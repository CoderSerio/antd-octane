import type { ButtonProps, InputProps, SwitchProps } from "antd";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  Descriptions,
  Divider,
  Empty,
  Input,
  Layout,
  List,
  Pagination,
  Progress,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Skeleton,
  Spin,
  Statistic,
  Steps,
  Switch,
  Tabs,
  Tag,
  Timeline,
  Typography,
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
    createElement(
      "div",
      { "data-controls": "segmented" },
      createElement(Segmented, {
        options: ["Day", "Week", "Month"],
        defaultValue: "Week",
      }),
    ),
    createElement(
      "div",
      { "data-controls": "rate" },
      createElement(Rate, { defaultValue: 3 }),
    ),
    createElement(
      "div",
      { "data-controls": "breadcrumb" },
      createElement(Breadcrumb, {
        items: [
          { title: "Home", href: "#" },
          { title: "App" },
          { title: "Details" },
        ],
      }),
    ),
    createElement(
      "div",
      { "data-controls": "pagination" },
      createElement(Pagination, { total: 50, defaultCurrent: 2 }),
    ),
    createElement(
      "div",
      { "data-controls": "steps" },
      createElement(Steps, {
        current: 1,
        items: [{ title: "First" }, { title: "Second" }, { title: "Last" }],
      }),
    ),

    createElement("div", { "data-feedback": "spin" }, createElement(Spin)),
    createElement(
      "div",
      { "data-feedback": "skeleton" },
      createElement(Skeleton),
    ),
    createElement(
      "div",
      { "data-feedback": "progress" },
      createElement(Progress, { percent: 40 }),
    ),
    createElement(
      "div",
      { "data-feedback": "result" },
      createElement(Result, {
        status: "success",
        title: "Completed",
        subTitle: "Saved successfully",
      }),
    ),

    createElement(
      "div",
      { "data-content": "text" },
      createElement(Typography.Text, null, "Text"),
    ),
    createElement(
      "div",
      { "data-content": "heading" },
      createElement(Typography.Title, { level: 3 }, "Heading"),
    ),
    createElement(
      "div",
      { "data-content": "paragraph" },
      createElement(Typography.Paragraph, null, "Paragraph"),
    ),
    createElement(
      "div",
      { "data-content": "list" },
      createElement(List, {
        bordered: true,
        header: "Header",
        footer: "Footer",
        dataSource: ["First", "Second"],
        renderItem: (item) =>
          createElement(
            List.Item,
            null,
            createElement(List.Item.Meta, {
              title: String(item),
              description: "Description",
            }),
          ),
      }),
    ),
    createElement(
      "div",
      { "data-content": "small" },
      createElement(List, {
        bordered: true,
        size: "small",
        dataSource: ["Small"],
        renderItem: (item) => createElement(List.Item, null, String(item)),
      }),
    ),

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
    createElement(
      "div",
      { "data-layout": "row" },
      createElement(
        Row,
        { gutter: 16 },
        createElement(Col, { span: 12 }, "A"),
        createElement(Col, { span: 12 }, "B"),
      ),
    ),
    createElement(
      "div",
      { "data-layout": "layout" },
      createElement(
        Layout,
        null,
        createElement(Layout.Header, null, "Header"),
        createElement(Layout.Content, null, "Content"),
        createElement(Layout.Footer, null, "Footer"),
      ),
    ),
    createElement(
      "div",
      { "data-layout": "collapse" },
      createElement(Collapse, {
        defaultActiveKey: ["one"],
        items: [
          { key: "one", label: "Label", children: "Content" },
          { key: "two", label: "Label 2", children: "Content 2" },
        ],
      }),
    ),
    createElement(
      "div",
      { "data-layout": "tabs" },
      createElement(Tabs, {
        items: [
          { key: "one", label: "First", children: "Content" },
          { key: "two", label: "Second", children: "Second content" },
        ],
      }),
    ),
    createElement(
      "div",
      { "data-layout": "empty" },
      createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
    ),
    createElement(
      "div",
      { "data-layout": "statistic" },
      createElement(Statistic, {
        title: "Statistic",
        value: 1234.56,
        precision: 2,
      }),
    ),
    createElement(
      "div",
      { "data-layout": "timeline" },
      createElement(Timeline, {
        items: [{ children: "First" }, { children: "Second" }],
      }),
    ),
    createElement(
      "div",
      { "data-layout": "descriptions" },
      createElement(Descriptions, {
        bordered: true,
        title: "Details",
        items: [
          { key: "a", label: "A", children: "One" },
          { key: "b", label: "B", children: "Two" },
          { key: "c", label: "C", children: "Three" },
        ],
      }),
    ),
  ),
);
