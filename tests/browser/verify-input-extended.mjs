/** Native Input extended behavior in production documentation. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#input");
  const password = page.locator("#password input");
  await password.fill("secret-example");
  await page.getByRole("button", { name: "显示密码", exact: true }).click();
  assert(
    (await password.getAttribute("type")) === "text",
    "Password not revealed",
  );
  assert(
    (await password.inputValue()) === "secret-example",
    "Password value lost",
  );
  await page.getByRole("button", { name: "隐藏密码", exact: true }).click();
  assert(
    (await password.getAttribute("type")) === "password",
    "Password not hidden",
  );
  await page
    .locator("#password")
    .getByRole("button", { name: "清除输入", exact: true })
    .click();
  assert((await password.inputValue()) === "", "Password clear failed");
  const search = page.getByRole("textbox", { name: "搜索组件", exact: true });
  await search.fill("Octane");
  await search.dispatchEvent("keydown", {
    key: "Enter",
    isComposing: true,
    bubbles: true,
  });
  assert(
    !(await page.getByText("搜索内容：Octane", { exact: true }).count()),
    "IME Enter searched",
  );
  await search.press("Enter");
  await page.getByText("搜索内容：Octane", { exact: true }).waitFor();
  await search.fill("Button");
  await page
    .locator("#search")
    .getByRole("button", { name: "搜索", exact: true })
    .click();
  await page.getByText("搜索内容：Button", { exact: true }).waitFor();
  await page
    .locator("#search")
    .getByRole("button", { name: "清除输入", exact: true })
    .click();
  assert((await search.inputValue()) === "", "Search clear failed");
  await page
    .getByText("输入关键词并按 Enter，或点击搜索。", { exact: true })
    .waitFor();
  const controlled = page.getByRole("textbox", {
    name: "受控输入",
    exact: true,
  });
  await controlled.fill("controlled");
  await page
    .locator("#controlled")
    .getByRole("button", { name: "清除输入", exact: true })
    .click();
  assert((await controlled.inputValue()) === "", "Controlled clear failed");
  assert(
    (await page.locator("#controlled output").textContent()) === "—",
    "Controlled change not notified",
  );
  const textarea = page.getByRole("textbox", { name: "项目说明", exact: true });
  const initial = await textarea.evaluate(
    (el) => el.getBoundingClientRect().height,
  );
  await textarea.fill("第一行\n第二行\n第三行\n第四行");
  const expanded = await textarea.evaluate(
    (el) => el.getBoundingClientRect().height,
  );
  assert(expanded > initial, "TextArea did not grow");
  await textarea.fill(
    Array.from({ length: 12 }, (_, i) => `项目第 ${i + 1} 行`).join("\n"),
  );
  const size = await textarea.evaluate((el) => {
    const css = getComputedStyle(el);
    return {
      height: el.getBoundingClientRect().height,
      max:
        5 * parseFloat(css.lineHeight) +
        parseFloat(css.paddingTop) +
        parseFloat(css.paddingBottom) +
        parseFloat(css.borderTopWidth) +
        parseFloat(css.borderBottomWidth),
      overflow: css.overflowY,
    };
  });
  assert(
    Math.abs(size.height - size.max) < 1 && size.overflow === "auto",
    "TextArea did not cap at five rows",
  );
  await page
    .locator("#textarea")
    .getByRole("button", { name: "清除输入", exact: true })
    .click();
  assert((await textarea.inputValue()) === "", "TextArea clear failed");
  assert(
    Math.abs((await textarea.boundingBox()).height - initial) < 1,
    "TextArea did not shrink",
  );
  await page.locator("#affix").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/octane-input-extended-desktop.png" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator("#affix").scrollIntoViewIfNeeded();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Input page mobile overflow",
  );
  for (const id of ["affix", "password", "search", "textarea"]) {
    const rect = await page.locator(`#${id}`).boundingBox();
    assert(
      rect.x >= 0 && rect.x + rect.width <= 390.5,
      `${id} mobile overflow`,
    );
  }
  await page.screenshot({ path: "/tmp/octane-input-extended-mobile.png" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    password: true,
    search: "Enter/button/IME/clear",
    controlledClear: true,
    textarea: "grow/maxRows/shrink",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
