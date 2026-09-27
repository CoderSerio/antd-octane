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
  const versions = Object.fromEntries(
    ["octane", "vite", "typescript", "@types/node", "happy-dom"].map((name) => [
      name,
      JSON.parse(
        readFileSync(join(root, "node_modules", name, "package.json"), "utf8"),
      ).version,
    ]),
  );
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
          "happy-dom": versions["happy-dom"],
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(join(directory, ".npmrc"), "auto-install-peers=false\n");
  run(["install", "--prefer-offline", "--ignore-scripts"]);
  writeFileSync(
    join(directory, "index.html"),
    '<div id="root"></div><script type="module" src="/main.tsx"></script>',
  );
  writeFileSync(
    join(directory, "tsrx.html"),
    '<div id="root"></div><script type="module" src="/main.tsrx"></script>',
  );
  writeFileSync(
    join(directory, "main.tsx"),
    `
import { createRoot } from 'octane';
import { Affix, Anchor, FloatButton, Image, Carousel, Splitter, Watermark, App, Icon, QRCode, Tour, Modal, Drawer, Menu, Dropdown, Popconfirm, message, notification, Button, InputNumber, Slider, Input, Checkbox, Switch, Flex, Space, Divider, Radio, Tag, Alert, Card, Avatar, Badge, Spin, Skeleton, Progress, Result, Typography, List, Row, Col, Layout, Collapse, Tabs, Empty, Statistic, Timeline, Descriptions, Segmented, Rate, Breadcrumb, Steps, Pagination, Tooltip, Popover, ConfigProvider, theme } from 'antd-octane';
import 'antd-octane/style.css';
function AppConsumer() {
  const {message} = App.useApp();
  return <Button onClick={() => message.success('Ready')}>App message</Button>;
}
function NoticeConsumer() {
  const [messages, messageHolder] = message.useMessage();
  const [notifications, notificationHolder] = notification.useNotification();
  return <>{messageHolder}{notificationHolder}<Button onClick={() => {messages.success('Saved'); notifications.info({message:'Packed',description:'Ready'});}}>Notify</Button></>;
}
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
    <InputNumber defaultValue={1.5} step={0.1} onChange={(value) => void value} />
    <Slider range defaultValue={[20, 50]} onChange={(value) => void value} />
    <Input.Password defaultValue="secret" />
    <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
    <Input.Search allowClear onSearch={(value) => void value} />
    <Modal open={false} title="Packed modal">Content</Modal>
    <Drawer open={false} title="Packed drawer">Content</Drawer>
    <Menu items={[{key:'one',label:'One'}]} />
    <Dropdown menu={{items:[{key:'one',label:'One'}]}}><Button>Menu</Button></Dropdown>
    <Popconfirm title="Save?"><Button>Confirm</Button></Popconfirm>
    <Affix offsetTop={8}><Button>Affix</Button></Affix>
    <Anchor items={[{key:'first',href:'#first',title:'First'}]} />
    <FloatButton.Group><FloatButton description="Help" /></FloatButton.Group>
    <Image.PreviewGroup><Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" /></Image.PreviewGroup>
    <Carousel><div>One</div><div>Two</div></Carousel>
    <Splitter><Splitter.Panel>One</Splitter.Panel><Splitter.Panel>Two</Splitter.Panel></Splitter>
    <Watermark content="Packed">Content</Watermark>
    <App><AppConsumer /></App>
    <Icon viewBox="0 0 24 24"><path d="M2 12h20" /></Icon>
    <QRCode value="Packed" /><QRCode type="svg" value="Packed SVG" />
    <Tour open={false} steps={[{title:'Packed tour',description:'Ready'}]} />
    <NoticeConsumer />
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
    join(directory, "main.tsrx"),
    `import { createRoot } from 'octane';
import { useSignal$ } from 'octane/signals/client';
import { Affix, Alert, Anchor, App, Breadcrumb, Button, Checkbox, ConfigProvider, Divider, Drawer, Dropdown, Flex, FloatButton, Icon, Input, InputNumber, Layout, Menu, Modal, Pagination, Popconfirm, Progress, Radio, Rate, Result, Row, Col, Skeleton, Slider, Space, Spin, Splitter, Steps, Switch, Tabs, Typography, Watermark, message, notification, Carousel } from 'antd-octane';
import 'antd-octane/style.css';

function Page() @{
  const value$ = useSignal$('');
  const checked$ = useSignal$(false);
  const number$ = useSignal$(1);
  const current$ = useSignal$(1);
  const [messages, messageHolder] = message.useMessage();
  const [notifications, notificationHolder] = notification.useNotification();
  <main>
    <Button id="signal-update" onClick={() => { value$.set('updated'); checked$.set(true); number$.set(3); current$.set(2); }}>Update</Button>
    <Input id="signal-input" value={value$.get()} onChange={(event) => value$.set(event.target.value)} />
    <Switch checked={checked$.get()} onChange={(next) => checked$.set(next)} />
    <Checkbox checked={checked$.get()} onChange={(event) => checked$.set(event.target.checked)}>checkable</Checkbox>
    <Radio checked={checked$.get()} onChange={(event) => checked$.set(event.target.checked)}>radio choice</Radio>
    <InputNumber value={number$.get()} onChange={(next) => number$.set(next ?? 0)} />
    <Rate value={number$.get()} onChange={(next) => number$.set(next)} />
    <Slider value={number$.get()} onChange={(next) => number$.set(Number(next))} />
    <Pagination current={current$.get()} total={50} onChange={(next) => current$.set(next)} />
    <Tabs activeKey={String(current$.get())} onChange={(key) => current$.set(Number(key))} items={[{ key: '1', label: 'First tab', children: 'first panel' }, { key: '2', label: 'Second tab', children: 'second panel' }]} />
    <section id="general">
      <FloatButton description="Quick" />
      <Icon viewBox="0 0 24 24"><path d="M2 12h20" /></Icon>
      <Typography.Text>typed text</Typography.Text>
    </section>
    <section id="layout">
      <Divider>divider content</Divider>
      <Flex><span>flex child</span></Flex>
      <Row><Col span={12}>grid child</Col></Row>
      <Layout><Layout.Header>layout header</Layout.Header><Layout.Content>layout content</Layout.Content></Layout>
    </section>
    <Splitter>
      <Splitter.Panel>first</Splitter.Panel>
      <Splitter.Panel>second</Splitter.Panel>
    </Splitter>
    <Space><span>one</span><span>two</span></Space>
    <Carousel><div>slide one</div><div>slide two</div></Carousel>
    <section id="navigation">
      <Anchor items={[{ key: 'target', href: '#general', title: 'Anchor target' }]} />
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Current' }]} />
      <Dropdown menu={{ items: [{ key: 'open', label: 'Open menu' }] }}><Button>dropdown trigger</Button></Dropdown>
      <Menu items={[{ key: 'item', label: 'Menu item' }]} />
      <Steps current={1} items={[{ title: 'Start' }, { title: 'Done' }]} />
    </section>
    <section id="feedback">
      <Alert message="alert content" />
      <Drawer open={false} title="Drawer title">drawer content</Drawer>
      <Modal open={false} title="Modal title">modal content</Modal>
      <Popconfirm title="Confirm action"><Button>confirm trigger</Button></Popconfirm>
      <Progress percent={30} />
      <Result status="success" title="result content" />
      <Skeleton loading={false}><span>skeleton child</span></Skeleton>
      <Spin spinning={false}><span>spin child</span></Spin>
      <Watermark content="watermark"><span>watermark child</span></Watermark>
      {messageHolder}{notificationHolder}
      <Button onClick={() => { messages.success('message ready'); notifications.info({ message: 'notification ready' }); }}>show notices</Button>
    </section>
    <section id="other">
      <Affix><span>affix child</span></Affix>
      <App><span>app child</span></App>
      <ConfigProvider><span>config child</span></ConfigProvider>
    </section>
  </main>
}

createRoot(document.getElementById('root')!).render(Page, {});
`,
  );
  writeFileSync(
    join(directory, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import { octane } from 'octane/compiler/vite';
export default defineConfig({ plugins: [octane()], build: { target: 'es2022', rollupOptions: { input: { main: 'index.html', tsrx: 'tsrx.html' } } } });`,
  );
  run(["exec", "tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);
  writeFileSync(
    join(directory, "smoke.mjs"),
    `import { Window } from 'happy-dom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const win = new Window({ url: 'http://localhost/' });
for (const key of ['window', 'document', 'navigator', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'Element', 'SVGElement', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'Event', 'PointerEvent', 'MouseEvent', 'MutationObserver', 'ResizeObserver', 'CustomEvent', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  const value = key === 'window' ? win : ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(key) ? win[key].bind(win) : win[key];
  Object.defineProperty(globalThis, key, { value, configurable: true });
}
win.document.body.innerHTML = '<div id="root"></div>';
try {
  const html = readFileSync('dist/tsrx.html', 'utf8');
  const script = html.match(/src="([^"]+\\.js)"/)?.[1];
  if (!script) throw new Error('TSRX build entry missing');
  await import(pathToFileURL(resolve('dist', script.replace(/^\\//, ''))).href);
  await new Promise((done) => setTimeout(done, 30));
  const count = (selector) => win.document.querySelectorAll(selector).length;
  if (count('.ant-splitter-panel') !== 2) throw new Error('TSRX Splitter.Panel children missing');
  if (count('.ant-space-item') !== 2) throw new Error('TSRX Space children missing');
  const carousel = win.document.querySelector('.ant-carousel');
  if (!carousel?.textContent.includes('slide one') || !carousel.textContent.includes('slide two')) throw new Error('TSRX Carousel children missing');
  const text = win.document.body.textContent;
  for (const expected of ['typed text', 'divider content', 'flex child', 'grid child', 'layout header', 'layout content', 'Anchor target', 'Home', 'Current', 'Menu item', 'Start', 'alert content', 'result content', 'skeleton child', 'spin child', 'watermark child', 'affix child', 'app child', 'config child']) {
    if (!text.includes(expected)) throw new Error('TSRX component content missing: ' + expected);
  }
  win.document.querySelector('#signal-update')?.click();
  await new Promise((done) => setTimeout(done, 30));
  if (win.document.querySelector('#signal-input')?.value !== 'updated') throw new Error('TSRX Signal-driven Input did not update');
  if (win.document.querySelector('[role="switch"]')?.getAttribute('aria-checked') !== 'true') throw new Error('TSRX Signal-driven Switch did not update');
  if (!win.document.querySelector('.ant-checkbox input')?.checked) throw new Error('TSRX Signal-driven Checkbox did not update');
  if (!win.document.querySelector('.ant-radio input')?.checked) throw new Error('TSRX Signal-driven Radio did not update');
  if (win.document.querySelector('.ant-input-number-input')?.value !== '3') throw new Error('TSRX Signal-driven InputNumber did not update');
  if (win.document.querySelector('.ant-rate')?.getAttribute('aria-valuenow') !== '3') throw new Error('TSRX Signal-driven Rate did not update');
  if (win.document.querySelector('.ant-slider [role="slider"]')?.getAttribute('aria-valuenow') !== '3') throw new Error('TSRX Signal-driven Slider did not update');
  if (win.document.querySelector('.ant-pagination-item-active')?.textContent.trim() !== '2') throw new Error('TSRX Signal-driven Pagination did not update');
  if (!win.document.querySelector('.ant-tabs-tab-active')?.textContent.includes('Second tab')) throw new Error('TSRX Signal-driven Tabs did not update');
  if (!win.document.querySelector('#feedback')?.textContent.includes('skeleton child')) throw new Error('TSRX feedback children missing');
  console.log('Packed TSRX consumer rendered non-data-display components and Signal-driven controls.');
} finally {
  win.happyDOM.abort();
}
process.exit(0);
`,
  );
  run(["exec", "node", "smoke.mjs"]);
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
