/** Limited stable style comparison against the fixed antd baseline. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    radio: ".ant-radio-wrapper",
    radioInner: ".ant-radio-inner",
    radioButton: ".ant-radio-button-wrapper",
    tag: ".ant-tag",
    alert: ".ant-alert",
    alertMessage: ".ant-alert-message",
    card: ".ant-card",
    cardHead: ".ant-card-head",
    cardBody: ".ant-card-body",
    badge: ".ant-badge-count, .ant-badge-indicator",
    avatar: ".ant-avatar",
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
    "marginRight",
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
      await page.locator('[data-display="avatar"] .ant-avatar').waitFor();
      await page.addStyleTag({
        content: "*{transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page.locator("[data-display]").evaluateAll(
        (containers, { selectors, properties }) =>
          Object.fromEntries(
            containers.flatMap((container) =>
              Object.entries(selectors).flatMap(([part, selector]) => {
                const element = container.querySelector(selector);
                if (!element) return [];
                const style = getComputedStyle(element);
                return [
                  [
                    `${container.dataset.display}/${part}`,
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
    for (const [id, values] of Object.entries(pair.octane))
      for (const [property, actual] of Object.entries(values)) {
        comparisons++;
        const expected = pair.antd[id]?.[property];
        if (actual !== expected)
          differences.push({ theme, id, property, actual, expected });
      }
  }
  return { comparisons, differences };
}
