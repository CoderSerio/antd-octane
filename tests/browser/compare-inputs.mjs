/** Limited native/upstream CSS comparison; use the separate fixture documents. */
export default async function compareInputs(page) {
  const results = {};
  for (const preset of ["default", "brand", "dark", "compact", "component"]) {
    results[preset] = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/index.html?renderer=${renderer}&theme=${preset}`,
      );
      await page.locator("#input-default").waitFor();
      await page.addStyleTag({
        content:
          "* { transition: none !important; animation: none !important; }",
      });
      const values = {};
      const ids = await page
        .locator('input[id^="input-"], input[id^="check-"]')
        .evaluateAll((nodes) => nodes.map((node) => node.id));
      for (const id of ids) {
        const node = page.locator(`#${id}`);
        const read = () =>
          node.evaluate((element) => {
            const target = element.id.startsWith("check-")
              ? element.parentElement.querySelector(".ant-checkbox-inner")
              : element;
            const s = getComputedStyle(target);
            const keys = [
              "height",
              "borderTopColor",
              "borderTopWidth",
              "borderRadius",
              "backgroundColor",
            ];
            if (element.id.startsWith("input-"))
              keys.push(
                "color",
                "paddingLeft",
                "paddingTop",
                "fontSize",
                "lineHeight",
                "boxShadow",
              );
            else keys.push("width");
            const values = Object.fromEntries(keys.map((key) => [key, s[key]]));
            if (element.id.startsWith("check-")) {
              const tick = getComputedStyle(target, "::after");
              for (const key of [
                "width",
                "height",
                "borderRightColor",
                "backgroundColor",
                "opacity",
              ])
                values[`tick-${key}`] = tick[key];
            }
            return values;
          });
        await page.mouse.move(1000, 1);
        await node.evaluate((element) => element.blur());
        values[`${id}-base`] = await read();
        if (id.startsWith("check-"))
          await node.locator("xpath=ancestor::label").hover();
        else await node.hover();
        values[`${id}-hover`] = await read();
        if (!(await node.isDisabled())) {
          await node.focus();
          values[`${id}-focus`] = await read();
        }
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
