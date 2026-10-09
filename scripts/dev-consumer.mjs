import { execFileSync, spawn } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Real, packed consumers: no workspace aliases, symlinks or existing Vite cache.
// Keep this separate from pack:check: a successful build cannot detect dev CJS errors.
const root = resolve(import.meta.dirname, "..");
const directory = mkdtempSync(join(tmpdir(), "antd-octane-cold-dev-"));
const withoutIntegration = process.argv.includes("--without-integration");
const port = process.env.PORT ?? "5197";
const buttonOnly = process.argv.includes("--button-only");
const run = (args, cwd = directory) =>
  execFileSync("pnpm", args, { cwd, stdio: "inherit" });
let server;
function cleanup() {
  if (process.env.KEEP_CONSUMER)
    console.log(`Consumer retained at ${directory}`);
  else rmSync(directory, { recursive: true, force: true });
}
try {
  run(
    ["pack", "--pack-destination", directory],
    join(root, "packages/antd-octane"),
  );
  const archive = readdirSync(directory).find((name) => name.endsWith(".tgz"));
  if (!archive) throw new Error("Package archive missing");
  const versions = Object.fromEntries(
    ["octane", "vite", "typescript", "@types/node", "dayjs"].map((name) => [
      name,
      JSON.parse(
        readFileSync(join(root, "node_modules", name, "package.json"), "utf8"),
      ).version,
    ]),
  );
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: "antd-octane-cold-dev-check",
        private: true,
        type: "module",
        dependencies: {
          "antd-octane": `file:./${archive}`,
          octane: versions.octane,
          dayjs: versions.dayjs,
        },
        devDependencies: {
          vite: versions.vite,
          typescript: versions.typescript,
          "@types/node": versions["@types/node"],
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(join(directory, ".npmrc"), "auto-install-peers=false\n");
  run(["install", "--prefer-offline", "--ignore-scripts"]);
  for (const [name, extension] of [
    ["button", "tsx"],
    ["dates", "tsx"],
    ["signals", "tsrx"],
  ]) {
    writeFileSync(
      join(directory, `${name}.html`),
      `<div id="root"></div><script type="module" src="/${name}.${extension}"></script>`,
    );
  }
  writeFileSync(
    join(directory, "button.tsx"),
    `
import { createRoot, useState } from 'octane';
import { Button } from 'antd-octane';
function Page() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>Clicked {count}</Button>;
}
createRoot(document.getElementById('root')!).render(Page, {});
`,
  );
  const imports = `
import { createRoot, useState } from 'octane';
import { useSignal$ } from 'octane/signals/client';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { DatePicker, Calendar } from 'antd-octane';
`;
  function content(value, update) {
    return `<main>
      <DatePicker id="date-input" locale={{ locale: 'fr' }} format="DD MMMM YYYY"
        defaultValue={dayjs('2025-06-15')} onChange={(date) => ${update}(date?.format('YYYY-MM-DD') ?? 'empty')} />
      <output id="selected-date">{${value}}</output>
      <output id="app-locale">{dayjs('2025-06-15').locale('fr').format('MMMM')}</output>
      <Calendar fullscreen={false} defaultValue={dayjs('2025-06-15')}
        locale={{ lang: { locale: 'fr_FR' } }} onSelect={(date) => ${update}(date.format('YYYY-MM-DD'))} />
    </main>`;
  }
  writeFileSync(
    join(directory, "dates.tsx"),
    `${imports}
function Page() {
  const [selected, setSelected] = useState('none');
  return ${content("selected", "setSelected")};
}
createRoot(document.getElementById('root')!).render(Page, {});`,
  );
  writeFileSync(
    join(directory, "signals.tsrx"),
    `${imports}
function Page() @{
  const selected$ = useSignal$('none');
  ${content("selected$.get()", "selected$.set")}
}
createRoot(document.getElementById('root')!).render(Page, {});`,
  );
  writeFileSync(
    join(directory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        jsx: "react-jsx",
        jsxImportSource: "octane",
        noEmit: true,
        types: ["vite/client", "node"],
      },
      include: ["*.tsx", "vite.config.ts"],
    }),
  );
  writeFileSync(
    join(directory, "vite.config.ts"),
    `
import { defineConfig } from 'vite';
import { octane } from 'octane/compiler/vite';
${withoutIntegration ? "" : "import { antdOctane } from 'antd-octane/vite';"}
export default defineConfig({
  plugins: [octane()${withoutIntegration ? "" : ", antdOctane()"}],
  // In Button-only mode, date imports cannot accidentally fix its dependencies.
  optimizeDeps: { entries: ${JSON.stringify(buttonOnly ? ["button.html"] : ["button.html", "dates.html", "signals.html"])} },
  build: { rollupOptions: { input: ['button.html', 'dates.html', 'signals.html'] } },
});`,
  );
  run(["exec", "tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);
  console.log(`Packed consumer: ${directory}`);
  console.log(
    `Cold dev: http://127.0.0.1:${port}/button.html (integration ${withoutIntegration ? "OFF — regression reproduction" : "ON"})`,
  );
  server = spawn(
    "pnpm",
    [
      "exec",
      "vite",
      "--host",
      "127.0.0.1",
      "--port",
      port,
      "--strictPort",
      "--force",
    ],
    { cwd: directory, stdio: "inherit" },
  );
  let shutdownRequested = false;
  const stop = () => {
    shutdownRequested = true;
    server.kill("SIGINT");
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  await new Promise((resolve, reject) => {
    server.on("error", reject);
    server.on("exit", (code, signal) => {
      if (
        shutdownRequested &&
        (code === 0 || code === 130 || signal === "SIGINT")
      )
        resolve();
      else reject(new Error(`Vite exited unexpectedly: ${signal ?? code}`));
    });
  });
} finally {
  server?.kill("SIGINT");
  cleanup();
}
