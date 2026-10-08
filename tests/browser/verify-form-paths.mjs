/** Run via playwright-cli run-code on form-paths.html; this exercises source, not npm. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(new URL("/tests/browser/form-paths.html", page.url()).href);
  await page.getByLabel(/Name/).fill("Grace");
  await page.getByRole("alert").filter({ hasText: "Names differ" }).waitFor();
  await page.getByLabel(/Confirmation/).fill("Grace");
  await page.getByRole("combobox", { name: /Team/ }).click();
  await page.getByRole("treeitem").filter({ hasText: "Team B" }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "note.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Hello"),
  });
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page.waitForFunction(() =>
    document.querySelector("output")?.textContent?.includes('"team":"b"'),
  );
  const value = JSON.parse(await page.getByLabel("Result").textContent());
  if (
    value.user.name !== "Grace" ||
    value.user.confirmation !== "Grace" ||
    !value.user.date.includes("T") ||
    value.user.files[0]?.name !== "note.txt"
  )
    throw new Error("Nested submission lost control values");
  await page.getByRole("button", { name: "Reset names" }).click();
  if (
    (await page.getByLabel(/Name/).inputValue()) !== "Ada" ||
    (await page.getByRole("combobox", { name: /Team/ }).inputValue()) !==
      "Team B"
  )
    throw new Error("Partial reset changed unrelated fields");
  await page.setViewportSize({ width: 360, height: 780 });
  await page.waitForFunction(
    () => document.documentElement.scrollWidth <= innerWidth,
  );
  if (errors.length) throw new Error(errors.join("\n"));
  return {
    nestedSubmission: true,
    dependencyValidation: true,
    partialReset: true,
    fileMapping: true,
    pageErrors: errors,
  };
}
