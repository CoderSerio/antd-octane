/** Limited stable styles for choice and navigation components. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    segmented: ".ant-segmented",
    selected: ".ant-segmented-item-selected",
    label: ".ant-segmented-item-label",
    rate: ".ant-rate",
    breadcrumb: ".ant-breadcrumb",
    separator: ".ant-breadcrumb-separator",
    pagination: ".ant-pagination",
    page: ".ant-pagination-item",
    steps: ".ant-steps",
    stepIcon: ".ant-steps-item-icon",
    stepTitle: ".ant-steps-item-title",
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
      await page
        .locator('[data-controls="steps"] .ant-steps-item-title')
        .first()
        .waitFor();
      await page.addStyleTag({
        content: "*{transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page.locator("[data-controls]").evaluateAll(
        (containers, { selectors, properties }) =>
          Object.fromEntries(
            containers.flatMap((container) =>
              Object.entries(selectors).flatMap(([part, selector]) => {
                const element = container.querySelector(selector);
                if (!element) return [];
                const style = getComputedStyle(element);
                return [
                  [
                    `${container.dataset.controls}/${part}`,
                    Object.fromEntries(
                      properties.map((property) => [
                        property,
                        // Upstream splits the page box (li) and text padding (a).
                        // Our native button owns both; compare each matching surface.
                        part === "page" &&
                        selector === ".ant-pagination-item" &&
                        (property === "paddingLeft" ||
                          property === "paddingRight")
                          ? getComputedStyle(element.querySelector("a"))[
                              property
                            ]
                          : style[property],
                      ]),
                    ),
                  ],
                ];
              }),
            ),
          ),
        {
          selectors:
            renderer === "octane"
              ? { ...selectors, page: ".ant-pagination-item button" }
              : selectors,
          properties,
        },
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
