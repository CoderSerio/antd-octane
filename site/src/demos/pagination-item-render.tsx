import { Pagination } from "antd-octane";

export function ItemRenderDemo() {
  return (
    <Pagination
      total={500}
      showSizeChanger={false}
      itemRender={(_page, type, original) =>
        type === "prev" ? "上一页" : type === "next" ? "下一页" : original
      }
    />
  );
}
