/** Run with playwright-cli run-code against tree-selection.html (native source fixture). */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    new URL("/tests/browser/tree-selection.html", page.url()).href,
  );
  const tree = page.getByRole("combobox", { name: "Places tree" });
  await tree.click();
  await tree.fill("Japan");
  await page.getByText("Japan", { exact: true }).click();
  if ((await page.getByLabel("Tree value").textContent()) !== '["jp"]')
    throw Error("Tree selection failed");
  await page.keyboard.press("Escape");
  const path = page.getByRole("combobox", { name: "Place path" });
  await path.focus();
  await path.press("ArrowDown");
  await path.press("ArrowDown");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  if (
    (await page.getByLabel("Path value").textContent()) !== '["asia","tokyo"]'
  )
    throw Error("Path keyboard selection failed");
  await page.getByRole("button", { name: "Clear selection" }).last().click();
  if ((await page.getByLabel("Path value").textContent()) !== "[]")
    throw Error("Clear failed");
  await path.click();
  const before = await page
    .getByRole("dialog")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await path.click();
  const after = await page
    .getByRole("dialog")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  if (before === after) throw Error("Dark theme not applied");
  await page.setViewportSize({ width: 375, height: 740 });
  // ResizeObserver / layout effects run after the viewport change is delivered.
  await page.waitForFunction(() => {
    const box = document
      .querySelector('[role="dialog"]')
      ?.getBoundingClientRect();
    return box && box.x >= 0 && box.right <= innerWidth;
  });
  const box = await page.getByRole("dialog").boundingBox();
  await page.getByRole("button", { name: "Toggle controls" }).click();
  if (await page.getByRole("dialog").count())
    throw Error("Portal leaked after unmount");
  if (errors.length) throw Error(errors.join("; "));
  return {
    passed: true,
    lightBackground: before,
    darkBackground: after,
    narrowPopup: box,
  };
}
