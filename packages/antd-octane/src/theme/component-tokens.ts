// Adapted from Ant Design 5.29.3, MIT © 2015-present Ant UED.
// Public component tokens; defaults are resolved by each native component.
// Source: components/*/style/index.ts at 14f397749dca177e5495dc9d1c2f7debfb639545.
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
