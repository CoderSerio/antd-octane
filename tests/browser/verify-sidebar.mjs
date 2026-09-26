/** Verify readable single-line navigation across desktop and mobile widths. */
export default async function verify(page) {
  const measurements = [];
  await page.goto("http://127.0.0.1:4174/#empty");
  await page.reload();
  await page.locator(".nav-item-label").first().waitFor();
  for (const width of [1440, 1100, 900, 720, 390]) {
    await page.setViewportSize({ width, height: 900 });
    if (width === 390)
      await page
        .getByRole("button", { name: "文档导航", exact: false })
        .click();
    const result = await page.locator(".sidebar").evaluate((sidebar) => {
      const rows = [...sidebar.querySelectorAll("nav a")];
      return {
        width: innerWidth,
        sidebarWidth: sidebar.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: rows
          .filter((row) => {
            const label = row.querySelector(".nav-item-label");
            return (
              row.getBoundingClientRect().height !== 40 ||
              !label ||
              label.scrollWidth > label.clientWidth ||
              label.getBoundingClientRect().height > 40
            );
          })
          .map((row) => row.textContent),
      };
    });
    measurements.push(result);
    if (result.overflow || result.broken.length)
      throw Error(JSON.stringify(result));
    if (width === 1100) {
      await page.locator('.sidebar a[href="#empty"]').scrollIntoViewIfNeeded();
      await page
        .locator(".sidebar")
        .screenshot({ path: "/tmp/octane-sidebar-fixed.png" });
    }
  }
  await page.locator('.sidebar a[href="#descriptions"]').click();
  if (await page.locator(".sidebar").isVisible())
    throw Error("Mobile navigation did not close");
  return measurements;
}
