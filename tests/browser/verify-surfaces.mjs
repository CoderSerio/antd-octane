/** Interactive splitter and actual canvas watermark production checks. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4174/#splitter");
  const handle = page.locator("#basic [role=separator]");
  await handle.waitFor();
  const initial = Number(await handle.getAttribute("aria-valuenow"));
  assert(initial > 0, "Panel dimensions missing");
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  const resized = Number(await handle.getAttribute("aria-valuenow"));
  assert(resized > initial + 40, "Pointer resize failed");
  await handle.focus();
  await page.keyboard.press("ArrowLeft");
  assert(
    Number(await handle.getAttribute("aria-valuenow")) === resized - 10,
    "Keyboard resize failed",
  );
  await page.keyboard.press("End");
  const total = await page
    .locator("#basic .ant-splitter")
    .evaluate((el) => el.clientWidth);
  assert(
    Math.abs(Number(await handle.getAttribute("aria-valuenow")) - total * 0.7) <
      1,
    "Panel max clamp failed",
  );
  const vertical = page.locator("#more [role=separator]").first();
  await vertical.focus();
  await page.keyboard.press("ArrowDown");
  assert(
    Number(await vertical.getAttribute("aria-valuenow")) === 110,
    "Controlled vertical resize failed",
  );
  await page.getByRole("button", { name: "重置面板", exact: true }).click();
  assert(
    Number(await vertical.getAttribute("aria-valuenow")) === 100,
    "Controlled reset failed",
  );
  await page.screenshot({ path: "/tmp/octane-splitter-desktop.png" });
  await page.setViewportSize({ width: 390, height: 1000 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Splitter page overflow",
  );
  await page.goto("http://127.0.0.1:4174/#watermark");
  await page.locator("#basic .ant-watermark-layer").waitFor();
  const painted = await page
    .locator("#basic .ant-watermark-layer")
    .evaluate(async (el) => {
      const url = el.style.backgroundImage.slice(5, -2);
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
      let ink = 0;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) ink++;
      return ink;
    });
  assert(painted > 100, "Canvas watermark contains no painted text");
  await page
    .getByRole("textbox", { name: "水印下的输入", exact: true })
    .fill("仍可交互");
  assert(
    (await page
      .getByRole("textbox", { name: "水印下的输入", exact: true })
      .inputValue()) === "仍可交互",
    "Overlay blocked input",
  );
  const layer = page.locator("#more .ant-watermark-layer");
  const text = await layer.getAttribute("style");
  await page.getByRole("button", { name: "使用图片水印", exact: true }).click();
  await page.waitForFunction(
    (before) =>
      document
        .querySelector("#more .ant-watermark-layer")
        ?.getAttribute("style") !== before,
    text,
  );
  const image = await layer.getAttribute("style");
  await page.getByRole("button", { name: "切换旋转角度", exact: true }).click();
  await page.waitForFunction(
    (before) =>
      document
        .querySelector("#more .ant-watermark-layer")
        ?.getAttribute("style") !== before,
    image,
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Watermark page overflow",
  );
  await page.screenshot({ path: "/tmp/octane-watermark-mobile.png" });
  assert(errors.length === 0, errors.join("\n"));
  return {
    splitter: "pointer/keyboard/minmax/controlled/reset",
    watermark: "real-canvas-pixels/input/image/rotation",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
