/** biome-ignore-all lint/a11y/useValidAnchor: Preserve the upstream demonstration trigger links. */
// Adapted from Ant Design 5.29.3 (MIT), components/breadcrumb/demo/overlay.tsx.
import { Breadcrumb } from "antd-octane";

const menuItems = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        General
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.taobao.com/"
      >
        Layout
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Navigation
      </a>
    ),
  },
];

const App = () => (
  <Breadcrumb
    items={[
      {
        title: "Ant Design",
      },
      {
        title: <a href="#">Component</a>,
      },
      {
        title: <a href="#">General</a>,
        menu: { items: menuItems },
      },
      {
        title: "Button",
      },
    ]}
  />
);

export default App;
