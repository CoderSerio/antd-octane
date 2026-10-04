// Panel slot structure adapted from rc-dialog 9.6.0 (MIT).
import type { AriaAttributes, CSSProperties, OctaneNode } from "octane";
import { componentClassName } from "../_util/componentClassName";
import type { ModalProps } from "./interface";
export interface ModalPanelProps
  extends Pick<
    ModalProps,
    "title" | "bodyStyle" | "bodyProps" | "styles" | "classNames" | "onCancel"
  > {
  prefixCls: string;
  ariaId: string;
  footer?: OctaneNode;
  children?: OctaneNode;
  closable: boolean;
  disabled: boolean;
  closeIcon?: OctaneNode;
  closeAttrs: AriaAttributes;
}
export default function ModalPanel({
  prefixCls,
  ariaId,
  title,
  footer,
  children,
  closable,
  disabled,
  closeIcon,
  closeAttrs,
  onCancel,
  bodyStyle,
  bodyProps,
  styles,
  classNames,
}: ModalPanelProps) {
  const cls = (suffix: string) =>
    componentClassName("ant-modal", prefixCls, suffix);
  return (
    <div
      className={[cls("-content"), classNames?.content]}
      style={styles?.content}
    >
      {closable && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          {...closeAttrs}
          className={cls("-close")}
          disabled={disabled}
        >
          {closeIcon}
        </button>
      )}
      {!!title && (
        <div
          className={[cls("-header"), classNames?.header]}
          style={styles?.header}
        >
          <div id={ariaId} className={cls("-title")}>
            {title}
          </div>
        </div>
      )}
      <div
        className={[cls("-body"), classNames?.body]}
        style={{ ...bodyStyle, ...styles?.body } as CSSProperties}
        {...bodyProps}
      >
        {children}
      </div>
      {!!footer && (
        <div
          className={[cls("-footer"), classNames?.footer]}
          style={styles?.footer}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
