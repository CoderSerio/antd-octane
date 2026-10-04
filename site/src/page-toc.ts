export interface TocLink {
  id: string;
  title: string;
}

export interface TocSection extends TocLink {
  children: TocLink[];
}

/** Match antd 5's H2 sections and H3 children, using the rendered document. */
export function readPageToc(root: HTMLElement): TocSection[] {
  const sections: TocSection[] = [];
  const usedIds = new Set(
    Array.from(root.querySelectorAll<HTMLElement>("[id]"), (node) => node.id),
  );
  let parent: TocSection | undefined;
  for (const heading of root.querySelectorAll<HTMLElement>("h2, h3")) {
    // Titles inside the running examples are not documentation sections.
    if (heading.closest(".demo-stage, .demo-code")) continue;
    const title = heading.textContent?.replace(/\s+/g, " ").trim();
    if (!title) continue;
    if (heading.tagName === "H3" && !parent) continue;

    let id = heading.id || heading.closest<HTMLElement>(".demo-card[id]")?.id;
    if (!id) {
      const base =
        title
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(/\s+/g, "-") || "section";
      id = base;
      for (let suffix = 2; usedIds.has(id); suffix += 1)
        id = `${base}-${suffix}`;
      heading.id = id;
      heading.tabIndex = -1;
      usedIds.add(id);
    }

    if (heading.tagName === "H2") {
      parent = { id, title, children: [] };
      sections.push(parent);
    } else {
      parent?.children.push({ id, title });
    }
  }
  return sections;
}
