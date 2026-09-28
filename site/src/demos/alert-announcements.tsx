import { Alert, Button, Space } from "antd-octane";
import { useState } from "octane";

const notices = [
  "今晚 22:00–22:30 维护，期间暂停导出。",
  "维护完成后，已有项目与草稿会继续保留。",
  "如有长时间任务，请提前保存当前配置。",
];

export function AnnouncementsDemo() {
  const [index, setIndex] = useState(0);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert banner showIcon={false} message={notices[index]} role="status" />
      <Button onClick={() => setIndex((index + 1) % notices.length)}>
        查看下一条公告
      </Button>
    </Space>
  );
}
