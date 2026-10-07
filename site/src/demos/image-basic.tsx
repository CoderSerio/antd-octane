import { Image, Space } from "antd-octane";

const picture = (color: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="${color}"/><circle cx="370" cy="80" r="34" fill="#ffffff" opacity=".7"/><path d="M0 300 170 105 300 300M170 300 340 150 480 300" fill="#ffffff" opacity=".25"/><text x="24" y="270" font-family="sans-serif" font-size="28" fill="white">${label}</text></svg>`)}`;
export function BasicDemo() {
  return (
    <Image
      width={240}
      src={picture("#1677ff", "Blue mountains")}
      alt="蓝色山景"
      loading="lazy"
    />
  );
}
export function MoreDemo() {
  return (
    <Image.PreviewGroup>
      <Space wrap>
        <Image width={140} src={picture("#13a8a8", "Lake")} alt="绿色湖景" />
        <Image width={140} src={picture("#722ed1", "Sunset")} alt="紫色夕景" />
        <Image width={140} src={picture("#d46b08", "Desert")} alt="橙色沙丘" />
      </Space>
    </Image.PreviewGroup>
  );
}
