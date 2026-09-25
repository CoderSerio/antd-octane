export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/");
  await page.locator(".home-hero h1").waitFor();
  assert(
    (await page.locator("#doc-sidebar").count()) === 0,
    "Home has doc sidebar",
  );
  assert((await page.title()).includes("熟悉的设计"), "Home title");
  await page.screenshot({ path: "/tmp/octane-home-desktop.png" });
  await page.getByRole("button", { name: "酱紫", exact: true }).click();
  await page.getByRole("radio", { name: "暗色", exact: true }).check();
  await page.getByRole("button", { name: "保存项目", exact: true }).click();
  await page.getByRole("button", { name: "已保存", exact: true }).waitFor();
  assert(
    (await page.locator(".home-demo-board").getAttribute("data-mode")) ===
      "dark",
    "Demo dark theme",
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document.querySelector(
          ".home-demo-board .ant-btn-default:not(.ant-btn-primary)",
        ),
      ).backgroundColor === "rgb(20, 20, 20)",
  );
  await page.screenshot({ path: "/tmp/octane-home-showcase.png" });
  await page.getByRole("radio", { name: "紧凑", exact: true }).check();
  await page.getByRole("slider", { name: "示例进度", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert(
    (await page
      .getByRole("slider", { name: "示例进度", exact: true })
      .getAttribute("aria-valuenow")) === "65",
    "Progress slider",
  );
  await page
    .getByRole("link", { name: "开始使用", exact: false })
    .first()
    .click();
  await page.locator(".main h1").waitFor();
  assert(
    (await page.locator("#doc-sidebar").count()) === 1,
    "Docs sidebar lost",
  );
  await page
    .getByRole("link", { name: "Ant Design for Octane 首页", exact: true })
    .click();
  await page.locator(".home-hero").waitFor();
  await page.waitForFunction(() => scrollY === 0);
  await page.getByRole("button", { name: "切换暗色主题" }).click();
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document.querySelector(
          ".home-actions .ant-btn-default:not(.ant-btn-primary)",
        ),
      ).backgroundColor === "rgb(20, 20, 20)",
  );
  await page.screenshot({ path: "/tmp/octane-home-dark.png" });
  await page.getByRole("button", { name: "切换暗色主题" }).click();
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document.querySelector(
          ".home-actions .ant-btn-default:not(.ant-btn-primary)",
        ),
      ).backgroundColor === "rgb(255, 255, 255)",
  );
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Page overflows ${width}`,
    );
    await page.screenshot({
      path: `/tmp/octane-home-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("searchbox", { name: "搜索文档" }).fill("Button");
  await page
    .locator(".search-results")
    .getByRole("link", { name: "Button 按钮" })
    .click();
  await page.locator(".main h1").filter({ hasText: "Button" }).waitFor();
  assert(errors.length === 0, errors.join("\n"));
  return {
    errors,
    viewports: [1440, 768, 390],
    checks:
      "default home, CTA/docs/logo, search, scoped themes, button/slider, dark shell, no overflow",
  };
}
