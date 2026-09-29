import { Rate, Space } from "antd-octane";

export function RateClearDemo() {
  return (
    <Space direction="vertical">
      <Space wrap>
        <Rate aria-label="可点击清零的评分" defaultValue={3} />
        <span>再次点击当前分值清零</span>
      </Space>
      <Space wrap>
        <Rate
          aria-label="不可点击清零的评分"
          defaultValue={3}
          allowClear={false}
        />
        <span>禁用点击清零</span>
      </Space>
    </Space>
  );
}
