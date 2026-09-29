import { Anchor } from "antd-octane";

export function CustomActiveDemo() {
  return (
    <Anchor
      affix={false}
      onClick={(event) => event.preventDefault()}
      getCurrentAnchor={() => "#anchor-pinned-second"}
      items={[
        { key: "first", href: "#anchor-pinned-first", title: "第一项" },
        {
          key: "second",
          href: "#anchor-pinned-second",
          title: "始终高亮第二项",
        },
      ]}
    />
  );
}
