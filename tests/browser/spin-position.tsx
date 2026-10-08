import { createRoot } from "octane";
import { ConfigProvider } from "../../packages/antd-octane/src/config-provider";
import { Spin, type SpinSize } from "../../packages/antd-octane/src/spin";
import {
  compactAlgorithm,
  darkAlgorithm,
  defaultAlgorithm,
} from "../../packages/antd-octane/src/theme/resolve";
import "../../packages/antd-octane/src/style.css";

const params = new URLSearchParams(location.search);
const mode = params.get("theme");
const size = (params.get("size") ?? "default") as SpinSize;
const fullscreen = params.has("fullscreen");
const tip = params.has("tip") ? "Loading content" : undefined;
const algorithm =
  mode === "dark"
    ? darkAlgorithm
    : mode === "compact"
      ? compactAlgorithm
      : defaultAlgorithm;

function Fixture() {
  return (
    <ConfigProvider theme={{ algorithm }}>
      {fullscreen ? (
        <Spin fullscreen size={size} percent={45} tip={tip} />
      ) : (
        <main style={{ padding: 16 }}>
          <div data-case="inline">
            Before <Spin size={size} /> <Spin size={size} percent={45} /> After
          </div>
          {(
            [
              ["dots", undefined, undefined],
              ["progress", 45, undefined],
              ["progress-tip", 45, "Loading content"],
              ["auto", "auto", undefined],
            ] as const
          ).map(([name, percent, description]) => (
            <section key={name} data-case={name} style={{ marginTop: 16 }}>
              <Spin size={size} percent={percent} tip={description}>
                <div style={{ height: 160 }}>Loading area</div>
              </Spin>
            </section>
          ))}
          <section data-case="rtl" dir="rtl" style={{ marginTop: 16 }}>
            <ConfigProvider direction="rtl">
              <Spin size={size} percent={45}>
                <div style={{ height: 160 }}>RTL loading area</div>
              </Spin>
            </ConfigProvider>
          </section>
          <section data-case="custom" style={{ marginTop: 16 }}>
            <Spin size={size} indicator={<span>◌</span>}>
              <div style={{ height: 160 }}>Custom loading area</div>
            </Spin>
          </section>
        </main>
      )}
    </ConfigProvider>
  );
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing fixture root");
createRoot(root).render(<Fixture />);
