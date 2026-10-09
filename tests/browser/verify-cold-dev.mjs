/** Run against scripts/dev-consumer.mjs, which serves an isolated packed package. */
export default async function verify(page, baseURL = "http://127.0.0.1:5197") {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  let checks = 0;
  const assert = (value, message) => {
    checks++;
    if (!value) throw new Error(message);
  };
  try {
    await page.goto(`${baseURL}/button.html`);
    const button = page.getByRole("button", { name: "Clicked 0", exact: true });
    await button.waitFor();
    await button.click();
    await page
      .getByRole("button", { name: "Clicked 1", exact: true })
      .waitFor();
    assert(
      (await page.locator(".ant-btn").count()) === 1,
      "Cold Button consumer must render",
    );
    for (const entry of ["dates", "signals"]) {
      await page.goto(`${baseURL}/${entry}.html`);
      const input = page.locator("#date-input");
      await input.waitFor();
      assert(
        (await input.inputValue()) === "15 juin 2025",
        `${entry}: picker must see the application's French locale`,
      );
      assert(
        (await page.locator("#app-locale").textContent()) === "juin",
        `${entry}: application Dayjs locale changed unexpectedly`,
      );
      await input.fill("31 février 2025");
      await input.press("Enter");
      await page.waitForFunction(
        () =>
          document
            .querySelector("#date-input")
            ?.getAttribute("aria-invalid") === "true",
      );
      assert(
        (await page.locator("#selected-date").textContent()) === "none",
        `${entry}: invalid date must not commit`,
      );
      await input.fill("17 juin 2025");
      await input.press("Enter");
      await page.waitForFunction(
        () =>
          document.querySelector("#selected-date")?.textContent ===
          "2025-06-17",
      );
      assert(
        (await input.inputValue()) === "17 juin 2025",
        `${entry}: localized strict parsing failed`,
      );
      await input.click();
      const date = page.locator('button[data-date="2025-06-18"]');
      await date.waitFor();
      await date.click();
      await page.waitForFunction(
        () =>
          document.querySelector("#selected-date")?.textContent ===
          "2025-06-18",
      );
      assert(
        (await input.inputValue()) === "18 juin 2025",
        `${entry}: panel selection failed`,
      );
      const calendar = page.locator(
        '.ant-picker-calendar td[title="2025-06-19"]',
      );
      await calendar.click();
      await page.waitForFunction(
        () =>
          document.querySelector("#selected-date")?.textContent ===
          "2025-06-19",
      );
      assert(
        (await calendar.count()) === 1,
        `${entry}: Calendar must use the shared date adapter`,
      );
    }
    assert(errors.length === 0, `Browser errors: ${errors.join("; ")}`);
    return {
      checks,
      errors,
      entries: ["button.tsx", "dates.tsx", "signals.tsrx"],
    };
  } finally {
    page.off("pageerror", onError);
  }
}
