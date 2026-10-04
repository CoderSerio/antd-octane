import type {
  AvatarToken,
  BadgeToken,
  CalendarToken,
  CardToken,
  CarouselToken,
  CollapseToken,
  DescriptionsToken,
  ImageToken,
  ListToken,
  PopoverToken,
  SegmentedToken,
  StatisticToken,
  TableToken,
  TagToken,
  TimelineToken,
  TooltipToken,
  TourToken,
  TreeToken,
  AlertToken,
  DrawerToken,
  MessageToken,
  ModalToken,
  NotificationToken,
  PopconfirmToken,
  ProgressToken,
  ResultToken,
  SkeletonToken,
} from "./component-tokens";

export type * from "./component-tokens";

import type { CSSProperties } from "octane";
import type { AliasToken, MapToken, SeedToken } from "./vendor/interface";

export type { AliasToken, MapToken, SeedToken };
export type MappingAlgorithm = (
  seed: SeedToken,
  previous?: MapToken,
) => MapToken;

/** Supported Button component tokens in the first alpha. */
export interface ButtonToken {
  fontWeight: CSSProperties["fontWeight"];
  iconGap: number;
  defaultShadow: string;
  primaryShadow: string;
  dangerShadow: string;
  primaryColor: string;
  dangerColor: string;
  defaultColor: string;
  defaultBg: string;
  defaultBorderColor: string;
  defaultHoverBg: string;
  defaultHoverColor: string;
  defaultHoverBorderColor: string;
  defaultActiveBg: string;
  defaultActiveColor: string;
  defaultActiveBorderColor: string;
  borderColorDisabled: string;
  defaultGhostColor: string;
  defaultGhostBorderColor: string;
  ghostBg: string;
  paddingInline: number;
  paddingInlineLG: number;
  paddingInlineSM: number;
  contentFontSize: number;
  contentFontSizeLG: number;
  contentFontSizeSM: number;
  textTextColor: string;
  textTextHoverColor: string;
  textTextActiveColor: string;
  textHoverBg: string;
  linkHoverBg: string;
}

