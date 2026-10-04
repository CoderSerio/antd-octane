// Adapted from Ant Design 5.29.3, MIT © 2015-present Ant UED.
// Public component tokens; defaults are resolved by each native component.
// Source: components/*/style/index.ts at 14f397749dca177e5495dc9d1c2f7debfb639545.
import type { CSSProperties } from "octane";
// components/avatar/style/index.ts
export interface AvatarToken {
  /**
   * @desc 头像尺寸
   * @descEN Size of Avatar
   */
  containerSize: number;
  /**
   * @desc 大号头像尺寸
   * @descEN Size of large Avatar
   */
  containerSizeLG: number;
  /**
   * @desc 小号头像尺寸
   * @descEN Size of small Avatar
   */
  containerSizeSM: number;
  /**
   * @desc 头像文字大小
   * @descEN Font size of Avatar
   */
  textFontSize: number;
  /**
   * @desc 大号头像文字大小
   * @descEN Font size of large Avatar
   */
  textFontSizeLG: number;
  /**
   * @desc 小号头像文字大小
   * @descEN Font size of small Avatar
   */
  textFontSizeSM: number;
  /**
   * @desc 头像图标大小
   * @descEN Font size of Avatar icon
   */
  iconFontSize: number;
  /**
   * @desc 大号头像图标大小
   * @descEN Font size of large Avatar icon
   */
  iconFontSizeLG: number;
  /**
   * @desc 小号头像图标大小
   * @descEN Font size of small Avatar icon
   */
  iconFontSizeSM: number;
  /**
   * @desc 头像组间距
   * @descEN Spacing between avatars in a group
   */
  groupSpace: number;
  /**
   * @desc 头像组重叠宽度
   * @descEN Overlapping of avatars in a group
   */
  groupOverlapping: number;
  /**
   * @desc 头像组边框颜色
   * @descEN Border color of avatars in a group
   */
  groupBorderColor: string;
}

// components/badge/style/index.ts
/** Component only token. Which will handle additional calculation of alias token */
export interface BadgeToken {
  /**
   * @desc 徽标 z-index
   * @descEN z-index of badge
   */
  indicatorZIndex: number | string;
  /**
   * @desc 徽标高度
   * @descEN Height of badge
   */
  indicatorHeight: number | string;
  /**
   * @desc 小号徽标高度
   * @descEN Height of small badge
   */
  indicatorHeightSM: number | string;
  /**
   * @desc 点状徽标尺寸
   * @descEN Size of dot badge
   */
  dotSize: number;
  /**
   * @desc 徽标文本尺寸
   * @descEN Font size of badge text
   */
  textFontSize: number;
  /**
   * @desc 小号徽标文本尺寸
   * @descEN Font size of small badge text
   */
  textFontSizeSM: number;
  /**
   * @desc 徽标文本粗细
   * @descEN Font weight of badge text
   */
  textFontWeight: number | string;
  /**
   * @desc 状态徽标尺寸
   * @descEN Size of status badge
   */
  statusSize: number;
}

// components/calendar/style/index.ts
export interface CalendarToken {
  /**
   * @desc 年选择器宽度
   * @descEN Width of year select
   */
  yearControlWidth: number | string;
  /**
   * @desc 月选择器宽度
   * @descEN Width of month select
   */
  monthControlWidth: number | string;
  /**
   * @desc 迷你日历内容高度
   * @descEN Height of mini calendar content
   */
  miniContentHeight: number | string;
  /**
   * @desc 完整日历背景色
   * @descEN Background color of full calendar
   */
  fullBg: string;
  /**
   * @desc 完整日历面板背景色
   * @descEN Background color of full calendar panel
   */
  fullPanelBg: string;
  /**
   * @desc 日期项选中背景色
   * @descEN Background color of selected date item
   */
  itemActiveBg: string;
}

