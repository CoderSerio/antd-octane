/** Component implementation differences, kept outside upstream reference pages. */
export function ComponentCompatibilityNotes() {
  return (
    <>

      <details>
        <summary>Badge</summary>
        <p>
          支持 indicatorHeight / SM、dotSize、textFontSize /
          SM、textFontWeight、statusSize、indicatorZIndex。color 支持 antd
          预设颜色名和 CSS 颜色。整数 count
          使用逐位滚动；显隐动画保留最后一个可见数字和点形态。 支持
          ConfigProvider.badge 的 className、style、classNames、styles 与 RTL。
          自定义 count 节点保留原有样式，style 的 borderColor 可用于内描边。
        </p>
      </details>
      <details>
        <summary>Calendar</summary>
        <p>
          默认接受 Dayjs 日期；Calendar.generateCalendar(generateConfig)
          可生成使用 自定义日期类型的日历，adapter
          的读取、计算、比较、格式化和周数接口与 rc-picker 的 GenerateConfig
          一致。支持受控/非受控日期和面板、有效范围、
          禁用日期、单元格与头部渲染，以及 ConfigProvider 的 locale、direction、
          prefixCls 和 Calendar 样式配置。默认头部使用原生 Octane 的 Select 与
          Radio.Group。支持
          fullBg、fullPanelBg、itemActiveBg、miniContentHeight、
          monthControlWidth 和 yearControlWidth 组件 token，窄屏布局使用主题
          screenXS。 日期与月份单元格沿用 rc-picker
          的点击选择路径，没有单元格方向键导航。 自定义日期库需提供完整
          adapter，相关语言数据应由日期库加载；此 Alpha 版本不代表完整
          API、视觉或无障碍认证。
        </p>
      </details>
      <details>
        <summary>Card</summary>
        <p>
          支持头部背景/字号/高度/内边距、内容内边距、actionsBg、extraColor 组件
          token。保留 headStyle / bodyStyle。Card 的页签配置映射到 Octane Tabs
          支持的参数，tabBarExtraContent 保留左右位置。支持 ConfigProvider.card
          样式、语义化配置与 variant，组件 props 优先；未显式指定 variant 时继承
          Form.variant，再继承组件和全局配置。Card ref 指向外层 div。
        </p>
      </details>
      <details>
        <summary>Carousel</summary>
        <p>
          支持 antd 5 的 Carousel 参数、组件 Token
          和方法，原生实现多面板、分组滚动、 centerMode、variableWidth、rows /
          slidesPerRow、responsive（含 unslick）、
          克隆循环、渐显、纵向、RTL、触摸 / 鼠标拖拽、自动播放、懒加载及联动。
          customPaging、appendDots、自定义箭头接收 Octane 节点；通过
          ref.innerSlider 可访问 list、track、导航与播放控制。非当前面板
          inert，避免键盘进入屏外内容。 内部对象使用原生 DOM 与 Octane
          状态，不是 react-slick 的 React 实例。 CSS 与布局基于 antd 5
          源码，但任意自定义子组件的几何布局、SSR / hydration
          和跨浏览器拖拽尚需进一步验证。
        </p>
      </details>
      <details>
        <summary>Collapse</summary>
        <p>
          支持 headerBg、headerPadding、contentBg、contentPadding 和
          borderlessContent 系列
          token。默认首次打开才挂载，关闭后保留；destroyOnHidden 可销毁。支持
          Collapse.Panel、面板级 styles/classNames、ref、单项销毁和
          onItemClick。展开/收起使用高度与透明度过渡，theme.token.motion=false
          时即时切换。默认点击整个头部；collapsible="header"
          限定到标题和箭头，collapsible="icon" 限定到箭头。
        </p>
      </details>

      <details>
        <summary>Descriptions</summary>
        <p>
          支持
          labelBg、labelColor、contentColor、titleColor、titleMarginBottom、itemPaddingBottom、itemPaddingEnd。支持
          root/header/title/extra/label/content 语义化 styles/classNames。支持
          Descriptions.Item、响应式 span 以及各项的 label/content 样式。column
          的局部响应式配置合并默认断点，filled 和每行末项补齐剩余列。支持
          ConfigProvider.descriptions
          的样式及语义化配置，组件和子项样式依次覆盖。
        </p>
      </details>

      <details>
        <summary>Empty</summary>
        <p>
          支持全局颜色、字体与间距 token。PRESENTED_IMAGE_SIMPLE
          提供上游小图示，默认插画和小图示均采用 antd 5.29.3 的 SVG。 描述读取
          ConfigProvider.locale.Empty；未提供 locale 时默认英文，可通过
          description 覆盖或传 false、null 隐藏。支持 ConfigProvider.empty
          的图片与语义化样式配置。
        </p>
      </details>
      <details>
        <summary>Image</summary>
        <p>
          支持单图及 PreviewGroup
          的受控预览、current、items、fallback、图片属性、容器、
          destroyOnHidden、关闭图标，以及 imageRender、toolbarRender
          和操作回调。 组内缩略图打开时选择对应图片；从外部重开时，未受控的
          current 回到首张。
          缩放、旋转、翻转、拖拽、滚轮、双击和双指缩放使用原生事件；旋转后的边界回弹参考
          rc-image 的坐标算法。onTransform
          按动画帧合并通知，关闭后在预览动画结束时复位。
        </p>
        <p>
          ConfigProvider 的
          prefixCls、direction、image.className/style/fallback/preview.closeIcon
          和 getPopupContainer 会应用到单图；locale.Image.preview
          控制缩略图预览文案，默认使用英文。 五项上游组件 Token
          和预览间距、按钮尺寸、遮罩文案颜色、运动等全局 Token 已接入。
          预览层支持焦点管理、Escape 和方向键；mask: false/null
          只隐藏单图缩略图上的遮层。
        </p>
        <p>
          内置运动使用原生 CSS 动画；rc-motion 的完整中断状态机、iframe
          外部拖拽事件和所有第三方自定义动画组合仍未完全复刻。 PreviewGroup
          的公开类型按当前上游源码排除
          mask、maskClassName；旧文档中的这两项不表示分组对话框参数。
        </p>
      </details>
      <details>
        <summary>List</summary>
        <p>
          支持列表间距、背景、Meta 文字与间距 token，以及 ConfigProvider 的
          componentSize、direction、prefixCls、renderEmpty 和 List 样式配置。
          网格使用 Row/Col；与 Ant Design 5 一样，仅取当前最高活动断点的列数，
          未设置时回退到 grid.column。List.Item 的网格 ref 指向 Col，colStyle
          应用于 Col；非网格 ref 指向 li。actions 与 extra 的 classNames/styles
          合并组件配置和当前 Item 配置。loading 接受布尔值或 SpinProps。
          数据多于 pageSize 时在本地切片；服务端分页可传当前页数据和 total。
          分页、头部、底部及 loadMore 的顺序沿用 Ant Design 5。
          已验证的路径不代表完整 API、视觉或无障碍认证。
        </p>
      </details>

      <details>
        <summary>Popover</summary>
        <p>
          继承全局颜色、字体、圆角和阴影，支持
          Popover.zIndexPopup、titleMinWidth、innerPadding。它是非模态浮层，不锁定焦点；复杂表单流程应使用后续的
          Modal。
        </p>
        <p>
          使用 Octane 原生 portal 保留主题与业务上下文。触发内容外增加
          inline-flex
          span，保留子元素事件；请提供一个可聚焦的触发元素，键盘提示需包含 focus
          触发。支持 getPopupContainer 和 ConfigProvider
          默认容器；自定义容器按实际 offset parent
          换算坐标。自动避让目前检查视口边缘，
          不计算任意裁剪祖先的可视区域；旋转或倾斜变换容器不保证对齐。
        </p>
        <p>
          支持 12 种 placement、align 的 points、数字或字符串
          offset/targetOffset、 adjust 溢出配置和内置箭头安全区位移，以及
          useCssRight、useCssBottom 和 useCssTransform。支持 builtinPlacements
          自定义位置表、onPopupAlign、forceRender、 arrow.pointAtCenter、fresh
          和旧 overlayInnerStyle；styles.body 优先于
          overlayInnerStyle。自定义位置表替换内置表，onPopupAlign
          在重新测量位置后调用； forceRender
          会在首次打开前挂载浮层。默认关闭时缓存内容，fresh=true 时继续更新。
        </p>
        <p>
          afterOpenChange 在入场或退场动效完成后触发，初始 open
          也会触发入场回调。 TooltipRef 提供
          forceAlign、forcePopupAlign（旧别名）、nativeElement 和
          popupElement。Popover 的 onOpenChange 在 Escape
          关闭时附带键盘事件，其他 触发只传 open。旧 destroyTooltipOnHide 的
          keepParent
          对象设置仍按上游兼容实现转成布尔值；要控制关闭后是否销毁请使用
          destroyOnHidden。
        </p>
      </details>

      <details>
        <summary>QRCode</summary>
        <p>
          使用 Project Nayuki 的 MIT 编码算法。支持 QRCode 全局 alias token
          覆盖；Canvas 按设备像素比绘制。value 为空时不渲染，超长文本显示提示。
          API 表沿用 antd 5 文档中的 color 默认值 #000；antd 5.29.3
          源码实际默认取 colorText，本组件采用相同实现，随主题变化。
        </p>
        <p>
          支持中心图标、statusRender、imageSettings、自定义静区尺寸与字符串数组分段。
          Canvas 仅在图标加载成功后挖孔，加载失败保留完整矩阵。状态文本读取
          ConfigProvider.locale.QRCode，
          默认使用上游英文文案；无边框时保留透明边框并移除内边距和圆角。
        </p>
        <p>
          minVersion、marginSize/includeMargin、imageSettings、fgColor/level
          别名是原生扩展；antd 5 的 QRCode
          包装层并未将它们全部传给内部渲染器。图标尺寸按 size
          换算为模块坐标，Canvas 位图为 size ×
          设备像素比，显示区域由布局控制。role/aria-* 放在 Canvas 或 SVG；data-*
          和 title 留在外层 div，不生成默认二维码标签。
        </p>
      </details>

      <details>
        <summary>Segmented</summary>
        <p>
          支持
          trackPadding、trackBg、itemColor、itemHoverColor、itemHoverBg、itemSelectedBg、itemActiveBg、itemSelectedColor。支持原生表单字段、受控值、RTL、上下布局以及原生滑块平移动画。
          默认尺寸为 middle，禁用状态由 disabled 属性控制，与 antd 5
          的包装实现一致。 方向键按 rc-segmented 2.7.1 在整个 options
          列表中循环，不增加 Home / End 行为。 ConfigProvider.segmented
          可提供样式与类名；自定义 prefixCls 同时保留 ant-* 样式类。
        </p>
      </details>

    </>
  );
}
