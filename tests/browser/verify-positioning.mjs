/** Production target scrolling, anchor tracking and floating actions. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#affix");
  await page.reload();
  const scroller = page.getByRole("region", {
    name: "固钉滚动容器",
    exact: true,
  });
  await scroller.waitFor();
  await scroller.evaluate((el) => {
    el.scrollTop = 150;
  });
  await page.getByRole("button", { name: "已固定", exact: true }).waitFor();
  const geometry = await scroller.evaluate((el) => {
    const fixed = el.querySelector(".ant-affix");
    return {
      actual: fixed?.getBoundingClientRect().top,
      expected: el.getBoundingClientRect().top + 8,
    };
  });
  assert(
    Math.abs(geometry.actual - geometry.expected) < 1,
    "Affix target offset geometry",
  );
  await scroller.evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.getByRole("button", { name: "滚动后固定", exact: true }).waitFor();
  await page.goto("http://127.0.0.1:4174/#anchor");
  const anchor = page
    .locator("#basic")
    .getByRole("navigation", { name: "页内导航" });
  await anchor.getByRole("link", { name: "快速开始", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('[aria-label="锚点内容容器"]').scrollTop > 200,
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector('#basic a[href="#anchor-demo-two"]')
        ?.getAttribute("aria-current") === "location",
  );
  const content = page.getByRole("region", {
    name: "锚点内容容器",
    exact: true,
  });
  await content.evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.waitForFunction(
    () =>
      document
        .querySelector('#basic a[href="#anchor-demo-one"]')
        ?.getAttribute("aria-current") === "location",
  );
  await page.goto("http://127.0.0.1:4174/#float-button");
  await page.getByRole("button", { name: "联系支持", exact: true }).click();
  await page.getByText("操作次数：1", { exact: true }).waitFor();
  const group = page.getByRole("button", {
    name: "展开浮动按钮组",
    exact: true,
  });
  await group.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "组内创建", exact: true }).click();
  await page.getByText("组内操作：1", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "组内创建", exact: true })
    .waitFor({ state: "hidden" });
  const top = page.getByRole("region", { name: "返回顶部容器", exact: true });
  await top.evaluate((el) => {
    el.scrollTop = 400;
  });
  await page.getByRole("button", { name: "返回顶部", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('[aria-label="返回顶部容器"]').scrollTop === 0,
  );
  for (const name of ["affix", "anchor", "float-button"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://127.0.0.1:4174/#${name}`);
    await page.locator("main h1").waitFor();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth === innerWidth,
      ),
      `${name} mobile overflow`,
    );
  }
  await page.screenshot({
    path: "/tmp/octane-float-button-mobile.png",
    fullPage: true,
  });
  assert(!errors.length, errors.join("\n"));
  return {
    errors,
    affix: "custom offset and release",
    anchor: "click and scroll active",
    floatButton: "click/keyboard/group/backtop",
    mobilePages: 3,
  };
}
