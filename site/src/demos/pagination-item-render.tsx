import type { PaginationProps } from "antd-octane";
import { Pagination } from "antd-octane";

const itemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement,
) => {
  if (type === "prev") {
    // biome-ignore lint/a11y/useValidAnchor: preserves the upstream Pagination itemRender example.
    return <a>Previous</a>;
  }
  if (type === "next") {
    // biome-ignore lint/a11y/useValidAnchor: preserves the upstream Pagination itemRender example.
    return <a>Next</a>;
  }
  return originalElement;
};

export function ItemRenderDemo() {
  return <Pagination total={500} itemRender={itemRender} />;
}
