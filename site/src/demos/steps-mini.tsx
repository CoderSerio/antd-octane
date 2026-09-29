import { Steps } from "antd-octane";

export function MiniDemo() {
  return (
    <Steps
      size="small"
      current={1}
      items={[
        { title: "Finished" },
        { title: "In Progress" },
        { title: "Waiting" },
      ]}
    />
  );
}
