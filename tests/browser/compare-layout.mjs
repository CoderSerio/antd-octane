/** Limited stable styles for layout and content components. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    row: ".ant-row",
    col: ".ant-col",
    layout: ".ant-layout",
    header: ".ant-layout-header",
    footer: ".ant-layout-footer",
    collapse: ".ant-collapse",
    collapseHeader: ".ant-collapse-header",
    collapseContent: ".ant-collapse-content-box",
    tabs: ".ant-tabs",
    tab: ".ant-tabs-tab",
    empty: ".ant-empty",
    emptyImage: ".ant-empty-image",
    statistic: ".ant-statistic-content",
    statisticTitle: ".ant-statistic-title",
    timeline: ".ant-timeline-item",
    timelineContent: ".ant-timeline-item-content",
    descriptions: ".ant-descriptions-title",
    descriptionLabel: ".ant-descriptions-item-label",
    descriptionContent: ".ant-descriptions-item-content",
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
    "marginTop",
    "marginBottom",
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
      await page.locator('[data-layout="descriptions"] table').waitFor();
      await page.addStyleTag({
        content: "*{transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page.locator("[data-layout]").evaluateAll(
        (containers, { selectors, properties }) =>
          Object.fromEntries(
            containers.flatMap((container) =>
              Object.entries(selectors).flatMap(([part, selector]) => {
                const element = container.querySelector(selector);
                if (!element) return [];
                const style = getComputedStyle(element);
                return [
                  [
                    `${container.dataset.layout}/${part}`,
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
