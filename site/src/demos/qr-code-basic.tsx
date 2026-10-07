import { Button, Input, QRCode, Space } from "antd-octane";
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
      />
      <Button onClick={() => setExpired(true)}>设为过期</Button>
    </Space>
  );
}
