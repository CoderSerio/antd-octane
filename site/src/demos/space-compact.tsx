import {
  AutoComplete,
  Button,
  Input,
  InputNumber,
  Select,
  Space,
  Tooltip,
} from "antd-octane";
import { CopyOutlined } from "./layout-navigation-icons";
export function CompactDemo() {
  return (
    <Space direction="vertical">
      <Space.Compact block>
        <Input style={{ width: "20%" }} defaultValue="0571" />
        <Input style={{ width: "30%" }} defaultValue="26888888" />
      </Space.Compact>
      <Space.Compact block size="small">
        <Input
          style={{ width: "calc(100% - 200px)" }}
          defaultValue="https://ant.design"
        />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact block>
        <Input
          style={{ width: "calc(100% - 200px)" }}
          defaultValue="https://ant.design"
        />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact block>
        <Input
          style={{ width: "calc(100% - 200px)" }}
          defaultValue="git@github.com:ant-design/ant-design.git"
        />
        <Tooltip title="copy git url">
          <Button icon={<CopyOutlined />} />
        </Tooltip>
      </Space.Compact>
      <Space.Compact block>
        <Select
          allowClear
          defaultValue="Zhejiang"
          options={[
            { label: "Zhejiang", value: "Zhejiang" },
            { label: "Jiangsu", value: "Jiangsu" },
          ]}
        />
        <Input
          style={{ width: "50%" }}
          defaultValue="Xihu District, Hangzhou"
        />
      </Space.Compact>
      <Space.Compact block>
        <Select
          allowClear
          mode="multiple"
          defaultValue={["Zhejiang"]}
          style={{ width: "50%" }}
          options={[
            { label: "Zhejiang", value: "Zhejiang" },
            { label: "Jiangsu", value: "Jiangsu" },
          ]}
        />
        <Input
          style={{ width: "50%" }}
          defaultValue="Xihu District, Hangzhou"
        />
      </Space.Compact>
      <Space.Compact block>
        <Input.Search style={{ width: "30%" }} defaultValue="0571" />
        <Input.Search
          allowClear
          style={{ width: "50%" }}
          defaultValue="26888888"
        />
        <Input.Search style={{ width: "20%" }} defaultValue="+1" />
      </Space.Compact>
      <Space.Compact block>
        <Select
          defaultValue="Option1"
          options={[
            { label: "Option1", value: "Option1" },
            { label: "Option2", value: "Option2" },
          ]}
        />
        <Input style={{ width: "50%" }} defaultValue="input content" />
        <InputNumber defaultValue={12} />
      </Space.Compact>
      <Space.Compact block>
        <Select
          defaultValue="Option1-1"
          options={[
            { label: "Option1-1", value: "Option1-1" },
            { label: "Option1-2", value: "Option1-2" },
          ]}
        />
        <Select
          defaultValue="Option2-2"
          options={[
            { label: "Option2-1", value: "Option2-1" },
            { label: "Option2-2", value: "Option2-2" },
          ]}
        />
      </Space.Compact>
      <Space.Compact block>
        <Select
          defaultValue="1"
          options={[
            { label: "Between", value: "1" },
            { label: "Except", value: "2" },
          ]}
        />
        <Input
          style={{ width: 100, textAlign: "center" }}
          placeholder="Minimum"
        />
        <Input
          style={{
            width: 30,
            borderInlineStart: 0,
            borderInlineEnd: 0,
            pointerEvents: "none",
          }}
          placeholder="~"
          disabled
        />
        <Input
          style={{ width: 100, textAlign: "center" }}
          placeholder="Maximum"
        />
      </Space.Compact>
      <Space.Compact block>
        <Select
          defaultValue="Sign Up"
          style={{ width: "30%" }}
          options={[
            { label: "Sign Up", value: "Sign Up" },
            { label: "Sign In", value: "Sign In" },
          ]}
        />
        <AutoComplete
          style={{ width: "70%" }}
          placeholder="Email"
          options={[{ value: "text 1" }, { value: "text 2" }]}
        />
      </Space.Compact>
      <Space.Compact>
        <Input placeholder="input here" />
        <Space.Addon>$</Space.Addon>
        <InputNumber placeholder="another input" style={{ width: "100%" }} />
        <InputNumber placeholder="another input" style={{ width: "100%" }} />
        <Space.Addon>$</Space.Addon>
      </Space.Compact>
      <Space.Compact>
        <Button type="primary">Button</Button>
        <Input placeholder="input here" />
        <Space.Addon>$</Space.Addon>
      </Space.Compact>
    </Space>
  );
}
