/**
 * Prebundle the CommonJS dependencies of Octane's source-distributed components.
 * Keep the ordinary Day.js entry: applications and locale plugins must share it.
 * Vite merges this fragment with the application's existing optimizeDeps config.
 */
export function antdOctane() {
  return {
    name: "antd-octane:dependencies",
    apply: "serve",
    config() {
      return {
        optimizeDeps: {
          include: [
            "antd-octane > dayjs",
            "antd-octane > dayjs/plugin/advancedFormat",
            "antd-octane > dayjs/plugin/customParseFormat",
            "antd-octane > dayjs/plugin/localeData",
            "antd-octane > dayjs/plugin/weekday",
            "antd-octane > dayjs/plugin/weekOfYear",
            "antd-octane > dayjs/plugin/weekYear",
          ],
        },
      };
    },
  };
}
