import {
  Button,
  type GetProp,
  type GetProps,
  type GetRef,
  Input,
} from "antd-octane";
import { useRef } from "octane";
export function BasicDemo() {
  const props: GetProps<typeof Button> = {
    type: "primary",
    children: "类型来自 Button",
  };
  const size: GetProp<typeof Button, "size"> = "small";
  return <Button {...props} size={size} />;
}
export function MoreDemo() {
  const input = useRef<GetRef<typeof Input> | null>(null);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Input ref={input} aria-label="类型安全的输入框" />
      <Button onClick={() => input.current?.focus()}>聚焦输入框</Button>
    </div>
  );
}
