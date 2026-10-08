import { BasicDemo, MoreDemo } from "../demos/date-picker-business";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        DatePicker <span>日期选择</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        选择一个日期或一个日期范围。应用直接安装 dayjs；值使用
        Dayjs，字符串仅用于输入与展示。
      </p>
      <DocMeta name="DatePicker" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控日期与禁用星期日"
          description="输入日期后按 Enter 提交；清除回到受控 null。"
          source={() => import("../demos/date-picker-business.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="需要确认的报告周期"
          description="两端共享草稿。此例 needConfirm 要求点击 OK；省略时完整范围默认自动提交。"
          source={() => import("../demos/date-picker-business.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["value / defaultValue", "单值受控值 / 初值", "Dayjs | null", "—"],
          [
            "onChange",
            "单值提交或清除",
            "(value: Dayjs | null, text: string) => void",
            "—",
          ],
          ["format", "严格解析和显示格式", "string", "YYYY-MM-DD"],
          [
            "disabledDate",
            "拒绝输入或点击的日期",
            "(date: Dayjs) => boolean",
            "—",
          ],
          [
            "open / defaultOpen / onOpenChange",
            "弹层受控状态、初始状态和请求回调",
            "boolean / boolean / (open) => void",
            "false",
          ],
          [
            "RangePicker.value / defaultValue",
            "范围受控值 / 初值",
            "[Dayjs | null, Dayjs | null] | null",
            "—",
          ],
          [
            "RangePicker.onChange",
            "确认完整范围或清除",
            "(range, [startText, endText]) => void",
            "—",
          ],
          [
            "RangePicker.onCalendarChange",
            "选择过程的共享草稿",
            "(range, texts, { range: start | end }) => void",
            "—",
          ],
          [
            "RangePicker.needConfirm",
            "是否使用显式确认",
            "boolean",
            "false；允许空端点时 true",
          ],
          [
            "RangePicker.allowEmpty / disabled",
            "允许空值 / 锁定端点",
            "[boolean, boolean] / boolean | [boolean, boolean]",
            "[false, false] / false",
          ],
          [
            "RangePicker.disabledDate",
            "另一个端点通过 from 提供",
            "(date, {type: date, from?: Dayjs}) => boolean",
            "—",
          ],
          [
            "getPopupContainer / locale",
            "弹层容器 / 文案和 Dayjs locale 名",
            "callback / PickerLocale",
            "ConfigProvider",
          ],
          [
            "ref",
            "原生容器和输入焦点方法",
            "PickerRef: nativeElement, focus, blur",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持边界
      </h2>
      <p>
        这是单日与单个日期范围的子集，未提供
        showTime、月份/季度/周选择模式、多个范围、presets、自动排序或
        TimePicker.RangePicker。范围使用一个日历面板；开始晚于结束会被拒绝。Escape、外部点击和离开整个组件会丢弃草稿；IME
        Enter 不提交。禁用任一端点时不能整体清空。非英语月份名称需由应用加载对应
        dayjs locale；时区转换由应用决定。
      </p>
    </>
  );
}
