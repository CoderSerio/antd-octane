import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  ConfigProvider,
  Progress,
  type ProgressProps,
} from "../packages/antd-octane/src";
import {
  handleGradient,
  sortGradient,
} from "../packages/antd-octane/src/progress/Line";
import { getCircleStyle } from "../packages/antd-octane/src/progress/rc-progress/util";
import {
  getPercentage,
  getSize,
} from "../packages/antd-octane/src/progress/utils";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  root = undefined;
  vi.useRealTimers();
});
it("uses explicit aria props and forwards the outer div ref", async () => {
  const ref = { current: null as HTMLDivElement | null };
  await render(
    <Progress
      ref={ref}
      aria-label="Download"
      aria-labelledby="label"
      percent={140}
    />,
  );
  expect(ref.current).toBe(container.firstElementChild);
  expect(ref.current?.getAttribute("aria-label")).toBe("Download");
  expect(ref.current?.getAttribute("aria-valuenow")).toBe("140");
  await render(
    <Progress {...({ percent: 20, "aria-valuenow": 99 } as ProgressProps)} />,
  );
  expect(container.firstElementChild?.getAttribute("aria-valuenow")).toBe("99");
});
it("keeps zero stroke fallbacks distinct for continuous and step lines", async () => {
  await render(
    <>
      <Progress strokeWidth={0} />
      <Progress strokeWidth={0} steps={3} />
      <Progress size="small" />
    </>,
  );
  expect(
    container.querySelector<HTMLElement>(".ant-progress-bg")?.style.height,
  ).toBe("8px");
  expect(
    container.querySelector<HTMLElement>(".ant-progress-steps-item")?.style
      .height,
  ).toBe("0px");
  expect(
    container.querySelectorAll<HTMLElement>(".ant-progress-bg")[1].style.height,
  ).toBe("6px");
});
it("passes raw size to circle while main default classes use the preset", async () => {
  await render(
    <>
      <Progress type="circle" width={72} />
      <Progress type="circle" width={72} size="default" />
      <Progress type="circle" size={20} />
    </>,
  );
  const inner = [
    ...container.querySelectorAll<HTMLElement>(".ant-progress-inner"),
  ];
  expect(inner.map((el) => el.style.width)).toEqual(["72px", "120px", "20px"]);
  expect(container.querySelectorAll(".ant-progress-default")).toHaveLength(2);
  expect(
    container.querySelectorAll(".ant-progress-inline-circle"),
  ).toHaveLength(1);
});
it("does not constrain the bottom info layout to the authored line width", async () => {
  await render(
    <Progress
      size={[160, 16]}
      percentPosition={{ align: "center", type: "outer" }}
    />,
  );
  expect(
    container.querySelector<HTMLElement>(".ant-progress-layout-bottom")?.style
      .width,
  ).toBe("");
  expect(
    container.querySelector<HTMLElement>(".ant-progress-bg")?.style.height,
  ).toBe("16px");
});
it("preserves success field presence and clamps success independently", async () => {
  expect(getPercentage({ percent: 60, success: { percent: 90 } })).toEqual([
    90, 0,
  ]);
  await render(
    <Progress
      successPercent={30}
      success={{ progress: 15, percent: undefined }}
      percent={60}
    />,
  );
  expect(container.querySelector(".ant-progress-success-bg")).toBeNull();
  expect(container.firstElementChild?.getAttribute("aria-valuenow")).toBe("60");
});
it("uses preset green for circle success even under a success token override", async () => {
  await render(
    <ConfigProvider
      theme={{ components: { Progress: { colorSuccess: "#008080" } } }}
    >
      <Progress type="circle" percent={60} success={{ percent: 20 }} />
    </ConfigProvider>,
  );
  const paths = [
    ...container.querySelectorAll<SVGCircleElement>(
      ".ant-progress-circle-path",
    ),
  ];
  expect(paths).toHaveLength(2);
  expect(paths[1].style.stroke).toBe("#52c41a");
  await render(
    <Progress type="circle" percent={60} success={{ percent: 0 }} />,
  );
  expect(container.querySelectorAll(".ant-progress-circle-path")).toHaveLength(
    2,
  );
  expect(
    container
      .querySelectorAll(".ant-progress-circle-path")[1]
      .getAttribute("opacity"),
  ).toBe("0");
});
it("renders source step circle attributes and subtracts success before rounding", async () => {
  await render(
    <Progress
      type="circle"
      steps={{ count: 8, gap: 6 }}
      percent={65}
      success={{ percent: 20 }}
      strokeColor="purple"
      trailColor="pink"
    />,
  );
  const paths = [...container.querySelectorAll<SVGCircleElement>("circle")];
  expect(paths).toHaveLength(8);
  expect(paths.filter((path) => path.style.stroke === "purple")).toHaveLength(
    4,
  );
  expect(
    paths.every((path) => path.getAttribute("stroke-linecap") === null),
  ).toBe(true);
  expect(paths.every((path) => path.getAttribute("opacity") === "1")).toBe(
    true,
  );
});
it("sorts line gradient numeric keys and retains from/to fallback", () => {
  expect(sortGradient({ "70": "green", "0%": "blue", invalid: "red" })).toBe(
    "blue 0%, green 70%",
  );
  expect(handleGradient({ from: "blue", to: "green" }, "rtl").background).toBe(
    "linear-gradient(to left, blue, green)",
  );
  expect(handleGradient({ invalid: "red" }).background).toBe(
    "linear-gradient(to right, )",
  );
});
it("retains circle gradient key order without applying line normalization", async () => {
  await render(
    <Progress
      type="circle"
      strokeColor={{ "70%": "green", "0%": "blue", "100%": "red" }}
    />,
  );
  const background = container.querySelector<HTMLElement>("foreignObject > div")
    ?.style.background;
  expect(background).toContain("green 70%, blue 0%, red 100%");
});
it("resolves custom prefix classes for all line and circle parts", async () => {
  await render(
    <>
      <Progress prefixCls="custom-progress" percent={30} />
      <Progress prefixCls="custom-progress" type="circle" size={20} steps={3} />
    </>,
  );
  expect(container.querySelector(".custom-progress-bg-outer")).not.toBeNull();
  expect(container.querySelector(".custom-progress-text-end")).not.toBeNull();
  expect(
    container.querySelector(".custom-progress-inline-circle"),
  ).not.toBeNull();
  expect(
    container.querySelectorAll(".custom-progress-circle-path"),
  ).toHaveLength(3);
});
it("matches dimension and gap calculations including unsupported object size", () => {
  expect(getSize({ width: 80 }, "circle")).toEqual([-1, -1]);
  expect(getSize(["80%", 12], "line")).toEqual(["80%", 12]);
  expect(getSize("small", "step", { steps: 5, strokeWidth: 8 })).toEqual([
    10, 8,
  ]);
  const style = getCircleStyle(
    300,
    (300 * 50) / 360,
    0,
    65,
    245,
    310,
    "bottom",
    "blue",
    "round",
    6,
  );
  expect(style.strokeDasharray).toBe(`${(300 * 50) / 360}px 300`);
  expect(style.transform).toBe("rotate(245deg)");
});
it("applies normal transition duration to updates spaced at least 100ms", async () => {
  vi.useFakeTimers();
  await render(<Progress type="circle" percent={35} />);
  await vi.advanceTimersByTimeAsync(150);
  await render(<Progress type="circle" percent={65} />);
  expect(
    container.querySelector<SVGCircleElement>(".ant-progress-circle-path")
      ?.style.transitionDuration,
  ).toBe(".3s, .3s, .3s, .06s");
  await render(<Progress type="circle" percent={70} />);
  expect(
    container.querySelector<SVGCircleElement>(".ant-progress-circle-path")
      ?.style.transitionDuration,
  ).toBe("0s, 0s");
});

it("preserves source fractional step counts and custom rounding comparisons", async () => {
  await render(<Progress steps={5} percent={65} rounding={(value) => value} />);
  expect(
    container.querySelectorAll(".ant-progress-steps-item-active"),
  ).toHaveLength(3);
  await render(<Progress steps={2.5} percent={0} />);
  expect(container.querySelectorAll(".ant-progress-steps-item")).toHaveLength(
    3,
  );
});
