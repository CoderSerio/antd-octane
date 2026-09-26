import { Checkbox } from "antd-octane";
export function CheckboxStatesDemo() {
  return (
    <div className="demo-row">
      <Checkbox disabled>不可用</Checkbox>
      <Checkbox disabled defaultChecked>
        选中且禁用
      </Checkbox>
      <Checkbox indeterminate disabled>
        部分选中且禁用
      </Checkbox>
    </div>
  );
}
