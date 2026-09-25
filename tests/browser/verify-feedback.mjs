/** Production interactions and responsive/theme checks for feedback components. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#spin");
  await page.reload();
  await page.getByRole("switch", { name: "切换加载状态" }).waitFor();
  await page.waitForFunction(
    () => document.querySelector(".ant-spin-container")?.inert === true,
  );
  await page.getByRole("switch", { name: "切换加载状态" }).click();
  await page.waitForFunction(
    () => document.querySelector(".ant-spin-container")?.inert === false,
  );
  assert(
    await page.getByText("项目概览", { exact: true }).isVisible(),
    "Spin content missing",
  );
  await page.goto("http://127.0.0.1:4174/#skeleton");
  await page.getByRole("switch", { name: "切换骨架屏" }).click();
  await page
    .getByRole("heading", { name: "让等待更清晰", exact: true })
    .waitFor();
  await page.getByRole("switch", { name: "切换骨架屏" }).click();
  assert(
    (await page.locator("#basic .ant-skeleton").count()) > 0,
    "Skeleton did not return",
  );
  await page.goto("http://127.0.0.1:4174/#progress");
  await page.getByRole("button", { name: "增加进度", exact: true }).click();
  assert(
    (await page
      .locator("#more .ant-progress-circle")
      .getAttribute("aria-valuenow")) === "70",
    "Circle progress update",
  );
  assert(
    (await page
      .locator("#more .ant-progress-dashboard")
      .getAttribute("aria-valuenow")) === "70",
    "Dashboard progress update",
  );
  await page.getByRole("button", { name: "减少进度", exact: true }).click();
  await page.screenshot({ path: "/tmp/octane-progress-desktop.png" });
  await page.goto("http://127.0.0.1:4174/#result");
  await page.getByRole("button", { name: "再建一个", exact: true }).click();
  await page.getByText("准备创建新项目", { exact: true }).waitFor();
  await page.getByRole("button", { name: "确认创建", exact: true }).click();
  await page.getByText("项目创建成功", { exact: true }).waitFor();
  await page.getByRole("button", { name: "403", exact: true }).click();
  await page
    .getByText("当前账号没有访问此页面的权限。", { exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["spin", "skeleton", "progress", "result"]) {
    await page.goto(`http://127.0.0.1:4174/#${name}`);
    await page
      .locator("main h1")
      .filter({ hasText: name[0].toUpperCase() + name.slice(1) })
      .waitFor();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth === innerWidth,
      ),
      `${name} mobile overflow`,
    );
  }
  await page.screenshot({
    path: "/tmp/octane-result-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "主题实验室", exact: true }).click();
  await page.getByRole("switch", { name: "暗色模式", exact: true }).click();
  await page.getByRole("switch", { name: "紧凑模式", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".ant-result-title")).color ===
      "rgba(255, 255, 255, 0.85)",
  );
  assert(!errors.length, errors.join("\n"));
  return { errors, interactivePages: 4, mobilePages: 4 };
}
