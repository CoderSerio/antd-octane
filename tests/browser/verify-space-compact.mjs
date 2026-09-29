/** Source fixture: compact geometry and interaction, including real border joins. */
export default async function verify(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  const fixture = "http://127.0.0.1:4175/tests/browser/space-compact.html";
  await page.setViewportSize({ width: 800, height: 1000 });
  await page.goto(fixture);
  await page.getByRole("button", { name: "Submit", exact: true }).waitFor();
  const geometry = async (name, selector = ".ant-space-compact-item") =>
    page
      .locator(
        selector
          .split(",")
          .map((part) => `[data-case="${name}"] ${part.trim()}`)
          .join(","),
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const css = getComputedStyle(node);
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            radii: [
              css.borderTopLeftRadius,
              css.borderTopRightRadius,
              css.borderBottomLeftRadius,
              css.borderBottomRightRadius,
            ],
            z: css.zIndex,
          };
        }),
      );
  const dimensions = {};
  for (const size of ["small", "middle", "large"]) {
    const controls = await geometry(`size-${size}`);
    const height = size === "small" ? 24 : size === "large" ? 40 : 32;
    assert(
      controls.every((control) => Math.abs(control.height - height) < 0.1),
      `${size} unequal control heights`,
    );
    assert(
      controls[0].radii[1] === "0px" &&
        controls[1].radii.every((radius) => radius === "0px") &&
        controls[2].radii[0] === "0px",
      `${size} corner join`,
    );
    assert(
      Math.abs(controls[1].x - (controls[0].x + controls[0].width - 1)) < 0.1,
      `${size} duplicated horizontal border`,
    );
    dimensions[size] = controls.map(({ height, radii }) => ({ height, radii }));
  }
  const vertical = await geometry("vertical");
  assert(
    vertical[0].radii[2] === "0px" &&
      vertical[1].radii.every((radius) => radius === "0px") &&
      vertical[2].radii[0] === "0px",
    "Vertical corner join",
  );
  assert(
    Math.abs(vertical[1].y - (vertical[0].y + vertical[0].height - 1)) < 0.1,
    "Duplicated vertical border",
  );
  const nested = await geometry("nested", "button");
  assert(
    nested[1].radii.every((radius) => radius === "0px") &&
      nested[2].radii.every((radius) => radius === "0px"),
    "Nested compact corners",
  );
  assert(
    Math.abs(nested[2].x - (nested[1].x + nested[1].width - 1)) < 0.1,
    "Nested compact border seam",
  );
  for (const name of ["affix", "addon", "controls"]) {
    const controls = await geometry(name);
    assert(
      controls.every((control) => Math.abs(control.height - 32) < 0.1),
      `${name} unequal height`,
    );
    assert(
      controls[0].radii[1] === "0px" && controls.at(-1).radii[0] === "0px",
      `${name} radius join`,
    );
  }
  const grouped = await page
    .locator('[data-case="grouped"] .ant-input-group-addon')
    .last()
    .evaluate((node) => getComputedStyle(node).borderTopRightRadius);
  assert(grouped === "0px", "Grouped input outer addon radius");
  const count = await page
    .locator('[data-case="count"] .ant-input-count-wrapper')
    .boundingBox();
  const countButton = await page
    .locator('[data-case="count"] button')
    .boundingBox();
  assert(
    Math.abs(countButton.x - (count.x + count.width - 1)) < 0.1,
    "Count wrapper border seam",
  );
  const query = page.getByRole("textbox", { name: "Query", exact: true });
  await query.fill("edited");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  assert(
    (await page.locator("output").textContent()) === "edited",
    "Compact callbacks lost",
  );
  await query.focus();
  assert(
    (await query.evaluate((node) => getComputedStyle(node).zIndex)) === "2",
    "Focused border behind adjacent control",
  );
  await page
    .getByRole("button", { name: "Toggle disabled", exact: true })
    .click();
  assert(
    (await query.isDisabled()) &&
      (await page
        .getByRole("button", { name: "Submit", exact: true })
        .isDisabled()),
    "Disabled context not updated",
  );
  await page
    .getByRole("button", { name: "Toggle disabled", exact: true })
    .click();
  assert(
    (await query.inputValue()) === "edited",
    "Input state lost on context update",
  );
  const rtl = await geometry("rtl");
  assert(
    rtl[0].radii[0] === "0px" && rtl[1].radii[1] === "0px",
    "RTL logical corner join",
  );
  await page.setViewportSize({ width: 390, height: 1000 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile fixture overflow",
  );
  await page.screenshot({
    path: "/tmp/octane-space-compact-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 800, height: 1000 });
  await page.goto(`${fixture}?renderer=antd`);
  await page.locator('[data-case="size-large"] button').last().waitFor();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-case="size-small"] button')
        ?.getBoundingClientRect().height === 24,
  );
  for (const size of ["small", "middle", "large"]) {
    const reference = await geometry(`size-${size}`, ".ant-input, .ant-btn");
    assert(
      JSON.stringify(
        reference.map(({ height, radii }) => ({ height, radii })),
      ) === JSON.stringify(dimensions[size]),
      `${size} differs from Ant Design height/radii: ${JSON.stringify(reference)} vs ${JSON.stringify(dimensions[size])}`,
    );
  }
  await page.goto(
    "http://127.0.0.1:4175/tests/browser/space-compact-signal.html",
  );
  const signalInput = page.getByRole("textbox", {
    name: "Signal input",
    exact: true,
  });
  await signalInput.waitFor();
  await signalInput.fill("Edited signal");
  await page.getByRole("button", { name: "Change size", exact: true }).click();
  assert(
    (await signalInput.inputValue()) === "Edited signal",
    "Signal size update lost input state",
  );
  assert(
    (await signalInput.evaluate(
      (node) => node.getBoundingClientRect().height,
    )) === 24,
    "Signal compact size context",
  );
  await page.getByRole("button", { name: "Toggle last", exact: true }).click();
  await page.waitForFunction(() =>
    document
      .querySelector('[data-case="signal"] input')
      ?.classList.contains("ant-space-compact-last-item"),
  );
  assert(
    (await signalInput.evaluate(
      (node) => getComputedStyle(node).borderTopRightRadius,
    )) === "4px",
    "Signal removal did not restore last corner",
  );
  await page.getByRole("button", { name: "Toggle last", exact: true }).click();
  await page.waitForFunction(
    () =>
      !document
        .querySelector('[data-case="signal"] input')
        ?.classList.contains("ant-space-compact-last-item"),
  );
  const signalNested = await geometry("signal-nested", "button");
  assert(
    signalNested[1].radii.every((radius) => radius === "0px") &&
      signalNested[2].radii.every((radius) => radius === "0px"),
    "Signal nested compact corners",
  );
  assert(
    Math.abs(
      signalNested[2].x - (signalNested[1].x + signalNested[1].width - 1),
    ) < 0.1,
    "Signal nested border seam",
  );
  assert(errors.length === 0, errors.join("\n"));
  return {
    sizes: "small/middle/large match antd heights and radii",
    joins:
      "horizontal/vertical/nested/affix/addon/select/input-number/count/grouped/RTL",
    interaction: "state/focus/disabled",
    signal: "size/conditional children/nested boundaries",
    mobile: 390,
    pageErrors: errors,
  };
}
