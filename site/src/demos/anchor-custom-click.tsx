import { Anchor } from "antd-octane";
import { useState } from "octane";

export function CustomClickDemo() {
  const [clicked, setClicked] = useState("尚未点击");
  return (
    <div>
      <Anchor
        affix={false}
        onClick={(event, link) => {
          event.preventDefault();
          setClicked(link.href);
        }}
        items={[
          { key: "first", href: "#anchor-click-first", title: "第一项" },
          { key: "second", href: "#anchor-click-second", title: "第二项" },
        ]}
      />
      <p aria-live="polite">
        点击回调：{clicked}；阻止默认行为后不会滚动或改写 URL。
      </p>
    </div>
  );
}
