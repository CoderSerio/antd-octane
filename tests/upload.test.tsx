import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Button,
  ConfigProvider,
  Upload,
  type UploadFile,
  type UploadRequestOptions,
} from "../packages/antd-octane/src";

let root: Root | undefined;
let host: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
  vi.unstubAllGlobals();
});
async function choose(...names: string[]) {
  await act(async () => {
    const input = host.querySelector("input");
    if (!input) throw Error("Missing file input");
    Object.defineProperty(input, "files", {
      configurable: true,
      value: names.map(
        (name) => new File([name], name, { type: "text/plain" }),
      ),
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}
async function remove(name: string) {
  await act(async () => {
    const button = host.querySelector<HTMLButtonElement>(
      `[aria-label="Remove ${name}"]`,
    );
    if (!button) throw Error(`Missing remove ${name}`);
    button.click();
    await Promise.resolve();
  });
}
it("uploads a controlled multi-file list with progress, completion, and errors", async () => {
  const calls: UploadRequestOptions[] = [];
  function Demo() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    return (
      <Upload
        multiple
        accept=".txt"
        fileList={files}
        onChange={(info) => setFiles(info.fileList)}
        customRequest={(options) => {
          calls.push(options);
        }}
      />
    );
  }
  await render(<Demo />);
  expect(host.querySelector("input")?.accept).toBe(".txt");
  expect(host.querySelector("input")?.multiple).toBe(true);
  await choose("a.txt", "b.txt");
  expect(calls).toHaveLength(2);
  expect(host.querySelectorAll("li")).toHaveLength(2);
  await act(() => calls[0].onProgress({ percent: 40 }));
  expect(host.querySelector("progress")?.value).toBe(40);
  await act(() => calls[0].onSuccess({ ok: true }));
  await act(() => calls[1].onError(new Error("bad file")));
  expect(host.querySelector('[data-status="done"]')?.textContent).toContain(
    "Uploaded",
  );
  expect(host.querySelector('[role="alert"]')?.textContent).toBe("bad file");
});
it("does not lose concurrent controlled completion events", async () => {
  const calls: UploadRequestOptions[] = [];
  function Demo() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    return (
      <Upload
        multiple
        fileList={files}
        onChange={(info) => setFiles(info.fileList)}
        customRequest={(options) => {
          calls.push(options);
        }}
      />
    );
  }
  await render(<Demo />);
  await choose("a.txt", "b.txt");
  await act(() => {
    calls[0].onSuccess("a");
    calls[1].onSuccess("b");
  });
  expect(host.querySelectorAll('[data-status="done"]')).toHaveLength(2);
});
it("awaits beforeUpload, preserves rejected files, ignores LIST_IGNORE, transforms blobs", async () => {
  const calls: UploadRequestOptions[] = [];
  await render(
    <Upload
      multiple
      beforeUpload={async (file) => {
        if (file.name === "ignore.txt") return Upload.LIST_IGNORE;
        if (file.name === "stop.txt") return false;
        if (file.name === "reject.txt") throw Error("no");
        return new Blob(["changed"], { type: "text/plain" });
      }}
      customRequest={(options) => {
        calls.push(options);
      }}
    />,
  );
  await choose("ignore.txt", "stop.txt", "reject.txt", "ok.txt");
  expect(host.querySelectorAll("li")).toHaveLength(3);
  expect(calls).toHaveLength(1);
  expect(calls[0].file).toBeInstanceOf(File);
  expect((calls[0].file as File).name).toBe("ok.txt");
  expect(await calls[0].file.text()).toBe("changed");
  expect(host.querySelectorAll("progress")).toHaveLength(1);
});
it("does not start I/O when a controlled owner rejects addition", async () => {
  const request = vi.fn(),
    change = vi.fn();
  await render(
    <Upload fileList={[]} customRequest={request} onChange={change} />,
  );
  await choose("a.txt");
  expect(change).toHaveBeenCalledOnce();
  expect(request).not.toHaveBeenCalled();
  expect(host.querySelector("li")).toBeNull();
});
it("honors asynchronous removal veto and aborts accepted removal, ignoring late events", async () => {
  let call!: UploadRequestOptions;
  const abort = vi.fn();
  const change = vi.fn();
  let allow = false;
  await render(
    <Upload
      customRequest={(options) => {
        call = options;
        return { abort };
      }}
      onRemove={async () => allow}
      onChange={change}
    />,
  );
  await choose("a.txt");
  await remove("a.txt");
  expect(abort).not.toHaveBeenCalled();
  expect(host.querySelector("li")).not.toBeNull();
  allow = true;
  await remove("a.txt");
  expect(abort).toHaveBeenCalledOnce();
  expect(host.querySelector("li")).toBeNull();
  const count = change.mock.calls.length;
  await act(() => call.onSuccess("late"));
  expect(change).toHaveBeenCalledTimes(count);
});
it("aborts when the controlled owner removes an active file", async () => {
  const abort = vi.fn();
  let clear!: () => void;
  function Demo() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    clear = () => setFiles([]);
    return (
      <Upload
        fileList={files}
        onChange={(info) => setFiles(info.fileList)}
        customRequest={() => ({ abort })}
      />
    );
  }
  await render(<Demo />);
  await choose("a.txt");
  await act(() => clear());
  expect(abort).toHaveBeenCalledOnce();
});
it("unmount cancels active requests and pending beforeUpload never starts", async () => {
  const abort = vi.fn();
  let resolve!: (value: boolean) => void;
  const request = vi.fn(() => ({ abort }));
  await render(<Upload customRequest={request} />);
  await choose("a.txt");
  await act(() => root?.unmount());
  root = undefined;
  expect(abort).toHaveBeenCalledOnce();
  host.remove();
  await render(
    <Upload
      beforeUpload={() =>
        new Promise<boolean>((done) => {
          resolve = done;
        })
      }
      customRequest={request}
    />,
  );
  await choose("pending.txt");
  await act(() => root?.unmount());
  root = undefined;
  await act(() => resolve(true));
  expect(request).toHaveBeenCalledOnce();
});
it("ignores an older asynchronous remove decision", async () => {
  const decisions: ((value: boolean) => void)[] = [];
  const abort = vi.fn();
  await render(
    <Upload
      customRequest={() => ({ abort })}
      onRemove={() =>
        new Promise<boolean>((resolve) => decisions.push(resolve))
      }
    />,
  );
  await choose("a.txt");
  await remove("a.txt");
  await remove("a.txt");
  await act(() => decisions[1](false));
  await act(() => decisions[0](true));
  expect(abort).not.toHaveBeenCalled();
  expect(host.querySelector("li")).not.toBeNull();
});
it("stops processing a selected batch when unmounted during beforeUpload", async () => {
  let resolve!: (value: boolean) => void;
  const before = vi.fn(
    () =>
      new Promise<boolean>((done) => {
        resolve = done;
      }),
  );
  await render(<Upload multiple beforeUpload={before} />);
  await choose("a.txt", "b.txt");
  expect(before).toHaveBeenCalledOnce();
  await act(() => root?.unmount());
  root = undefined;
  await act(async () => {
    resolve(true);
    await Promise.resolve();
  });
  expect(before).toHaveBeenCalledOnce();
});
it("supports Button children without nested buttons and blocks disabled triggers", async () => {
  await render(
    <Upload>
      <Button>Pick document</Button>
    </Upload>,
  );
  expect(host.querySelector("button button")).toBeNull();
  const input = host.querySelector("input");
  if (!input) throw Error("Missing input");
  const click = vi.spyOn(input, "click");
  await act(() => host.querySelector("button")?.click());
  expect(click).toHaveBeenCalledOnce();
  await render(
    <Upload disabled>
      <Button>Pick document</Button>
    </Upload>,
  );
  const wrapper = host.querySelector<HTMLElement>('[role="button"]');
  if (!wrapper) throw Error("Missing trigger");
  expect(wrapper.tabIndex).toBe(-1);
  expect(wrapper.querySelector("[inert]")).not.toBeNull();
  await act(() => wrapper.click());
  expect(click).toHaveBeenCalledOnce();
});
it("inherits disabled controls", async () => {
  await render(
    <ConfigProvider componentDisabled>
      <Upload defaultFileList={[{ uid: "1", name: "old.txt" }]} />
    </ConfigProvider>,
  );
  expect(
    [...host.querySelectorAll("button,input")].every(
      (node) => (node as HTMLInputElement).disabled,
    ),
  ).toBe(true);
});
it("reports missing transport configuration and thrown custom requests", async () => {
  await render(<Upload />);
  await choose("a.txt");
  expect(host.querySelector('[role="alert"]')?.textContent).toContain(
    "action or customRequest",
  );
  await render(
    <Upload
      customRequest={() => {
        throw Error("transport failed");
      }}
    />,
  );
  await choose("b.txt");
  expect(host.textContent).toContain("transport failed");
});
it("default XHR posts FormData, reports HTTP failure and clears callbacks on abort", async () => {
  class MockXHR {
    static instances: MockXHR[] = [];
    upload = {
      onprogress: null as
        | ((event: {
            lengthComputable: boolean;
            loaded: number;
            total: number;
          }) => void)
        | null,
    };
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    status = 200;
    responseText = '{"ok":true}';
    withCredentials = false;
    open = vi.fn();
    setRequestHeader = vi.fn();
    send = vi.fn();
    abort = vi.fn();
    constructor() {
      MockXHR.instances.push(this);
    }
  }
  vi.stubGlobal("XMLHttpRequest", MockXHR);
  await render(
    <Upload
      action="/upload"
      name="document"
      data={{ folder: "test" }}
      headers={{ Authorization: "local-test" }}
      withCredentials
    />,
  );
  await choose("a.txt");
  const xhr = MockXHR.instances[0];
  expect(xhr.open).toHaveBeenCalledWith("POST", "/upload", true);
  expect(xhr.withCredentials).toBe(true);
  expect(xhr.setRequestHeader).toHaveBeenCalledWith(
    "Authorization",
    "local-test",
  );
  const body = xhr.send.mock.calls[0][0] as FormData;
  expect(body.get("folder")).toBe("test");
  expect((body.get("document") as File).name).toBe("a.txt");
  await act(() =>
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 2 }),
  );
  expect(host.querySelector("progress")?.value).toBe(50);
  await act(() => xhr.onload?.());
  expect(host.querySelector('[data-status="done"]')).not.toBeNull();
  await choose("b.txt");
  const failed = MockXHR.instances[1];
  failed.status = 500;
  await act(() => failed.onload?.());
  expect(host.textContent).toContain("HTTP 500");
  await choose("c.txt");
  const canceled = MockXHR.instances[2];
  await remove("c.txt");
  expect(canceled.abort).toHaveBeenCalledOnce();
  expect(canceled.onload).toBeNull();
  expect(canceled.upload.onprogress).toBeNull();
});
