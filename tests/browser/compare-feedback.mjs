/** Limited stable styles for feedback components. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    spin: ".ant-spin",
    dot: ".ant-spin-dot",
    skeleton: ".ant-skeleton",
    skeletonTitle: ".ant-skeleton-title",
    skeletonRow: ".ant-skeleton-paragraph li",
    progress: ".ant-progress",
    progressInner: ".ant-progress-inner",
    progressText: ".ant-progress-text",
    result: ".ant-result",
    resultTitle: ".ant-result-title",
    resultSubtitle: ".ant-result-subtitle",
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
        .locator('[data-feedback="result"] .ant-result-title')
        .first()
        .waitFor();
      await page.addStyleTag({
        content: "*{transition:none!important;animation:none!important}",
      });
      pair[renderer] = await page.locator("[data-feedback]").evaluateAll(
        (containers, { selectors, properties }) =>
          Object.fromEntries(
            containers.flatMap((container) =>
              Object.entries(selectors).flatMap(([part, selector]) => {
                const element = container.querySelector(selector);
                if (!element) return [];
                const style = getComputedStyle(element);
                return [
                  [
                    `${container.dataset.feedback}/${part}`,
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
