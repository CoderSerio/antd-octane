/** Keep upstream Anchor demo fragments within the site's hash-based route. */
export function preserveDemoAnchorRoute(page: string, event: MouseEvent) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  )
    return;
  const link = event.target.closest<HTMLAnchorElement>(
    ".demo-stage a.ant-anchor-link-title",
  );
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href?.startsWith("#") || link.target === "_blank") return;
  const hash = new URL(link.href).hash;
  // The component updates history only when its onClick callback allows it.
  if (window.location.hash !== hash) return;
  const fragment = hash.slice(1);
  try {
    if (!document.getElementById(decodeURIComponent(fragment))) return;
  } catch {
    return;
  }
  history.replaceState(history.state, "", `#${page}/${fragment}`);
}
