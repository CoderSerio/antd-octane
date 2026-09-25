/** App context, SVG icons and QR renderers in the production documentation. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#app");
  await page
    .locator("#more")
    .getByRole("button", { name: "显示消息", exact: true })
    .click();
  const notice = page.locator(".ant-message-notice-content");
  await notice.waitFor();
  assert(
    (await notice.evaluate((el) => getComputedStyle(el).backgroundColor)) ===
      "rgb(230, 244, 255)",
    "App holder lost context theme",
  );
  await page.goto("http://127.0.0.1:4174/#icon");
  await page.getByRole("img", { name: "完成", exact: true }).waitFor();
  assert(
    (await page.locator(".ant-message-notice").count()) === 0,
    "App unmount leaked message",
  );
  const icon = page.getByRole("img", { name: "完成", exact: true });
  assert(
    (await icon.locator("svg path").evaluate((el) => el.namespaceURI)) ===
      "http://www.w3.org/2000/svg",
    "Icon wrong SVG namespace",
  );
  assert(
    (await icon.locator("svg path").getAttribute("stroke")) === "currentColor",
    "Icon path lost paint",
  );
  assert(
    (await page
      .getByRole("img", { name: "自定义图形", exact: true })
      .locator("svg rect")
      .count()) === 1,
    "Custom SVG child missing",
  );
  await page.goto("http://127.0.0.1:4174/#qr-code");
  await page.locator("#basic canvas").waitFor();
  const checkPixels = async () =>
    page.locator("#basic").evaluate((el) => {
      const canvas = el.querySelector("canvas");
      const svg = el.querySelector("svg");
      const count = Number(svg.getAttribute("viewBox").split(" ")[2]);
      const dark = new Set(
        Array.from(
          svg
            .querySelector("path")
            .getAttribute("d")
            .matchAll(/M(\d+) (\d+)h1v1h-1z/g),
          (match) => `${match[1]},${match[2]}`,
        ),
      );
      const ctx = canvas.getContext("2d");
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let mismatches = 0;
      for (let y = 0; y < count; y++)
        for (let x = 0; x < count; x++) {
          const px = Math.floor(((x + 0.5) * canvas.width) / count);
          const py = Math.floor(((y + 0.5) * canvas.height) / count);
          const offset = (py * canvas.width + px) * 4;
          const ink =
            (data[offset] + data[offset + 1] + data[offset + 2]) / 3 < 128;
          if (ink !== dark.has(`${x},${y}`)) mismatches++;
        }
      return { mismatches, dark: dark.size, dimensions: count };
    });
  const settledPixels = async () => {
    let result;
    for (let attempt = 0; attempt < 30; attempt++) {
      result = await checkPixels();
      if (result.mismatches === 0 && result.dark > 100) return result;
      await page.waitForTimeout(50);
    }
    return result;
  };
  let pixels = await settledPixels();
  assert(
    pixels.mismatches === 0 && pixels.dark > 100,
    "Canvas disagrees with SVG modules or quiet zone",
  );
  const before = await page
    .locator("#basic .ant-qrcode svg path")
    .getAttribute("d");
  await page
    .getByRole("textbox", { name: "二维码内容", exact: true })
    .fill("中文 Octane 🚀");
  await page.waitForFunction(
    (previous) =>
      document
        .querySelector("#basic .ant-qrcode svg path")
        ?.getAttribute("d") !== previous,
    before,
  );
  pixels = await settledPixels();
  assert(pixels.mismatches === 0, "UTF8 Canvas/SVG repaint mismatch");
  await page
    .locator("#more")
    .getByRole("button", { name: "刷新", exact: true })
    .click();
  assert(
    (await page.locator("#more .ant-qrcode-mask").count()) === 0,
    "QR refresh did not clear mask",
  );
  await page.getByRole("button", { name: "设为过期", exact: true }).click();
  await page
    .locator("#more")
    .getByText("二维码已过期", { exact: true })
    .waitFor();
  await page.screenshot({ path: "/tmp/octane-qr-desktop.png" });
  await page.getByRole("textbox", { name: "二维码内容", exact: true }).fill("");
  await page.locator("#basic [role=status]").first().waitFor();
  assert(
    (await page
      .locator("#basic .ant-qrcode canvas,#basic .ant-qrcode svg")
      .count()) === 0,
    "Empty value retained stale QR",
  );
  await page
    .getByRole("textbox", { name: "二维码内容", exact: true })
    .fill("https://ant.design");
  await page.locator("#basic canvas").waitFor();
  await page.setViewportSize({ width: 390, height: 1000 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "QR page mobile overflow",
  );
  await page.screenshot({ path: "/tmp/octane-qr-mobile.png" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    app: "theme-context/unmount",
    icon: "SVGnamespace/path/custom-child",
    qr: "Canvas/SVG all module pixels incl quietzone/UTF8/repaint/empty/refresh",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
