import { createRoot } from "octane";
import {
  Carousel,
  ConfigProvider,
  Image,
  theme,
} from "../../packages/antd-octane/src";
import "../../packages/antd-octane/src/style.css";
import { brand, component, src } from "./media-theme-cases";

const name = new URLSearchParams(location.search).get("theme");
const chosen =
  name === "dark"
    ? { algorithm: theme.darkAlgorithm }
    : name === "compact"
      ? { algorithm: theme.compactAlgorithm }
      : name === "brand"
        ? brand
        : name === "component"
          ? component
          : {};
const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
createRoot(root).render(
  <ConfigProvider theme={chosen}>
    <div className="media-fixture">
      <Image src={src} width={160} preview={{ visible: true }} />
      <Carousel arrows>
        <div className="fixture-slide">One</div>
        <div className="fixture-slide">Two</div>
      </Carousel>
    </div>
  </ConfigProvider>,
);
