import { Anchor } from "antd-octane";

const getCurrentAnchor = () => "#static";

const App = () => (
  <Anchor
    affix={false}
    getCurrentAnchor={getCurrentAnchor}
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
