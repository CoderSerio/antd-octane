import packageSource from "../package.json?raw";

// The site pins its published component dependency, independently of workspace source.
export const siteVersion: string =
  JSON.parse(packageSource).dependencies["antd-octane"];
