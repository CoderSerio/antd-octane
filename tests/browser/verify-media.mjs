/** Production Image preview and Carousel behavior, including mobile boundaries. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
  };
  const go = async (name) => {
    await page.goto(`http://127.0.0.1:4174/#${name}`);
    await page
      .locator("main h1")
      .filter({ hasText: name === "image" ? "Image" : "Carousel" })
      .waitFor();
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("image");
  const trigger = page.getByRole("button", {
    name: "预览：蓝色山景",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "图片预览", exact: true });
  await dialog.waitFor();
  assert(
    await page.evaluate(() => document.body.style.overflow === "hidden"),
    "Image preview locks background scroll",
  );
  await dialog.getByRole("button", { name: "放大图片", exact: true }).click();
  assert(
    await dialog
      .locator("img")
      .evaluate((el) => el.style.transform === "scale(1.5)"),
    "Image zoom changes rendered image",
  );
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert(
    await trigger.evaluate((el) => el === document.activeElement),
    "Image close restores trigger focus",
  );
  assert(
    await page.evaluate(() => document.body.style.overflow !== "hidden"),
    "Image close unlocks scroll",
  );
  await page
    .getByRole("button", { name: "预览：绿色湖景", exact: true })
    .click();
  await dialog.waitFor();
  assert(
    await dialog
      .getByRole("button", { name: "上一张图片", exact: true })
      .isDisabled(),
    "Preview group first boundary",
  );
  await dialog.getByRole("button", { name: "下一张图片", exact: true }).click();
  assert(
    (await dialog.locator("img").getAttribute("alt")) === "紫色夕景",
    "Preview group next image",
  );
  await page.keyboard.press("ArrowRight");
  assert(
    (await dialog.locator("img").getAttribute("alt")) === "橙色沙丘",
    "Preview group keyboard next",
  );
  assert(
    await dialog
      .getByRole("button", { name: "下一张图片", exact: true })
      .isDisabled(),
    "Preview group last boundary",
  );
  await dialog
    .getByRole("button", { name: "关闭图片预览", exact: true })
    .click();
  await go("carousel");
  const basic = page.locator("#basic");
  assert(
    await basic
      .locator(".slick-dots button")
      .evaluateAll((nodes) =>
        nodes.every((node) => node.textContent.trim() === ""),
      ),
    "Carousel dots must not leak numeric text under consumer font resets",
  );
  await basic
    .getByRole("button", { name: "切换至第 3 张幻灯片", exact: true })
    .click();
  await page.getByText("当前第 3 张", { exact: true }).waitFor();
  assert(
    await basic
      .getByRole("button", { name: "下一张幻灯片", exact: true })
      .isDisabled(),
    "Carousel finite end boundary",
  );
  assert(
    (await basic.locator(".slick-slide[inert]").count()) === 2,
    "Inactive slides inert",
  );
  await basic.getByRole("button", { name: "回到第一页", exact: true }).click();
  await page.getByText("当前第 1 张", { exact: true }).waitFor();
  await basic.getByRole("button", { name: "下一页", exact: true }).click();
  await page.getByText("当前第 2 张", { exact: true }).waitFor();
  const box = await basic.locator(".slick-list").boundingBox();
  assert(box, "Carousel swipe surface");
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
  await page.mouse.up();
  await page.getByText("当前第 3 张", { exact: true }).waitFor();
  await page.locator("main h1").click();
  await page.locator("main h1").hover();
  await page.waitForFunction(
    () =>
      document.querySelector("#more .slick-active.slick-slide")?.textContent !==
      "1",
    {},
    { timeout: 7000 },
  );
  await page
    .locator("#more")
    .getByRole("button", { name: "暂停自动播放", exact: true })
    .click();
  assert(
    await page
      .locator("#more")
      .getByRole("button", { name: "继续自动播放", exact: true })
      .isVisible(),
    "Carousel pause control state",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["image", "carousel"]) {
    await go(name);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${name} mobile page overflow`,
    );
  }
  await page.screenshot({
    path: "/tmp/octane-carousel-mobile.png",
    fullPage: true,
  });
  await go("image");
  await page
    .getByRole("button", { name: "预览：蓝色山景", exact: true })
    .click();
  await dialog.waitFor();
  const imageBox = await dialog.locator("img").boundingBox();
  assert(imageBox && imageBox.width <= 390, "Mobile image fits preview");
  await page.screenshot({ path: "/tmp/octane-image-preview-mobile.png" });
  await page.keyboard.press("Escape");
  assert(errors.length === 0, errors.join("\n"));
  return {
    image: "preview, zoom, group, keyboard, focus, scroll lock",
    carousel:
      "arrows, dots, ref, swipe, finite boundaries, inert, autoplay/pause",
    mobileWidth: 390,
    pageErrors: errors,
  };
}
