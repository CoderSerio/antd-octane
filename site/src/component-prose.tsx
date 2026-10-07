import { upstreamSlug } from "./component-coverage";
import copy from "./component-prose.json";
import { ReferenceText } from "./docs-ui";
import { ReferenceMarkdown } from "./reference-markdown";

interface ComponentCopy {
  description?: string;
  when?: string;
  beforeExamples?: string;
  apiIntro?: string;
  afterApi?: string;
  sectionBefore?: Record<string, string>;
  sectionIntro?: Record<string, string>;
  sectionAfter?: Record<string, string>;
  sectionHeadings?: Record<string, number>;
}
const references: Record<string, ComponentCopy> = copy;

export function ComponentDescription({ component }: { component: string }) {
  return <p className="lead">{references[component]?.description}</p>;
}

export function ComponentSectionHeading({
  component,
  title,
}: {
  component: string;
  title: string;
}) {
  const level = references[component]?.sectionHeadings?.[title] ?? 3;
  if (!level) return null;
  const content = <ReferenceText text={title} />;
  if (level === 2) return <h2>{content}</h2>;
  if (level === 4) return <h4>{content}</h4>;
  return <h3>{content}</h3>;
}

export function ComponentWhenToUse({ component }: { component: string }) {
  const markdown = references[component]?.when;
  if (!markdown) return null;
  return (
    <>
      <h2 id="when-to-use" tabIndex={-1}>
        何时使用
      </h2>
      <ReferenceMarkdown
        markdown={markdown}
        referenceUrl={`https://5x.ant.design/components/${upstreamSlug(component)}-cn/`}
      />
    </>
  );
}

export function ComponentProse({
  component,
  part,
  section,
}: {
  component: string;
  part:
    | "beforeExamples"
    | "apiIntro"
    | "afterApi"
    | "sectionBefore"
    | "sectionIntro"
    | "sectionAfter";
  section?: string;
}) {
  const value = references[component]?.[part];
  const markdown = typeof value === "string" ? value : value?.[section ?? ""];
  if (!markdown) return null;
  return (
    <ReferenceMarkdown
      markdown={markdown}
      referenceUrl={`https://5x.ant.design/components/${upstreamSlug(component)}-cn/`}
    />
  );
}
