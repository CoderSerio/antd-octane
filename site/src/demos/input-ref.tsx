import { Button, Input, type InputRef } from "antd-octane";
import { useRef } from "octane";
export function InputRefDemo() {
  const inputRef = useRef<InputRef | null>(null);
  return (
    <div className="input-examples">
      <Input
        ref={inputRef}
        defaultValue="可以通过 ref 聚焦或全选"
        aria-label="ref 输入"
      />
      <div className="demo-row">
        <Button onClick={() => inputRef.current?.focus()}>聚焦</Button>
        <Button
          onClick={() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          }}
        >
          全选
        </Button>
      </div>
    </div>
  );
}
