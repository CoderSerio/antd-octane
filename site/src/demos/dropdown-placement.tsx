import { Button, Dropdown, Space } from "antd-octane";

export function PlacementDemo() {
  return (
    <Space wrap>
      {(
        [
          "topLeft",
          "top",
          "topRight",
          "bottomLeft",
          "bottom",
          "bottomRight",
        ] as const
      ).map((placement) => (
        <Dropdown
          key={placement}
          placement={placement}
          trigger={["click"]}
          menu={{
            items: [
              { key: "one", label: "1st menu item" },
              { key: "two", label: "2nd menu item" },
            ],
          }}
        >
          <Button>{placement}</Button>
        </Dropdown>
      ))}
    </Space>
  );
}
