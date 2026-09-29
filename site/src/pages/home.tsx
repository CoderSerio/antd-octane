import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  ConfigProvider,
  Input,
  Progress,
  Radio,
  Segmented,
  Slider,
  Space,
  Switch,
  Tag,
  theme,
} from "antd-octane";
import { useState } from "octane";
import { componentCoverage } from "../component-coverage";
import { usePageAnchor } from "../docs-ui";
import "../home.css";

const colors = [
  { name: "拂晓蓝", value: "#1677ff" },
  { name: "酱紫", value: "#722ed1" },
  { name: "青碧", value: "#13a8a8" },
  { name: "日暮", value: "#fa8c16" },
];
export default function Home({ section }: { section?: string }) {
  usePageAnchor(section);
  const [color, setColor] = useState("#1677ff");
  const [mode, setMode] = useState("明亮");
  const [progress, setProgress] = useState(64);
  const [saved, setSaved] = useState(false);
  const count = componentCoverage.filter((item) => item.implemented).length;
  return (
    <>
      <section className="home-hero">
        <div className="home-container">
          <a className="home-release" href="#compatibility">
            <span /> 0.1 Alpha · 探索中的原生组件库{" "}
            <span aria-hidden="true">↗</span>
          </a>
          <h1>
            Ant Design <span>for Octane</span>
          </h1>
          <p className="home-lead">熟悉的设计，原生的体验。</p>
          <p className="home-description">
            把熟悉的组件与主题带到 Octane，让每一次构建都从容开始。
          </p>
          <div className="home-actions">
            <Button type="primary" size="large" href="#start">
              开始使用 <span aria-hidden="true">→</span>
            </Button>
            <Button size="large" href="#components">
              浏览组件
            </Button>
          </div>
          <div className="home-paths">
            <a href="#overview">
              <span className="home-kicker">HELLO, OCTANE</span>
              <h2>从熟悉的地方出发</h2>
              <p>了解项目目标、设计取舍，以及 Octane 原生实现的边界。</p>
              <span className="home-path-tail">
                认识这个项目 <b aria-hidden="true">↗</b>
              </span>
            </a>
            <a href="#theme">
              <span className="home-kicker">DESIGN TOKENS</span>
              <h2>让品牌延续下来</h2>
              <p>从品牌色到暗色与紧凑模式，逐步迁移已有主题配置。</p>
              <span className="home-path-tail">
                定制主题 <b aria-hidden="true">↗</b>
              </span>
            </a>
            <a href="#components/coverage">
              <span className="home-kicker">BUILDING IN THE OPEN</span>
              <h2>{count} 项已提供</h2>
              <p>可运行示例、API 与支持范围，让每一步迁移都有据可查。</p>
              <span className="home-path-tail">
                查看覆盖清单 <b aria-hidden="true">↗</b>
              </span>
            </a>
          </div>
          <div className="home-foundations">
            <span>OCTANE 原生</span>
            <i /> <span>ANT DESIGN 5.x 主题基线</span>
            <i />
            <span>开源 · MIT</span>
          </div>
        </div>
      </section>
      <section className="home-showcase home-container" id="experience">
        <div className="home-section-heading">
          <span className="home-kicker">MAKE IT YOURS</span>
          <h2>熟悉的组件，你的风格</h2>
          <p>换一种颜色，切换一种模式。亲手试试正在构建的组件。</p>
        </div>
        <div className="home-showcase-toolbar">
          <Segmented
            aria-label="展示模式"
            options={["明亮", "暗色", "紧凑"]}
            value={mode}
            onChange={(v) => setMode(String(v))}
          />
          <fieldset className="home-swatches" aria-label="展示品牌色">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-label={c.name}
                aria-pressed={color === c.value}
                style={{ "--swatch": c.value }}
                onClick={() => setColor(c.value)}
              >
                <span />
              </button>
            ))}
          </fieldset>
        </div>
        <ConfigProvider
          theme={{
            algorithm:
              mode === "暗色"
                ? theme.darkAlgorithm
                : mode === "紧凑"
                  ? theme.compactAlgorithm
                  : theme.defaultAlgorithm,
            token: { colorPrimary: color },
          }}
        >
          <div
            className="home-demo-board"
            data-mode={mode === "暗色" ? "dark" : "light"}
            style={{ "--demo-accent": color }}
          >
            <div className="home-demo-card home-controls">
              <div className="home-demo-heading">
                <h3>从一个想法开始</h3>
                <Tag color="blue">组件体验</Tag>
              </div>
              <Input
                aria-label="项目名称"
                placeholder="为你的下一个项目命名"
                allowClear
              />
              <Space wrap>
                <Button type="primary" onClick={() => setSaved(!saved)}>
                  {saved ? "已保存" : "保存项目"}
                </Button>
                <Button onClick={() => setSaved(false)}>重置状态</Button>
                <Button type="dashed" href="#button">
                  更多按钮
                </Button>
              </Space>
              <p className="home-demo-status" role="status">
                {saved
                  ? "项目已保存，可以继续探索。"
                  : "这里的组件都可以交互。"}
              </p>
              <div className="home-control-row">
                <Checkbox defaultChecked>接收项目动态</Checkbox>
                <Switch defaultChecked aria-label="开启通知" />
              </div>
              <Radio.Group
                aria-label="项目可见范围"
                options={["公开项目", "私有项目"]}
                defaultValue="公开项目"
              />
            </div>
            <div className="home-demo-card">
              <div className="home-demo-heading">
                <h3>每一步，都看得见</h3>
                <Badge status="processing" text="进行中" />
              </div>
              <div className="home-progress">
                <Progress type="circle" percent={progress} size={112} />
                <div>
                  <strong>{progress}%</strong>
                  <p>示例项目进度</p>
                </div>
              </div>
              <Slider
                aria-label="示例进度"
                value={progress}
                onChange={(v) => setProgress(v as number)}
              />
              <div className="home-demo-foot">
                <span>拖动滑块，查看变化</span>
                <a href="#progress">进度条文档 ↗</a>
              </div>
            </div>
            <div className="home-demo-card">
              <div className="home-demo-heading">
                <h3>一起完成更多</h3>
                <Tag color="success">准备就绪</Tag>
              </div>
              <div className="home-person">
                <Avatar size={48} style={{ background: color }}>
                  O
                </Avatar>
                <div>
                  <strong>Octane 工作空间</strong>
                  <p>为下一次创作做好准备</p>
                </div>
              </div>
              <div className="home-tag-row">
                <Tag>设计</Tag>
                <Tag color="blue">开发</Tag>
                <Tag color="purple">协作</Tag>
              </div>
              <div className="home-demo-divider" />
              <p className="home-demo-copy">
                统一的视觉语言，让不同的组件自然地融入同一个界面。
              </p>
              <Button block href="#components">
                探索组件库 →
              </Button>
            </div>
          </div>
        </ConfigProvider>
        <p className="home-showcase-note">
          此处切换仅影响展示区域。<a href="#theme">了解全局与局部主题 →</a>
        </p>
      </section>
      <section className="home-start-section">
        <div className="home-container home-start-grid">
          <div>
            <span className="home-kicker">YOUR NEXT STEP</span>
            <h2>从第一个 Button 开始</h2>
            <p>
              熟悉的组件接口，配合 Octane 的原生运行时。
              <br />
              先运行示例，再逐项检查你的迁移需求。
            </p>
            <Button type="primary" size="large" href="#start">
              阅读快速开始 →
            </Button>
          </div>
          <div className="home-code">
            <div>
              <span>App.tsx</span>
              <span>Octane + TypeScript</span>
            </div>
            <pre>
              <code>{`import { Button } from 'antd-octane';\nimport 'antd-octane/style.css';\n\nexport default function App() {\n  return <Button type="primary">\n    开始构建\n  </Button>;\n}`}</code>
            </pre>
          </div>
        </div>
      </section>
      <footer className="home-footer home-container">
        <div>
          <strong>Ant Design for Octane</strong>
          <p>独立社区探索 · MIT 开源</p>
        </div>
        <nav aria-label="首页资源">
          <a href="#compatibility">兼容与迁移</a>
          <a href="https://github.com/CoderSerio/antd-octane">GitHub ↗</a>
          <a href="https://github.com/CoderSerio/antd-octane/issues">
            反馈问题 ↗
          </a>
        </nav>
        <p className="home-alpha-note">
          当前为 Alpha。已提供数量不代表完整 API
          兼容，使用前请查阅各组件的支持范围。
        </p>
      </footer>
    </>
  );
}
