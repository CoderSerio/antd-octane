import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

it("omits deprecated parameter rows from component reference data", () => {
  const source = resolve(root, "site/src");
  let tables = 0;
  for (const path of readdirSync(source, {
    recursive: true,
    encoding: "utf8",
  })) {
    if (!path.endsWith(".json")) continue;
    const reference: { api?: { title: string; rows: string[][] }[] } =
      JSON.parse(readFileSync(resolve(source, path), "utf8"));
    for (const section of reference.api ?? []) {
      tables++;
      expect(section.rows.length, `${path}: ${section.title}`).toBeGreaterThan(
        0,
      );
      for (const row of section.rows)
        expect(row[0], `${path}: ${section.title}`).not.toMatch(/~~[^~]+~~/);
    }
  }
  expect(tables).toBeGreaterThan(0);
});

it("skips deprecated names during synchronization and preserves current API cells", () => {
  const markdown = [
    "## API",
    "### Dropdown",
    "| 参数 | 说明 | 类型 | 默认值 | 版本 |",
    "| --- | --- | --- | --- | --- |",
    "| ~~destroyPopupOnHide~~ | 使用 destroyOnHidden | boolean | false | |",
    "| destroyOnHidden | 关闭后是否销毁 | boolean | false | 5.25.0 |",
    "| ~~dropdownRender~~ | 使用 popupRender | ReactNode | - | |",
    "| popupRender | 自定义弹出框 | (node: ReactNode) => ReactNode | - | |",
    "| open | ~~旧说明~~ 新说明 | boolean \\| undefined | - | |",
    "",
    "### Legacy",
    "| 属性 | 说明 | 类型 |",
    "| --- | --- | --- |",
    "| ~~oldProp~~ | 历史参数 | string |",
    "",
    "### Item",
    "| 属性 | 说明 | 类型 |",
    "| --- | --- | --- |",
    "| key | 唯一标识 | string |",
  ].join("\n");
  const result = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        [
          'import { readFileSync } from "node:fs";',
          'import { parseApi } from "./scripts/reference-utils.mjs";',
          'const markdown = JSON.parse(readFileSync(0, "utf8"));',
          'process.stdout.write(JSON.stringify(parseApi(markdown, "Dropdown")));',
        ].join("\n"),
      ],
      { cwd: root, input: JSON.stringify(markdown), encoding: "utf8" },
    ),
  );
  expect(result).toEqual([
    {
      title: "Dropdown",
      rows: [
        ["destroyOnHidden", "关闭后是否销毁", "boolean", "false"],
        [
          "popupRender",
          "自定义弹出框",
          "(node: OctaneNode) => OctaneNode",
          "-",
        ],
        ["open", "~~旧说明~~ 新说明", "boolean | undefined", "-"],
      ],
    },
    { title: "Item", rows: [["key", "唯一标识", "string", "-"]] },
  ]);
});
