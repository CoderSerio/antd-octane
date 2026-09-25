/** Production dialog interactions including nested locks and owned body portals. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#modal");
  await page.reload();
  const trigger = page.getByRole("button", { name: "打开对话框", exact: true });
  await trigger.click();
  const modal = page.getByRole("dialog", { name: "编辑项目", exact: true });
  await modal.waitFor();
  assert(
    (await page.evaluate(() => document.body.style.overflow)) === "hidden",
    "Modal body lock",
  );
  await modal
    .getByRole("textbox", { name: "项目名称", exact: true })
    .fill("保留的项目");
  await modal.getByRole("button", { name: "确定", exact: true }).focus();
  await page.keyboard.press("Tab");
  assert(
    await modal
      .getByRole("button", { name: "关闭对话框", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Tab trap wraps",
  );
  await page.keyboard.press("Shift+Tab");
  assert(
    await modal
      .getByRole("button", { name: "确定", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Reverse Tab trap",
  );
  await page.keyboard.press("Escape");
  await modal.waitFor({ state: "hidden" });
  assert(
    await trigger.evaluate((el) => el === document.activeElement),
    "Modal trigger focus restore",
  );
  assert(
    (await page.evaluate(() => document.body.style.overflow)) !== "hidden",
    "Modal body unlock",
  );
  await trigger.click();
  assert(
    (await modal
      .getByRole("textbox", { name: "项目名称", exact: true })
      .inputValue()) === "保留的项目",
    "Modal retains child input",
  );
  await modal.getByRole("button", { name: "确定", exact: true }).click();
  await page.getByText("已保存", { exact: true }).waitFor();
  await modal.waitFor({ state: "hidden" });
  const nestedTrigger = page.getByRole("button", {
    name: "打开嵌套示例",
    exact: true,
  });
  await nestedTrigger.click();
  const parent = page.getByRole("dialog", { name: "项目设置", exact: true });
  await parent.getByRole("button", { name: "更多设置", exact: true }).click();
  await page.getByRole("menuitem", { name: "编辑设置", exact: true }).focus();
  assert(
    await page
      .getByRole("menuitem", { name: "编辑设置", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Dialog permits dropdown portal focus",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("menuitem", { name: "编辑设置", exact: true })
    .waitFor({ state: "hidden" });
  assert(await parent.isVisible(), "Dropdown Escape must leave Modal open");
  const memberTrigger = parent.getByRole("button", {
    name: "打开成员抽屉",
    exact: true,
  });
  await memberTrigger.click();
  const child = page.getByRole("dialog", { name: "成员信息", exact: true });
  await child.waitFor();
  await child
    .getByRole("textbox", { name: "成员名称", exact: true })
    .fill("成员 A");
  await page.keyboard.press("Escape");
  await child.waitFor({ state: "hidden" });
  assert(await parent.isVisible(), "Nested Escape closes only child");
  assert(
    (await page.evaluate(() => document.body.style.overflow)) === "hidden",
    "Nested lock preserves parent",
  );
  assert(
    await memberTrigger.evaluate((el) => el === document.activeElement),
    "Nested focus restore",
  );
  await page.keyboard.press("Escape");
  await parent.waitFor({ state: "hidden" });
  assert(
    await nestedTrigger.evaluate((el) => el === document.activeElement),
    "Parent focus restore",
  );
  assert(
    (await page.evaluate(() => document.body.style.overflow)) !== "hidden",
    "All nested locks release",
  );
  await page.goto("http://127.0.0.1:4174/#drawer");
  const destroyTrigger = page.getByRole("button", {
    name: "打开销毁示例",
    exact: true,
  });
  await destroyTrigger.click();
  const temporary = page.getByRole("dialog", { name: "临时编辑", exact: true });
  await temporary
    .getByRole("textbox", { name: "临时备注", exact: true })
    .fill("discard me");
  await page.keyboard.press("Escape");
  await temporary.waitFor({ state: "detached" });
  await destroyTrigger.click();
  assert(
    (await temporary
      .getByRole("textbox", { name: "临时备注", exact: true })
      .inputValue()) === "",
    "Drawer destroys content",
  );
  await page.keyboard.press("Escape");
  for (const placement of ["left", "right", "top", "bottom"]) {
    await page.getByRole("radio", { name: placement, exact: true }).check();
    await page.getByRole("button", { name: "打开抽屉", exact: true }).click();
    const panel = page.getByRole("dialog", { name: "项目详情", exact: true });
    await panel.waitFor();
    const rect = await panel.boundingBox();
    assert(
      rect && rect.width > 0 && rect.height > 0,
      `${placement} Drawer visible geometry`,
    );
    await panel.getByRole("button", { name: "完成", exact: true }).click();
    await panel.waitFor({ state: "hidden" });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4174/#modal");
  await page.getByRole("button", { name: "打开对话框", exact: true }).click();
  await page.getByRole("dialog", { name: "编辑项目", exact: true }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    "Mobile Modal overflow",
  );
  await page.screenshot({ path: "/tmp/octane-modal-mobile.png" });
  await page.keyboard.press("Escape");
  await page.goto("http://127.0.0.1:4174/#drawer");
  await page.getByRole("button", { name: "打开抽屉", exact: true }).click();
  await page.getByRole("dialog", { name: "项目详情", exact: true }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    "Mobile Drawer overflow",
  );
  await page.screenshot({ path: "/tmp/octane-drawer-mobile.png" });
  await page.keyboard.press("Escape");
  assert(!errors.length, errors.join("\n"));
  return {
    errors,
    dialogs: "focus/trap/restore/retained/destroyed/nested-locks/portal-menu",
    placements: 4,
    mobileWidth: 390,
  };
}
