// Ant Design 5.29.3 components/skeleton/Paragraph.tsx (MIT), adapted to Octane.
import type { SkeletonParagraphProps } from "./interface";

function getWidth(index: number, { width, rows = 2 }: SkeletonParagraphProps) {
  if (Array.isArray(width)) return width[index];
  return rows - 1 === index ? width : undefined;
}
export default function Paragraph(
  props: SkeletonParagraphProps & { nativePrefixCls?: string },
) {
  const { prefixCls, nativePrefixCls, className, style, rows = 0 } = props;
  return (
    <ul className={[prefixCls, nativePrefixCls, className]} style={style}>
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} style={{ width: getWidth(index, props) }} />
      ))}
    </ul>
  );
}
