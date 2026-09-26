/** Hook notification behavior and portal context in the production docs. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#message");
  await page.getByRole("button", { name: "开始保存", exact: true }).waitFor();
  await page.getByRole("button", { name: "开始保存", exact: true }).click();
  const message = page.locator(".ant-message-notice");
  await message.waitFor();
  assert((await message.count()) === 1, "Initial keyed notice missing");
  assert(
    (await message
      .locator(".ant-message-notice-content")
      .evaluate((el) => getComputedStyle(el).backgroundColor)) ===
      "rgb(230, 244, 255)",
    "Holder did not inherit local theme",
  );
  await page.getByRole("button", { name: "更新结果", exact: true }).click();
  await message
    .getByText("同一条消息已更新为保存成功", { exact: true })
    .waitFor();
  assert((await message.count()) === 1, "Same key duplicated message");
  await page.screenshot({ path: "/tmp/octane-message-desktop.png" });
  await page.getByRole("button", { name: "手动关闭", exact: true }).click();
  await message.waitFor({ state: "detached" });
  await page.getByRole("button", { name: "自动关闭", exact: true }).click();
  await message.waitFor();
  await message.waitFor({ state: "detached", timeout: 3500 });
  await page.getByRole("button", { name: "开始保存", exact: true }).click();
  await message.waitFor();
  await page.goto("http://127.0.0.1:4174/#notification");
  await page.getByRole("button", { name: "显示任务", exact: true }).waitFor();
  assert(
    (await message.count()) === 0,
    "Route unmount retained message portal",
  );
  const notices = page.locator(".ant-notification-notice");
  await page.getByRole("button", { name: "显示任务", exact: true }).click();
  await notices.waitFor();
  await page.getByRole("button", { name: "确认收到", exact: true }).click();
  await notices.waitFor({ state: "detached" });
  await page.getByRole("button", { name: "显示任务", exact: true }).click();
  await notices.waitFor();
  await page.getByRole("button", { name: "更新通知", exact: true }).click();
  await notices.getByText("任务已更新", { exact: true }).waitFor();
  assert((await notices.count()) === 1, "Same key duplicated notification");
  await page.getByRole("button", { name: "清空通知", exact: true }).click();
  await notices.waitFor({ state: "detached" });
  for (const placement of [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "top",
    "bottom",
  ]) {
    await page.getByRole("button", { name: placement, exact: true }).click();
    const positioned = page.locator(`.ant-notification-${placement}`);
    await positioned.waitFor();
    const box = await positioned.boundingBox();
    assert(
      box &&
        box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= 1440 &&
        box.y + box.height <= 1000,
      `${placement} outside viewport`,
    );
    await positioned
      .getByRole("button", { name: "关闭通知", exact: true })
      .click();
    await positioned.waitFor({ state: "detached" });
  }
  await page.getByRole("button", { name: "自动关闭通知", exact: true }).click();
  await notices.waitFor();
  await notices.hover();
  await page.waitForTimeout(2300);
  assert(
    (await notices.count()) === 1,
    "Hovered notification prematurely closed",
  );
  await page.mouse.move(0, 500);
  await notices.waitFor({ state: "detached", timeout: 3500 });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.getByRole("button", { name: "显示任务", exact: true }).click();
  await notices.waitFor();
  const mobile = await notices.boundingBox();
  assert(
    mobile && mobile.x >= 0 && mobile.x + mobile.width <= 390,
    "Notification mobile overflow",
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Notification page overflow",
  );
  await page.screenshot({ path: "/tmp/octane-notification-mobile.png" });
  await page.getByRole("button", { name: "确认收到", exact: true }).click();
  await notices.waitFor({ state: "detached" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    message: "key-update/manual/auto-close/theme-context/unmount",
    notification: "key-update/action/close/6placements/hover-pause",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
