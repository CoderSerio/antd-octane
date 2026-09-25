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
    QRCode?: ComponentTheme;
    Tour?: ComponentTheme<{
      zIndexPopup: number;
      closeBtnSize: number;
      primaryPrevBtnBg: string;
      primaryNextBtnHoverBg: string;
    }>;
    Anchor?: ComponentTheme<{
      linkPaddingBlock: number;
      linkPaddingInlineStart: number;
    }>;
    Affix?: ComponentTheme<{ zIndexPopup: number }>;
    FloatButton?: ComponentTheme;
    Image?: ComponentTheme<{
      previewOperationColor: string;
      previewOperationColorDisabled: string;
      previewOperationHoverColor: string;
      previewOperationSize: number;
      previewOperationSizeZoom: number;
      previewOperationBg: string;
    }>;
    Carousel?: ComponentTheme<{
      dotWidth: number;
      dotHeight: number;
      dotActiveWidth: number;
      dotGap: number;
      arrowSize: number;
      arrowOffset: number;
    }>;
    Splitter?: ComponentTheme<{
      splitBarSize: number;
      splitTriggerSize: number;
      splitBarDraggableSize: number;
      resizeSpinnerSize: number;
    }>;

    Popconfirm?: ComponentTheme<{ zIndexPopup: number }>;
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
    Modal?: ComponentTheme<{
      contentBg: string;
      headerBg: string;
      titleColor: string;
      titleFontSize: number;
      titleLineHeight: number;
      footerBg: string;
    }>;
    Drawer?: ComponentTheme<{
      footerPaddingBlock: number;
      footerPaddingInline: number;
      zIndexPopup: number;
    }>;
    Message?: ComponentTheme<{
      contentBg: string;
      contentPadding: string | number;
      zIndexPopup: number;
    }>;
    Notification?: ComponentTheme<{ width: number; zIndexPopup: number }>;

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
    Tooltip?: ComponentTheme<{ zIndexPopup: number }>;
    Popover?: ComponentTheme<{
      zIndexPopup: number;
      titleMinWidth: number;
      innerPadding: number | string;
    }>;
    Progress?: ComponentTheme<{
      defaultColor: string;
      remainingColor: string;
      circleTextColor: string;
      circleTextFontSize: string;
      lineBorderRadius: number;
    }>;
    Result?: ComponentTheme<{
      titleFontSize: number;
      subtitleFontSize: number;
      iconFontSize: number;
      extraMargin: string;
    }>;
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
    Collapse?: ComponentTheme<{
      headerBg: string;
      headerPadding: string;
      contentBg: string;
      contentPadding: string;
      borderlessContentBg: string;
      borderlessContentPadding: string;
    }>;
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
    Statistic?: ComponentTheme<{
      titleFontSize: number;
      contentFontSize: number;
    }>;
    Timeline?: ComponentTheme<{
      tailColor: string;
      tailWidth: number;
      dotBorderWidth: number;
      dotBg: string;
      itemPaddingBottom: number;
    }>;
    Descriptions?: ComponentTheme<{
      labelColor: string;
      labelBg: string;
      contentColor: string;
      titleColor: string;
      titleMarginBottom: number;
      itemPaddingBottom: number;
      itemPaddingEnd: number;
    }>;
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
    Tag?: ComponentTheme<{ defaultBg: string; defaultColor: string }>;
    Alert?: ComponentTheme<{
      withDescriptionIconSize: number;
      defaultPadding: string;
      withDescriptionPadding: string;
    }>;
    Card?: ComponentTheme<{
      headerBg: string;
      headerFontSize: number;
      headerFontSizeSM: number;
      headerHeight: number;
      headerHeightSM: number;
      actionsBg: string;
      extraColor: string;
      bodyPadding: number;
      bodyPaddingSM: number;
      headerPadding: number;
      headerPaddingSM: number;
    }>;
    Badge?: ComponentTheme<{
      indicatorZIndex: string | number;
      indicatorHeight: number;
      indicatorHeightSM: number;
      dotSize: number;
      textFontSize: number;
      textFontSizeSM: number;
      textFontWeight: CSSProperties["fontWeight"];
      statusSize: number;
    }>;
    Avatar?: ComponentTheme<{
      containerSize: number;
      containerSizeLG: number;
      containerSizeSM: number;
      textFontSize: number;
      textFontSizeLG: number;
      textFontSizeSM: number;
      iconFontSize: number;
      iconFontSizeLG: number;
      iconFontSizeSM: number;
    }>;
    Typography?: ComponentTheme<{
      titleMarginTop: string | number;
      titleMarginBottom: string | number;
    }>;
    Segmented?: ComponentTheme<{
      trackPadding: number;
      trackBg: string;
      itemColor: string;
      itemHoverColor: string;
      itemHoverBg: string;
      itemSelectedBg: string;
      itemActiveBg: string;
      itemSelectedColor: string;
    }>;
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
    Skeleton?: ComponentTheme<{
      gradientFromColor: string;
      gradientToColor: string;
      color: string;
      colorGradientEnd: string;
      titleHeight: number;
      blockRadius: number;
      paragraphMarginTop: number;
      paragraphLiHeight: number;
    }>;
    List?: ComponentTheme<{
      contentWidth: number;
      itemPadding: string;
      itemPaddingSM: string;
      itemPaddingLG: string;
      headerBg: string;
      footerBg: string;
      emptyTextPadding: number;
      metaMarginBottom: number;
      avatarMarginRight: number;
      titleMarginBottom: number;
      descriptionFontSize: number;
    }>;
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
