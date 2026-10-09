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
import { AutoComplete, Mentions, Affix, Anchor, FloatButton, Image, Carousel, Splitter, Watermark, App, Icon, QRCode, Tour, Modal, Drawer, Menu, Dropdown, Popconfirm, message, notification, Button, InputNumber, Slider, Input, Select, Form, Checkbox, Switch, Flex, Space, Divider, Radio, Tag, Alert, Card, Avatar, Badge, Spin, Skeleton, Progress, Result, Typography, List, Row, Col, Layout, Collapse, Tabs, Empty, Statistic, Timeline, Descriptions, Segmented, Rate, Breadcrumb, Steps, Pagination, Tooltip, Popover, ConfigProvider, theme } from 'antd-octane';
import { AntDesignOutlined, ClockCircleOutlined, MinusOutlined, PlusOutlined, QuestionOutlined, UserOutlined } from 'antd-octane/icons';
import { Calendar, Cascader, ColorPicker, DatePicker, TimePicker, Transfer, TreeSelect, Tree, Table, Upload } from 'antd-octane';
import 'antd-octane/style.css';
import { StyleProvider, type StyleProviderProps } from 'antd-octane/style';
// @ts-expect-error Time ranges are deliberately not exposed yet.
const unsupportedRange = TimePicker.RangePicker;
// @ts-expect-error Gradient mode has no implementation.
const unsupportedColor = <ColorPicker mode="gradient" />;
// @ts-expect-error TreeSelect checkbox conduction is not implemented.
const unsupportedTree = <TreeSelect treeCheckable />;
void [unsupportedRange, unsupportedColor, unsupportedTree];
const packedStyleProvider: StyleProviderProps = { layer: true };
// @ts-expect-error StyleProvider layer is boolean.
const invalidStyleProvider: StyleProviderProps = { layer: 'antd' };
void [packedStyleProvider, invalidStyleProvider];
import type { ConfigProviderProps, CSPConfig, DrawerProps, GroupProps, MessageArgs, MessageConfig, MultipleSelectProps, NotificationArgsProps, NotificationConfig, NotificationGlobalConfig, TableFilterDropdownProps, WarningContextProps } from 'antd-octane';
import type { GetProps, GetProp, GetRef, SelectProps, SelectRef, AffixRef } from 'antd-octane';
type PackedCheckboxGroup = GetProps<typeof Checkbox.Group>;
const packedGroup: PackedCheckboxGroup = { options: [1, 2], onChange: (values) => void values.length };
const packedOption1: GetProp<SelectProps, 'options'>[number] = { value: 'one', label: 'One' };
const packedOption2: GetProp<typeof Select, 'options'>[number] = packedOption1;
function usePackedRefs(select: GetRef<typeof Select>, affix: GetRef<typeof Affix>) {
  const checkedSelect: SelectRef = select;
  const checkedAffix: AffixRef = affix;
  checkedSelect.focus(); checkedAffix.updatePosition.cancel();
}
void [packedGroup, packedOption2, usePackedRefs];
const packedIcons = [<AntDesignOutlined />, <ClockCircleOutlined />, <MinusOutlined />, <PlusOutlined />, <QuestionOutlined />, <UserOutlined />];
void packedIcons;

const packedDrawerProps: DrawerProps = {
  panelRef: { current: null }, push: {}, id: 'panel', 'aria-label': 'Panel',
  onClick: event => void event.currentTarget, onKeyUp: event => void event.key,
  closable: { placement: 'end', disabled: true, 'aria-label': 'Dismiss' },
};
const packedDrawerProvider: ConfigProviderProps = { drawer: { closable: false, closeIcon: 'X' } };
// @ts-expect-error Drawer exposes the upstream panel events, not arbitrary DOM events.
const badDrawerEvent: DrawerProps = { onFocus: () => {} };
// @ts-expect-error Upstream Drawer preset size uses default, not medium.
const badDrawerSize: DrawerProps = { size: 'medium' };
void [packedDrawerProps, packedDrawerProvider, badDrawerEvent, badDrawerSize];

