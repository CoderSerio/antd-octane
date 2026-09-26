/** Production Tour geometry, keyboard focus, controlled transitions and mobile fit. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#tour");
  await page.reload();
  const begin = page.getByRole("button", { name: "开始引导", exact: true });
  await begin.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".ant-tour-spotlight")?.getBoundingClientRect()
        .width > 20,
  );
  const geometry = await page.evaluate(() => {
    const target = Array.from(document.querySelectorAll("button"))
      .find((n) => n.textContent === "上传文件")
      .parentElement.getBoundingClientRect();
    const hole = document
      .querySelector(".ant-tour-spotlight")
      .getBoundingClientRect();
    const p = document.querySelector(".ant-tour").getBoundingClientRect();
    return {
      hole: { x: hole.x, y: hole.y, width: hole.width, height: hole.height },
      target: {
        x: target.x,
        y: target.y,
        width: target.width,
        height: target.height,
      },
      panel: { x: p.x, y: p.y, width: p.width, height: p.height },
      overflow: document.body.style.overflow,
      focus: document
        .querySelector(".ant-tour")
        .contains(document.activeElement),
    };
  });
  assert(
    Math.abs(geometry.hole.x - (geometry.target.x - 6)) < 1,
    "hole horizontal gap",
  );
  assert(
    Math.abs(geometry.hole.y - (geometry.target.y - 6)) < 1,
    "hole vertical gap",
  );
  assert(geometry.target.height >= 32, "target contains full button height");
  assert(
    Math.abs(geometry.hole.width - (geometry.target.width + 12)) < 1,
    "hole width",
  );
  assert(
    geometry.focus && geometry.overflow === "hidden",
    "focus and scroll lock",
  );
  await page.screenshot({ path: "/tmp/octane-tour-desktop.png" });
  await dialog.getByRole("button", { name: "下一步", exact: true }).click();
  await page.waitForFunction(() => document.querySelector(".ant-tour-primary"));
  await dialog.getByRole("button", { name: "上一步", exact: true }).click();
  await page.waitForFunction(
    () => !document.querySelector(".ant-tour-primary"),
  );
  await dialog.getByRole("button", { name: "下一步", exact: true }).click();
  await dialog.getByRole("button", { name: "下一步", exact: true }).click();
  await page.waitForFunction(() =>
    document.querySelector(".ant-tour-full-mask"),
  );
  await page.waitForFunction(() => {
    const r = document.querySelector(".ant-tour").getBoundingClientRect();
    return (
      Math.abs(r.x - (innerWidth - r.width) / 2) < 1 &&
      Math.abs(r.y - (innerHeight - r.height) / 2) < 1
    );
  });
  await dialog.getByRole("button", { name: "完成", exact: true }).click();
  await dialog.waitFor({ state: "detached" });
  assert(
    await begin.evaluate((el) => el === document.activeElement),
    "finish restores focus",
  );
  await begin.click();
  await dialog.waitFor();
  const close = dialog.getByRole("button", { name: "关闭引导", exact: true });
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  assert(
    await dialog
      .getByRole("button", { name: "下一步", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Shift Tab loops",
  );
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert(
    await begin.evaluate((el) => el === document.activeElement),
    "Escape restores focus",
  );
  assert(
    await page.evaluate(() => document.body.style.overflow === ""),
    "scroll lock cleanup",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await begin.click();
  await dialog.waitFor();
  await page.waitForFunction(() => {
    const r = document.querySelector(".ant-tour").getBoundingClientRect();
    return r.x >= 0 && r.right <= innerWidth;
  });
  await page.screenshot({ path: "/tmp/octane-tour-mobile.png" });
  const mobile = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
  }));
  assert(mobile.width <= mobile.viewport, "mobile document overflow");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    checks:
      "Tour target hole/gap, primary step, prev/next, centered fallback, finish, focus trap/restore, Escape/lock cleanup, 390px fit",
    geometry,
    mobile,
    errors,
  };
}
