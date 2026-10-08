import { BasicDemo, MoreDemo } from "../demos/calendar-business";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Calendar <span>日历</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在页面中显示月或年日历，以 Dayjs 管理日期。</p>
      <DocMeta name="Calendar" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控卡片日历"
          description="选择日期更新同一个 Dayjs 状态。"
          source={() => import("../demos/calendar-business.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="限制可选日期"
          description="仅允许十月且禁止星期日；回调展示选择来源。"
          source={() => import("../demos/calendar-business.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["value / defaultValue", "受控日期 / 初始日期", "Dayjs", "当天"],
          ["mode", "面板模式", "month | year", "month"],
          ["fullscreen", "全屏式日历或卡片", "boolean", "true"],
          ["validRange", "可选日期边界", "[Dayjs, Dayjs]", "—"],
          ["disabledDate", "额外禁用规则", "(date: Dayjs) => boolean", "—"],
          ["onChange", "当前日期改变", "(date: Dayjs) => void", "—"],
          ["onSelect", "选择日期及来源", "(date, {source}) => void", "—"],
          ["onPanelChange", "面板日期或模式改变", "(date, mode) => void", "—"],
          [
            "cellRender / fullCellRender",
            "追加内容 / 替换整个单元格",
            "(date, info) => OctaneNode",
            "—",
          ],
          [
            "headerRender",
            "自定义头部并使用提供的更新回调",
            "({value, type, onChange, onTypeChange}) => OctaneNode",
            "—",
          ],
          [
            "locale / showWeek",
            "日历语言 / 显示周数",
            "CalendarLocale / boolean",
            "ConfigProvider / false",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持边界
      </h2>
      <p>
        Calendar
        是内嵌日历，不是范围输入或日程排程系统。业务事件、远程数据加载、时区和重复规则由应用管理。value、mode
        为受控属性时需要在回调中更新父级状态。自定义完整单元格和头部时，由应用保留可操作语义；不能以此页两例推断完整上游或辅助技术兼容。
      </p>
    </>
  );
}
