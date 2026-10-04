import { Button, ConfigProvider, Empty, Switch, Table } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return <Empty style={{ width: "100%" }} />;
}
export function SimpleDemo() {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: "100%" }} />
  );
}

export function CustomizeDemo() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      styles={{ image: { height: 60 } }}
      description={
        <span>
          Customize <a href="#empty">Description</a>
        </span>
      }
      style={{ width: "100%" }}
    >
      <Button type="primary" onClick={() => (window.location.hash = "start")}>
        Create Now
      </Button>
    </Empty>
  );
}

export function ConfigProviderDemo() {
  const [customize, setCustomize] = useState(true);
  return (
    <>
      <Switch
        checked={customize}
        checkedChildren="customize"
        unCheckedChildren="default"
        onChange={setCustomize}
      />
      <ConfigProvider
        renderEmpty={
          customize
            ? () => (
                <div style={{ textAlign: "center" }}>
                  <p>Data Not Found</p>
                </div>
              )
            : undefined
        }
      >
        <Table
          style={{ marginTop: 8 }}
          columns={[{ title: "Name", dataIndex: "name" }]}
        />
      </ConfigProvider>
    </>
  );
}

export function DescriptionDemo() {
  return <Empty description={false} style={{ width: "100%" }} />;
}
