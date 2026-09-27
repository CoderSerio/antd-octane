import { Flex } from "antd-octane";

export function WrappingDemo() {
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <span>容器宽度为 240px，项目会自动换行：</span>
      <Flex
        wrap
        gap="small"
        style={{
          width: 240,
          maxWidth: "100%",
          padding: 8,
          border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
        }}
      >
        {["首页", "团队管理", "账单设置", "访问日志", "帮助中心"].map(
          (label) => (
            <span
              key={label}
              style={{
                padding: "4px 8px",
                border:
                  "1px solid color-mix(in srgb, currentColor 25%, transparent)",
                borderRadius: 4,
              }}
            >
              {label}
            </span>
          ),
        )}
      </Flex>
      <Flex gap="small" align="center" style={{ width: "100%" }}>
        <span style={{ flex: "0 0 auto" }}>固定</span>
        <span
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          这一段较长的内容占据剩余空间，容器变窄时显示省略号
        </span>
      </Flex>
    </Flex>
  );
}
