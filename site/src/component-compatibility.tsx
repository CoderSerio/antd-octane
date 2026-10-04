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

    </>
  );
}
