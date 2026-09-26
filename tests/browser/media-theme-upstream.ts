import { Carousel, ConfigProvider, Image, theme } from "antd";
import { createElement as h } from "react";
import { createRoot } from "react-dom/client";
import { brand, component, src } from "./media-theme-cases";

const name = new URLSearchParams(location.search).get("theme");
const chosen =
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
if (!root) throw Error("Missing fixture root");
createRoot(root).render(
  h(
    ConfigProvider,
    { theme: chosen },
    h(
      "div",
      { className: "media-fixture" },
      h(Image, { src, width: 160, preview: { visible: true } }),
      h(
        Carousel,
        { arrows: true },
        h("div", { className: "fixture-slide" }, "One"),
        h("div", { className: "fixture-slide" }, "Two"),
      ),
    ),
  ),
);
