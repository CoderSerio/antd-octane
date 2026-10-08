import "../../packages/antd-octane/src/style.css";
import dayjs from "dayjs";
import { createRoot, useState } from "octane";
import { DatePicker } from "../../packages/antd-octane/src/date-picker";
import { Form } from "../../packages/antd-octane/src/form";
import { Input } from "../../packages/antd-octane/src/input";
import { TreeSelect } from "../../packages/antd-octane/src/tree-select";
import { Upload } from "../../packages/antd-octane/src/upload";

function Fixture() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("Not submitted");
  return (
    <main
      style={{
        width: "min(500px, 100%)",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <Form
        form={form}
        initialValues={{
          user: {
            name: "Ada",
            confirmation: "Ada",
            date: dayjs("2026-10-08"),
            team: "a",
            files: [],
          },
        }}
        onFinish={(values) => setResult(JSON.stringify(values))}
      >
        <Form.Item name={["user", "name"]} label="Name" required>
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "confirmation"]}
          label="Confirmation"
          dependencies={[["user", "name"]]}
          rules={[
            {
              validator: (_rule, value) => {
                if (value !== form.getFieldValue(["user", "name"]))
                  throw new Error("Names differ");
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={["user", "date"]} label="Date">
          <DatePicker />
        </Form.Item>
        <Form.Item name={["user", "team"]} label="Team">
          <TreeSelect
            allowClear
            treeData={[
              { value: "a", title: "Team A" },
              { value: "b", title: "Team B" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name={["user", "files"]}
          valuePropName="fileList"
          getValueFromEvent={(info: { fileList: unknown[] }) => info.fileList}
        >
          <Upload beforeUpload={() => false}>
            <button type="button">Choose file</button>
          </Upload>
        </Form.Item>
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() =>
            form.resetFields([
              ["user", "name"],
              ["user", "confirmation"],
            ])
          }
        >
          Reset names
        </button>
      </Form>
      <output
        aria-label="Result"
        style={{ display: "block", overflowWrap: "anywhere" }}
      >
        {result}
      </output>
    </main>
  );
}
const host = document.getElementById("root");
if (host) createRoot(host).render(<Fixture />);
