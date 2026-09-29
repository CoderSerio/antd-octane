import { AutoComplete, Flex } from "antd-octane";

const cities = [
  { value: "Beijing", label: "北京" },
  { value: "Shanghai", label: "上海" },
  { value: "Shenzhen", label: "深圳" },
];
export function AutoCompleteFilterDemo() {
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <AutoComplete
        options={cities}
        filterOption
        aria-label="按城市英文名过滤"
        placeholder="输入 sh"
        style={{ width: "min(100%, 280px)" }}
      />
      <AutoComplete
        options={cities}
        filterOption={(text, option) =>
          `${option.value} ${option.label}`
            .toLowerCase()
            .includes(text.toLowerCase())
        }
        aria-label="按中英文城市名过滤"
        placeholder="输入 上海 或 sh"
        style={{ width: "min(100%, 280px)" }}
      />
      <p>
        默认不筛选。filterOption=true 按 value 筛选；自定义函数可加入文本标签。
      </p>
    </Flex>
  );
}
