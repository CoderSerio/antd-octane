/** Run via playwright-cli run-code; fixture servers must already be running. */
export default async function compare(page) {
  const results = {};
  for (const preset of ["default", "brand", "dark", "compact", "component"]) {
    results[preset] = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/index.html?renderer=${renderer}&theme=${preset}`,
      );
      await page.locator("#primary").waitFor();
      await page.addStyleTag({
        content:
          "* { transition: none !important; animation: none !important; }",
      });
      await page.mouse.move(1000, 1);
      const values = await page.locator("button").evaluateAll((nodes) =>
        Object.fromEntries(
          nodes.map((el) => {
            const style = getComputedStyle(el);
            return [
              el.id,
              Object.fromEntries(
                [
                  "height",
                  "paddingLeft",
                  "paddingRight",
                  "color",
                  "backgroundColor",
                  "borderTopColor",
                  "borderTopWidth",
                  "borderTopStyle",
                  "borderRadius",
                  "fontSize",
                  "lineHeight",
                  "fontWeight",
                ].map((key) => [key, style[key]]),
              ),
            ];
          }),
        ),
      );
      for (const id of Object.keys(values)) {
        await page.locator(`#${id}`).hover();
        const readState = async () =>
          page.locator(`#${id}`).evaluate((el) => {
            const style = getComputedStyle(el);
            return {
              color: style.color,
              backgroundColor: style.backgroundColor,
              borderTopColor: style.borderTopColor,
            };
          });
        values[`${id}-hover`] = await readState();
        await page.mouse.down();
        values[`${id}-active`] = await readState();
        await page.mouse.up();
      }
      results[preset][renderer] = values;
    }
  }
  const differences = [];
  let comparisons = 0;
  for (const [preset, pair] of Object.entries(results)) {
    for (const [id, values] of Object.entries(pair.octane)) {
      for (const [property, actual] of Object.entries(values)) {
        comparisons++;
        const expected = pair.antd[id][property];
        if (actual !== expected)
          differences.push({ preset, id, property, actual, expected });
      }
    }
  }
  return { comparisons, differences };
}
