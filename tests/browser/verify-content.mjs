/** Run against the production documentation preview via playwright-cli. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (v, m) => {
    if (!v) throw Error(m);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#typography");
  await page.getByRole("button", { name: "编辑", exact: true }).click();
  const editor = page.getByRole("textbox", { name: "编辑文本" });
  await editor.fill("浏览器编辑验证");
  await editor.press("Enter");
  await page.getByRole("button", { name: "编辑", exact: true }).waitFor();
  assert(
    await page
      .locator("#more")
      .textContent()
      .then((text) => text.includes("浏览器编辑验证")),
    "Edit save",
  );
  assert(
    await page
      .getByRole("button", { name: "编辑", exact: true })
      .evaluate((node) => node === document.activeElement),
    "Edit focus",
  );
  await page.getByRole("button", { name: "编辑", exact: true }).click();
  await editor.fill("取消内容");
  await editor.press("Escape");
  assert(
    !(await page.locator("#more").textContent()).includes("取消内容"),
    "Edit cancel",
  );
  await page.evaluate(() => {
    window.__copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copied = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "复制", exact: true }).click();
  await page.getByRole("button", { name: "已复制", exact: true }).waitFor();
  assert(
    (await page.evaluate(() => window.__copied)) === "浏览器编辑验证",
    "Copy edited text",
  );
  await page.getByRole("button", { name: "展开", exact: true }).click();
  await page.getByRole("button", { name: "收起", exact: true }).click();
  await page.goto("http://127.0.0.1:4174/#list");
  await page
    .getByRole("button", { name: "标记完成", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "已完成", exact: true }).waitFor();
  assert(
    (await page
      .locator("#more .ant-list-items")
      .evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      )) === 2,
    "Desktop grid",
  );
  await page.getByRole("switch", { name: "显示空列表" }).click();
  await page.getByText("暂无数据", { exact: true }).waitFor();
  await page.getByRole("switch", { name: "显示空列表" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document.querySelector("#more .ant-list-items"),
      ).gridTemplateColumns.split(" ").length === 1,
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    "List overflow",
  );
  assert(
    await page
      .locator(".table-scroll")
      .evaluate((node) => node.scrollWidth > node.clientWidth),
    "API table should scroll internally",
  );
  await page.screenshot({
    path: "/tmp/octane-list-mobile.png",
    fullPage: true,
  });
  await page.goto("http://127.0.0.1:4174/#typography");
  await page.getByRole("button", { name: "编辑", exact: true }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    "Typography overflow",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "主题实验室", exact: true }).click();
  await page.getByRole("switch", { name: "暗色模式", exact: true }).click();
  await page.getByRole("switch", { name: "紧凑模式", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#more .ant-typography"))
        .color === "rgba(255, 255, 255, 0.85)",
  );
  await page.screenshot({ path: "/tmp/octane-typography-dark.png" });
  assert(!errors.length, errors.join("\n"));
  return { errors, editing: true, copy: true, responsive: true };
}
