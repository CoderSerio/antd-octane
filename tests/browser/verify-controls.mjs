/** Production interactions, catalog coverage and mobile layout for choice/navigation components. */
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
      .filter({ hasText: name[0].toUpperCase() + name.slice(1) })
      .waitFor();
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("segmented");
  await page.reload();
  const view = page.locator('#more [role="radiogroup"]').first();
  await view.getByRole("radio", { name: "项目", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await page.getByText("当前视图：成员", { exact: true }).waitFor();
  assert(
    await view.getByRole("radio", { name: "成员", exact: true }).isChecked(),
    "Controlled Segmented radio did not update",
  );
  await page.keyboard.press("End");
  await page.getByText("当前视图：设置", { exact: true }).waitFor();
  await view.getByRole("radio", { name: "项目", exact: true }).check();
  await page.getByText("当前视图：项目", { exact: true }).waitFor();
  const group = page.locator('#basic [role="radiogroup"]').nth(1);
  await group.getByRole("radio", { name: "看板", exact: true }).check();
  await group.getByRole("radio", { name: "看板", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert(
    await group.getByRole("radio", { name: "列表", exact: true }).isChecked(),
    "Segmented keyboard did not skip disabled item",
  );

  await go("rate");
  const rate = page.getByRole("slider", { name: "体验评分", exact: true });
  await rate.focus();
  await page.keyboard.press("ArrowRight");
  assert(
    (await rate.getAttribute("aria-valuenow")) === "3.5",
    "Rate half-step keyboard update",
  );
  await page.getByText("3.5 分", { exact: true }).waitFor();
  await page.keyboard.press("End");
  assert((await rate.getAttribute("aria-valuenow")) === "5", "Rate End");
  await page.keyboard.press("Home");
  assert((await rate.getAttribute("aria-valuenow")) === "0", "Rate Home");
  const second = rate.locator(".ant-rate-star").nth(1);
  const rect = await second.boundingBox();
  assert(rect, "Rate star bounds");
  await page.mouse.click(rect.x + rect.width * 0.25, rect.y + rect.height / 2);
  assert(
    (await rate.getAttribute("aria-valuenow")) === "1.5",
    "Rate half-star pointer selection",
  );
  await page.mouse.click(rect.x + rect.width * 0.25, rect.y + rect.height / 2);
  assert(
    (await rate.getAttribute("aria-valuenow")) === "0",
    "Rate repeated pointer clears",
  );

  await go("breadcrumb");
  await page
    .locator("#more")
    .getByRole("button", { name: "订单列表", exact: true })
    .click();
  await page.getByText("当前区域：订单列表", { exact: true }).waitFor();
  assert(
    (await page.locator('#basic a[href="#components"]').count()) === 1,
    "Breadcrumb href",
  );

  await go("pagination");
  const basic = page.locator("#basic");
  await basic.getByRole("button", { name: "下一页", exact: true }).click();
  await page.getByText("第 2 页，每页 10 条。", { exact: true }).waitFor();
  await basic
    .getByRole("combobox", { name: "每页条数", exact: true })
    .selectOption("20");
  await page.getByText(/每页 20 条。/).waitFor();
  await basic.getByRole("textbox", { name: "跳转页码", exact: true }).fill("4");
  await basic
    .getByRole("textbox", { name: "跳转页码", exact: true })
    .press("Enter");
  await page.getByText("第 4 页，每页 20 条。", { exact: true }).waitFor();
  assert(
    (await basic
      .getByRole("button", { name: "第 4 页", exact: true })
      .getAttribute("aria-current")) === "page",
    "Pagination current semantics",
  );

  await go("steps");
  await page.getByRole("button", { name: "下一步", exact: true }).click();
  assert(
    (await page.locator('#basic [aria-current="step"]').textContent()).includes(
      "检查内容",
    ),
    "Steps next state",
  );
  await page.getByRole("button", { name: "下一步", exact: true }).click();
  assert(
    await page
      .getByRole("button", { name: "下一步", exact: true })
      .isDisabled(),
    "Steps end disabled",
  );
  await page
    .locator("#more")
    .getByRole("button", { name: /填写信息/ })
    .click();
  assert(
    (await page.locator('#more [aria-current="step"]').textContent()).includes(
      "填写信息",
    ),
    "Clickable vertical Steps",
  );
  assert(
    await page
      .locator("#more")
      .getByRole("button", { name: /归档/ })
      .isDisabled(),
    "Disabled step interactive",
  );

  await go("list");
  assert(
    (await page.locator("#basic .ant-list-items > .ant-list-item").count()) ===
      2,
    "List first page size",
  );
  await page
    .locator("#basic")
    .getByRole("button", { name: "下一页", exact: true })
    .click();
  await page.locator("#basic").getByText("验证交互", { exact: true }).waitFor();
  assert(
    (await page.locator("#basic .ant-list-items > .ant-list-item").count()) ===
      1,
    "List final page size",
  );

  await page.goto("http://127.0.0.1:4174/#components/coverage");
  await page.locator(".coverage-list").first().waitFor();
  const coverage = {
    entries: await page.locator(".coverage-list > li").count(),
    implemented: await page.locator(".coverage-ready").count(),
  };
  assert(coverage.entries === 70, `Coverage expected70 got${coverage.entries}`);
  assert(
    coverage.implemented === 37,
    `Coverage implemented expected37 got${coverage.implemented}`,
  );

  const mobilePages = [
    "segmented",
    "rate",
    "breadcrumb",
    "pagination",
    "steps",
    "tooltip",
    "popover",
  ];
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of mobilePages) {
    await go(name);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth === innerWidth,
      ),
      `${name} mobile document overflow`,
    );
  }
  await go("segmented");
  await page.screenshot({
    path: "/tmp/octane-segmented-mobile.png",
    fullPage: true,
  });
  await go("pagination");
  await page.screenshot({
    path: "/tmp/octane-pagination-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("rate");
  assert(
    await page
      .locator(".ant-rate-star-zero .ant-rate-star-first")
      .first()
      .evaluate((node) => getComputedStyle(node).opacity === "0"),
    "Empty Rate first half must not double-paint translucent color",
  );
  assert(
    await page
      .locator(".ant-rate-star-half .ant-rate-star-first")
      .first()
      .evaluate((node) => getComputedStyle(node).opacity === "1"),
    "Half Rate must show its selected first half",
  );
  await page.screenshot({
    path: "/tmp/octane-rate-desktop.png",
    fullPage: true,
  });
  assert(!errors.length, errors.join("\n"));
  return {
    errors,
    interactivePages: 6,
    mobilePages: mobilePages.length,
    coverage,
  };
}
