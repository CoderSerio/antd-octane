export function previewClass(prefixCls: string, suffix: string) {
  const base = `ant-image-preview${suffix}`;
  const custom = `${prefixCls}${suffix}`;
  return custom === base ? base : [base, custom].join(" ");
}

export function getMotionName(
  prefixCls: string,
  transitionName?: string,
  animation?: string,
) {
  return (
    transitionName || (animation ? `${prefixCls}-${animation}` : undefined)
  );
}
