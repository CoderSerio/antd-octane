/** Limited stable floating surfaces, measured in separate renderer documents. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  const selectors = {
    modal: ".ant-modal-content",
    modalTitle: ".ant-modal-title",
    drawer: ".ant-drawer-body",
    drawerTitle: ".ant-drawer-title",
    menu: ".ant-menu",
    menuItem: ".ant-menu-item",
    confirmTitle: ".ant-popconfirm-title",
    confirmDescription: ".ant-popconfirm-description",
    message: ".ant-message-notice-content",
    notification: ".ant-notification-notice",
  };
  const properties = [
    "backgroundColor",
    "color",
    "fontSize",
    "lineHeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopLeftRadius",
  ];
  for (const theme of ["default", "brand", "dark", "compact", "component"]) {
    const pair = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/index.html?renderer=${renderer}&theme=${theme}&overlays=1`,
      );
      await page.locator(".ant-notification-notice").first().waitFor();
      await page.addStyleTag({
        content: "*{animation:none!important;transition:none!important}",
      });
      pair[renderer] = await page.evaluate(
        ({ selectors, properties }) =>
          Object.fromEntries(
            Object.entries(selectors).map(([key, selector]) => {
              const element = document.querySelector(selector);
              if (!element) return [key, null];
              const style = getComputedStyle(element);
              return [
                key,
                Object.fromEntries(
                  properties.map((property) => [property, style[property]]),
                ),
              ];
            }),
          ),
        { selectors, properties },
      );
    }
    for (const [id, values] of Object.entries(pair.antd))
      for (const [property, expected] of Object.entries(values ?? {})) {
        comparisons++;
        const actual = pair.octane[id]?.[property];
        if (actual !== expected)
          differences.push({ theme, id, property, actual, expected });
      }
  }
  return { comparisons, differences };
}
