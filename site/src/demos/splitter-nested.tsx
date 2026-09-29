import { Splitter } from "antd-octane";

export function NestedDemo() {
  return (
    <Splitter
      style={{ height: 240, width: "100%", boxShadow: "0 0 0 1px var(--line)" }}
    >
      <Splitter.Panel defaultSize="35%" min="20%" style={{ padding: 16 }}>
        左侧区域
      </Splitter.Panel>
      <Splitter.Panel min="30%">
        <Splitter layout="vertical" style={{ height: "100%" }}>
          <Splitter.Panel defaultSize="50%" min="20%" style={{ padding: 16 }}>
            右上区域
          </Splitter.Panel>
          <Splitter.Panel min="20%" style={{ padding: 16 }}>
            右下区域
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
}
