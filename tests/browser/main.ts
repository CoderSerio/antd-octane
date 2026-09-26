export {};

if (new URLSearchParams(location.search).get("renderer") === "antd") {
  await import("./upstream");
} else {
  await import("./native");
}
