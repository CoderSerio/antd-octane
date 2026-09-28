import { Steps } from "antd-octane";

export function ItemStatusDemo() {
  return (
    <Steps
      current={1}
      status="error"
      items={[
        { title: "Finished", description: "已完成" },
        { title: "In Progress", description: "运行失败", subTitle: "重试中" },
        { title: "Waiting", status: "wait", description: "等待恢复" },
      ]}
    />
  );
}
