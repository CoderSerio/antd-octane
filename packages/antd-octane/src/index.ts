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

export type { AlertProps, AlertRef } from "./alert";
export { Alert } from "./alert";
export type { AvatarProps, AvatarRef } from "./avatar";
export { Avatar } from "./avatar";
export type { BadgeProps } from "./badge";
export { Badge } from "./badge";
export type { CardMetaProps, CardProps } from "./card";
export { Card } from "./card";
export type {
  CheckboxChangeEvent,
  CheckboxGroupProps,
  CheckboxOption,
  CheckboxProps,
  CheckboxRef,
  CheckboxValue,
} from "./checkbox";
export { Checkbox } from "./checkbox";
export type { CollapseItem, CollapseProps } from "./collapse";
export { Collapse } from "./collapse";
export type { DescriptionsItem, DescriptionsProps } from "./descriptions";
export { Descriptions } from "./descriptions";
export type { DividerProps } from "./divider";
export { Divider } from "./divider";
export type { EmptyProps } from "./empty";
export { Empty } from "./empty";
export type { FlexProps } from "./flex";
export { Flex } from "./flex";
export type {
  Breakpoint,
  ColProps,
  ColSize,
  Responsive,
  RowProps,
  Screens,
} from "./grid";
export { Col, Grid, Row } from "./grid";
export type { InputChangeEvent, InputProps, InputRef } from "./input";
export { Input } from "./input";
export type { LayoutProps, SiderProps } from "./layout";
export { Layout } from "./layout";
export type {
  RadioChangeEvent,
  RadioGroupProps,
  RadioOption,
  RadioProps,
  RadioRef,
  RadioValue,
} from "./radio";
export { Radio } from "./radio";
export type { SpaceProps } from "./space";
export { Space } from "./space";
export type { StatisticProps } from "./statistic";
export { Statistic } from "./statistic";
export type { SwitchProps } from "./switch";
export { Switch } from "./switch";
export type { TabItem, TabsProps } from "./tabs";
export { Tabs } from "./tabs";
export type { CheckableTagProps, TagProps } from "./tag";
export { Tag } from "./tag";
export type { TimelineItem, TimelineProps } from "./timeline";
export { Timeline } from "./timeline";
