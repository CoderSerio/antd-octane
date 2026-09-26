import { Flex, Segmented } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Flex vertical gap={16}>
      <Segmented options={["每日", "每周", "每月", "每季", "每年"]} />
      <Segmented
        size="small"
        options={["列表", "看板", { value: "日历", disabled: true }]}
      />
      <Segmented size="large" options={["开发", "设计", "产品"]} />
    </Flex>
  );
}
export function MoreDemo() {
  const [value, setValue] = useState<string | number>("项目");
  return (
    <Flex vertical gap={16} style={{ width: "100%" }}>
      <Segmented
        block
        options={["项目", "成员", "设置"]}
        value={value}
        onChange={setValue}
        aria-label="工作区视图"
      />
      <p>当前视图：{value}</p>
      <Segmented
        vertical
        shape="round"
        options={["总览", "活动", "收藏"]}
        aria-label="导航方向"
      />
    </Flex>
  );
}