export type ButtonTheme = Partial<AliasToken & ButtonToken> & {
  algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
};
export interface InputToken {
  paddingBlock: number;
  paddingBlockSM: number;
  paddingBlockLG: number;
  paddingInline: number;
  paddingInlineSM: number;
  paddingInlineLG: number;
  activeBorderColor: string;
  hoverBorderColor: string;
  activeShadow: string;
  errorActiveShadow: string;
  warningActiveShadow: string;
  hoverBg: string;
  activeBg: string;
  inputFontSize: number;
  inputFontSizeSM: number;
  inputFontSizeLG: number;
}
export type ComponentTheme<T = object> = Partial<AliasToken & T> & {
  algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
};
export interface ThemeConfig {
  token?: Partial<AliasToken>;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  components?: {
    Table?: ComponentTheme<TableToken>;
    Tree?: ComponentTheme<TreeToken>;
    Select?: ComponentTheme<{ zIndexPopup: number }>;
    QRCode?: ComponentTheme;
    Tour?: ComponentTheme<TourToken>;
    Anchor?: ComponentTheme<{
      linkPaddingBlock: number;
      linkPaddingInlineStart: number;
    }>;
    Affix?: ComponentTheme<{ zIndexPopup: number }>;
    FloatButton?: ComponentTheme;
    Image?: ComponentTheme<
      ImageToken & {
        previewOperationSizeZoom: number;
        previewOperationBg: string;
      }
    >;
    Carousel?: ComponentTheme<CarouselToken>;
    Splitter?: ComponentTheme<{
      splitBarSize: number;
      splitTriggerSize: number;
      splitBarDraggableSize: number;
      resizeSpinnerSize: number;
    }>;

    Popconfirm?: ComponentTheme<PopconfirmToken>;
    Menu?: ComponentTheme<{
      itemColor: string;
      itemBg: string;
      itemHoverColor: string;
      itemHoverBg: string;
      itemSelectedColor: string;
      itemSelectedBg: string;
      itemDisabledColor: string;
      itemHeight: number;
      itemMarginInline: number;
      itemMarginBlock: number;
      itemBorderRadius: number;
      subMenuItemBg: string;
      groupTitleColor: string;
      iconSize: number;
      dangerItemColor: string;
    }>;
    Dropdown?: ComponentTheme<{
      paddingBlock: number;
      controlItemBgActive: string;
      zIndexPopup: number;
    }>;
    Modal?: ComponentTheme<ModalToken>;
    Drawer?: ComponentTheme<DrawerToken>;
    Message?: ComponentTheme<MessageToken>;
    Notification?: ComponentTheme<NotificationToken>;

    InputNumber?: ComponentTheme<
      InputToken & {
        controlWidth: number;
        handleWidth: number;
        handleFontSize: number;
        handleVisible: true | "auto";
        handleActiveBg: string;
        handleBg: string;
        handleHoverColor: string;
        handleBorderColor: string;
      }
    >;
    Slider?: ComponentTheme<{
      controlSize: number;
      railSize: number;
      handleSize: number;
      handleSizeHover: number;
      handleLineWidth: number;
      handleLineWidthHover: number;
      railBg: string;
      railHoverBg: string;
      trackBg: string;
      trackHoverBg: string;
      handleColor: string;
      handleActiveColor: string;
      handleActiveOutlineColor: string;
      handleColorDisabled: string;
      dotSize: number;
      dotBorderColor: string;
      dotActiveBorderColor: string;
      trackBgDisabled: string;
    }>;
    Tooltip?: ComponentTheme<TooltipToken>;
    Popover?: ComponentTheme<PopoverToken & { innerPadding: number | string }>;
    Progress?: ComponentTheme<ProgressToken>;
    Result?: ComponentTheme<ResultToken>;
    Breadcrumb?: ComponentTheme<{
      itemColor: string;
      lastItemColor: string;
      linkColor: string;
      linkHoverColor: string;
      separatorColor: string;
      separatorMargin: number;
    }>;
    Steps?: ComponentTheme<{
      iconSize: number;
      iconSizeSM: number;
      descriptionMaxWidth: number;
    }>;
    Pagination?: ComponentTheme<{
      itemSize: number;
      itemSizeSM: number;
      itemBg: string;
      itemActiveBg: string;
    }>;
    Button?: ButtonTheme;
    Input?: ComponentTheme<InputToken>;
    Checkbox?: ComponentTheme;
    Layout?: ComponentTheme<{
      bodyBg: string;
      headerBg: string;
      headerHeight: number;
      headerPadding: string;
      headerColor: string;
      footerBg: string;
      footerPadding: string;
      siderBg: string;
      triggerHeight: number;
      triggerBg: string;
      triggerColor: string;
      lightSiderBg: string;
      lightTriggerBg: string;
      lightTriggerColor: string;
    }>;
    Collapse?: ComponentTheme<CollapseToken>;
    Tabs?: ComponentTheme<{
      horizontalMargin: string;
      horizontalItemGutter: number;
      itemColor: string;
      itemSelectedColor: string;
      itemHoverColor: string;
      itemActiveColor: string;
      inkBarColor: string;
      titleFontSize: number;
      titleFontSizeSM: number;
      titleFontSizeLG: number;
      horizontalItemPadding: string;
      horizontalItemPaddingSM: string;
      horizontalItemPaddingLG: string;
      cardBg: string;
      cardPadding: string;
    }>;
    Empty?: ComponentTheme;
    Statistic?: ComponentTheme<StatisticToken>;
    Timeline?: ComponentTheme<TimelineToken>;
    Descriptions?: ComponentTheme<DescriptionsToken>;
    Radio?: ComponentTheme<{
      radioSize: number;
      dotSize: number;
      dotColorDisabled: string;
      buttonBg: string;
      buttonCheckedBg: string;
      buttonColor: string;
      buttonSolidCheckedColor: string;
      buttonSolidCheckedBg: string;
      buttonSolidCheckedHoverBg: string;
      buttonSolidCheckedActiveBg: string;
      buttonPaddingInline: number;
      wrapperMarginInlineEnd: number;
    }>;
    Tag?: ComponentTheme<TagToken>;
    Alert?: ComponentTheme<AlertToken>;
    Card?: ComponentTheme<CardToken>;
    Badge?: ComponentTheme<BadgeToken>;
    Calendar?: ComponentTheme<CalendarToken>;
    Avatar?: ComponentTheme<AvatarToken>;
    Typography?: ComponentTheme<{
      titleMarginTop: string | number;
      titleMarginBottom: string | number;
    }>;
    Segmented?: ComponentTheme<SegmentedToken>;
    Rate?: ComponentTheme<{
      starColor: string;
      starSize: number;
      starHoverScale: string;
      starBg: string;
    }>;
    Spin?: ComponentTheme<{
      dotSize: number;
      dotSizeSM: number;
      dotSizeLG: number;
      contentHeight: number;
    }>;
    Skeleton?: ComponentTheme<
      SkeletonToken & { color: string; colorGradientEnd: string }
    >;
    List?: ComponentTheme<ListToken>;
    Divider?: ComponentTheme<{
      textPaddingInline: string | number;
      orientationMargin: number;
      verticalMarginInline: number;
    }>;
    Switch?: ComponentTheme<{
      trackHeight: number;
      trackHeightSM: number;
      trackMinWidth: number;
      trackMinWidthSM: number;
      trackPadding: number;
      handleSize: number;
      handleSizeSM: number;
      handleBg: string;
      handleShadow: string;
    }>;
  };
  inherit?: boolean;
}
