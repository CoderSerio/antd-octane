import type { ButtonProps, InputProps, SwitchProps } from "antd";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Input,
  Radio,
  Switch,
  Tag,
  theme,
} from "antd";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import {
  brand,
  cases,
  checkboxCases,
  component,
  inputCases,
  switchCases,
} from "./cases";

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
    inputCases.map(({ id, props }) =>
      createElement(
        "div",
        { key: id, style: { padding: 12, width: 280 } },
        createElement(Input, {
          ...(props as InputProps),
          id,
          defaultValue: "Input",
        }),
      ),
    ),
    checkboxCases.map(({ id, props }) =>
      createElement(
        "div",
        { key: id, style: { padding: 12 } },
        createElement(Checkbox, { ...props, id }, "Checkbox"),
      ),
    ),
    switchCases.map(({ id, props }) =>
      createElement(
        "div",
        { key: id, style: { padding: 12 } },
        createElement(Switch, { ...(props as SwitchProps), id }),
      ),
    ),
    createElement(Divider, {
      className: "fixture-divider",
      ...{ id: "divider-default" },
    }),
    createElement(
      Divider,
      { className: "fixture-divider", ...{ id: "divider-text" } },
      "Title",
    ),
    createElement(
      "div",
      { "data-display": "radio" },
      createElement(Radio, { checked: true }, "Radio"),
    ),
    createElement(
      "div",
      { "data-display": "radio-button" },
      createElement(Radio.Group, {
        defaultValue: "a",
        optionType: "button",
        options: ["a", "b"],
      }),
    ),
    createElement(
      "div",
      { "data-display": "tag" },
      createElement(Tag, null, "Tag"),
    ),
    createElement(
      "div",
      { "data-display": "tag-success" },
      createElement(Tag, { color: "success" }, "Success"),
    ),
    createElement(
      "div",
      { "data-display": "tag-blue" },
      createElement(Tag, { color: "blue" }, "Blue"),
    ),
    createElement(
      "div",
      { "data-display": "alert" },
      createElement(Alert, { message: "Message", type: "success" }),
    ),
    createElement(
      "div",
      { "data-display": "alert-description" },
      createElement(Alert, {
        message: "Message",
        description: "Description",
        showIcon: true,
      }),
    ),
    createElement(
      "div",
      { "data-display": "card" },
      createElement(Card, { title: "Title" }, "Body"),
    ),
    createElement(
      "div",
      { "data-display": "card-small" },
      createElement(Card, { title: "Title", size: "small" }, "Body"),
    ),
    createElement(
      "div",
      { "data-display": "badge" },
      createElement(Badge, { count: 5 }),
    ),
    createElement(
      "div",
      { "data-display": "avatar" },
      createElement(Avatar, null, "O"),
    ),
    createElement(
      "div",
      { "data-display": "avatar-large" },
      createElement(Avatar, { size: "large", shape: "square" }, "O"),
    ),
  ),
);
