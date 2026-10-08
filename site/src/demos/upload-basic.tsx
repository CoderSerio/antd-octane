import { Space, Upload, type UploadFile } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <p>
        仅本地模拟请求，不发送或保存文件。选择文件名含 fail
        的文件可模拟失败；上传期间移除会取消计时器。
      </p>
      <Upload
        multiple
        accept=".txt"
        fileList={files}
        onChange={(info) => setFiles(info.fileList)}
        customRequest={({ file, onProgress, onSuccess, onError }) => {
          let percent = 0;
          const timer = setInterval(() => {
            percent += 25;
            onProgress({ percent });
            if (percent >= 100) {
              clearInterval(timer);
              if (file instanceof File && file.name.includes("fail"))
                onError(new Error("本地模拟失败"));
              else onSuccess({ localOnly: true });
            }
          }, 250);
          return { abort: () => clearInterval(timer) };
        }}
      />
      <p aria-live="polite">列表中 {files.length} 个文件</p>
    </Space>
  );
}
