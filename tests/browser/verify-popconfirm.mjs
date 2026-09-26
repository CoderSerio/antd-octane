export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#popconfirm");
  await page.getByRole("button", { name: "删除记录", exact: true }).click();
  await page.locator(".ant-popconfirm:not([hidden])").waitFor();
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await page.getByText("已取消", { exact: true }).waitFor();
  await page.getByRole("button", { name: "删除记录", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await page.getByText("已删除", { exact: true }).waitFor();
  await page.getByRole("button", { name: "异步保存", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await page
    .locator(".ant-popconfirm:not([hidden]) .ant-btn-loading")
    .waitFor();
  await page.getByText("已保存", { exact: true }).waitFor();
  await page
    .locator(".ant-popconfirm:not([hidden])")
    .waitFor({ state: "hidden" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "删除记录", exact: true }).click();
  const popup = page.locator(".ant-popconfirm:not([hidden])");
  await popup.waitFor();
  const box = await popup.boundingBox();
  assert(box.x >= 0 && box.x + box.width <= 390, "Confirm fits viewport");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    "No mobile overflow",
  );
  await page.screenshot({
    path: "/tmp/antd-popconfirm-mobile.png",
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await popup.waitFor({ state: "hidden" });
  assert(!errors.length, errors.join("\n"));
  return { errors, confirm: true, cancel: true, promise: true, mobile: 390 };
}
