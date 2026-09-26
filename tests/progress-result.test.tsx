import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Progress } from "../packages/antd-octane/src/progress";
import { Result } from "../packages/antd-octane/src/result";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
});
it("clamps invalid progress, exposes accessible values and updates", async () => {
  await render(<Progress percent={140} aria-label="下载" />);
  expect(
    container
      .querySelector('[role="progressbar"]')
      ?.getAttribute("aria-valuenow"),
  ).toBe("100");
  expect(
    container
      .querySelector(".ant-progress")
      ?.classList.contains("ant-progress-status-success"),
  ).toBe(true);
  await act(() => root?.render(<Progress percent={Number.NaN} />));
  expect(
    container
      .querySelector('[role="progressbar"]')
      ?.getAttribute("aria-valuenow"),
  ).toBe("0");
  expect(
    container.querySelector<HTMLElement>(".ant-progress-bg")?.style.width,
  ).toBe("0%");
});
it("keeps success portion independent and lets formatter render zero", async () => {
  await render(
    <Progress
      percent={40}
      success={{ percent: 20, strokeColor: "red" }}
      format={(percent, success) => `${percent}:${success}`}
    />,
  );
  expect(container.querySelector(".ant-progress-text")?.textContent).toBe(
    "40:20",
  );
  expect(
    container.querySelector<HTMLElement>(".ant-progress-success-bg")?.style
      .width,
  ).toBe("20%");
  await act(() => root?.render(<Progress percent={0} format={() => 0} />));
  expect(container.querySelector(".ant-progress-text")?.textContent).toBe("0");
});
it("uses unique gradient references and dashboard gaps with no zero-percent cap", async () => {
  await render(
    <>
      <Progress
        type="dashboard"
        percent={0}
        strokeColor={{ "0%": "red", "100%": "blue" }}
      />
      <Progress
        type="circle"
        percent={50}
        strokeColor={{ from: "red", to: "green" }}
      />
    </>,
  );
  const gradients = [...container.querySelectorAll("linearGradient")];
  expect(gradients).toHaveLength(2);
  expect(gradients[0].id).not.toBe(gradients[1].id);
  const paths = [...container.querySelectorAll(".ant-progress-circle-path")];
  expect(paths[0].getAttribute("stroke")).toBe(`url(#${gradients[0].id})`);
  expect(paths[0].getAttribute("opacity")).toBe("0");
  const trails = [...container.querySelectorAll(".ant-progress-circle-trail")];
  expect(trails[0].getAttribute("stroke-dasharray")).not.toBe(
    trails[1].getAttribute("stroke-dasharray"),
  );
});
it("renders discrete steps and hides only visual info", async () => {
  await render(
    <Progress steps={5} percent={60} showInfo={false} strokeColor="red" />,
  );
  const steps = [
    ...container.querySelectorAll<HTMLElement>(".ant-progress-steps-item"),
  ];
  expect(steps).toHaveLength(5);
  expect(steps.filter((step) => step.style.background === "red")).toHaveLength(
    3,
  );
  expect(container.querySelector(".ant-progress-text")).toBeNull();
  expect(
    container
      .querySelector('[role="progressbar"]')
      ?.getAttribute("aria-valuenow"),
  ).toBe("60");
});
it("uses scoped component tokens for both feedback components", async () => {
  await render(
    <ConfigProvider
      theme={{
        components: {
          Progress: { defaultColor: "purple", remainingColor: "pink" },
          Result: { titleFontSize: 30, extraMargin: "12px" },
        },
      }}
    >
      <Progress percent={30} />
      <Result title="完成" extra={<button type="button">返回</button>} />
    </ConfigProvider>,
  );
  expect(
    container
      .querySelector<HTMLElement>(".ant-progress")
      ?.style.getPropertyValue("--ao-progress-color"),
  ).toBe("purple");
  expect(
    container
      .querySelector<HTMLElement>(".ant-result")
      ?.style.getPropertyValue("--ao-result-title-size"),
  ).toBe("30px");
});
it("supports result HTTP statuses, custom icons, details and actions without live announcements", async () => {
  await render(
    <Result
      status="404"
      title="页面不存在"
      subTitle="检查地址"
      extra={<button type="button">返回</button>}
    >
      详细说明
    </Result>,
  );
  expect(container.querySelector(".ant-result-http")?.textContent).toBe("404");
  expect(container.querySelector(".ant-result-content")?.textContent).toBe(
    "详细说明",
  );
  expect(container.querySelector('[role="alert"]')).toBeNull();
  await act(() =>
    root?.render(<Result status="success" title="完成" icon={null} />),
  );
  expect(container.querySelector(".ant-result-icon")).toBeNull();
  await act(() => root?.render(<Result icon={<span>自定义</span>} />));
  expect(container.querySelector(".ant-result-icon")?.textContent).toBe(
    "自定义",
  );
});
