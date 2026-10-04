import { Badge, Descriptions, Divider, Radio, Switch } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Descriptions
      title="User Info"
      items={[
        { key: "1", label: "UserName", children: "Zhou Maomao" },
        { key: "2", label: "Telephone", children: "1810000000" },
        { key: "3", label: "Live", children: "Hangzhou, Zhejiang" },
        { key: "4", label: "Remark", children: "empty" },
        {
          key: "5",
          label: "Address",
          children:
            "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
        },
      ]}
    />
  );
}
export function BorderedDemo() {
  return (
    <Descriptions bordered style={{ width: "100%" }} title="用户信息">
      <Descriptions.Item label="用户名">张三</Descriptions.Item>
      <Descriptions.Item label="电话">1810000000</Descriptions.Item>
      <Descriptions.Item label="居住地">杭州</Descriptions.Item>
      <Descriptions.Item label="备注" span={2}>
        暂无
      </Descriptions.Item>
    </Descriptions>
  );
}

export function TextDemo() {
  return (
    <Descriptions
      style={{ width: "100%" }}
      title="User Info"
      column={2}
      items={[
        { key: "1", label: "Product", children: "Cloud Database" },
        { key: "2", label: "Billing Mode", children: "Prepaid" },
        { key: "3", label: "Automatic Renewal", children: "YES" },
        { key: "4", label: "Order time", children: "2018-04-24 18:00:00" },
        {
          key: "5",
          label: "Usage Time",
          span: 2,
          children: "2019-04-24 18:00:00",
        },
        {
          key: "6",
          label: "Status",
          span: 2,
          children: <Badge status="processing" text="Running" />,
        },
        { key: "7", label: "Negotiated Amount", children: "$80.00" },
        { key: "8", label: "Discount", children: "$20.00" },
        { key: "9", label: "Official Receipts", children: "$60.00" },
        {
          key: "10",
          label: "Config Info",
          children: (
            <>
              Data disk type: Octane
              <br />
              Theme: Default
              <br />
              Region: East China 1
            </>
          ),
        },
      ]}
    />
  );
}

export function PaddingDemo() {
  const items = Array.from({ length: 5 }, (_, index) => ({
    key: String(index),
    label: "long",
    children: "loooooooooooooooooooooooooooooooooooooooooooooooong",
  }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ width: "100%", border: "1px solid", padding: 20 }}>
        <Descriptions title="User Info" column={2} items={items} />
      </div>
      <div style={{ width: "100%", border: "1px solid", padding: 20 }}>
        <Descriptions
          layout="vertical"
          title="User Info"
          column={2}
          items={items}
        />
      </div>
    </div>
  );
}

export function SizeDemo() {
  return (
    <Descriptions
      bordered
      size="small"
      style={{ width: "100%" }}
      title="小尺寸"
    >
      <Descriptions.Item label="产品">Ant Design</Descriptions.Item>
      <Descriptions.Item label="版本">5.0.0</Descriptions.Item>
      <Descriptions.Item label="状态">稳定</Descriptions.Item>
    </Descriptions>
  );
}

export function ResponsiveDemo() {
  return (
    <Descriptions
      bordered
      style={{ width: "100%" }}
      column={{ xs: 1, sm: 2, md: 3 }}
      title="响应式描述列表"
    >
      <Descriptions.Item label="项目">Octane</Descriptions.Item>
      <Descriptions.Item label="框架">Octane</Descriptions.Item>
      <Descriptions.Item label="主题">默认</Descriptions.Item>
    </Descriptions>
  );
}

export function VerticalDemo() {
  return (
    <Descriptions
      layout="vertical"
      column={3}
      style={{ width: "100%" }}
      title="垂直布局"
    >
      <Descriptions.Item label="姓名">张三</Descriptions.Item>
      <Descriptions.Item label="电话">1810000000</Descriptions.Item>
      <Descriptions.Item label="地址">杭州</Descriptions.Item>
    </Descriptions>
  );
}

export function VerticalBorderedDemo() {
  return (
    <Descriptions
      bordered
      layout="vertical"
      column={2}
      style={{ width: "100%" }}
      title="垂直带边框"
    >
      <Descriptions.Item label="创建时间">2025-12-10</Descriptions.Item>
      <Descriptions.Item label="更新时间">2025-12-11</Descriptions.Item>
      <Descriptions.Item label="描述" span={2}>
        这是一段跨列描述。
      </Descriptions.Item>
    </Descriptions>
  );
}

export function StyleDemo() {
  const [border, setBorder] = useState(true);
  const [layout, setLayout] = useState(
    "horizontal" as "horizontal" | "vertical",
  );
  const labelStyle = { background: "var(--ao-color-warning-bg)" };
  const contentStyle = { background: "var(--ao-color-success-bg)" };
  return (
    <div style={{ width: "100%" }}>
      <Switch checked={border} onChange={setBorder} />
      <Divider />
      <Radio.Group
        onChange={(event) =>
          setLayout(event.target.value as "horizontal" | "vertical")
        }
        value={layout}
      >
        <Radio value="horizontal">horizontal</Radio>
        <Radio value="vertical">vertical</Radio>
      </Radio.Group>
      <Divider />
      <Descriptions
        title="User Info"
        bordered={border}
        layout={layout}
        items={[
          {
            key: "1",
            label: "Product",
            children: "Cloud Database",
            styles: { label: labelStyle, content: contentStyle },
          },
          { key: "2", label: "Billing Mode", children: "Prepaid" },
          { key: "3", label: "Automatic Renewal", children: "YES" },
        ]}
      />
      <Divider />
      <Descriptions
        title="Root style"
        styles={{ label: labelStyle, content: contentStyle }}
        bordered={border}
        layout={layout}
        items={[
          { key: "1", label: "Product", children: "Cloud Database" },
          { key: "2", label: "Billing Mode", children: "Prepaid" },
          {
            key: "3",
            label: "Automatic Renewal",
            children: "YES",
            styles: { label: { color: "orange" }, content: { color: "blue" } },
          },
        ]}
      />
    </div>
  );
}

export function JsxDemo() {
  return (
    <Descriptions title="User Info">
      <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
      <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
      <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
      <Descriptions.Item label="Remark">empty</Descriptions.Item>
      <Descriptions.Item label="Address">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </Descriptions.Item>
    </Descriptions>
  );
}

export function BlockDemo() {
  return (
    <Descriptions bordered title="User Info">
      <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
      <Descriptions.Item label="Live" span="filled">
        Hangzhou, Zhejiang
      </Descriptions.Item>
      <Descriptions.Item label="Remark" span="filled">
        empty
      </Descriptions.Item>
      <Descriptions.Item label="Address" span={1}>
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </Descriptions.Item>
    </Descriptions>
  );
}