// components/card/style/index.ts
export interface CardToken {
  /**
   * @desc 卡片头部背景色
   * @descEN Background color of card header
   */
  headerBg: string;
  /**
   * @desc 卡片头部文字大小
   * @descEN Font size of card header
   */
  headerFontSize: number | string;
  /**
   * @desc 小号卡片头部文字大小
   * @descEN Font size of small card header
   */
  headerFontSizeSM: number | string;
  /**
   * @desc 卡片头部高度
   * @descEN Height of card header
   */
  headerHeight: number | string;
  /**
   * @desc 小号卡片头部高度
   * @descEN Height of small card header
   */
  headerHeightSM: number | string;
  /**
   * @desc 小号卡片内边距
   * @descEN Padding of small card body
   */
  bodyPaddingSM: number;
  /**
   * @desc 小号卡片头部内边距
   * @descEN Padding of small card head
   */
  headerPaddingSM: number;
  /**
   * @desc 卡片内边距
   * @descEN Padding of card body
   */
  bodyPadding: number;
  /**
   * @desc 卡片头部内边距
   * @descEN Padding of card head
   */
  headerPadding: number;
  /**
   * @desc 操作区背景色
   * @descEN Background color of card actions
   */
  actionsBg: string;
  /**
   * @desc 操作区每一项的外间距
   * @descEN Margin of each item in card actions
   */
  actionsLiMargin: string;
  /**
   * @desc 内置标签页组件下间距
   * @descEN Margin bottom of tabs component
   */
  tabsMarginBottom: number;
  /**
   * @desc 额外区文字颜色
   * @descEN Text color of extra area
   */
  extraColor: string;
}

// components/carousel/style/index.ts
export interface CarouselToken {
  /**
   * @desc 指示点宽度
   * @descEN Width of indicator
   */
  dotWidth: number | string;
  /**
   * @desc 指示点高度
   * @descEN Height of indicator
   */
  dotHeight: number | string;
  /**
   * @desc 指示点之间的间距
   * @descEN gap between indicator
   */
  dotGap: number;
  /**
   * @desc 指示点距离边缘的距离
   * @descEN dot offset to Carousel edge
   */
  dotOffset: number;
  /** @deprecated Use `dotActiveWidth` instead. */
  dotWidthActive: number;
  /**
   * @desc 激活态指示点宽度
   * @descEN Width of active indicator
   */
  dotActiveWidth: number | string;
  /**
   * @desc 切换箭头大小
   * @descEN Size of arrows
   */
  arrowSize: number;
  /**
   * @desc 切换箭头边距
   * @descEN arrows offset to Carousel edge
   */
  arrowOffset: number;
}

// components/collapse/style/index.ts
/** Component only token. Which will handle additional calculation of alias token */
export interface CollapseToken {
  /**
   * @desc 折叠面板头部内边距
   * @descEN Padding of header
   */
  headerPadding: CSSProperties["padding"];
  /**
   * @desc 折叠面板头部背景
   * @descEN Background of header
   */
  headerBg: string;
  /**
   * @desc 折叠面板内容内边距
   * @descEN Padding of content
   */
  contentPadding: CSSProperties["padding"];
  /**
   * @desc 折叠面板内容背景
   * @descEN Background of content
   */
  contentBg: string;
  /**
   * @desc 简约风格折叠面板的内容内边距
   * @descEN Padding of content in borderless style
   */
  borderlessContentPadding: CSSProperties["padding"];
  /**
   * @desc 简约风格折叠面板的内容背景
   * @descEN Background of content in borderless style
   */
  borderlessContentBg: string;
}

// components/descriptions/style/index.ts
/** Component only token. Which will handle additional calculation of alias token */
export interface DescriptionsToken {
  /**
   * @desc 标签背景色
   * @descEN Background color of label
   */
  labelBg: string;
  /**
   * @desc 标签文字颜色
   * @descEN Text color of label
   */
  labelColor: string;
  /**
   * @desc 标题文字颜色
   * @descEN Text color of title
   */
  titleColor: string;
  /**
   * @desc 标题下间距
   * @descEN Bottom margin of title
   */
  titleMarginBottom: number;
  /**
   * @desc 子项下间距
   * @descEN Bottom padding of item
   */
  itemPaddingBottom: number;
  /**
   * @desc 子项结束间距
   * @descEN End padding of item
   */
  itemPaddingEnd: number;
  /**
   * @desc 冒号右间距
   * @descEN Right margin of colon
   */
  colonMarginRight: number;
  /**
   * @desc 冒号左间距
   * @descEN Left margin of colon
   */
  colonMarginLeft: number;
  /**
   * @desc 内容区域文字颜色
   * @descEN Text color of content
   */
  contentColor: string;
  /**
   * @desc 额外区域文字颜色
   * @descEN Text color of extra area
   */
  extraColor: string;
}

