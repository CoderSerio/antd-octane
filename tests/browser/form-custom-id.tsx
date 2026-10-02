import { createRoot, useState } from "octane";
import { Button, Form, Input } from "../../packages/antd-octane/src";
import "../../packages/antd-octane/src/style.css";

function Fixture() {
  const [result, setResult] = useState("");
  return (
    <Form onFinish={(values) => setResult(`Saved ${values.email}`)}>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Enter your email" }]}
      >
        <Input id="contact-email" />
      </Form.Item>
      <Button htmlType="submit">Save</Button>
      <p role="status">{result}</p>
    </Form>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing root");
createRoot(root).render(<Fixture />);
