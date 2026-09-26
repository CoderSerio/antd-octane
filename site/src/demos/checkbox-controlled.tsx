import { Button, Checkbox } from "antd-octane";
import { useState } from "octane";
export function CheckboxControlledDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="input-examples">
      <Checkbox
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      >
        受控选择
      </Checkbox>
      <div className="demo-row">
        <Button onClick={() => setChecked(!checked)}>切换选中</Button>
        <span aria-live="polite">{checked ? "已选中" : "未选中"}</span>
      </div>
    </div>
  );
}
