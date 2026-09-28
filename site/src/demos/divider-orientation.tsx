import { Divider } from "antd-octane";

export function OrientationDemo() {
  return (
    <div style={{ width: "100%" }}>
      <Divider orientation="left">左侧标题</Divider>
      <p>从标题开始阅读这一组内容。</p>
      <Divider orientation="center">居中标题</Divider>
      <Divider orientation="right" orientationMargin={24}>
        右侧标题
      </Divider>
      <p>orientationMargin 可设置数字像素值或 CSS 长度。</p>
    </div>
  );
}
