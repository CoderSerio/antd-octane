import {
  Cascader,
  type CascaderProps,
  TreeSelect,
  type TreeSelectProps,
} from "../packages/antd-octane/src/index";

const single: TreeSelectProps = {
  value: 1,
  onChange: (value) => {
    const selected: string | number | undefined = value;
    void selected;
  },
};
const multiple: TreeSelectProps = {
  multiple: true,
  value: [1],
  onChange: (values) => values.map(String),
};
const path: CascaderProps = {
  value: ["p", 1],
  onChange: (values, options) => void [values, options],
};
// @ts-expect-error Multiple selection requires an array.
const wrong: TreeSelectProps = { multiple: true, value: "one" };
// @ts-expect-error Async loading has no supported race/cancellation contract yet.
const asyncTree: TreeSelectProps = { loadData: async () => {} };
// @ts-expect-error Cascader uses a complete path, not a scalar value.
const scalar: CascaderProps = { value: 1 };
// @ts-expect-error Cascader multiple selection is not implemented.
const multiPath: CascaderProps = { multiple: true };
void [
  <TreeSelect key="single" {...single} />,
  <TreeSelect key="multiple" {...multiple} />,
  <Cascader key="path" {...path} />,
  wrong,
  asyncTree,
  scalar,
  multiPath,
];
