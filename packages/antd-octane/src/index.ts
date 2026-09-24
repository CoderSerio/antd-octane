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
  ComponentTheme,
  InputToken,
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

export type {
  CheckboxChangeEvent,
  CheckboxProps,
  CheckboxRef,
} from "./checkbox";
export { Checkbox } from "./checkbox";
export type { DividerProps } from "./divider";
export { Divider } from "./divider";
export type { FlexProps } from "./flex";
export { Flex } from "./flex";
export type { InputChangeEvent, InputProps, InputRef } from "./input";
export { Input } from "./input";
export type { SpaceProps } from "./space";
export { Space } from "./space";
export type { SwitchProps } from "./switch";
export { Switch } from "./switch";
