/** Run against pnpm dev:compare; checks geometry in a real browser. */
export default async function verify(page, baseURL = "http://127.0.0.1:4175") {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  let checks = 0;
  const assert = (value, message) => {
    checks++;
    if (!value) throw new Error(message);
  };
  const near = (value) => Math.abs(value) <= 1;
  const fixture = `${baseURL}/tests/browser/spin-position.html`;
  try {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["default", "dark", "compact"]) {
        for (const size of ["small", "default", "large"]) {
          const query = `theme=${theme}&size=${size}`;
          const label = `${width}/${theme}/${size}`;
          await page.goto(`${fixture}?${query}`);
          await page.waitForFunction(() =>
            document.querySelector('[data-case="auto"] svg'),
          );
          const result = await page.evaluate(() => {
            const center = (element) => {
              const rect = element.getBoundingClientRect();
              return {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2,
                width: rect.width,
                height: rect.height,
              };
            };
            const cases = [...document.querySelectorAll("[data-case]")].map(
              (wrapper) => ({
                name: wrapper.dataset.case,
                spins: [...wrapper.querySelectorAll(".ant-spin")].map(
                  (spin) => ({
                    spin: center(spin),
                    indicator: center(
                      spin.querySelector(".ant-spin-dot-progress") ??
                        spin.querySelector(".ant-spin-dot"),
                    ),
                  }),
                ),
              }),
            );
            return {
              cases,
              overflow: document.documentElement.scrollWidth > innerWidth,
            };
          });
          assert(!result.overflow, `${label}: horizontal overflow`);
          for (const { name, spins } of result.cases) {
            for (const { spin, indicator } of spins) {
              assert(
                near(indicator.x - spin.x),
                `${label}/${name}: horizontal center`,
              );
              assert(
                near(indicator.y - spin.y + (name === "progress-tip" ? 10 : 0)),
                `${label}/${name}: vertical center/tip spacing`,
              );
              if (name === "inline") {
                assert(
                  near(spin.width - spin.height) && spin.width <= 40,
                  `${label}: inline Spin must retain its indicator-sized box`,
                );
              }
            }
          }
          for (const withTip of [false, true]) {
            await page.goto(
              `${fixture}?${query}&fullscreen${withTip ? "&tip" : ""}`,
            );
            await page.locator(".ant-spin-dot-progress").waitFor();
            const offsets = await page.evaluate(() => {
              const center = (element) => {
                const r = element.getBoundingClientRect();
                return [r.x + r.width / 2, r.y + r.height / 2];
              };
              const spin = center(document.querySelector(".ant-spin"));
              const progress = center(
                document.querySelector(".ant-spin-dot-progress"),
              );
              const dots = center(
                document.querySelector(".ant-spin-dot-holder"),
              );
              return [
                spin[0] - innerWidth / 2,
                spin[1] - innerHeight / 2,
                progress[0] - dots[0],
                progress[1] - dots[1],
              ];
            });
            assert(
              offsets.every(near),
              `${label}/fullscreen/${withTip}: group centered and indicators aligned`,
            );
          }
        }
      }
    }
    assert(errors.length === 0, `Browser errors: ${errors.join("; ")}`);
    return { checks, errors };
  } finally {
    page.off("pageerror", onError);
  }
}
