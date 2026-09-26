/** Native menu and Dropdown behavior on the production documentation build. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  const go = async (name) => {
    await page.goto(`http://127.0.0.1:4174/#${name}`);
    await page
      .locator("main h1")
      .filter({ hasText: name === "menu" ? "Menu" : "Dropdown" })
      .waitFor();
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("menu");
  const basic = page.locator("#basic");
  const overview = basic.getByRole("menuitem", {
    name: "项目概览",
    exact: true,
  });
  await overview.focus();
  await page.keyboard.press("ArrowDown");
  assert(
    await basic
      .getByRole("menuitem", { name: /项目设置/ })
      .evaluate((el) => el === document.activeElement),
    "Menu ArrowDown focus",
  );
  await page.keyboard.press("ArrowRight");
  assert(
    await basic
      .getByRole("menuitem", { name: "成员管理", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Menu enters open submenu",
  );
  await page.keyboard.press("Enter");
  await page.getByText("当前选择：members", { exact: true }).waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  assert(
    await basic
      .getByRole("menuitem", { name: "使用帮助", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Menu skips disabled item",
  );
  await basic.getByRole("menuitem", { name: "成员管理", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  assert(
    (await basic
      .getByRole("menuitem", { name: /项目设置/ })
      .getAttribute("aria-expanded")) === "false",
    "Menu collapses submenu",
  );
  await page.keyboard.press("ArrowRight");
  await basic.getByRole("menuitem", { name: "访问权限", exact: true }).click();
  await page.getByText("当前选择：access", { exact: true }).waitFor();
  assert(
    await basic
      .getByRole("menuitem", { name: "审计日志", exact: true })
      .isDisabled(),
    "Menu disabled semantic",
  );
  await go("dropdown");
  const trigger = page.getByRole("button", { name: "更多操作", exact: true });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const popup = page.locator(".ant-dropdown:visible");
  await popup.waitFor();
  assert(
    await popup
      .getByRole("menuitem", { name: "复制链接", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Dropdown keyboard initial focus",
  );
  assert(
    (await trigger.getAttribute("aria-controls")) ===
      (await popup.getAttribute("id")),
    "Dropdown ownership link",
  );
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.getByText("已选择重命名", { exact: true }).waitFor();
  await popup.waitFor({ state: "hidden" });
  assert(
    await trigger.evaluate((el) => el === document.activeElement),
    "Selection restores trigger focus",
  );
  await trigger.click();
  await popup.waitFor();
  await popup.getByRole("menuitem", { name: "复制链接", exact: true }).focus();
  await page.keyboard.press("Escape");
  await popup.waitFor({ state: "hidden" });
  await trigger.click();
  await popup.waitFor();
  await page.locator("main h1").click();
  await popup.waitFor({ state: "hidden" });
  const hover = page.getByRole("button", { name: "悬停查看菜单", exact: true });
  await hover.hover();
  await popup.waitFor();
  await popup.getByRole("menuitem", { name: "打开", exact: true }).hover();
  assert(await popup.isVisible(), "Hover bridge retains menu");
  await page.locator("main h1").hover();
  await popup.waitFor({ state: "hidden" });
  const context = page.getByRole("button", {
    name: "右键打开菜单",
    exact: true,
  });
  await context.click({ button: "right" });
  await popup.waitFor();
  await popup.getByRole("menuitem", { name: "下载", exact: true }).click();
  await page.getByText("当前操作：下载", { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["menu", "dropdown"]) {
    await go(name);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${name} page horizontal overflow`,
    );
  }
  await page.getByRole("button", { name: "更多操作", exact: true }).click();
  await popup.waitFor();
  const bounds = await popup.boundingBox();
  assert(
    bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390,
    "Mobile Dropdown stays in viewport",
  );
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "/tmp/octane-dropdown-mobile.png",
    fullPage: true,
  });
  await go("menu");
  await page.screenshot({
    path: "/tmp/octane-menu-mobile.png",
    fullPage: true,
  });
  assert(errors.length === 0, errors.join("\n"));
  return {
    menu: "keyboard, selection, disabled, submenus",
    dropdown:
      "keyboard, click, hover, context menu, Escape, outside, ownership",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
