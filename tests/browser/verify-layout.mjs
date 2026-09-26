/** Production documentation checks; run through playwright-cli run-code. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (v, m) => {
    if (!v) throw Error(m);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#tabs");
  await page.reload();
  await page.getByRole("tab", { name: "概览", exact: true }).waitFor();
  await page.getByRole("tab", { name: "概览", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert(
    await page
      .getByRole("tab", { name: "设置", exact: true })
      .evaluate((e) => e === document.activeElement),
    "Tab focus navigation",
  );
  assert(
    (await page
      .getByRole("tab", { name: "概览", exact: true })
      .getAttribute("aria-selected")) === "true",
    "Arrow unexpectedly activated",
  );
  await page.keyboard.press("Enter");
  await page
    .getByRole("textbox", { name: "标签页输入", exact: true })
    .fill("状态保留");
  await page.getByRole("tab", { name: "概览", exact: true }).click();
  await page.getByRole("tab", { name: "设置", exact: true }).click();
  assert(
    (await page
      .getByRole("textbox", { name: "标签页输入", exact: true })
      .inputValue()) === "状态保留",
    "Tab lost input",
  );
  await page.getByRole("button", { name: "新增标签页", exact: true }).click();
  await page.getByRole("tab", { name: "页面 3", exact: true }).waitFor();
  await page.getByRole("button", { name: "关闭 页面 1", exact: true }).click();
  await page.waitForFunction(
    () =>
      document.activeElement?.getAttribute("role") === "tab" &&
      document.activeElement.textContent === "页面 2",
  );
  await page.goto("http://127.0.0.1:4174/#collapse");
  await page.getByRole("button", { name: "输入内容", exact: true }).waitFor();
  await page
    .getByRole("button", { name: "输入内容", exact: true })
    .press("Space");
  await page
    .getByRole("textbox", { name: "折叠面板输入", exact: true })
    .fill("面板状态");
  await page.getByRole("button", { name: "输入内容", exact: true }).click();
  await page.getByRole("button", { name: "输入内容", exact: true }).click();
  assert(
    (await page
      .getByRole("textbox", { name: "折叠面板输入", exact: true })
      .inputValue()) === "面板状态",
    "Collapse lost input",
  );
  await page.goto("http://127.0.0.1:4174/#layout");
  await page.getByRole("button", { name: "收起侧栏", exact: true }).waitFor();
  await page.getByRole("button", { name: "收起侧栏", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector(".ant-layout-sider").style.width === "64px",
  );
  await page.goto("http://127.0.0.1:4174/#grid");
  await page
    .getByRole("heading", { name: "Grid 栅格Alpha", exact: true })
    .waitFor();
  assert(
    (await page
      .locator("#more .ant-col")
      .first()
      .evaluate((e) => getComputedStyle(e).maxWidth)) === "50%",
    "Desktop responsive column",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#more .ant-col")).maxWidth ===
      "100%",
  );
  for (const name of [
    "grid",
    "layout",
    "collapse",
    "tabs",
    "empty",
    "statistic",
    "timeline",
    "descriptions",
  ]) {
    await page.goto(`http://127.0.0.1:4174/#${name}`);
    await page
      .locator("main h1")
      .filter({
        hasText:
          name === "grid" ? "Grid" : name[0].toUpperCase() + name.slice(1),
      })
      .waitFor();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth === innerWidth,
      ),
      `${name} mobile overflow`,
    );
  }
  await page.screenshot({ path: "/tmp/octane-descriptions-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#tabs");
  await page.getByRole("button", { name: "主题实验室", exact: true }).click();
  await page.getByRole("switch", { name: "暗色模式", exact: true }).click();
  await page.getByRole("switch", { name: "紧凑模式", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".ant-tabs")).color ===
      "rgba(255, 255, 255, 0.85)",
  );
  await page.screenshot({ path: "/tmp/octane-tabs-dark.png" });
  assert(!errors.length, errors.join("\n"));
  return { errors, keyboard: true, responsive: true, mobilePages: 8 };
}
