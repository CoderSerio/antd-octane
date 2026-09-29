import { Typography } from "antd-octane";
export function HeadingsDemo() {
  return (
    <div>
      {([1, 2, 3, 4, 5] as const).map((level) => (
        <Typography.Title key={level} level={level}>
          h{level}. Ant Design for Octane
        </Typography.Title>
      ))}
    </div>
  );
}