// components/image/style/index.ts
export interface ImageToken {
  /**
   * @desc 预览浮层 z-index
   * @descEN z-index of preview popup
   */
  zIndexPopup: number;
  /**
   * @desc 预览操作图标大小
   * @descEN Size of preview operation icon
   */
  previewOperationSize: number;
  /**
   * @desc 预览操作图标颜色
   * @descEN Color of preview operation icon
   */
  previewOperationColor: string;
  /**
   * @desc 预览操作图标悬浮颜色
   * @descEN Color of hovered preview operation icon
   */
  previewOperationHoverColor: string;
  /**
   * @desc 预览操作图标禁用颜色
   * @descEN Disabled color of preview operation icon
   */
  previewOperationColorDisabled: string;
}

// components/list/style/index.ts
export interface ListToken {
  /**
   * @desc 内容宽度
   * @descEN Width of content
   */
  contentWidth: number | string;
  /**
   * @desc 大号列表项内间距
   * @descEN Padding of large item
   */
  itemPaddingLG: string;
  /**
   * @desc 小号列表项内间距
   * @descEN Padding of small item
   */
  itemPaddingSM: string;
  /**
   * @desc 列表项内间距
   * @descEN Padding of item
   */
  itemPadding: string;
  /**
   * @desc 头部区域背景色
   * @descEN Background color of header
   */
  headerBg: string;
  /**
   * @desc 底部区域背景色
   * @descEN Background color of footer
   */
  footerBg: string;
  /**
   * @desc 空文本内边距
   * @descEN Padding of empty text
   */
  emptyTextPadding: CSSProperties["padding"];
  /**
   * @desc Meta 下间距
   * @descEN Margin bottom of meta
   */
  metaMarginBottom: CSSProperties["marginBottom"];
  /**
   * @desc 头像右间距
   * @descEN Right margin of avatar
   */
  avatarMarginRight: CSSProperties["marginRight"];
  /**
   * @desc 标题下间距
   * @descEN Margin bottom of title
   */
  titleMarginBottom: CSSProperties["marginBottom"];
  /**
   * @desc 描述文字大小
   * @descEN Font size of description
   */
  descriptionFontSize: number;
}

// components/popover/style/index.ts
export interface PopoverToken {
  /**
   * @deprecated Please use `titleMinWidth` instead
   * @desc 气泡卡片宽度
   * @descEN Width of Popover
   */
  width?: number | string;
  /**
   * @deprecated Please use `titleMinWidth` instead
   * @desc 气泡卡片最小宽度
   * @descEN Min width of Popover
   */
  minWidth?: number | string;
  /**
   * @desc 气泡卡片标题最小宽度
   * @descEN Min width of Popover title
   */
  titleMinWidth: number | string;
  /**
   * @desc 气泡卡片 z-index
   * @descEN z-index of Popover
   */
  zIndexPopup: number;
}

// components/segmented/style/index.ts
export interface SegmentedToken {
  /**
   * @desc 选项文本颜色
   * @descEN Text color of item
   */
  itemColor: string;
  /**
   * @desc 选项悬浮态文本颜色
   * @descEN Text color of item when hover
   */
  itemHoverColor: string;
  /**
   * @desc 选项悬浮态背景颜色
   * @descEN Background color of item when hover
   */
  itemHoverBg: string;
  /**
   * @desc 选项激活态背景颜色
   * @descEN Background color of item when active
   */
  itemActiveBg: string;
  /**
   * @desc 选项选中时背景颜色
   * @descEN Background color of item when selected
   */
  itemSelectedBg: string;
  /**
   * @desc 选项选中时文字颜色
   * @descEN Text color of item when selected
   */
  itemSelectedColor: string;
  /**
   * @desc Segmented 控件容器的 padding
   * @descEN Padding of Segmented container
   */
  trackPadding: string | number;
  /**
   * @desc Segmented 控件容器背景色
   * @descEN Background of Segmented container
   */
  trackBg: string;
}
