/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useEffect, useLayoutEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface CopyConfig {
  text?: string | (() => string | Promise<string>);
  onCopy?: () => void;
}
export interface EditConfig {
  editing?: boolean;
  text?: string;
  maxLength?: number;
  onStart?: () => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
}
export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | "collapsible";
  expanded?: boolean;
  defaultExpanded?: boolean;
  suffix?: string;
  onExpand?: (event: MouseEvent, info: { expanded: boolean }) => void;
}
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  type?: "secondary" | "success" | "warning" | "danger";
  disabled?: boolean;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  mark?: boolean;
  code?: boolean;
  keyboard?: boolean;
  copyable?: boolean | CopyConfig;
  editable?: boolean | EditConfig;
  ellipsis?: boolean | EllipsisConfig;
  style?: CSSProperties;
}
export interface TitleProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5;
}
export interface LinkProps extends TypographyProps {
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
}
// Each wrapper owns its child value. Capturing a reassigned JSX variable
// creates a self-reference after Octane compiles children into getters.
function decorate(
  content: OctaneNode,
  Tag: "strong" | "em" | "u" | "del" | "mark" | "code" | "kbd",
) {
  return <Tag>{content}</Tag>;
}
function Base({
  as: Tag = "div",
  level,
  type,
  disabled,
  strong,
  italic,
  underline,
  delete: deleted,
  mark,
  code,
  keyboard,
  copyable,
  editable,
  ellipsis,
  children,
  className,
  style,
  onClick,
  ...rest
}: LinkProps & {
  as?: "div" | "span" | "a" | "h1" | "h2" | "h3" | "h4" | "h5";
  level?: 1 | 2 | 3 | 4 | 5;
}) {
  const { token: t, component: c, base } = useComponentTokens("Typography");
  const copy = typeof copyable === "object" ? copyable : {};
  const edit = typeof editable === "object" ? editable : {};
  const ellipse = typeof ellipsis === "object" ? ellipsis : {};
  const [internalEditing, setEditing] = useState(false);
  const editing = edit.editing ?? internalEditing;
  const [draft, setDraft] = useState("");
  const [internalExpanded, setExpanded] = useState(
    ellipse.defaultExpanded ?? false,
  );
  const expanded = ellipse.expanded ?? internalExpanded;
  const [copyState, setCopyState] = useState<
    "idle" | "pending" | "done" | "error"
  >("idle");
  const textRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const alive = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const composing = useRef(false);
  const finishing = useRef(false);
  const currentText = useRef("");
  useLayoutEffect(() => {
    if (!editing) currentText.current = textRef.current?.textContent ?? "";
  });
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  useLayoutEffect(() => {
    if (!editing) return;
    finishing.current = false;
    setDraft(
      edit.text ??
        (currentText.current || (typeof children === "string" ? children : "")),
    );
    inputRef.current?.focus();
  }, [editing]);
  const finish = (cancel: boolean) => {
    if (finishing.current) return;
    finishing.current = true;
    setEditing(false);
    if (cancel) edit.onCancel?.();
    else {
      edit.onChange?.(draft);
      edit.onEnd?.();
    }
  };
  const wasEditing = useRef(editing);
  useLayoutEffect(() => {
    if (wasEditing.current && !editing) editRef.current?.focus();
    wasEditing.current = editing;
  }, [editing]);
  async function doCopy() {
    if (copyState === "pending") return;
    setCopyState("pending");
    try {
      const text =
        typeof copy.text === "function"
          ? await copy.text()
          : (copy.text ?? textRef.current?.textContent ?? "");
      await navigator.clipboard.writeText(text);
      if (!alive.current) return;
      setCopyState("done");
      copy.onCopy?.();
    } catch {
      if (alive.current) setCopyState("error");
    }
    if (alive.current) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopyState("idle"), 2000);
    }
  }
  let content: OctaneNode = children;
  if (strong) content = decorate(content, "strong");
  if (italic) content = decorate(content, "em");
  if (underline) content = decorate(content, "u");
  if (deleted) content = decorate(content, "del");
  if (mark) content = decorate(content, "mark");
  if (code) content = decorate(content, "code");
  if (keyboard) content = decorate(content, "kbd");
  const color = disabled
    ? t.colorTextDisabled
    : type === "secondary"
      ? t.colorTextDescription
      : type === "success"
        ? t.colorSuccessText
        : type === "warning"
          ? t.colorWarningText
          : type === "danger"
            ? t.colorErrorText
            : level
              ? t.colorTextHeading
              : Tag === "a"
                ? t.colorLink
                : t.colorText;
  return (
    <Tag
      {...rest}
      href={disabled ? undefined : rest.href}
      aria-disabled={disabled || undefined}
      className={[
        "ant-typography",
        level && "ant-typography-title",
        disabled && "ant-typography-disabled",
        className,
      ]}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      style={{
        ...base,
        "--ao-type-color": color,
        "--ao-type-size": `${level ? t[`fontSizeHeading${level}`] : t.fontSize}px`,
        "--ao-type-line": level ? t[`lineHeightHeading${level}`] : t.lineHeight,
        "--ao-type-weight": t.fontWeightStrong,
        "--ao-type-top":
          typeof c?.titleMarginTop === "number"
            ? `${c.titleMarginTop}px`
            : (c?.titleMarginTop ?? "1.2em"),
        "--ao-type-bottom":
          typeof c?.titleMarginBottom === "number"
            ? `${c.titleMarginBottom}px`
            : (c?.titleMarginBottom ?? "0.5em"),
        "--ao-type-code": t.fontFamilyCode,
        "--ao-type-hover": t.colorLinkHover,
        "--ao-type-success": t.colorSuccess,
        ...style,
      }}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          aria-label="编辑文本"
          value={draft}
          maxLength={edit.maxLength}
          onInput={(event) => {
            finishing.current = false;
            setDraft(event.currentTarget.value);
          }}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={() => {
            composing.current = false;
          }}
          onKeyDown={(event) => {
            if (composing.current || event.isComposing || event.keyCode === 229)
              return;
            if (event.key === "Escape") {
              event.preventDefault();
              finish(true);
            } else if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              finish(false);
            }
          }}
          onBlur={() => {
            if (!composing.current) finish(false);
          }}
        />
      ) : (
        <>
          <span
            ref={textRef}
            className={
              ellipsis && !expanded ? "ant-typography-clamp" : undefined
            }
            style={
              ellipsis && !expanded
                ? { WebkitLineClamp: Math.max(1, ellipse.rows ?? 1) }
                : undefined
            }
          >
            {content}
          </span>
          {ellipsis && ellipse.suffix}
          {ellipse.expandable &&
            (!expanded || ellipse.expandable === "collapsible") && (
              <button
                type="button"
                className="ant-typography-expand"
                aria-expanded={expanded}
                onClick={(event) => {
                  setExpanded(!expanded);
                  ellipse.onExpand?.(event, { expanded: !expanded });
                }}
              >
                {expanded ? "收起" : "展开"}
              </button>
            )}
          {editable && (
            <button
              ref={editRef}
              type="button"
              className="ant-typography-edit"
              disabled={disabled}
              aria-label="编辑"
              onClick={() => {
                setEditing(true);
                edit.onStart?.();
              }}
            >
              ✎
            </button>
          )}
          {copyable && (
            <>
              <button
                type="button"
                className="ant-typography-copy"
                disabled={disabled || copyState === "pending"}
                aria-label={copyState === "done" ? "已复制" : "复制"}
                onClick={() => {
                  void doCopy();
                }}
              >
                {copyState === "done" ? "✓" : "⧉"}
              </button>
              <span className="ant-typography-copy-status" role="status">
                {copyState === "done"
                  ? "已复制"
                  : copyState === "error"
                    ? "复制失败，请手动复制"
                    : ""}
              </span>
            </>
          )}
        </>
      )}
    </Tag>
  );
}
function Text(props: TypographyProps) {
  return <Base {...props} as="span" />;
}
function Paragraph(props: TypographyProps) {
  return <Base {...props} as="div" />;
}
function Title({ level = 1, ...props }: TitleProps) {
  const tag = `h${level}` as "h1";
  return <Base {...props} as={tag} level={level} />;
}
function Link(props: LinkProps) {
  return <Base {...props} as="a" />;
}
export const Typography = Object.assign(Paragraph, {
  Text,
  Paragraph,
  Title,
  Link,
});
