/** Run via playwright-cli run-code against pnpm dev:compare. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  for (const preset of ["default", "brand", "dark", "compact", "component"]) {
    const pair = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/index.html?renderer=${renderer}&theme=${preset}`,
      );
      await page.locator("#switch-off").waitFor();
      await page.addStyleTag({
        content: "* {transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page
        .locator('[id^="switch-"], [id^="divider-"]')
        .evaluateAll((nodes) =>
          Object.fromEntries(
            nodes.map((node) => {
              const style = getComputedStyle(node);
              return [
                node.id,
                Object.fromEntries(
                  [
                    "height",
                    "minWidth",
                    "backgroundColor",
                    "color",
                    "borderTopWidth",
                    "borderTopColor",
                    "marginTop",
                    "marginBottom",
                    "fontSize",
                    "fontWeight",
                    "lineHeight",
                    "opacity",
                  ].map((key) => [key, style[key]]),
                ),
              ];
            }),
          ),
        );
    }
    for (const [id, values] of Object.entries(pair.octane))
      for (const [property, actual] of Object.entries(values)) {
        comparisons++;
        const expected = pair.antd[id][property];
        if (actual !== expected)
          differences.push({ preset, id, property, actual, expected });
      }
  }
  return { comparisons, differences };
}
