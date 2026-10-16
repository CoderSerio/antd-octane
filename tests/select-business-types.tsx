import { Select, type SelectOptionItem } from "../packages/antd-octane/src";

const options: SelectOptionItem[] = [
  {
    label: "People",
    options: [
      { value: 0, label: "Unassigned" },
      { value: "alice", label: "Alice" },
    ],
  },
];
export const single = (
  <Select
    options={options}
    loading
    optionFilterProp="title"
    onChange={(value, option) => {
      value?.toString();
      option?.value.toString();
    }}
  />
);
export const multiple = (
  <Select
    mode="multiple"
    options={options}
    value={[0, "alice"]}
    filterOption={(query, option) => String(option.value).includes(query)}
  />
);
export const labeled = (
  <Select labelInValue value={{ value: "alice", label: "Alice" }} />
);
export const tags = <Select mode="tags" />;
// @ts-expect-error Only the supported option fields can be searched.
export const field = <Select optionFilterProp="children" />;
export const nested = (
  // @ts-expect-error Nested groups are not implemented.
  <Select
    options={[{ label: "Outer", options: [{ label: "Inner", options: [] }] }]}
  />
);

export const mapped = (
  <Select
    fieldNames={{
      value: "id",
      label: "name",
      options: "members",
      groupLabel: "heading",
    }}
    options={[
      { heading: "Team", members: [{ id: 0, name: "Ada", department: "dev" }] },
    ]}
    onChange={(_value, option) => {
      const department: string | undefined = option?.department;
      return department;
    }}
  />
);
export const mappedMultiple = (
  <Select
    mode="multiple"
    fieldNames={{ value: "id", label: "name" }}
    options={[{ id: 0, name: "Ada" }]}
    onChange={(_values, options) => {
      const id: number = options[0].id;
      return id;
    }}
  />
);

export const labeledTags = (
  <Select
    mode="tags"
    labelInValue
    value={[{ value: "alice", label: "Alice" }]}
    onChange={(values, options) => {
      values[0].value.toString();
      options[0].value.toString();
    }}
  />
);
export const mappedLabeled = (
  <Select
    labelInValue
    fieldNames={{ value: "id", label: "name" }}
    options={[{ id: 0, name: "Ada", team: "web" }]}
    onChange={(value, option) => {
      value?.label;
      option?.team.toUpperCase();
    }}
  />
);
// @ts-expect-error labelInValue requires value objects.
export const invalidLabeled = <Select labelInValue value="alice" />;
// @ts-expect-error tags requires an array.
export const invalidTags = <Select mode="tags" value="alice" />;
// @ts-expect-error objects require labelInValue.
export const invalidRaw = <Select value={{ value: "alice", label: "Alice" }} />;
