export const collapseClass = (prefixCls: string, suffix: string) =>
  prefixCls === "ant-collapse"
    ? `ant-collapse-${suffix}`
    : [`${prefixCls}-${suffix}`, `ant-collapse-${suffix}`];
