export {};

if (new URLSearchParams(location.search).get("renderer") === "antd")
  await import("./media-theme-upstream");
else await import("./media-theme-native");
