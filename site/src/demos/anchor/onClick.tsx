import { Anchor } from "antd-octane";
import type { OctaneNode } from "octane";

const handleClick = (
  e: MouseEvent,
  link: {
    title: OctaneNode;
    href: string;
  },
) => {
  e.preventDefault();
  console.log(link);
};

const App = () => (
  <Anchor
    affix={false}
    onClick={handleClick}
    items={[
      {
        key: "1",
        href: "#basic",
        title: "Basic demo",
      },
      {
        key: "2",
        href: "#static",
        title: "Static demo",
      },
      {
        key: "3",
        href: "#api",
        title: "API",
        children: [
          {
            key: "4",
            href: "#anchor-props",
            title: "Anchor Props",
          },
          {
            key: "5",
            href: "#link-props",
            title: "Link Props",
          },
        ],
      },
    ]}
  />
);

export default App;
