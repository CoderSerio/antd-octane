import { Rate, Space } from "antd-octane";
import { useState } from "octane";

const descriptions = ["很差", "较差", "一般", "不错", "很好"];
export function RateHoverTextDemo() {
  const [value, setValue] = useState(3);
  const [hover, setHover] = useState<number | undefined>();
  const displayed = hover ?? value;
  return (
    <Space direction="vertical">
      <Rate
        aria-label="服务评价"
        value={value}
        onChange={setValue}
        onHoverChange={setHover}
        tooltips={descriptions}
      />
      <span role="status">
        {hover === undefined ? "已选" : "预览"}：
        {displayed ? descriptions[displayed - 1] : "未评分"}
      </span>
    </Space>
  );
}
