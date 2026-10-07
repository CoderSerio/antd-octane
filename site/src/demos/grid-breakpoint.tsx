import { Grid, Tag } from "antd-octane";

const { useBreakpoint } = Grid;

export function BreakpointDemo() {
  const screens = useBreakpoint();

  return (
    <>
      Current break point:{" "}
      {Object.entries(screens)
        .filter((screen) => !!screen[1])
        .map((screen) => (
          <Tag color="blue" key={screen[0]}>
            {screen[0]}
          </Tag>
        ))}
    </>
  );
}
