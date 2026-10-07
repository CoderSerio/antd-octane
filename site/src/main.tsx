import "antd-octane/style.css";
import { createRoot } from "octane";
import { App } from "./App";
import "./style.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
createRoot(root).render(<App />);
