import "antd-octane/style.css";
import { createRoot } from "octane";
import { App } from "./App";
import { IsolatedDemo } from "./demo-frame";
import "./style.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
const demo = new URLSearchParams(location.search).get("demo");
const demos = import.meta.glob<{ default: () => unknown }>([
  "./demos/popconfirm/*.tsx",
  "./demos/alert/*.tsx",
]);
const renderer = createRoot(root);
if (demo && demos[`./demos/${demo}.tsx`]) {
  document.body.style.margin = "0";
  document.body.style.padding = "24px";
  void demos[`./demos/${demo}.tsx`]().then(({ default: Demo }) => {
    renderer.render(<IsolatedDemo Demo={Demo} />);
  });
} else renderer.render(<App />);
