import { Button, Space } from "antd-octane";
import { useState } from "octane";

export function NativeFormLinkDemo() {
  const [result, setResult] = useState("尚未提交");
  return (
    <Space direction="vertical">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setResult("原生表单已提交");
        }}
        onReset={() => setResult("表单已重置")}
      >
        <Space wrap>
          <input
            name="name"
            aria-label="姓名"
            placeholder="输入姓名"
            required
          />
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="reset">重置</Button>
        </Space>
      </form>
      <Button href="https://ant.design/components/button/" target="_blank">
        查看 Ant Design Button ↗
      </Button>
      <p aria-live="polite">{result}</p>
    </Space>
  );
}
