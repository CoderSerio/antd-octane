/** @jsxImportSource octane */
import { createRoot, useState } from "octane";
import {
  Cascader,
  ConfigProvider,
  TreeSelect,
  theme,
} from "../../packages/antd-octane/src";
import "../../packages/antd-octane/src/style.css";
function Scene() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [value, setValue] = useState<(string | number)[]>([]);
  const [path, setPath] = useState<(string | number)[]>([]);
  return (
    <ConfigProvider
      theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <main style={{ padding: 20 }}>
        <button type="button" onClick={() => setDark(!dark)}>
          Toggle theme
        </button>
        <button type="button" onClick={() => setMounted(!mounted)}>
          Toggle controls
        </button>
        {mounted && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 20,
            }}
          >
            <TreeSelect
              aria-label="Places tree"
              multiple
              value={value}
              onChange={setValue}
              treeDefaultExpandAll
              showSearch
              allowClear
              treeData={[
                {
                  value: "world",
                  title: "World",
                  children: [
                    { value: "jp", title: "Japan" },
                    { value: "cn", title: "China" },
                    { value: "blocked", title: "Blocked", disabled: true },
                  ],
                },
              ]}
            />
            <Cascader
              aria-label="Place path"
              showSearch
              allowClear
              value={path}
              onChange={setPath}
              options={[
                {
                  value: "asia",
                  label: "Asia",
                  children: [
                    { value: "tokyo", label: "Tokyo" },
                    { value: "blocked", label: "Blocked", disabled: true },
                  ],
                },
              ]}
            />
          </div>
        )}
        <output aria-label="Tree value">{JSON.stringify(value)}</output>
        <output aria-label="Path value">{JSON.stringify(path)}</output>
      </main>
    </ConfigProvider>
  );
}
createRoot(document.getElementById("root")!).render(<Scene />);
