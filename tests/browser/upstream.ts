import type { ButtonProps } from "antd";
import { Button, ConfigProvider, theme } from "antd";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { brand, cases, component } from "./cases";

const name = new URLSearchParams(location.search).get("theme");
const config =
  name === "dark"
    ? { algorithm: theme.darkAlgorithm }
    : name === "compact"
      ? { algorithm: theme.compactAlgorithm }
      : name === "brand"
        ? brand
        : name === "component"
          ? component
          : {};
const root = document.getElementById("root");
if (!root) throw new Error("Missing fixture root");
createRoot(root).render(
  createElement(
    ConfigProvider,
    { theme: config },
    cases.map(({ id, props }) =>
      createElement(
        "div",
        { key: id, style: { padding: 12 } },
        createElement(Button, { ...(props as ButtonProps), id }, "Button"),
      ),
    ),
  ),
);