type PackedSkeletonProps = GetProps<typeof Skeleton>;
const packedSkeleton: PackedSkeletonProps = {
  avatar: { shape: 'square', size: 48, className: 'avatar' },
  title: { prefixCls: 'heading', className: 'title', width: '50%', style: { height: 22 } },
  paragraph: { prefixCls: 'lines', className: 'paragraph', rows: 3, width: [100, '75%'] },
};
const packedSkeletonButton: GetProps<typeof Skeleton.Button> = { block: true, size: 'large', shape: 'round' };
const packedSkeletonNode: GetProps<typeof Skeleton.Node> = { fullSize: true, children: 'Node', style: { width: 120 } };
// @ts-expect-error Main Skeleton has an explicit component API, not div event props.
const invalidSkeletonClick: PackedSkeletonProps = { onClick: () => {} };
// @ts-expect-error Active belongs to the main Skeleton or standalone Avatar, not avatar options.
const invalidSkeletonAvatarActive: PackedSkeletonProps = { avatar: { active: true } };
// @ts-expect-error Block belongs to Button/Input, not Avatar.
const invalidSkeletonAvatarBlock: GetProps<typeof Skeleton.Avatar> = { block: true };
// @ts-expect-error Button sizes are presets; numeric sizing belongs to Avatar.
const invalidSkeletonButtonSize: GetProps<typeof Skeleton.Button> = { size: 48 };
// @ts-expect-error Skeleton.Input has no shape option.
const invalidSkeletonInputShape: GetProps<typeof Skeleton.Input> = { shape: 'round' };
// @ts-expect-error Skeleton.Image has no block option.
const invalidSkeletonImageBlock: GetProps<typeof Skeleton.Image> = { block: true };
void [packedSkeleton, packedSkeletonButton, packedSkeletonNode, invalidSkeletonClick, invalidSkeletonAvatarActive, invalidSkeletonAvatarBlock, invalidSkeletonButtonSize, invalidSkeletonInputShape, invalidSkeletonImageBlock];
const packedSpin: GetProps<typeof Spin> = { size: 'default', indicator: <span />, percent: 'auto', tip: <span>Loading</span> };
const packedSpinContext: ConfigProviderProps = { spin: { indicator: <span />, style: { color: '#722ed1' } } };
Spin.setDefaultIndicator('Fallback to native dots');
Spin.setDefaultIndicator(undefined);
// @ts-expect-error Spin exposes its explicit component contract, not arbitrary div events.
const invalidSpinClick: GetProps<typeof Spin> = { onClick: () => {} };
// @ts-expect-error The preset is default, not medium.
const invalidSpinSize: GetProps<typeof Spin> = { size: 'medium' };
// @ts-expect-error Indicator requires an element; tip can contain text.
const invalidSpinIndicator: GetProps<typeof Spin> = { indicator: 'Loading' };
// @ts-expect-error ConfigProvider preserves the same indicator element contract.
const invalidSpinContext: ConfigProviderProps = { spin: { indicator: 'Loading' } };
// @ts-expect-error Spin is not a forwarded DOM ref component.
const invalidSpinRef: GetProps<typeof Spin> = { ref: { current: null } };
void [packedSpin, packedSpinContext, invalidSpinClick, invalidSpinSize, invalidSpinIndicator, invalidSpinContext, invalidSpinRef];
const packedProgress: GetProps<typeof Progress> = { percent: 65, size: ['80%', 12], strokeColor: { '0%': 'blue', '100%': 'green' }, 'aria-label': 'Download', ref: { current: null } };
const packedProgressAria: import('antd-octane').ProgressAriaProps = { 'aria-labelledby': 'download-label' };
const packedProgressRef = (element: GetRef<typeof Progress>) => { const div: HTMLDivElement = element; void div; };
// @ts-expect-error Progress has explicit component props, not arbitrary div events.
const invalidProgressClick: GetProps<typeof Progress> = { onClick: () => {} };
// @ts-expect-error Progress exposes label/labelledby; valuenow is derived at runtime.
const invalidProgressAria: GetProps<typeof Progress> = { 'aria-valuenow': 20 };
// @ts-expect-error The Progress size preset is default, not medium.
const invalidProgressSize: GetProps<typeof Progress> = { size: 'medium' };
void [packedProgress, packedProgressAria, packedProgressRef, invalidProgressClick, invalidProgressAria, invalidProgressSize];
const packedResult: GetProps<typeof Result> = { status: 404, title: 'Not found', icon: false, extra: null, rootClassName: 'result-root' };
const packedResultImage = Result.PRESENTED_IMAGE_404;
// @ts-expect-error Result does not expose arbitrary div events.
const invalidResultClick: GetProps<typeof Result> = { onClick: () => {} };
// @ts-expect-error Result is not a forwarded-ref component upstream.
const invalidResultRef: GetProps<typeof Result> = { ref: { current: null } };
// @ts-expect-error Result supports only the upstream statuses.
const invalidResultStatus: GetProps<typeof Result> = { status: 'pending' };
void [packedResult, packedResultImage, invalidResultClick, invalidResultRef, invalidResultStatus];
const packedAlert: GetProps<typeof Alert> = { closable: { closeIcon: true, disabled: true, 'aria-label': 'Dismiss' }, onClose: (event: MouseEvent) => event.preventDefault(), role: 'status', ref: { current: null } };
const packedAlertRef = (handle: GetRef<typeof Alert>) => { const element: HTMLDivElement = handle.nativeElement; void element; };
// @ts-expect-error Alert forwards explicit mouse handlers, not arbitrary div events.
const invalidAlertKeyDown: GetProps<typeof Alert> = { onKeyDown: () => {} };
// @ts-expect-error Alert does not expose arbitrary div attributes.
const invalidAlertTitle: GetProps<typeof Alert> = { title: 'Notice' };
// @ts-expect-error Alert uses the four upstream status styles.
const invalidAlertType: GetProps<typeof Alert> = { type: 'pending' };
void [packedAlert, packedAlertRef, invalidAlertKeyDown, invalidAlertTitle, invalidAlertType];
// @ts-expect-error GetRef accepts a component, not an intrinsic tag string.
type InvalidTagRef = GetRef<'div'>;
// @ts-expect-error GetProp rejects unknown prop names.
type InvalidPropName = GetProp<SelectProps, 'notAProp'>;
const legacyConfig: ConfigProviderProps = { autoInsertSpaceInButton: false, dropdownMatchSelectWidth: false, popupMatchSelectWidth: true };
const csp: CSPConfig = { nonce: 'packed-nonce' };
const emptyCsp: CSPConfig = {};
const cspConfig: ConfigProviderProps = { csp };
void [emptyCsp, cspConfig];
// @ts-expect-error CSP nonce is a string, not a number.
const invalidCsp: CSPConfig = { nonce: 42 };
void invalidCsp;
const filterAutoFocus: TableFilterDropdownProps = { autoFocus: true };
void filterAutoFocus;
const notificationConfig: NotificationConfig = { top: 32, bottom: 16, placement: 'top', stack: { threshold: 2 }, showProgress: true, pauseOnHover: false };
const notificationGlobalConfig: NotificationGlobalConfig = { top: 24, props: { 'data-testid': 'notice' }, closable: false };
const notificationArgs: NotificationArgsProps = { message: 'Notice', duration: null, type: 'info', onClick: () => {}, props: { style: { color: 'red' } } };
const messageConfig: MessageConfig = { top: '3rem' };
const messageArgs: MessageArgs = { content: 'Message', onClick: event => { const node: HTMLDivElement = event.currentTarget; void node.dataset; } };
void [notificationConfig, notificationGlobalConfig, notificationArgs, messageConfig, messageArgs];
// @ts-expect-error Notification top is a number; string offsets belong to Message.
const invalidNotificationTop: NotificationConfig = { top: '24px' };
// @ts-expect-error Notification static configuration also accepts only numeric top offsets.
const invalidNotificationGlobalTop: NotificationGlobalConfig = { top: '24px' };
// @ts-expect-error The notification callback is declared without an event parameter.
const invalidNotificationClick: NotificationArgsProps = { message: 'Notice', onClick: (event: MouseEvent) => void event };
// @ts-expect-error Notification has no loading kind.
const invalidNotificationType: NotificationArgsProps = { message: 'Notice', type: 'loading' };
// @ts-expect-error Hook-only stack configuration is not a static notification config property.
const invalidNotificationStack: NotificationGlobalConfig = { stack: false };
// @ts-expect-error Notification args must not inherit Message content.
const invalidNotificationContent: NotificationArgsProps = { message: 'Notice', content: 'Message' };
// @ts-expect-error Hook configuration duration is numeric; null is a per-notice argument.
const invalidNotificationDuration: NotificationConfig = { duration: null };
// @ts-expect-error props.style uses the upstream object style contract.
const invalidNotificationStyle: NotificationArgsProps = { message: 'Notice', props: { style: 'color:red' } };
void [invalidNotificationTop, invalidNotificationGlobalTop, invalidNotificationClick, invalidNotificationType, invalidNotificationStack, invalidNotificationContent, invalidNotificationDuration, invalidNotificationStyle];
function verifyReadonlyNoticeHooks(notices: ReturnType<typeof notification.useNotification>, messages: ReturnType<typeof message.useMessage>, args: NotificationArgsProps) {
  // @ts-expect-error The hook returns a readonly tuple, like Ant Design 5.
  notices[0] = notices[0];
  // @ts-expect-error Message hook tuples are readonly too.
  messages[0] = messages[0];
  // @ts-expect-error Notification's type property is readonly.
  args.type = 'info';
}
void verifyReadonlyNoticeHooks;
// @ts-expect-error filter dropdown autoFocus is boolean.
const invalidFilterAutoFocus: TableFilterDropdownProps = { autoFocus: 'yes' };
void invalidFilterAutoFocus;
ConfigProvider.config({ theme: { token: { colorInfo: '#722ed1' }, components: { App: { colorText: '#123456', fontSize: 16 } } } });
ConfigProvider.config({ theme: { primaryColor: '#722ed1', infoColor: '#13a8a8' }, holderRender: undefined, prefixCls: undefined });
ConfigProvider.config({ theme: {}, prefixCls: 'ant', iconPrefixCls: 'anticon' });
// @ts-expect-error App's wrapper API does not forward arbitrary HTML attributes.
const invalidApp = <App id="unsupported" />;
void invalidApp;
// @ts-expect-error Watermark has an explicit prop contract, not arbitrary div attributes.
const invalidWatermark = <Watermark id="unsupported" content="Packed" />;
void invalidWatermark;
// @ts-expect-error Affix has an explicit component contract, not div attributes.
const invalidAffix = <Affix id="unsupported">Packed child</Affix>;
void invalidAffix;
function cancelAffix(ref: import('antd-octane').AffixRef) { ref.updatePosition(); ref.updatePosition.cancel(); }
void cancelAffix;
// @ts-expect-error ConfigProvider width configuration accepts only boolean or number.
const invalidConfig: ConfigProviderProps = { popupMatchSelectWidth: 'wide' };
void invalidConfig;
const legacySizeContext = ConfigProvider.SizeContext;
void legacySizeContext;
const packedModal: GetProps<typeof Modal> = {
  height: 240, width: { xs: 300, lg: '70%' }, panelRef: { current: null },
  closable: { 'aria-label': 'Dismiss', 'data-close': 'packed', disabled: true },
  bodyProps: { onClick: event => { const node: HTMLDivElement = event.currentTarget; void node; }, style: { padding: 12 } },
  maskProps: { style: { backgroundColor: 'rgba(0,0,0,.2)' } },
  wrapStyle: { paddingTop: 24 }, 'data-modal': 'packed',
};
const packedModalProvider: ConfigProviderProps = { modal: { centered: true, closable: false } };
// @ts-expect-error Modal refs target a div panel, not a button.
const invalidModalPanelRef: GetProps<typeof Modal> = { panelRef: { current: document.createElement('button') } };
// @ts-expect-error Responsive width keys are Ant Design breakpoints.
const invalidModalWidth: GetProps<typeof Modal> = { width: { mobile: 320 } };
// @ts-expect-error Height is a CSS dimension, not a boolean.
const invalidModalHeight: GetProps<typeof Modal> = { height: true };
void [packedModal, packedModalProvider, invalidModalPanelRef, invalidModalWidth, invalidModalHeight];
function packedConfirmations() {
  const staticResult = Modal.confirm({ direction: 'rtl', onOk: () => false, onCancel: (close: () => void) => { close(); } });
  // @ts-expect-error Static confirmations do not expose the hook-only then method.
  staticResult.then(() => true);
  // @ts-expect-error destroy has no public payload parameter.
  staticResult.destroy('unsupported');
  const tuple = Modal.useModal();
  // @ts-expect-error The hook result tuple is readonly.
  tuple[0] = tuple[0];
  const hookResult: import('antd-octane').HookModalResult = tuple[0].confirm({ autoFocusButton: null, onOk: () => ({ value: true }) });
  const confirmation: PromiseLike<boolean> = hookResult;
  hookResult.update(previous => ({ ...previous, title: 'Updated' }));
  void confirmation;
}
void packedConfirmations;

