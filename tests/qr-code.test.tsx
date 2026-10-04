import { createRequire } from "node:module";
import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { QRCode } from "../packages/antd-octane/src/qr-code";
import { qrcodegen } from "../packages/antd-octane/src/qr-code/vendor/qrcodegen";

const require = createRequire(import.meta.url);
const fromAntd = createRequire(require.resolve("antd/package.json"));
const reference = fromAntd("@rc-component/qrcode/lib/libs/qrcodegen") as {
  QrCode: typeof qrcodegen.QrCode;
  Ecc: typeof qrcodegen.QrCode.Ecc;
};
const rendererReference = fromAntd("@rc-component/qrcode/lib/utils") as {
  generatePath: (cells: boolean[][], margin: number) => string;
};
const levels = { L: "LOW", M: "MEDIUM", Q: "QUARTILE", H: "HIGH" } as const;
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
  root = undefined;
  container?.remove();
  vi.restoreAllMocks();
});
const matrix = (qr: qrcodegen.QrCode) =>
  Array.from({ length: qr.size }, (_, y) =>
    Array.from({ length: qr.size }, (_, x) => qr.getModule(x, y)),
  );
for (const level of ["L", "M", "Q", "H"] as const)
  it(`encoder matches antd's dev reference for ${level} numeric, ASCII, UTF8 and multiversion text`, () => {
    for (const text of [
      "01234567890123456789",
      "HELLO OCTANE",
      "https://ant.design/components/qr-code",
      "中文与 emoji 🚀 café",
      "Octane二维码🚀".repeat(60),
    ]) {
      const actual = qrcodegen.QrCode.encodeText(
        text,
        qrcodegen.QrCode.Ecc[levels[level]],
      );
      const expected = reference.QrCode.encodeText(
        text,
        reference.Ecc[levels[level]],
      );
      expect(actual.version).toBe(expected.version);
      expect(matrix(actual)).toEqual(matrix(expected));
    }
  });
it("SVG path exactly represents modules with an explicit four-module quiet zone", async () => {
  const value = "中文 SVG 🧩";
  await render(
    <QRCode value={value} type="svg" errorLevel="H" marginSize={4} />,
  );
  const qr = reference.QrCode.encodeText(value, reference.Ecc.HIGH);
  const svg = container.querySelector("svg") as SVGSVGElement;
  expect(svg.getAttribute("viewBox")).toBe(`0 0 ${qr.size + 8} ${qr.size + 8}`);
  expect(svg.querySelectorAll("path")).toHaveLength(2);
  expect(svg.querySelectorAll("path")[1].getAttribute("d")).toBe(
    rendererReference.generatePath(matrix(qr), 4),
  );
  expect(svg.getAttribute("aria-label")).toBeNull();
  expect(svg.querySelector("title")).toBeNull();
});
it("Canvas paints the same matrix, rerenders colors/value and uses DPR", async () => {
  const paints: Array<{ color: string; rect: number[] }> = [];
  let fillStyle = "";
  const ctx = {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value: string) {
      fillStyle = value;
    },
    scale: vi.fn(),
    fillRect: (...rect: number[]) => paints.push({ color: fillStyle, rect }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(window, "devicePixelRatio", "get").mockReturnValue(2);
  await render(<QRCode value="Canvas" color="#112233" bgColor="#ffffff" />);
  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  expect(canvas.width).toBe(320);
  const qr = reference.QrCode.encodeText("Canvas", reference.Ecc.MEDIUM);
  expect(ctx.scale).toHaveBeenLastCalledWith(320 / qr.size, 320 / qr.size);
  expect(paints).toHaveLength(matrix(qr).flat().filter(Boolean).length + 1);
  expect(paints[0]).toEqual({
    color: "#ffffff",
    rect: [0, 0, qr.size, qr.size],
  });
  expect(paints.slice(1).every((paint) => paint.color === "#112233")).toBe(
    true,
  );
  const previous = paints.length;
  await render(<QRCode value="Changed" color="#445566" />);
  expect(paints.length).toBeGreaterThan(previous);
  expect(paints.at(-1)?.color).toBe("#445566");
});
it("empty content renders nothing; oversized content falls back and recovers", async () => {
  await render(<QRCode value="" type="svg" />);
  // Ant Design 5.29.3 components/qr-code/index.tsx returns null for !value.
  expect(container.childElementCount).toBe(0);
  await render(<QRCode value={"a".repeat(5000)} type="svg" />);
  expect(container.querySelector("[role=status]")).not.toBeNull();
  await render(<QRCode value="valid again" type="svg" />);
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.querySelector("[role=status]")).toBeNull();
});
it("expired refresh callback and loading state remain operable", async () => {
  const refresh = vi.fn();
  await render(
    <QRCode value="valid" type="svg" status="expired" onRefresh={refresh} />,
  );
  await act(() => container.querySelector("button")?.click());
  expect(refresh).toHaveBeenCalledOnce();
  await render(<QRCode value="valid" type="svg" status="loading" />);
  expect(container.querySelector(".ant-spin")).not.toBeNull();
});
