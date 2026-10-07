import { Button, Empty } from "antd-octane";
export function BasicDemo() {
  return <Empty style={{ width: "100%" }} />;
}
export function MoreDemo() {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="还没有项目"
      style={{ width: "100%" }}
    >
      <Button
        type="primary"
        onClick={() => {
          window.location.hash = "start";
        }}
      >
        创建项目
      </Button>
    </Empty>
  );
}