const legacyDrawer: DrawerProps = { visible: false, afterVisibleChange: (open) => { const visible: boolean = open; void visible; }, drawerStyle: { color: 'red' } };
// @ts-expect-error afterVisibleChange receives a boolean, not a string.
const invalidDrawer: DrawerProps = { afterVisibleChange: (open: string) => void open };
void invalidDrawer;
const warningProps: WarningContextProps = { strict: false };
const groupProps: GroupProps = { compact: true, size: 'small', onFocus: (event) => void event.currentTarget };
// @ts-expect-error Legacy Input.Group uses default, large or small, not middle.
const invalidGroup: GroupProps = { size: 'middle' };
void invalidGroup;
const multipleProps: MultipleSelectProps = {
  mode: 'multiple', options: [{value:'first',label:'First'},{value:2,label:'Second'}], defaultValue: ['first'],
  onChange: (values, options) => { const selected: (string | number)[] = values; void [selected, options.length]; },
};
// @ts-expect-error MultipleSelectProps must reject scalar values.
const invalidMultiple: MultipleSelectProps = { mode: 'multiple', options: [], value: 'first' };
void invalidMultiple;
function AppConsumer() {
  const {message} = App.useApp();
  return <Button onClick={() => message.success('Ready')}>App message</Button>;
}
function NoticeConsumer() {
  const [messages, messageHolder] = message.useMessage({transitionName:'packed-message-motion'});
  // @ts-expect-error Message has no notification progress option.
  const invalidMessageProgress: Parameters<typeof messages.open>[0] = {content:'Unsupported',showProgress:true};
  // @ts-expect-error Message duration is a number, not null.
  const invalidMessageDuration: Parameters<typeof messages.open>[0] = {content:'Unsupported',duration:null};
  void invalidMessageProgress; void invalidMessageDuration;
  const shadow = document.createElement('div').attachShadow({mode:'open'});
  const [notifications, notificationHolder] = notification.useNotification({getContainer: () => shadow});
  return <>{messageHolder}{notificationHolder}<Button onClick={() => {messages.success('Saved'); notifications.info({message:'Packed',description:'Ready',closable:{closeIcon:'×','aria-label':'Close notification'}});}}>Notify</Button></>;
}
createRoot(document.getElementById('root')!).render(
  <StyleProvider layer>
  <ConfigProvider {...legacyConfig} csp={csp} warning={warningProps} theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#722ed1' } }}>
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
    <Result status="success" title="Packed feedback" /><Drawer {...legacyDrawer} />
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
    <Input.Group {...groupProps}><Input defaultValue="Grouped" /><Input disabled value="disabled" /></Input.Group>
    <Select options={[{value:'first',label:'First'},{value:'second',label:'Second'}]} defaultValue="first" showSearch onChange={(value) => void value} />
    <Select {...multipleProps} />
    <Space.Compact size="small"><Space.Addon>https://</Space.Addon><Input /><Button>Go</Button></Space.Compact>
    <AutoComplete options={[{value:'Octane'}]} onChange={(text) => void text} onSelect={(text,option) => void option.value} />
    <Mentions options={[{value:'alice'}]} defaultValue="Packed @a" onChange={(text) => void text} />
    <Form initialValues={{name:'Packed', user:{owner:'a'}}} onFinish={(values) => void values.name}>
      <Form.Item name="name" label="Name" rules={[{required:true}, {validator: async (_rule,value) => { if (!value) throw new Error("Required"); }}]}><Input /></Form.Item>
      <Form.Item name={['user', 'owner']} label="Owner" dependencies={['name']}><Select loading options={[{label:'Team',options:[{value:'a',label:'Alice'}]}]} optionFilterProp="label" /></Form.Item>
      <Form.Item name="enabled" label="Enabled" valuePropName="checked"><Switch /></Form.Item>
      <Button htmlType="submit">Save</Button>
    </Form>
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

    <section id="new-components">
      <ColorPicker defaultValue="#1677ff" showText />
      <DatePicker aria-label="Packed date" value={null} />
      <DatePicker.RangePicker value={null} needConfirm />
      <TimePicker aria-label="Packed time" defaultValue={null} minuteStep={15} />
      <Cascader aria-label="Packed cascader" options={[{ value:'p', label:'Parent', children:[{value:'leaf',label:'Leaf'}] }]} defaultValue={['p','leaf']} />
      <TreeSelect aria-label="Packed tree select" treeData={[{value:'leaf',title:'Tree leaf'}]} defaultValue="leaf" />
      <Transfer dataSource={[{key:'one',title:'Transfer one'}]} targetKeys={[]} />
      <Upload beforeUpload={() => Upload.LIST_IGNORE}><Button>Upload file</Button></Upload>
      <Upload.Dragger maxCount={2} multiple beforeUpload={() => false}>Drop local files</Upload.Dragger>
      <Calendar fullscreen={false} />
      <Tree treeData={[{key:'tree',title:'Standalone tree'}]} />
      <Table dataSource={[{key:'row',name:'Table row'}]} columns={[{title:'Name',dataIndex:'name'}]} pagination={false} />
    </section>
    <QRCode value="Packed" /><QRCode type="svg" value="Packed SVG" />
    <Tour open={false} steps={[{title:'Packed tour',description:'Ready'}]} />
    <NoticeConsumer />
    <Button type="primary">Packed consumer</Button>
    <Input defaultValue="Packed input" onChange={(event) => void event.target.value} />
    <Checkbox defaultChecked onChange={(event) => void event.target.checked}>Packed checkbox</Checkbox>
  </ConfigProvider>
  </StyleProvider>
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
import { StyleProvider } from 'antd-octane/style';
import { AutoComplete, Mentions, Affix, Alert, Anchor, App, Breadcrumb, Button, Checkbox, ConfigProvider, Divider, Drawer, Dropdown, Flex, FloatButton, Form, Icon, Input, InputNumber, Layout, Menu, Modal, Pagination, Popconfirm, Progress, Radio, Rate, Result, Row, Col, Select, Skeleton, Slider, Space, Spin, Splitter, Steps, Switch, Tabs, Typography, Watermark, message, notification, Carousel } from 'antd-octane';
import { Calendar, Cascader, ColorPicker, DatePicker, TimePicker, Transfer, TreeSelect, Tree, Table, Upload } from 'antd-octane';
import 'antd-octane/style.css';

function Page() @{
  const value$ = useSignal$('');
  const checked$ = useSignal$(false);
  const number$ = useSignal$(1);
  const current$ = useSignal$(1);
  const selected$ = useSignal$('first');
  const selectedMany$ = useSignal$<(string | number)[]>(['first']);
  const [messages, messageHolder] = message.useMessage();
  const [notifications, notificationHolder] = notification.useNotification();
  <StyleProvider layer><main>
    <Button id="signal-update" onClick={() => { value$.set('updated'); checked$.set(true); number$.set(3); current$.set(2); selected$.set('second'); selectedMany$.set(['first','second']); }}>Update</Button>
    <AutoComplete id="signal-autocomplete" value={value$.get()} onChange={(next) => value$.set(next)} options={[{value:"updated"}]} />
    <Mentions id="signal-mentions" value={value$.get()} onChange={(next) => value$.set(next)} options={[{value:"updated"}]} />
    <Input id="signal-input" value={value$.get()} onChange={(event) => value$.set(event.target.value)} />
    <Form initialValues={{user:{profile:'Signal form'}}}>
      <Form.Item name={['user','profile']} label="Profile" required><Input /></Form.Item>
    </Form>
    <Switch checked={checked$.get()} onChange={(next) => checked$.set(next)} />
    <Checkbox checked={checked$.get()} onChange={(event) => checked$.set(event.target.checked)}>checkable</Checkbox>
    <Radio checked={checked$.get()} onChange={(event) => checked$.set(event.target.checked)}>radio choice</Radio>
    <InputNumber value={number$.get()} onChange={(next) => number$.set(next ?? 0)} />
    <Select id="signal-select" options={[{value:'first',label:'First'},{value:'second',label:'Second'}]} value={selected$.get()} onChange={(next) => selected$.set(String(next ?? ''))} />
    <section id="signal-multiple"><Select mode="multiple" id="signal-multiple-input" options={[{value:'first',label:'First'},{value:'second',label:'Second'}]} value={selectedMany$.get()} onChange={(next) => selectedMany$.set(next)} allowClear /></section>
    <Rate value={number$.get()} onChange={(next) => number$.set(next)} />
    <Slider value={number$.get()} onChange={(next) => number$.set(Number(next))} />
    <Pagination current={current$.get()} total={50} onChange={(next) => current$.set(next)} />
    <Tabs activeKey={String(current$.get())} onChange={(key) => current$.set(Number(key))} items={[{ key: '1', label: 'First tab', children: 'first panel' }, { key: '2', label: 'Second tab', children: 'second panel' }]} />
    <section id="general">
      <FloatButton description="Quick" />
      <Icon viewBox="0 0 24 24"><path d="M2 12h20" /></Icon>
      <Typography.Text>typed text</Typography.Text>
    </section>
    <section id="compact"><Space.Compact><Space.Addon>Protocol</Space.Addon><Input /><Button>Compact submit</Button></Space.Compact></section>
    <section id="legacy-group"><ConfigProvider warning={{strict:false}}><Input.Group compact size="small"><Input id="signal-group-input" value={value$.get()} onChange={(event) => value$.set(event.target.value)} /></Input.Group></ConfigProvider></section>
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

    <section id="new-components">
      <ColorPicker defaultValue="#1677ff" showText />
      <DatePicker aria-label="Packed date" value={null} />
      <DatePicker.RangePicker value={null} needConfirm />
      <TimePicker aria-label="Packed time" defaultValue={null} minuteStep={15} />
      <Cascader aria-label="Packed cascader" options={[{ value:'p', label:'Parent', children:[{value:'leaf',label:'Leaf'}] }]} defaultValue={['p','leaf']} />
      <TreeSelect aria-label="Packed tree select" treeData={[{value:'leaf',title:'Tree leaf'}]} defaultValue="leaf" />
      <Transfer dataSource={[{key:'one',title:'Transfer one'}]} targetKeys={[]} />
      <Upload beforeUpload={() => Upload.LIST_IGNORE}><Button>Upload file</Button></Upload>
      <Upload.Dragger maxCount={2} multiple beforeUpload={() => false}>Drop local files</Upload.Dragger>
      <Calendar fullscreen={false} />
      <Tree treeData={[{key:'tree',title:'Standalone tree'}]} />
      <Table dataSource={[{key:'row',name:'Table row'}]} columns={[{title:'Name',dataIndex:'name'}]} pagination={false} />
    </section>
    <section id="other">
      <Affix><span>affix child</span></Affix>
      <App><span>app child</span></App>
      <ConfigProvider><span>config child</span></ConfigProvider>
    </section>
  </main></StyleProvider>
}

createRoot(document.getElementById('root')!).render(Page, {});
`,
  );
  writeFileSync(
    join(directory, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import { octane } from 'octane/compiler/vite';
import { antdOctane } from 'antd-octane/vite';
export default defineConfig({
  plugins: [octane(), antdOctane()],
  build: { target: 'es2022', rollupOptions: { input: { main: 'index.html', tsrx: 'tsrx.html' } } },
});`,
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
  for (const name of ['app','modal']) {
    if (!win.document.querySelector('style[data-ao-' + name + '-style]')?.textContent.startsWith('@layer antd')) throw new Error('Packed StyleProvider layer did not reach ' + name);
  }
  if (count('.ant-splitter-panel') !== 2) throw new Error('TSRX Splitter.Panel children missing');
  if (count('.ant-space-item') !== 2) throw new Error('TSRX Space children missing: count=' + count('.ant-space-item'));
  if (!win.document.querySelector('#compact')?.textContent.includes('Compact submit') || !win.document.querySelector('#compact')?.textContent.includes('Protocol')) throw new Error('TSRX Space.Compact/Addon children missing');
  const carousel = win.document.querySelector('.ant-carousel');
  if (!carousel?.textContent.includes('slide one') || !carousel.textContent.includes('slide two')) throw new Error('TSRX Carousel children missing');
  const text = win.document.body.textContent;
  for (const expected of ['typed text', 'divider content', 'flex child', 'grid child', 'layout header', 'layout content', 'Anchor target', 'Home', 'Current', 'Menu item', 'Start', 'alert content', 'result content', 'skeleton child', 'spin child', 'watermark child', 'affix child', 'app child', 'config child']) {
    if (!text.includes(expected)) throw new Error('TSRX component content missing: ' + expected);
  }
  for (const selector of ['.ant-color-picker', '.ao-single-picker', '.ao-range-picker', '.ant-cascader', '.ant-tree-select', '.ant-transfer', '.ant-upload', '.ant-picker-calendar', '.ant-tree', '.ant-table']) {
    if (!win.document.querySelector('#new-components ' + selector)) throw new Error('Packed new component missing: ' + selector);
  }
  if (win.document.querySelector('#new-components button button')) throw new Error('Upload nested interactive triggers');
  win.document.querySelector('#signal-update')?.click();
  await new Promise((done) => setTimeout(done, 30));
  if (win.document.querySelector('#signal-autocomplete')?.value !== 'updated') throw new Error('TSRX Signal-driven AutoComplete did not update');
  if (win.document.querySelector('#signal-mentions')?.value !== 'updated') throw new Error('TSRX Signal-driven Mentions did not update');
  const autoInput = win.document.querySelector('#signal-autocomplete');
  autoInput.value = 'free text';
  autoInput.dispatchEvent(new win.Event('input', {bubbles:true}));
  await new Promise((done) => setTimeout(done, 30));
  if (win.document.querySelector('#signal-input')?.value !== 'free text') throw new Error('TSRX AutoComplete free input did not update owner Signal');
  win.document.querySelector('#signal-update')?.click();
  await new Promise((done) => setTimeout(done, 30));
  if (win.document.querySelector('#signal-input')?.value !== 'updated') throw new Error('TSRX Signal-driven Input did not update');
  if (!win.document.querySelector('#legacy-group .ant-input-group-compact.ant-input-group-sm') || win.document.querySelector('#signal-group-input')?.value !== 'updated') throw new Error('Packed TSRX Input.Group did not preserve its Signal-driven child');
  if (win.document.querySelector('[role="switch"]')?.getAttribute('aria-checked') !== 'true') throw new Error('TSRX Signal-driven Switch did not update');
  if (!win.document.querySelector('.ant-checkbox input')?.checked) throw new Error('TSRX Signal-driven Checkbox did not update');
  if (!win.document.querySelector('.ant-radio input')?.checked) throw new Error('TSRX Signal-driven Radio did not update');
  if (win.document.querySelector('.ant-input-number-input')?.value !== '3') throw new Error('TSRX Signal-driven InputNumber did not update');
  if (win.document.querySelector('#signal-select')?.value !== 'Second') throw new Error('TSRX Signal-driven Select did not update');
  if (win.document.querySelector('.ant-rate')?.getAttribute('aria-valuenow') !== '3') throw new Error('TSRX Signal-driven Rate did not update');
  if (win.document.querySelector('.ant-slider [role="slider"]')?.getAttribute('aria-valuenow') !== '3') throw new Error('TSRX Signal-driven Slider did not update');
  if (win.document.querySelector('.ant-pagination-item-active')?.textContent.trim() !== '2') throw new Error('TSRX Signal-driven Pagination did not update');
  if (!win.document.querySelector('.ant-tabs-tab-active')?.textContent.includes('Second tab')) throw new Error('TSRX Signal-driven Tabs did not update');
  if (!win.document.querySelector('#feedback')?.textContent.includes('skeleton child')) throw new Error('TSRX feedback children missing');
  const multi = win.document.querySelector('#signal-multiple');
  if (multi?.querySelectorAll('.ant-select-selection-item').length !== 2) throw new Error('TSRX Signal-driven multiple Select did not update');
  multi.querySelector('[aria-label="移除 First"]')?.click();
  await new Promise((done) => setTimeout(done, 30));
  if (multi.querySelectorAll('.ant-select-selection-item').length !== 1 || multi.querySelector('.ant-select-selection-item-content')?.textContent !== 'Second') throw new Error('TSRX multiple Select removal did not update owner array');
  multi.querySelector('.ant-select-clear')?.click();
  await new Promise((done) => setTimeout(done, 30));
  if (multi.querySelectorAll('.ant-select-selection-item').length !== 0) throw new Error('TSRX multiple Select clear did not update owner array');
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
