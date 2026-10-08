/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useEffect, useLayoutEffect, useRef, useState } from "octane";
import { useConfig } from "../config-provider";
export const LIST_IGNORE = Symbol("Upload.LIST_IGNORE");
export interface UploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  status?: "uploading" | "done" | "error" | "removed";
  percent?: number;
  response?: unknown;
  error?: Error;
  originFileObj?: File;
}
export interface UploadRequestOptions {
  file: File | Blob;
  filename: string;
  action?: string;
  data?: Record<string, string | Blob>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onProgress: (event: { percent: number }) => void;
  onSuccess: (response: unknown) => void;
  onError: (error: Error) => void;
}
export interface UploadRequest {
  abort: () => void;
}
export interface UploadProps {
  action?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  beforeUpload?: (
    file: File,
    files: File[],
  ) =>
    | boolean
    | void
    | File
    | Blob
    | typeof LIST_IGNORE
    // biome-ignore lint/suspicious/noConfusingVoidType: Async callbacks may intentionally return nothing.
    | Promise<boolean | void | File | Blob | typeof LIST_IGNORE>;
  // biome-ignore lint/suspicious/noConfusingVoidType: A transport may omit its optional abort handle.
  customRequest?: (options: UploadRequestOptions) => UploadRequest | void;
  onChange?: (info: {
    file: UploadFile;
    fileList: UploadFile[];
    event?: { percent: number };
  }) => void;
  // biome-ignore lint/suspicious/noConfusingVoidType: An observer callback returning nothing approves removal.
  onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>;
  data?: Record<string, string | Blob>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  showUploadList?: boolean;
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}
function request(options: UploadRequestOptions): UploadRequest {
  if (!options.action)
    throw new Error("Upload requires action or customRequest.");
  const xhr = new XMLHttpRequest();
  const body = new FormData();
  for (const [key, value] of Object.entries(options.data ?? {}))
    body.append(key, value);
  body.append(
    options.filename,
    options.file,
    options.file instanceof File ? options.file.name : "file",
  );
  xhr.open("POST", options.action, true);
  xhr.withCredentials = options.withCredentials ?? false;
  for (const [key, value] of Object.entries(options.headers ?? {}))
    xhr.setRequestHeader(key, value);
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable)
      options.onProgress({ percent: (event.loaded / event.total) * 100 });
  };
  xhr.onerror = () => options.onError(new Error("Upload network error"));
  xhr.onload = () => {
    let response: unknown = xhr.responseText;
    try {
      response = JSON.parse(xhr.responseText);
    } catch {
      /* Plain-text responses are valid. */
    }
    if (xhr.status >= 200 && xhr.status < 300) options.onSuccess(response);
    else options.onError(new Error(`Upload failed with HTTP ${xhr.status}`));
  };
  xhr.send(body);
  return {
    abort() {
      xhr.onload = null;
      xhr.onerror = null;
      xhr.upload.onprogress = null;
      xhr.abort();
    },
  };
}
let sequence = 0;
export interface UploadDraggerProps extends UploadProps {
  onDrop?: (event: DragEvent) => void;
  height?: number;
}
function accepts(file: File, accept?: string) {
  if (!accept?.trim()) return true;
  return accept.split(",").some((part) => {
    const pattern = part.trim().toLowerCase();
    if (pattern === "*" || pattern === "*/*") return true;
    if (pattern.startsWith("."))
      return file.name.toLowerCase().endsWith(pattern);
    if (pattern.endsWith("/*"))
      return file.type.toLowerCase().startsWith(pattern.slice(0, -1));
    return !!pattern && file.type.toLowerCase() === pattern;
  });
}
function UploadBase(
  props: UploadProps & {
    drag?: boolean;
    dragHeight?: number;
    onDrop?: (event: DragEvent) => void;
  },
) {
  const config = useConfig();
  const disabled = props.disabled ?? config.componentDisabled ?? false;
  if (
    props.maxCount !== undefined &&
    (!Number.isInteger(props.maxCount) || props.maxCount < 1)
  )
    throw new RangeError("Upload maxCount must be a positive integer");
  const enabled = useRef(!disabled);
  enabled.current = !disabled;
  const batchSequence = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [inner, setInner] = useState<UploadFile[]>(props.defaultFileList ?? []);
  const files = props.fileList ?? inner;
  const latest = useRef(props);
  latest.current = props;
  const current = useRef(files);
  const committed = useRef(files);
  current.current = files;
  committed.current = files;
  const input = useRef<HTMLInputElement | null>(null);
  const alive = useRef(true);
  const requests = useRef(new Map<string, { abort?: () => void }>());
  const removals = useRef(new Map<string, symbol>());
  const emit = (
    file: UploadFile,
    next: UploadFile[],
    event?: { percent: number },
  ) => {
    if (!alive.current) return;
    // Accumulate same-turn events so concurrent requests do not overwrite each other.
    current.current = next;
    if (latest.current.fileList === undefined) setInner(next);
    latest.current.onChange?.({ file, fileList: next, event });
    if (latest.current.fileList !== undefined) {
      // An owner may reject the proposal without rendering at all.
      queueMicrotask(() => {
        current.current = committed.current;
      });
    }
  };
  const abort = (uid: string) => {
    const active = requests.current.get(uid);
    requests.current.delete(uid);
    active?.abort?.();
  };
  useEffect(
    () => () => {
      alive.current = false;
      for (const uid of requests.current.keys()) abort(uid);
      removals.current.clear();
    },
    [],
  );
  useLayoutEffect(() => {
    for (const uid of requests.current.keys())
      if (!files.some((file) => file.uid === uid)) abort(uid);
    for (const uid of removals.current.keys())
      if (!files.some((file) => file.uid === uid)) removals.current.delete(uid);
  }, [files]);
  const upload = async (original: File, batch: File[], batchId: number) => {
    const stale = () =>
      !alive.current ||
      !enabled.current ||
      (latest.current.maxCount === 1 && batchId !== batchSequence.current);
    if (stale()) return;
    const uid = `upload-${Date.now()}-${++sequence}`;
    let transformed: Awaited<
      ReturnType<NonNullable<UploadProps["beforeUpload"]>>
    >;
    try {
      transformed = await latest.current.beforeUpload?.(original, batch);
    } catch {
      transformed = false;
    }
    if (stale() || transformed === LIST_IGNORE) return;
    const file: UploadFile = {
      uid,
      name: original.name,
      size: original.size,
      type: original.type,
      originFileObj: original,
      ...(transformed === false
        ? {}
        : { status: "uploading" as const, percent: 0 }),
    };
    const proposed = [...current.current, file];
    const limit = latest.current.maxCount;
    const next =
      limit === 1
        ? proposed.slice(-1)
        : limit
          ? proposed.slice(0, limit)
          : proposed;
    // A truncated file never starts a transport or produces an onChange event.
    if (!next.some((item) => item.uid === uid)) return;
    emit(file, next);
    if (transformed === false) return;
    // Give a controlled owner a commit to accept the proposed list before I/O.
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    if (stale() || !current.current.some((item) => item.uid === uid)) return;
    const active: { abort?: () => void } = {};
    requests.current.set(uid, active);
    const update = (
      patch: Partial<UploadFile>,
      event?: { percent: number },
      final = false,
    ) => {
      if (!alive.current || requests.current.get(uid) !== active) return;
      const previous = current.current.find((item) => item.uid === uid);
      if (!previous) {
        abort(uid);
        return;
      }
      if (final) requests.current.delete(uid);
      const next = { ...previous, ...patch };
      emit(
        next,
        current.current.map((item) => (item.uid === uid ? next : item)),
        event,
      );
    };
    try {
      const body =
        transformed instanceof File
          ? transformed
          : transformed instanceof Blob
            ? new File([transformed], original.name, { type: transformed.type })
            : original;
      const options: UploadRequestOptions = {
        file: body,
        filename: latest.current.name ?? "file",
        action: latest.current.action,
        data: latest.current.data,
        headers: latest.current.headers,
        withCredentials: latest.current.withCredentials,
        onProgress: (event) => update({ percent: event.percent }, event),
        onSuccess: (response) =>
          update({ status: "done", percent: 100, response }, undefined, true),
        onError: (error) => update({ status: "error", error }, undefined, true),
      };
      const handle = (latest.current.customRequest ?? request)(options);
      if (requests.current.get(uid) === active)
        active.abort = () => handle?.abort();
      // A synchronous callback may remove/unmount this upload before a handle exists.
      else if (
        !alive.current ||
        !current.current.some((item) => item.uid === uid)
      )
        handle?.abort();
    } catch (error) {
      update(
        {
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        },
        undefined,
        true,
      );
    }
  };
  const enqueue = async (incoming: File[]) => {
    if (!alive.current || !enabled.current) return;
    let batch = incoming.filter((file) => accepts(file, latest.current.accept));
    if (!latest.current.multiple) batch = batch.slice(0, 1);
    if (!batch.length) return;
    const batchId = ++batchSequence.current;
    for (const file of batch) {
      if (!alive.current || !enabled.current) break;
      await upload(file, batch, batchId);
    }
  };
  const remove = async (file: UploadFile) => {
    if (disabled) return;
    const token = Symbol();
    removals.current.set(file.uid, token);
    // biome-ignore lint/suspicious/noConfusingVoidType: Preserve the callback return type.
    let allowed: boolean | void;
    try {
      allowed = await latest.current.onRemove?.(file);
    } catch {
      allowed = false;
    }
    if (!alive.current || removals.current.get(file.uid) !== token) return;
    removals.current.delete(file.uid);
    if (
      allowed === false ||
      !current.current.some((item) => item.uid === file.uid)
    )
      return;
    abort(file.uid);
    emit(
      { ...file, status: "removed" },
      current.current.filter((item) => item.uid !== file.uid),
    );
  };
  const t = config.token;
  return (
    <div
      className={["ant-upload", props.className]}
      dir={config.direction}
      style={{
        color: t.colorText,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        "--ao-upload-border": t.colorBorder,
        "--ao-upload-bg": t.colorBgContainer,
        "--ao-upload-error": t.colorError,
        ...props.style,
      }}
    >
      <input
        ref={input}
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        disabled={disabled}
        hidden
        onChange={(event) => {
          const batch = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          void enqueue(batch);
        }}
      />
      {props.children === undefined && !props.drag ? (
        <button
          type="button"
          className="ant-upload-trigger"
          disabled={disabled}
          aria-label={props["aria-label"] ?? "Choose files"}
          onClick={() => input.current?.click()}
        >
          Choose files
        </button>
      ) : (
        // biome-ignore lint/a11y/useSemanticElements: Custom children may already be native buttons; avoid invalid nested buttons.
        <span
          className={[
            "ant-upload-custom-trigger",
            props.drag && "ant-upload-drag",
            dragging && !disabled && "ant-upload-drag-hover",
          ]}
          style={
            props.dragHeight === undefined
              ? undefined
              : { height: props.dragHeight, minHeight: 0 }
          }
          onDragOver={(event) => {
            if (!props.drag) return;
            event.preventDefault();
            if (event.dataTransfer)
              event.dataTransfer.dropEffect = disabled ? "none" : "copy";
            if (!disabled) setDragging(true);
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setDragging(false);
          }}
          onDrop={(event) => {
            if (!props.drag) return;
            event.preventDefault();
            setDragging(false);
            if (disabled) return;
            props.onDrop?.(event);
            void enqueue(Array.from(event.dataTransfer?.files ?? []));
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={props["aria-label"] ?? "Choose files"}
          aria-disabled={disabled || undefined}
          onClick={() => {
            if (!disabled) input.current?.click();
          }}
          onKeyDown={(event) => {
            // Native interactive children produce their own click from the keyboard.
            if (event.target !== event.currentTarget || disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              input.current?.click();
            }
          }}
        >
          <span inert={disabled}>
            {props.children ?? "Click or drag files here to upload"}
          </span>
        </span>
      )}
      {props.showUploadList !== false && (
        <ul className="ant-upload-list">
          {files.map((file) => (
            <li key={file.uid} data-status={file.status}>
              <span>{file.name}</span>
              {file.status === "uploading" && (
                <progress
                  aria-label={`Upload progress ${file.name}`}
                  max={100}
                  value={file.percent ?? 0}
                />
              )}
              <span role={file.status === "error" ? "alert" : "status"}>
                {file.status === "error"
                  ? (file.error?.message ?? "Upload failed")
                  : file.status === "done"
                    ? "Uploaded"
                    : ""}
              </span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                onClick={() => void remove(file)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function UploadInternal(props: UploadProps) {
  return <UploadBase {...props} />;
}
function Dragger(props: UploadDraggerProps) {
  return <UploadBase {...props} drag dragHeight={props.height} />;
}
export const Upload = Object.assign(UploadInternal, {
  Dragger,
  LIST_IGNORE: LIST_IGNORE as typeof LIST_IGNORE,
});
