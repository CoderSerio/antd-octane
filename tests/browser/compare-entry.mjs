/** Stable input surfaces only: differences are reported, not a full parity claim. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    number: ".ant-input-number",
    numberInput: ".ant-input-number-input",
    slider: ".ant-slider",
    rail: ".ant-slider-rail",
    track: ".ant-slider-track",
    affix: ".ant-input-affix-wrapper",
    textarea: "textarea.ant-input",
  };
  const properties = [
    "height",
    "backgroundColor",
    "color",
    "fontSize",
    "lineHeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderTopColor",
    "borderTopLeftRadius",
  ];
  for (const theme of ["default", "brand", "dark", "compact", "component"]) {
    const pair = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/index.html?renderer=${renderer}&theme=${theme}`,
      );
      await page.locator('[data-entry="number"] input').waitFor();
      await page.addStyleTag({
        content: "*{transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page.locator("[data-entry]").evaluateAll(
        (containers, { selectors, properties }) =>
          Object.fromEntries(
            containers.flatMap((container) =>
              Object.entries(selectors).flatMap(([part, selector]) => {
                const element = container.querySelector(selector);
                if (!element) return [];
                const style = getComputedStyle(element);
                return [
                  [
                    `${container.dataset.entry}/${part}`,
                    Object.fromEntries(
                      properties.map((property) => [property, style[property]]),
                    ),
                  ],
                ];
              }),
            ),
          ),
        { selectors, properties },
      );
    }
    for (const [id, values] of Object.entries(pair.antd)) {
      for (const [property, expected] of Object.entries(values)) {
        comparisons++;
        const actual = pair.octane[id]?.[property];
        if (actual !== expected)
          differences.push({ theme, id, property, actual, expected });
      }
    }
  }
  return { comparisons, differences };
}
