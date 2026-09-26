/** Production interaction checks for numeric input and sliders. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#input-number");
  const price = page.getByRole("spinbutton", { name: "单价", exact: true });
  await price.fill("0.1");
  await price.press("ArrowUp");
  await page.getByText("当前数值：0.2", { exact: true }).waitFor();
  await price.fill("99");
  await price.press("Tab");
  await page.waitForFunction(
    () => document.querySelector('[aria-label="单价"]').value === "10.00",
  );
  await price.fill("");
  await price.press("Tab");
  await page.getByText("当前数值：空", { exact: true }).waitFor();
  const amount = page.getByRole("spinbutton", { name: "金额", exact: true });
  await amount.fill("2500");
  await amount.press("Tab");
  assert(
    (await amount.inputValue()).includes("2500"),
    "Parser/formatter must preserve numeric value",
  );
  assert(
    await page
      .getByRole("spinbutton", { name: "禁用数量", exact: true })
      .isDisabled(),
    "Disabled number",
  );
  await page.goto("http://127.0.0.1:4174/#slider");
  const slider = page.getByRole("slider", { name: "音量", exact: true });
  await slider.focus();
  await slider.press("ArrowRight");
  await page.getByText("音量：31", { exact: true }).waitFor();
  await slider.press("Home");
  await page.getByText("音量：0", { exact: true }).waitFor();
  await slider.press("End");
  await page.getByText("音量：100", { exact: true }).waitFor();
  const rail = page.locator("#basic .ant-slider");
  const box = await rail.boundingBox();
  await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, {
    steps: 6,
  });
  await page.mouse.up();
  const value = Number(await slider.getAttribute("aria-valuenow"));
  assert(value >= 23 && value <= 27, "Pointer drag should set roughly25");
  const low = page.getByRole("slider", { name: "范围下限" }),
    high = page.getByRole("slider", { name: "范围上限" });
  await low.press("End");
  assert(
    Number(await low.getAttribute("aria-valuenow")) <=
      Number(await high.getAttribute("aria-valuenow")),
    "Range handles must not cross",
  );
  await page.getByRole("slider", { name: "离散档位" }).press("ArrowRight");
  assert(
    (await page
      .getByRole("slider", { name: "离散档位" })
      .getAttribute("aria-valuenow")) === "100",
    "Discrete marks keyboard",
  );
  await page.getByRole("switch", { name: "禁用滑块" }).click();
  assert(
    (await slider.getAttribute("aria-disabled")) === "true",
    "Disabled slider semantics",
  );
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ["input-number", "slider", "input"]) {
      await page.goto(`http://127.0.0.1:4174/#${name}`);
      await page.locator("main h1").waitFor();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth === innerWidth,
        ),
        `${name} overflow at ${width}`,
      );
    }
  }
  await page.goto("http://127.0.0.1:4174/#slider");
  await page.screenshot({
    path: "/tmp/antd-slider-mobile.png",
    fullPage: true,
  });
  assert(errors.length === 0, errors.join("\n"));
  return {
    errors,
    numeric: "precision/clamp/clear/formatter",
    slider: "keyboard/pointer/range/marks/disabled",
    responsiveWidths: [1440, 390],
  };
}
