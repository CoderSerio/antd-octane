import { Splitter } from "antd-octane";

export function MultipleDemo() {
  return (
    <Splitter
      style={{ height: 200, width: "100%", boxShadow: "0 0 0 1px var(--line)" }}
    >
      <Splitter.Panel defaultSize="25%" min="15%" style={{ padding: 16 }}>
        First
      </Splitter.Panel>
      <Splitter.Panel min="15%" style={{ padding: 16 }}>
        Second
      </Splitter.Panel>
      <Splitter.Panel defaultSize="25%" min="15%" style={{ padding: 16 }}>
        Third
      </Splitter.Panel>
    </Splitter>
  );
}
