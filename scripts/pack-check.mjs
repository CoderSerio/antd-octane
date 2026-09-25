import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const directory = mkdtempSync(join(tmpdir(), "antd-octane-consumer-"));
const run = (args, cwd = directory) =>
  execFileSync("pnpm", args, { cwd, stdio: "inherit" });
try {
  run(
    ["pack", "--pack-destination", directory],
    join(root, "packages/antd-octane"),
  );
  const archive = readdirSync(directory).find((name) => name.endsWith(".tgz"));
  if (!archive) throw new Error("Package archive missing");
  const versions = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  ).devDependencies;
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: "antd-octane-consumer-check",
        private: true,
        type: "module",
        dependencies: {
          "antd-octane": `file:./${archive}`,
          octane: versions.octane,
        },
        devDependencies: {
          vite: versions.vite,
          typescript: versions.typescript,
          "@types/node": versions["@types/node"],
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(join(directory, ".npmrc"), "auto-install-peers=false\n");
  run(["install", "--offline", "--ignore-scripts"]);
  writeFileSync(
    join(directory, "index.html"),
    '<div id="root"></div><script type="module" src="/main.tsx"></script>',
  );
  writeFileSync(
    join(directory, "main.tsx"),
    `
import { createRoot } from 'octane';
import { Button, Input, Checkbox, Switch, Flex, Space, Divider, Radio, Tag, Alert, Card, Avatar, Badge, Spin, Skeleton, Progress, Result, Typography, List, Row, Col, Layout, Collapse, Tabs, Empty, Statistic, Timeline, Descriptions, Segmented, Rate, Breadcrumb, Steps, Pagination, Tooltip, Popover, ConfigProvider, theme } from 'antd-octane';
import 'antd-octane/style.css';
createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#722ed1' } }}>
    <Flex gap="small"><Space><Switch defaultChecked /></Space><Divider type="vertical" /></Flex>
    <Radio.Group options={[1, 2]} defaultValue={1} onChange={(event) => void event.target.value} />
    <Checkbox.Group options={[true, false]} onChange={(values) => void values.length} />
    <Card title="Packed card"><Card.Meta title="Metadata" /><Badge count={5}><Avatar>O</Avatar></Badge><Tag color="success">Ready</Tag><Alert message="Installed" /></Card>
    <Layout><Layout.Header>Header</Layout.Header><Layout.Content>
      <Row gutter={{ xs: 8, md: 16 }}><Col xs={24} md={12}><Statistic title="Count" value={1200} /></Col></Row>
      <Collapse items={[{ key: 'one', label: 'Details', children: <Empty /> }]} />
      <Tabs items={[{ key: 'one', label: 'Overview', children: <Timeline items={[{ children: 'Ready' }]} /> }]} />
      <Descriptions column={{ xs: 1, md: 2 }} items={[{ key: 'one', label: 'Status', children: 'Ready' }]} />
    </Layout.Content></Layout>
    <Spin spinning={false}><Skeleton loading={false}><Progress percent={40} /></Skeleton></Spin>
    <Progress type="circle" percent={80} strokeColor={{from:'#1677ff',to:'#52c41a'}} />
    <Result status="success" title="Packed feedback" />
    <Typography.Title level={3}>Packed content</Typography.Title>
    <Typography.Paragraph copyable editable={{ onChange: (text) => void text }}>Edit me</Typography.Paragraph>
    <List pagination={{ pageSize: 2 }} rowKey="id" dataSource={[{ id: 1, title: 'Packed list' }]} renderItem={(item) => <List.Item><List.Item.Meta title={item.title} /></List.Item>} />
    <Segmented options={['Day', 'Week']} onChange={(value) => void value} />
    <Rate allowHalf defaultValue={2.5} onChange={(value) => void value} />
    <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Packed' }]} />
    <Steps current={1} items={[{ title: 'Start' }, { title: 'Ready' }]} />
    <Pagination total={50} onChange={(page, size) => void [page, size]} />
    <Tooltip title="Packed tooltip"><Button>Tooltip trigger</Button></Tooltip>
    <Popover title="Packed popover" content="Details" trigger="click"><Button>Popover trigger</Button></Popover>
    <Button type="primary">Packed consumer</Button>
    <Input defaultValue="Packed input" onChange={(event) => void event.target.value} />
    <Checkbox defaultChecked onChange={(event) => void event.target.checked}>Packed checkbox</Checkbox>
  </ConfigProvider>
);
`,
  );
  writeFileSync(
    join(directory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        skipLibCheck: true,
        jsx: "react-jsx",
        jsxImportSource: "octane",
        noEmit: true,
      },
      include: ["main.tsx"],
    }),
  );
  writeFileSync(
    join(directory, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import { octane } from 'octane/compiler/vite';
export default defineConfig({ plugins: [octane()], build: { target: 'es2022' } });`,
  );
  run(["exec", "tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);
  const manifest = JSON.parse(
    readFileSync(
      join(directory, "node_modules/antd-octane/package.json"),
      "utf8",
    ),
  );
  if (manifest.dependencies?.react || manifest.dependencies?.antd)
    throw new Error("Unexpected React runtime dependency");
  console.log(
    "Packed consumer typecheck and production build passed; no workspace source aliases.",
  );
  if (process.env.KEEP_CONSUMER)
    console.log(`Consumer retained at ${directory}`);
} finally {
  if (!process.env.KEEP_CONSUMER)
    rmSync(directory, { recursive: true, force: true });
}
