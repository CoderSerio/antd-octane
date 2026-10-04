import { useToken } from "./config-provider";
import {
  compactAlgorithm,
  darkAlgorithm,
  defaultAlgorithm,
  getDesignToken,
} from "./theme/resolve";

export type {
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteRef,
} from "./auto-complete";
export { AutoComplete } from "./auto-complete";
export type { ButtonProps, ButtonRef } from "./button";
export { Button } from "./button";
export type { ConfigProviderProps } from "./config-provider";
export { ConfigProvider } from "./config-provider";
export type {
  FormFieldError,
  FormInstance,
  FormItemProps,
  FormProps,
  FormRule,
  FormValidationError,
  FormValues,
} from "./form";
export { Form } from "./form";
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

export type { FloatingProps, Placement, Trigger } from "./_util/floating";
export type { AffixProps, AffixRef } from "./affix";
export { Affix } from "./affix";
export type { AlertProps, AlertRef } from "./alert";
export { Alert } from "./alert";
export type { AnchorItem, AnchorProps } from "./anchor";
export { Anchor } from "./anchor";
export type { AppContextValue, AppProps } from "./app";
export { App } from "./app";
export type {
  AvatarGroupProps,
  AvatarProps,
  AvatarRef,
  AvatarSize,
} from "./avatar";
export { Avatar } from "./avatar";
export type { BadgeProps, BadgeRibbonProps, ScrollNumberProps } from "./badge";
export { Badge } from "./badge";
export type { BreadcrumbItem, BreadcrumbProps } from "./breadcrumb";
export { Breadcrumb } from "./breadcrumb";
export type {
  CalendarCellInfo,
  CalendarGenerateConfig,
  CalendarHeaderRender,
  CalendarLocale,
  CalendarLocaleLang,
  CalendarMode,
  CalendarProps,
  CalendarSelectInfo,
  CalendarSelectSource,
} from "./calendar";
export { Calendar } from "./calendar";
export type { CardMetaProps, CardProps } from "./card";
export { Card } from "./card";
export type { CarouselProps, CarouselRef } from "./carousel";
export { Carousel } from "./carousel";
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
export type { DrawerProps } from "./drawer";
export { Drawer } from "./drawer";
export type { DropdownProps } from "./dropdown";
export { Dropdown } from "./dropdown";
export type { EmptyProps } from "./empty";
export { Empty } from "./empty";
export type { FlexProps } from "./flex";
export { Flex } from "./flex";
export type {
  BackTopProps,
  FloatButtonGroupProps,
  FloatButtonProps,
} from "./float-button";
export { FloatButton } from "./float-button";
export type {
  Breakpoint,
  ColProps,
  ColSize,
  Responsive,
  RowProps,
  Screens,
} from "./grid";
export { Col, Grid, Row } from "./grid";
export type { IconDefinition, IconNode, IconProps } from "./icon";
export { createIcon, Icon } from "./icon";
export type {
  ImagePreviewConfig,
  ImagePreviewGroupProps,
  ImageProps,
} from "./image";
export { Image } from "./image";
export type {
  InputChangeEvent,
  InputProps,
  InputRef,
  PasswordProps,
  SearchProps,
  TextAreaChangeEvent,
  TextAreaProps,
  TextAreaRef,
} from "./input";
export { Input } from "./input";
export type { InputNumberProps, InputNumberRef } from "./input-number";
export { InputNumber } from "./input-number";
export type { LayoutProps, SiderProps } from "./layout";
export { Layout } from "./layout";
export type { ListItemMetaProps, ListItemProps, ListProps } from "./list";
export { List } from "./list";
export type { MenuInfo, MenuItem, MenuProps } from "./menu";
export { Menu } from "./menu";
export type {
  MessageArgs,
  MessageConfig,
  MessageInstance,
  MessageType,
} from "./message";
export { message, useMessage } from "./message";
export type { ModalProps } from "./modal";
export { Modal } from "./modal";
export type {
  NotificationArgs,
  NotificationConfig,
  NotificationInstance,
  NotificationPlacement,
} from "./notification";
export { notification, useNotification } from "./notification";
export type { PaginationProps } from "./pagination";
export { Pagination } from "./pagination";
export type { PopconfirmProps } from "./popconfirm";
export { Popconfirm } from "./popconfirm";
export type { PopoverProps } from "./popover";
export { Popover } from "./popover";
export type { ProgressGradient, ProgressProps } from "./progress";
export { Progress } from "./progress";
export type { QRCodeProps } from "./qr-code";
export { QRCode } from "./qr-code";
export type {
  RadioChangeEvent,
  RadioGroupProps,
  RadioOption,
  RadioProps,
  RadioRef,
  RadioValue,
} from "./radio";
export { Radio } from "./radio";
export type { RateProps } from "./rate";
export { Rate } from "./rate";
export type { ResultProps } from "./result";
export { Result } from "./result";
export type {
  SegmentedOption,
  SegmentedProps,
  SegmentedValue,
} from "./segmented";
export { Segmented } from "./segmented";
export type {
  MultipleSelectProps,
  SelectComponentProps,
  SelectOption,
  SelectProps,
  SelectRef,
  SelectValue,
} from "./select";
export { Select } from "./select";
export type { SkeletonElementProps, SkeletonProps } from "./skeleton";
export { Skeleton } from "./skeleton";
export type { SliderMark, SliderProps, SliderValue } from "./slider";
export { Slider } from "./slider";
export type { SpaceAddonProps, SpaceCompactProps, SpaceProps } from "./space";
export { Space } from "./space";
export type { SpinProps } from "./spin";
export { Spin } from "./spin";
export type { PanelProps, SplitterProps } from "./splitter";
export { Splitter } from "./splitter";
export type { StatisticProps } from "./statistic";
export { Statistic } from "./statistic";
export type { StepItem, StepStatus, StepsProps } from "./steps";
export { Steps } from "./steps";
export type { SwitchProps } from "./switch";
export { Switch } from "./switch";
export type { TabItem, TabsProps } from "./tabs";
export { Tabs } from "./tabs";
export type { CheckableTagProps, TagProps } from "./tag";
export { Tag } from "./tag";
export type { TimelineItem, TimelineProps } from "./timeline";
export { Timeline } from "./timeline";
export type { TooltipProps } from "./tooltip";
export { Tooltip } from "./tooltip";
export type { TourProps, TourStepProps } from "./tour";
export { Tour } from "./tour";
export type {
  CopyConfig,
  EditConfig,
  EllipsisConfig,
  LinkProps,
  TitleProps,
  TypographyProps,
} from "./typography";
export { Typography } from "./typography";
export type { WatermarkProps } from "./watermark";
export { Watermark } from "./watermark";
