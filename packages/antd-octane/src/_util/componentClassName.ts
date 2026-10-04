/** Keep the static stylesheet alias alongside a configured Ant Design prefix. */
export function componentClassName(
  basePrefix: string,
  prefixCls: string,
  suffix = "",
) {
  return prefixCls === basePrefix
    ? `${basePrefix}${suffix}`
    : `${basePrefix}${suffix} ${prefixCls}${suffix}`;
}
