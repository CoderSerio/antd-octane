import { Divider } from "antd-octane";

export function DashedDemo() {
  return (
    <div style={{ width: "100%" }}>
      <p>实线分隔</p>
      <Divider />
      <p>虚线分隔</p>
      <Divider dashed />
      <Divider dashed orientation="left">
        带文字的虚线
      </Divider>
    </div>
  );
}
