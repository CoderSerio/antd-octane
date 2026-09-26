import { createIcon, Icon, type IconDefinition, Space } from "antd-octane";

const check: IconDefinition = {
  name: "demo-check",
  theme: "outlined",
  icon: {
    tag: "svg",
    attrs: { viewBox: "0 0 24 24" },
    children: [
      {
        tag: "path",
        attrs: {
          d: "m5 12 4 4L19 6",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        },
      },
    ],
  },
};
const Check = createIcon(check);
export function BasicDemo() {
  return (
    <Space size="large">
      <Check aria-label="完成" style={{ fontSize: 24, color: "#52c41a" }} />
      <Check rotate={45} style={{ fontSize: 24 }} />
      <Icon
        spin
        viewBox="0 0 24 24"
        aria-label="加载中"
        style={{ fontSize: 24 }}
      >
        <path
          d="M12 3a9 9 0 1 1-9 9"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </Icon>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Icon
      viewBox="0 0 24 24"
      aria-label="自定义图形"
      style={{ fontSize: 32, color: "#1677ff" }}
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
    </Icon>
  );
}
