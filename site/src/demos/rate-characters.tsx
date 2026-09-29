import { Rate, Space } from "antd-octane";

export function RateCharactersDemo() {
  return (
    <Space direction="vertical">
      <Rate
        aria-label="十分评分"
        count={10}
        defaultValue={6}
        character={({ index }: { index: number }) => index + 1}
        style={{ fontSize: 18 }}
      />
      <Rate
        aria-label="三档满意度"
        count={3}
        defaultValue={2}
        character={({ index }: { index: number }) => ["☹", "◉", "☺"][index]}
        tooltips={["不满意", "一般", "满意"]}
      />
    </Space>
  );
}
