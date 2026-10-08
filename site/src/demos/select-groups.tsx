import { Select, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function GroupedDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Switch
          checked={loading}
          onChange={setLoading}
          aria-label="展示选项加载标记"
        />
        加载标记
      </Space>
      <Select
        aria-label="项目负责人"
        style={{ width: "100%", minWidth: 180 }}
        placeholder="按姓名或团队搜索"
        showSearch
        allowClear
        loading={loading}
        optionFilterProp="label"
        options={[
          {
            label: "研发团队",
            options: [
              { value: "ada", label: "Ada" },
              { value: "lin", label: "Lin", disabled: true },
            ],
          },
          { label: "设计团队", options: [{ value: "sam", label: "Sam" }] },
          { value: "unassigned", label: "暂未分配" },
        ]}
      />
      <span>加载标记不禁止已有选项；本例不请求远程服务。</span>
    </Space>
  );
}
