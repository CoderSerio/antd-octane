import { Checkbox } from "antd-octane";
import { useState } from "octane";

const options = ["文档", "组件", "测试"];
export function CheckboxAllDemo() {
  const [selected, setSelected] = useState<string[]>(["文档"]);
  return (
    <div className="input-examples">
      <Checkbox
        checked={selected.length === options.length}
        indeterminate={selected.length > 0 && selected.length < options.length}
        onChange={(event) => setSelected(event.target.checked ? options : [])}
      >
        全选
      </Checkbox>
      <div className="demo-row">
        {options.map((option) => (
          <Checkbox
            key={option}
            checked={selected.includes(option)}
            onChange={(event) =>
              setSelected(
                event.target.checked
                  ? [...selected, option]
                  : selected.filter((item) => item !== option),
              )
            }
          >
            {option}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}
