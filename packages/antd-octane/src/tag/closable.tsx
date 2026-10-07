/** @jsxImportSource octane */
import type { HTMLAttributes, OctaneNode } from "octane";
import type { ClosableType, TagClosableConfig } from ".";

type Collection = { closable?: ClosableType; closeIcon?: OctaneNode };

function normalize({
  closable,
  closeIcon,
}: Collection): TagClosableConfig | false | undefined {
  if (
    !closable &&
    (closable === false || closeIcon === false || closeIcon === null)
  )
    return false;
  if (closable === undefined && closeIcon === undefined) return undefined;
  return {
    closeIcon:
      typeof closeIcon !== "boolean" && closeIcon !== null
        ? closeIcon
        : undefined,
    ...(typeof closable === "object" && closable !== null ? closable : {}),
  };
}

// CloseOutlined path from @ant-design/icons-svg 4.6.0 (MIT).
function CloseOutlined({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      role={props.role ?? "img"}
      className={["anticon", "anticon-close", className]}
    >
      <svg
        viewBox="64 64 896 896"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
      </svg>
    </span>
  );
}

/** Props, context, then the default icon; undefined never overrides a fallback. */
export function getClosable(
  props: Collection,
  context?: Collection,
  closeLabel = "Close",
) {
  const own = normalize(props);
  const inherited = normalize(context ?? {});
  if (own === false || (own === undefined && inherited === false))
    return undefined;
  if (own === undefined && inherited === undefined) return undefined;
  const merged = {
    // Keep the icon as a prop-forwarding component so cloneElement can attach
    // the Tag close class and handler to the actual span.
    closeIcon: <CloseOutlined aria-label={closeLabel} />,
  } as TagClosableConfig;
  for (const value of [inherited, own]) {
    if (!value) continue;
    for (const [key, field] of Object.entries(value)) {
      if (field !== undefined) Object.assign(merged, { [key]: field });
    }
  }
  return merged;
}
