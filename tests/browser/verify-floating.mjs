/** Production floating interactions and viewport checks via playwright-cli. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#tooltip");
  const trigger = page.getByRole("button", { name: "悬停或聚焦", exact: true });
  await trigger.waitFor();
  await trigger.hover();
  const tip = page.getByRole("tooltip", { name: "保存当前编辑内容" });
  await tip.waitFor();
  assert(
    (await trigger.getAttribute("aria-describedby")) ===
      (await tip.getAttribute("id")),
    "Tooltip ARIA relation missing",
  );
  await page.keyboard.press("Escape");
  await tip.waitFor({ state: "hidden" });
  await page.mouse.move(0, 0);
  await trigger.focus();
  await tip.waitFor();
  await page.screenshot({ path: "/tmp/octane-tooltip-desktop.png" });
  await page.keyboard.press("Escape");
  await tip.waitFor({ state: "hidden" });
  const placements = [
    "topLeft",
    "top",
    "topRight",
    "bottomLeft",
    "bottom",
    "bottomRight",
    "leftTop",
    "left",
    "leftBottom",
    "rightTop",
    "right",
    "rightBottom",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const placement of placements) {
      const button = page.getByRole("button", { name: placement, exact: true });
      await button.scrollIntoViewIfNeeded();
      await button.hover();
      const tooltip = page.getByRole("tooltip", {
        name: `位置：${placement}`,
        exact: true,
      });
      await tooltip.waitFor();
      const bounds = await tooltip.boundingBox();
      assert(
        bounds &&
          bounds.x >= 0 &&
          bounds.y >= 0 &&
          bounds.x + bounds.width <= width + 0.5 &&
          bounds.y + bounds.height <= 1000.5,
        `${width}px ${placement} escaped viewport`,
      );
      await page.keyboard.press("Escape");
      await tooltip.waitFor({ state: "hidden" });
      await page.mouse.move(0, 0);
    }
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Tooltip page overflow ${width}`,
    );
  }
  await page.goto("http://127.0.0.1:4174/#popover");
  await page.getByRole("button", { name: "点击打开", exact: true }).waitFor();
  const click = page.getByRole("button", { name: "点击打开", exact: true });
  await click.click();
  const popup = page.locator(".ant-popover:not([hidden])");
  await popup.waitFor();
  assert(
    (await click.getAttribute("aria-expanded")) === "true",
    "Popover expanded state",
  );
  await popup.getByText("点击外部或按 Escape 关闭。", { exact: true }).click();
  assert((await popup.count()) === 1, "Inside click closed popover");
  await page.locator("main h1").click();
  await popup.waitFor({ state: "hidden" });
  await click.click();
  await popup.waitFor();
  await page.keyboard.press("Escape");
  await popup.waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "打开操作面板", exact: true }).click();
  await page.getByRole("button", { name: "确认保存", exact: true }).waitFor();
  await page.screenshot({ path: "/tmp/octane-popover-mobile.png" });
  await page.getByRole("button", { name: "确认保存", exact: true }).click();
  await popup.waitFor({ state: "hidden" });
  await page.getByText("草稿已保存", { exact: true }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "Popover mobile overflow",
  );
  assert(errors.length === 0, errors.join("\n"));
  return {
    tooltip: "hover/focus/Escape/ARIA",
    popover: "click/inside/outside/Escape/controlled-save",
    placementViewportChecks: 24,
    mobileWidth: 390,
    pageErrors: errors,
  };
}
