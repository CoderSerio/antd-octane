import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import { Button } from "../../packages/antd-octane/src/button";
import { Form } from "../../packages/antd-octane/src/form";
import { Input } from "../../packages/antd-octane/src/input";

const checks: (() => void)[] = [];
function Members(props: {
  targetKeys?: string[];
  onMove?: (keys: string[], direction: string) => void;
}) {
  return (
    <Button onClick={() => props.onMove?.(["alice", "bob"], "right")}>
      成员：{props.targetKeys?.join(",") ?? "无"}
    </Button>
  );
}
function Fixture() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("尚未提交");
  return (
    <main style={{ maxWidth: 500, padding: 24 }}>
      <Form
        form={form}
        initialValues={{ username: "taken", members: [] }}
        onFinish={(values) => setResult(JSON.stringify(values))}
        onFinishFailed={(error) =>
          setResult(error.outOfDate ? "旧校验已失效" : "校验失败")
        }
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              validator: (_rule, value) =>
                new Promise<void>((resolve, reject) => {
                  checks.push(() => {
                    if (value === "taken") reject(new Error("用户名已占用"));
                    else resolve();
                  });
                }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="members" valuePropName="targetKeys" trigger="onMove">
          <Members />
        </Form.Item>
        <Button htmlType="submit">提交</Button>
        <Button
          onClick={() => {
            for (const finish of checks.splice(0)) finish();
          }}
        >
          完成校验
        </Button>
        <Button htmlType="reset" onClick={() => setResult("尚未提交")}>
          重置
        </Button>
      </Form>
      <output aria-live="polite">{result}</output>
    </main>
  );
}
const container = document.getElementById("root");
if (container) createRoot(container).render(<Fixture />);
