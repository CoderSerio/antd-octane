export interface TocLink {
  id: string;
  title: string;
}

export interface TocSection extends TocLink {
  children: TocLink[];
}

/** Independent demo columns cannot use source order to pick the visible section. */
export function findActiveTocAnchor(
  headings: HTMLElement[],
  requestedId?: string,
  offset = 160,
): string {
  const above = headings
    .map((node) => ({ node, top: node.getBoundingClientRect().top }))
    .filter(({ top }) => top <= offset);
  if (!above.length) return headings[0]?.id ?? "";
  const nearest = Math.max(...above.map(({ top }) => top));
  const candidates = above.filter(({ top }) => Math.abs(top - nearest) < 1);
  return (
    candidates.find(({ node }) => node.id === requestedId) ?? candidates[0]
  ).node.id;
}

/** Match antd 5's H2 sections and H3 children, using the rendered document. */
export function readPageToc(root: HTMLElement): TocSection[] {
  const sections: TocSection[] = [];
  const usedIds = new Set(
    Array.from(root.querySelectorAll<HTMLElement>("[id]"), (node) => node.id),
  );
  let parent: TocSection | undefined;
  // Demo columns have independent heights; the TOC keeps their source order.
  const headings = Array.from(
    root.querySelectorAll<HTMLElement>("h2, h3"),
  ).filter((heading) => !heading.closest(".demo-stage, .demo-code"));
  for (const grid of root.querySelectorAll(".demo-grid")) {
    const positions = headings.flatMap((heading, index) =>
      heading.closest(".demo-grid") === grid ? [index] : [],
    );
    const ordered = positions
      .map((index) => headings[index])
      .sort(
        (a, b) =>
          Number(a.closest<HTMLElement>(".demo-card")?.dataset.demoOrder ?? 0) -
          Number(b.closest<HTMLElement>(".demo-card")?.dataset.demoOrder ?? 0),
      );
    positions.forEach((position, index) => {
      headings[position] = ordered[index];
    });
  }
  for (const heading of headings) {
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
