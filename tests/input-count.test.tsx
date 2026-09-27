import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { Input } from "../packages/antd-octane/src/input";

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
});

function count() {
  return container.querySelector(".ant-input-count");
}

it("shows the controlled Input value and preserves existing descriptions", async () => {
  await render(
    <Input
      value="fixed"
      showCount
      maxLength={3}
      aria-describedby="hint"
      onChange={() => {}}
    />,
  );
  const input = container.querySelector("input") as HTMLInputElement;
  expect(count()?.textContent).toBe("5 / 3");
  expect(count()?.classList.contains("ant-input-count-exceed")).toBe(true);
  expect(input.getAttribute("aria-describedby")?.split(" ")).toContain("hint");
  expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
    count()?.id,
  );
  await act(() => {
    input.value = "no";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(input.value).toBe("fixed");
  expect(count()?.textContent).toBe("5 / 3");
});

it("updates uncontrolled Input count on edit, clear, and native form reset", async () => {
  await render(
    <form>
      <Input defaultValue="seed" showCount allowClear maxLength={8} />
    </form>,
  );
  const input = container.querySelector("input") as HTMLInputElement;
  expect(count()?.textContent).toBe("4 / 8");
  await act(() => {
    input.value = "edited";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(count()?.textContent).toBe("6 / 8");
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-input-clear-icon")
      ?.click(),
  );
  expect(count()?.textContent).toBe("0 / 8");
  await act(() => container.querySelector("form")?.reset());
  await act(() => Promise.resolve());
  expect(count()?.textContent).toBe("4 / 8");
});

it("shows controlled TextArea count and respects rejected edits", async () => {
  await render(<Input.TextArea value="文字" showCount onChange={() => {}} />);
  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
  expect(count()?.textContent).toBe("2");
  expect(textarea.getAttribute("aria-describedby")).toBe(count()?.id);
  await act(() => {
    textarea.value = "changed";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(count()?.textContent).toBe("2");
});

it("updates uncontrolled TextArea count on input", async () => {
  await render(<Input.TextArea defaultValue="ab" showCount maxLength={10} />);
  expect(count()?.textContent).toBe("2 / 10");
  const field = container.querySelector("textarea") as HTMLTextAreaElement;
  await act(() => {
    field.value = "abcd";
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(count()?.textContent).toBe("4 / 10");
});
