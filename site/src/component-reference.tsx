import { Popover, theme } from "antd-octane";
import type { OctaneNode } from "octane";
import { upstreamSlug } from "./component-coverage";
import { ComponentProse, ComponentSectionHeading } from "./component-prose";
import { ApiTable } from "./docs-ui";
import alert from "./feedback/alert.json";
import drawer from "./feedback/drawer.json";
import message from "./feedback/message.json";

export interface ApiSection {
  title: string;
  rows: string[][];
}
export interface TokenReference {
  component: string[][];
  global: string[][];
}

const references: Record<
  string,
  { api: ApiSection[]; tokens: TokenReference }
> = {
  Alert: alert,

  Drawer: drawer,
  Message: message,

};

export function ReferenceApiTables({ component }: { component: string }) {
  const reference = references[component];
  if (!reference) throw new Error(`Missing reference data for ${component}`);
  return <ComponentApiTables component={component} sections={reference.api} />;
}

export function ReferenceTokenTable({ component }: { component: string }) {
  const reference = references[component];
  if (!reference) throw new Error(`Missing reference data for ${component}`);
  return (
    <ComponentTokenTable component={component} tokens={reference.tokens} />
  );
}

/** Render parameter rows from the pinned upstream source. */
export function ComponentApiTables({
  component,
  sections,
  sectionNotes,
}: {
  component: string;
  sections: ApiSection[];
  sectionNotes?: Record<string, OctaneNode>;
}) {
  const referenceUrl = `https://5x.ant.design/components/${upstreamSlug(component)}-cn/`;
  return (
    <>
      <ComponentProse component={component} part="apiIntro" />
      {sections.map(({ title, rows }, index) => (
        <section key={`${title}-${index}`}>
          <ComponentProse
            component={component}
            part="sectionBefore"
            section={title}
          />
          <ComponentSectionHeading component={component} title={title} />
          <ComponentProse
            component={component}
            part="sectionIntro"
            section={title}
          />
          <ApiTable
            rows={rows}
            className="reference-table"
            markdown
            referenceUrl={referenceUrl}
            label={`${component} ${title} API 参数表，可横向滚动`}
          />
          {sectionNotes?.[title]}
          <ComponentProse
            component={component}
            part="sectionAfter"
            section={title}
          />
        </section>
      ))}
      <ComponentProse component={component} part="afterApi" />
    </>
  );
}

export function ApiNote({ children }: { children: OctaneNode }) {
  const { token } = theme.useToken();
  return (
    <blockquote
      className="api-note"
      style={{
        "--api-note-color": token.colorTextSecondary,
        "--api-note-border": token.colorSplit,
        "--api-note-code-bg": token.colorFillTertiary,
        "--api-note-code-radius": `${token.borderRadiusSM}px`,
        "--api-note-font-size": `${token.fontSize}px`,
      }}
    >
      <p>{children}</p>
    </blockquote>
  );
}

export function ComponentTokenTable({
  component,
  tokens,
}: {
  component: string;
  tokens: TokenReference;
}) {
  const { token } = theme.useToken();
  return (
    <div
      className="token-reference"
      style={{
        "--token-code-bg": token.colorFillTertiary,
        "--token-code-border": token.colorSplit,
        "--token-code-radius": `${token.borderRadiusSM}px`,
        "--token-color-radius": `${token.borderRadius}px`,
        "--token-motion-duration": token.motionDurationSlow,
      }}
    >
      {tokens.component.length > 0 && (
        <details className="token-table component-token-table" open>
          <summary>
            <TokenArrow />
            组件 Token
          </summary>
          <ApiTable
            rows={tokens.component}
            className="reference-table token-reference-table"
            codeName={false}
            renderValue={renderTokenValue}
            headers={["Token 名称", "描述", "类型", "默认值"]}
            label={`${component} 组件 Token 表，可横向滚动`}
          />
        </details>
      )}
      {tokens.global.length > 0 && (
        <details className="token-table global-token-table">
          <summary>
            <TokenArrow />
            全局 Token
          </summary>
          <ApiTable
            rows={tokens.global}
            className="reference-table token-reference-table"
            codeName={false}
            renderValue={renderTokenValue}
            headers={["Token 名称", "描述", "类型", "默认值"]}
            label={`${component} 全局 Token 表，可横向滚动`}
          />
        </details>
      )}
    </div>
  );
}

function TokenArrow() {
  return (
    <svg className="token-arrow" viewBox="64 64 896 896" aria-hidden="true">
      <path
        fill="currentColor"
        d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.2 12.6L668 512 308.2 793.1c-3.9 3-6.2 7.7-6.2 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.99 31.99 0 000-50.4z"
      />
    </svg>
  );
}

function renderTokenValue(value: string) {
  if (!value.startsWith("#") && !value.startsWith("rgb")) return value;
  return (
    <Popover
      placement="left"
      color={value}
      trigger={["hover", "focus"]}
      content={<div hidden />}
      styles={{ body: { width: 120, height: 120, backgroundColor: value } }}
    >
      <span className="token-color">
        <span className="token-color-dot" style={{ backgroundColor: value }} />
        {value}
      </span>
    </Popover>
  );
}
