import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import { Button } from "../../packages/antd-octane/src/button";
import { ConfigProvider } from "../../packages/antd-octane/src/config-provider";
import { Form } from "../../packages/antd-octane/src/form";
import { Input } from "../../packages/antd-octane/src/input";
import { Select } from "../../packages/antd-octane/src/select";
import {
  compactAlgorithm,
  darkAlgorithm,
  defaultAlgorithm,
} from "../../packages/antd-octane/src/theme/resolve";

const ada = { id: 0, name: "Ada", team: "Engineering" };
const options = [
  {
    heading: "Engineering",
    members: [
      { id: 1, name: "Disabled", team: "Engineering", disabled: true },
      ada,
    ],
  },
];
const fields = {
  value: "id",
  label: "name",
  options: "members",
  groupLabel: "heading",
} as const;
function Fixture() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState("default");
  const [hidden, setHidden] = useState(true);
  const [result, setResult] = useState("Ready");
  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? darkAlgorithm
            : mode === "compact"
              ? compactAlgorithm
              : defaultAlgorithm,
      }}
    >
      <main
        style={{
          padding: 24,
          maxWidth: 500,
          background: mode === "dark" ? "#141414" : "#fff",
        }}
      >
        <h1>Consumer form and select</h1>
        <Button
          onClick={() =>
            setMode(
              mode === "default"
                ? "dark"
                : mode === "dark"
                  ? "compact"
                  : "default",
            )
          }
        >
          Theme: {mode}
        </Button>
        <Form
          form={form}
          initialValues={{ user: { name: "Form wins" } }}
          layout="vertical"
          onFinish={(values) => setResult(JSON.stringify(values))}
          onFinishFailed={(error) =>
            setResult(JSON.stringify(error.errorFields))
          }
        >
          <Form.Item
            name="secret"
            label="Hidden metadata"
            hidden={hidden}
            initialValue=""
            required
          >
            <Input id="secret" />
          </Form.Item>
          <Form.Item
            name={["user", "name"]}
            label="Name"
            initialValue="Item loses"
            required
          >
            <Input id="name" />
          </Form.Item>
          <Form.Item name={["user", "role"]} label="Role" initialValue="Reader">
            <Input id="role" />
          </Form.Item>
          <Form.Item name="owner" label="Owner" required>
            <Select
              fieldNames={fields}
              options={options}
              showSearch
              onChange={(_value, option) =>
                setResult(`Original owner: ${option === ada}; ${option?.team}`)
              }
            />
          </Form.Item>
          <Form.Item name="reviewers" label="Reviewers" initialValue={[]}>
            <Select mode="multiple" fieldNames={fields} options={options} />
          </Form.Item>
          <Button htmlType="submit">Submit</Button>
          <Button onClick={() => form.resetFields(["user"])}>Reset user</Button>
          <Button onClick={() => form.resetFields()}>Reset all</Button>
          <Button onClick={() => form.setFieldValue("secret", "token")}>
            Set metadata
          </Button>
          <Button onClick={() => setHidden(!hidden)}>
            Toggle metadata visibility
          </Button>
        </Form>
        <output>{result}</output>
      </main>
    </ConfigProvider>
  );
}
const host = document.getElementById("root");
if (host) createRoot(host).render(<Fixture />);
