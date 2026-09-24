import { useToken } from "./config-provider";
import {
  compactAlgorithm,
  darkAlgorithm,
  defaultAlgorithm,
  getDesignToken,
} from "./theme/resolve";

export type { ButtonProps, ButtonRef } from "./button";
export { Button } from "./button";
export type { ConfigProviderProps } from "./config-provider";
export { ConfigProvider } from "./config-provider";
export type {
  AliasToken,
  ButtonToken,
  MappingAlgorithm,
  MapToken,
  SeedToken,
  ThemeConfig,
} from "./theme/types";
export const theme = {
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
  getDesignToken,
  useToken,
};
