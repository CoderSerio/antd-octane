import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import {
  Button,
  ConfigProvider,
  theme,
  Upload,
  type UploadFile,
} from "../../packages/antd-octane/src";

const mode = new URLSearchParams(location.search).get("theme");
function Demo() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? theme.darkAlgorithm
            : mode === "compact"
              ? theme.compactAlgorithm
              : theme.defaultAlgorithm,
      }}
    >
      <div style={{ padding: 24, maxWidth: 600 }}>
        <Upload
          action="/local-upload"
          accept=".txt"
          multiple
          fileList={files}
          onChange={(info) => setFiles(info.fileList)}
        />
        <div id="custom-upload">
          <Upload action="/local-upload" aria-label="Custom upload">
            <Button>Pick document</Button>
          </Upload>
        </div>
        <div id="disabled-custom-upload">
          <Upload disabled aria-label="Disabled custom upload">
            <Button>Disabled document</Button>
          </Upload>
        </div>
        <div id="dragger-upload">
          <Upload.Dragger
            action="/local-upload"
            aria-label="Drop documents"
            accept=".txt"
            multiple
            maxCount={2}
          >
            Drop text documents or press Enter to choose (maximum two).
          </Upload.Dragger>
        </div>
        <div id="dragger-single">
          <Upload.Dragger
            action="/local-upload"
            aria-label="Replace document"
            maxCount={1}
          />
        </div>
        <div id="dragger-disabled">
          <Upload.Dragger
            disabled
            action="/local-upload"
            aria-label="Disabled drop area"
          >
            Disabled drop area
          </Upload.Dragger>
        </div>
        <ConfigProvider componentDisabled>
          <Upload aria-label="Disabled upload" />
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
createRoot(root).render(<Demo />);
