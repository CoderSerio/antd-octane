import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The library dist must already be built. This check never mutates workspace dependencies.
const root = resolve(import.meta.dirname, "..");
const directory = mkdtempSync(join(tmpdir(), "antd-octane-tailwind-"));
const run = (args, cwd = directory) =>
  execFileSync("pnpm", args, { cwd, stdio: "inherit" });
const installed = (name) =>
  JSON.parse(
    readFileSync(join(root, "node_modules", name, "package.json"), "utf8"),
  ).version;
const versions = {
  octane: installed("octane"),
  vite: installed("vite"),
  typescript: installed("typescript"),
  tailwindcss: "4.3.3",
  "@tailwindcss/vite": "4.3.3",
};
try {
  run(
    ["pack", "--pack-destination", directory],
    join(root, "packages/antd-octane"),
  );
  const archive = readdirSync(directory).find((name) => name.endsWith(".tgz"));
  if (!archive) throw Error("Missing library tarball");
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: "antd-octane-tailwind-consumer",
        private: true,
        type: "module",
        dependencies: {
          "antd-octane": `file:./${archive}`,
          octane: versions.octane,
        },
        devDependencies: {
          vite: versions.vite,
          typescript: versions.typescript,
          tailwindcss: versions.tailwindcss,
          "@tailwindcss/vite": versions["@tailwindcss/vite"],
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(join(directory, ".npmrc"), "auto-install-peers=false\n");
  run(["install", "--ignore-scripts"]);
  writeFileSync(
    join(directory, "index.html"),
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tailwind v4 packed consumer</title><link rel="icon" href="data:,"></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
  );
  writeFileSync(
    join(directory, "app.css"),
    '@layer theme, base, antd, components, utilities;\n@import "tailwindcss";\n@import "antd-octane/style.css";\n@theme inline { --color-app-primary: var(--app-primary); }\n',
  );
  writeFileSync(
    join(directory, "main.tsx"),
    `import {createRoot,useState,type CSSProperties} from 'octane';
import {App,Button,ConfigProvider,Modal,theme} from 'antd-octane';
import {StyleProvider} from 'antd-octane/style';
import './app.css';
function ThemeScope(){const {token}=theme.useToken();return <section style={{'--app-primary':token.colorPrimary} as CSSProperties}><span id="mapped-primary" className="text-app-primary">Mapped application token</span></section>;}
function Consumer(){
 const [mode,setMode]=useState('default');
 const [open,setOpen]=useState(false);
 const chosen=mode==='dark'?{algorithm:theme.darkAlgorithm}:mode==='compact'?{algorithm:theme.compactAlgorithm}:mode==='brand'?{token:{colorPrimary:'#722ed1'}}:{};
 return <ConfigProvider theme={chosen}><main className="p-6"><h1 className="mb-4 text-2xl font-bold">Tailwind v4 packed consumer</h1><label>Theme <select aria-label="Theme" value={mode} onChange={event=>setMode((event.target as HTMLSelectElement).value)} className="mb-4 border p-2"><option value="default">Default</option><option value="brand">Brand</option><option value="dark">Dark</option><option value="compact">Compact</option></select></label><ThemeScope/><section id="utility-layout" className="grid grid-cols-2 gap-4 p-6 w-[640px] max-w-full"><Button id="default">Default button</Button><Button id="primary" type="primary">Primary button</Button><Button id="utility" className="h-12 px-8 gap-3" icon={<span aria-hidden="true">+</span>}>Utility button</Button><Button id="disabled" disabled>Disabled button</Button></section><section id="layered-app"><App className="text-xl text-purple-700"><span id="layered-app-child">App utility text</span></App></section><Button id="open-utility-modal" onClick={()=>setOpen(true)}>Open utility Modal</Button><Modal title="Tailwind modal" open={open} onOk={()=>setOpen(false)} onCancel={()=>setOpen(false)} classNames={{body:"p-8"}}><span id="utility-modal-body">Modal utility padding</span></Modal><p id="mode">{mode}</p></main></ConfigProvider>;
}
const container=document.getElementById('root');if(!container)throw Error('Missing root');createRoot(container).render(<StyleProvider layer><Consumer/></StyleProvider>);
`,
  );
  writeFileSync(
    join(directory, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          strict: true,
          skipLibCheck: true,
          jsx: "react-jsx",
          jsxImportSource: "octane",
          noEmit: true,
        },
        include: ["main.tsx"],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(directory, "vite.config.ts"),
    `import {defineConfig} from 'vite';
import {octane} from 'octane/compiler/vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[octane(),tailwindcss()],build:{target:'es2022'},preview:{host:'127.0.0.1',port:4176,strictPort:true}});`,
  );
  run(["exec", "tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);
  const cssFiles = readdirSync(join(directory, "dist/assets")).filter((name) =>
    name.endsWith(".css"),
  );
  const css = cssFiles
    .map((name) => readFileSync(join(directory, "dist/assets", name), "utf8"))
    .join("\n");
  if (
    !css.includes("@layer antd") ||
    !css.includes(".h-12") ||
    !css.includes(".grid-cols-2")
  )
    throw Error("Missing library layer or generated Tailwind utilities");
  const manifest = JSON.parse(
    readFileSync(
      join(directory, "node_modules/antd-octane/package.json"),
      "utf8",
    ),
  );
  if (manifest.dependencies?.react || manifest.dependencies?.antd)
    throw Error("Unexpected React runtime dependency");
  console.log(
    JSON.stringify(
      {
        check: "Tailwind consumer typecheck and production build passed",
        versions,
        node: process.version,
        directory,
        retained: !!process.env.KEEP_TAILWIND_CONSUMER,
        browserVerification:
          "tests/browser/verify-tailwind.mjs against preview port 4176",
      },
      null,
      2,
    ),
  );
  if (process.env.KEEP_TAILWIND_CONSUMER)
    console.log(`Preview: cd ${directory} && pnpm exec vite preview`);
} finally {
  if (!process.env.KEEP_TAILWIND_CONSUMER)
    rmSync(directory, { recursive: true, force: true });
}
