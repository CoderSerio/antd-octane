import { Select, Space } from "antd-octane";

const options = [
  { value: "beijing", label: "北京", title: "北京市" },
  { value: "shanghai", label: "上海", title: "上海市" },
  { value: "guangzhou", label: "广州", title: "广州市" },
];

export function SelectFilterEmptyDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        options={options}
        showSearch
        filterOption={(query, option) =>
          (option.title ?? "")
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase())
        }
        notFoundContent="没有匹配的城市"
        placeholder="输入城市全称，如北京市"
        aria-label="按全称搜索城市"
        style={{ width: "100%" }}
      />
      <Select
        options={options}
        showSearch
        filterOption={false}
        placeholder="输入任意内容，仍显示全部选项"
        aria-label="不自动过滤城市"
        style={{ width: "100%" }}
      />
    </Space>
  );
}
