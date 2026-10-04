import { Button, Input, Popover, QRCode, Segmented, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState("https://ant.design");
  return (
    <Space direction="vertical">
      <Input
        aria-label="二维码内容"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Space wrap>
        <QRCode value={value} />
        <QRCode value={value} type="svg" />
      </Space>
    </Space>
  );
}
export function MoreDemo() {
  const [expired, setExpired] = useState(true);
  return (
    <Space wrap>
      <QRCode
        value="Ant Design for Octane"
        status={expired ? "expired" : "active"}
        onRefresh={() => setExpired(false)}
      />
      <QRCode
        value="Ant Design for Octane"
        color="#1677ff"
        errorLevel="H"
        type="svg"
        icon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231677ff'/%3E%3C/svg%3E"
        iconSize={28}
      />
      <Button onClick={() => setExpired(true)}>设为过期</Button>
    </Space>
  );
}

export function IconDemo() {
  return (
    <QRCode
      value="https://ant.design/"
      errorLevel="H"
      icon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231677ff'/%3E%3C/svg%3E"
      iconSize={40}
    />
  );
}

export function StatusDemo() {
  return (
    <Space wrap>
      <QRCode value="https://ant.design" status="loading" />
      <QRCode value="https://ant.design" status="expired" />
      <QRCode value="https://ant.design" status="scanned" />
    </Space>
  );
}

export function CustomStatusDemo() {
  const [expired, setExpired] = useState(true);
  return (
    <QRCode
      value="https://ant.design"
      status={expired ? "expired" : "scanned"}
      onRefresh={() => setExpired(false)}
      statusRender={(info) => (
        <div style={{ textAlign: "center" }}>
          <div>{info.status === "expired" ? "二维码已过期" : "已扫描"}</div>
          {info.status === "expired" && (
            <Button type="link" onClick={info.onRefresh}>
              刷新
            </Button>
          )}
        </div>
      )}
    />
  );
}

export function TypeDemo() {
  return (
    <Space>
      <QRCode type="canvas" value="https://ant.design/" />
      <QRCode type="svg" value="https://ant.design/" />
    </Space>
  );
}

export function SizeDemo() {
  const [size, setSize] = useState(160);
  return (
    <Space direction="vertical">
      <Space>
        <Button
          onClick={() => setSize(Math.max(48, size - 10))}
          disabled={size <= 48}
        >
          缩小
        </Button>
        <Button
          onClick={() => setSize(Math.min(300, size + 10))}
          disabled={size >= 300}
        >
          放大
        </Button>
      </Space>
      <QRCode value="https://ant.design/" size={size} />
    </Space>
  );
}

export function ColorDemo() {
  return (
    <Space>
      <QRCode value="https://ant.design/" color="#1677ff" />
      <QRCode value="https://ant.design/" color="#52c41a" bgColor="#f6ffed" />
    </Space>
  );
}

export function DownloadDemo() {
  const download = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      "[data-demo-qrcode] canvas",
    );
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  return (
    <Space direction="vertical">
      <div data-demo-qrcode>
        <QRCode value="https://ant.design/" />
      </div>
      <Button type="primary" onClick={download}>
        下载二维码
      </Button>
    </Space>
  );
}

export function LevelDemo() {
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  return (
    <Space direction="vertical">
      <QRCode value="https://ant.design/" errorLevel={level} />
      <Segmented
        options={["L", "M", "Q", "H"]}
        value={level}
        onChange={setLevel}
      />
    </Space>
  );
}

export function AdvancedDemo() {
  return (
    <Popover content={<QRCode value="https://ant.design" bordered={false} />}>
      <Button type="primary">Hover me</Button>
    </Popover>
  );
}
