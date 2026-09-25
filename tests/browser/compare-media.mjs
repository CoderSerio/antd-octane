/** Five-theme comparison of supported media tokens, not full UI parity. */
export default async function compare(page) {
  const differences = [];
  let comparisons = 0;
  for (const theme of ["default", "brand", "dark", "compact", "component"]) {
    const pair = {};
    for (const renderer of ["octane", "antd"]) {
      await page.goto(
        `http://127.0.0.1:4175/tests/browser/media-theme.html?renderer=${renderer}&theme=${theme}`,
      );
      await page.locator(".ant-image-preview-img").waitFor();
      await page.addStyleTag({
        content: "*{animation:none!important;transition:none!important}",
      });
      pair[renderer] = await page.evaluate((renderer) => {
        const values = {};
        const take = (id, selector, props) => {
          const el = document.querySelector(selector);
          if (!el) throw Error(`Missing ${id}: ${selector}`);
          const css = getComputedStyle(el);
          for (const prop of props) values[`${id}/${prop}`] = css[prop];
        };
        take("image", ".ant-image-img", ["width", "height", "verticalAlign"]);
        take("dot", ".slick-dots li:not(.slick-active) button", [
          "width",
          "height",
          "backgroundColor",
          "opacity",
        ]);
        take("activeDot", ".slick-dots .slick-active button", [
          "width",
          "height",
        ]);
        // Upstream paints the active foreground on li::after; the native button paints it directly.
        values["activeDot/foregroundOpacity"] =
          renderer === "octane"
            ? getComputedStyle(
                document.querySelector(".slick-dots .slick-active button"),
              ).opacity
            : getComputedStyle(
                document.querySelector(".slick-dots .slick-active"),
                "::after",
              ).opacity;
        take(
          "operation",
          renderer === "octane"
            ? '.ant-image-preview button[aria-label="关闭图片预览"]'
            : ".ant-image-preview-operations-operation:not(.ant-image-preview-operations-operation-disabled) .anticon",
          ["color", "fontSize"],
        );
        take(
          "disabledOperation",
          renderer === "octane"
            ? '.ant-image-preview button[aria-label="缩小图片"]'
            : ".ant-image-preview-operations-operation-disabled",
          ["color"],
        );
        take("arrow", ".slick-prev", ["left"]);
        return values;
      }, renderer);
      const hoverTarget = page
        .locator(
          renderer === "octane"
            ? '.ant-image-preview button[aria-label="关闭图片预览"]'
            : ".ant-image-preview-operations-operation:not(.ant-image-preview-operations-operation-disabled) .anticon",
        )
        .first();
      await hoverTarget.hover();
      pair[renderer]["operation/hoverColor"] = await hoverTarget.evaluate(
        (element) => getComputedStyle(element).color,
      );
    }
    for (const [id, expected] of Object.entries(pair.antd)) {
      comparisons++;
      if (pair.octane[id] !== expected)
        differences.push({ theme, id, actual: pair.octane[id], expected });
    }
  }
  if (differences.length)
    throw Error(JSON.stringify({ comparisons, differences }));
  return { comparisons, differences };
}
