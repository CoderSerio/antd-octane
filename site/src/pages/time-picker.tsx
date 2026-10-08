import { BasicDemo } from "../demos/time-picker-basic";
import { StepsDemo } from "../demos/time-picker-steps";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        TimePicker <span>时间选择器</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">以 Dayjs 值选择单个 24 小时时间。</p>
      <DocMeta name="TimePicker" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>预约时刻或工作时间输入。跨时区、夏令时和日期组合策略由应用处理。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控时间"}
          description={
            "value 使用 Dayjs 或 null；清除回调为 (null, 空字符串)。"
          }
          source={() => import("../demos/time-picker-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="steps"
          title={"步长与禁用时间"}
          description={
            "允许 9–17 时、每 15 分钟和 30 秒一档；输入与确认都检查限制。"
          }
          source={() => import("../demos/time-picker-steps.tsx?raw")}
        >
          <StepsDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <p>
        以下为本页使用的支持子集。完整类型以安装包声明为准，不直接照搬上游未实现属性。
      </p>
      <ApiTable
        rows={[
          [
            "value / defaultValue",
            "受控时间 / 初始时间",
            "Dayjs | null",
            "— / null",
          ],
          [
            "onChange",
            "提交值与格式化文本",
            "(value: Dayjs | null, text: string) => void",
            "—",
          ],
          [
            "format",
            "Dayjs 严格解析格式；不是数组或 mask",
            "string",
            "HH:mm:ss",
          ],
          [
            "hourStep / minuteStep / secondStep",
            "正整数步长，分别不超过 24/60/60",
            "number",
            "1",
          ],
          [
            "disabledTime",
            "返回 disabledHours/Minutes/Seconds 函数",
            "(date: Dayjs) => DisabledTimes",
            "—",
          ],
          [
            "allowClear / inputReadOnly",
            "允许清除 / 禁止手工编辑",
            "boolean",
            "true / false",
          ],
          [
            "open / defaultOpen / onOpenChange",
            "弹层控制",
            "boolean / boolean / function",
            "— / false / —",
          ],
          [
            "locale",
            "覆盖 provider 的时间选择文案",
            "PickerLocale",
            "ConfigProvider.locale.TimePicker",
          ],
          [
            "getPopupContainer / ref",
            "弹层容器 / focus、blur、nativeElement",
            "function / TimePickerRef",
            "provider / —",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "使用 Dayjs 的消费项目应直接安装 dayjs，不依赖传递依赖。输入编辑是草稿：Enter 提交合法输入；时间列修改由 OK 提交；Escape、点外部或离开整个控件丢弃未提交草稿。"
        }
      </p>
      <p>
        {
          "仅单值、24 小时、时分秒三列；不含 RangePicker、12 小时制、毫秒、presets、自定义日期适配器或 mask。format 省略秒也不会隐藏秒列。"
        }
      </p>
      <p>
        {
          "支持 size/status/disabled、输入标签和 locale；具体语言的 Dayjs 格式化另需导入对应 locale。未声称完整 rc-picker、视觉或 SSR/hydration 兼容。"
        }
      </p>
    </>
  );
}
