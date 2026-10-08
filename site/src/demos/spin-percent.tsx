import { Alert, Slider, Space, Spin, Switch } from "antd-octane";
import { useState } from "octane";

export function PercentDemo() {
  const [percent, setPercent] = useState(40);
  const [auto, setAuto] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Space wrap>
        <Switch
          checked={loading}
          onChange={setLoading}
          aria-label="进度示例加载状态"
        />
        加载中
        <Switch checked={auto} onChange={setAuto} aria-label="自动模拟进度" />
        自动模拟
      </Space>
      <Slider
        min={0}
        max={100}
        value={percent}
        onChange={(value) => {
          if (typeof value === "number") setPercent(value);
        }}
        disabled={auto}
        aria-label="加载进度百分比"
      />
      <Spin
        spinning={loading}
        percent={auto ? "auto" : percent}
        tip={auto ? "正在模拟进度…" : `进度 ${percent}%`}
      >
        <Alert
          type="info"
          message="数据汇总"
          description="自动进度是等待反馈，不代表实际下载或计算进度。请关闭加载开关模拟任务结束。"
        />
      </Spin>
    </Space>
  );
}
