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
  // @ts-expect-error Labeled value objects are not implemented.
  <Select labelInValue value={{ value: "alice", label: "Alice" }} />
);
// @ts-expect-error Tags creation is not implemented.
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
