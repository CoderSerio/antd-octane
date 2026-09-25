/** Packed library + Tailwind v4 with the declared cascade order; deliberately limited surface coverage. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
  };
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto("http://127.0.0.1:4176/");
  await page.locator("#utility").waitFor();
  const read = () =>
    page.evaluate(() => {
      const style = (id) => getComputedStyle(document.getElementById(id));
      const layout = style("utility-layout"),
        normal = style("default"),
        utility = style("utility"),
        primary = style("primary");
      return {
        layout: {
          display: layout.display,
          columns: layout.gridTemplateColumns.split(" ").length,
          gap: layout.gap,
          padding: layout.padding,
        },
        normal: {
          height: normal.height,
          borderWidth: normal.borderTopWidth,
          borderStyle: normal.borderTopStyle,
          radius: normal.borderTopLeftRadius,
          fontSize: normal.fontSize,
          background: normal.backgroundColor,
        },
        utility: {
          height: utility.height,
          paddingLeft: utility.paddingLeft,
          paddingRight: utility.paddingRight,
          gap: utility.gap,
        },
        primary: primary.backgroundColor,
      };
    });
  const values = await read();
  assert(
    values.layout.display === "grid" && values.layout.columns === 2,
    "Tailwind grid columns",
  );
  assert(
    values.layout.gap === "16px" && values.layout.padding === "24px",
    "Tailwind gap/padding",
  );
  const utilities = (values) => {
    assert(
      values.utility.height === "48px",
      "h-12 must override Button height",
    );
    assert(
      values.utility.paddingLeft === "32px" &&
        values.utility.paddingRight === "32px",
      "px-8 must override Button padding",
    );
    assert(
      values.utility.gap === "12px",
      "gap-3 must override Button icon gap",
    );
  };
  utilities(values);
  assert(
    (await page
      .locator("#mapped-primary")
      .evaluate((el) => getComputedStyle(el).color)) === "rgb(22, 119, 255)",
    "Application token mapping default",
  );
  assert(
    values.normal.background === "rgb(255, 255, 255)" &&
      values.normal.height === "32px" &&
      values.normal.borderWidth === "1px" &&
      values.normal.borderStyle === "solid" &&
      values.normal.radius === "6px" &&
      values.normal.fontSize === "14px",
    "Tailwind Preflight must preserve default Button surface",
  );
  assert(values.primary === "rgb(22, 119, 255)", "Default primary theme");
  assert(await page.locator("#disabled").isDisabled(), "Disabled semantics");
  await page.getByRole("combobox", { name: "Theme" }).selectOption("brand");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("primary")).backgroundColor ===
      "rgb(114, 46, 209)",
  );
  assert(
    (await page
      .locator("#mapped-primary")
      .evaluate((el) => getComputedStyle(el).color)) === "rgb(114, 46, 209)",
    "Application token mapping updates with brand",
  );
  utilities(await read());
  await page.getByRole("combobox", { name: "Theme" }).selectOption("dark");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("default")).backgroundColor ===
      "rgb(20, 20, 20)",
  );
  utilities(await read());
  await page.getByRole("combobox", { name: "Theme" }).selectOption("compact");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("default")).height === "28px",
  );
  utilities(await read());
  await page.getByRole("combobox", { name: "Theme" }).selectOption("default");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("default")).height === "32px",
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("default")).backgroundColor ===
        "rgb(255, 255, 255)" &&
      getComputedStyle(document.getElementById("disabled")).color ===
        "rgba(0, 0, 0, 0.25)",
  );
  await page.screenshot({ path: "/tmp/octane-tailwind-consumer.png" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    preflight: "default Button intact",
    utilities: "h-12 / px-8 / gap-3 / grid-cols-2 / gap-4 / p-6",
    themes: ["default", "brand", "dark", "compact"],
    tokenMapping:
      "theme.useToken -> --app-primary -> @theme inline text-app-primary",
    pageErrors: errors,
  };
}
