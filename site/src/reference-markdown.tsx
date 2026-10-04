import { theme } from "antd-octane";
import { Code, ReferenceText } from "./docs-ui";

/** Render the prose and code blocks used by the pinned component documentation. */
export function ReferenceMarkdown({
  markdown,
  referenceUrl,
}: {
  markdown: string;
  referenceUrl?: string;
}) {
  const { token } = theme.useToken();
  const lines = markdown.trim().split("\n");
  const blocks: { kind: string; text: string }[] = [];
  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const content: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        content.push(lines[index++]);
      }
      index += 1;
      blocks.push({ kind: "code", text: content.join("\n") });
      continue;
    }
    if (line.startsWith(">")) {
      const content: string[] = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        content.push(lines[index++].replace(/^>\s?/, ""));
      }
      blocks.push({ kind: "note", text: content.join("\n") });
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ kind: `h${heading[1].length}`, text: heading[2] });
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const content: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        content.push(lines[index++].slice(2));
      }
      blocks.push({ kind: "list", text: content.join("\n") });
      continue;
    }
    const content = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(?:```|>|#{2,4}\s|- )/.test(lines[index])
    ) {
      content.push(lines[index++]);
    }
    blocks.push({ kind: "paragraph", text: content.join(" ") });
  }
  const text = (value: string) => (
    <ReferenceText text={value} referenceUrl={referenceUrl} />
  );
  return (
    <div
      className="reference-prose"
      style={{
        "--api-note-color": token.colorTextSecondary,
        "--api-note-border": token.colorSplit,
        "--api-note-code-bg": token.colorFillTertiary,
        "--api-note-code-radius": `${token.borderRadiusSM}px`,
        "--api-note-font-size": `${token.fontSize}px`,
      }}
    >
      {blocks.map((block, index) => {
        if (block.kind === "code")
          return <Code key={index} source={block.text} />;
        if (block.kind === "note") {
          return (
            <blockquote key={index} className="api-note">
              <ReferenceMarkdown
                markdown={block.text}
                referenceUrl={referenceUrl}
              />
            </blockquote>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="prose-list">
              {block.text.split("\n").map((item) => (
                <li key={item}>{text(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.kind === "h2") return <h2 key={index}>{text(block.text)}</h2>;
        if (block.kind === "h3") return <h3 key={index}>{text(block.text)}</h3>;
        if (block.kind === "h4") return <h4 key={index}>{text(block.text)}</h4>;
        return <p key={index}>{text(block.text)}</p>;
      })}
    </div>
  );
}
