// Declare the site's cascade layers before component styles introduce `antd`.
import "./style.css";
import "antd-octane/style.css";
import { createRoot } from "octane";
import { App } from "./App";
import { IsolatedDemo } from "./demo-frame";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
const demo = new URLSearchParams(location.search).get("demo");
const demos = import.meta.glob<{ default: () => unknown }>([
  "./demos/popconfirm/*.tsx",
  "./demos/alert/*.tsx",
  "./demos/anchor/*.tsx",
  "./demos/layout-side.tsx",
  "./demos/layout-fixed.tsx",
  "./demos/layout-fixed-sider.tsx",
]);
const renderer = createRoot(root);
if (import.meta.env.DEV && demo?.startsWith("development/")) {
  document.body.style.margin = "0";
  document.body.className = demo.startsWith("development/layout/")
    ? "development-demo layout-demo-frame"
    : "development-demo";
  void import("./development/layout-navigation").then(
    async ({ loadIsolatedExample }) => {
      const example = loadIsolatedExample(demo.slice("development/".length));
      if (!example) throw new Error(`Missing development demo: ${demo}`);
      const { default: Component } = await example;
      renderer.render(<IsolatedDemo Demo={() => <Component />} />);
    },
  );
} else if (demo && demos[`./demos/${demo}.tsx`]) {
  document.body.style.margin = "0";
  const viewportDemo = demo.startsWith("layout-") || demo.startsWith("anchor/");
  document.body.style.padding = viewportDemo ? "0" : "24px";
  if (demo.startsWith("anchor/")) document.body.style.overflowX = "hidden";
  if (demo.startsWith("layout-")) document.body.className = "layout-demo-frame";
  void demos[`./demos/${demo}.tsx`]().then(({ default: Demo }) => {
    renderer.render(<IsolatedDemo Demo={Demo} />);
  });
} else renderer.render(<App />);
