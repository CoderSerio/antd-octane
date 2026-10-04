/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useState } from "octane";
import type { PopupContainer } from "../config-provider/context";
import { Popover } from "../popover";
import type { TableSelectionItem } from "./types";

export interface SelectionDropdownProps {
  items: TableSelectionItem[];
  changeableRowKeys: (string | number)[];
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  label: string;
  children?: OctaneNode;
}

/** Native action menu used by Table row selection presets and custom actions. */
export function SelectionDropdown({
  items,
  changeableRowKeys,
  getPopupContainer,
  label,
  children,
}: SelectionDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      arrow={false}
      getPopupContainer={getPopupContainer}
      prefixCls="ant-table-selection-popup"
      content={
        <div className="ant-table-selection-dropdown">
          {items.map((item) => (
            <button
              type="button"
              key={item.key}
              onClick={() => {
                item.onSelect(changeableRowKeys);
                setOpen(false);
              }}
            >
              {item.text}
            </button>
          ))}
        </div>
      }
    >
      {children ?? (
        <button
          type="button"
          className="ant-table-selection-dropdown-trigger"
          aria-label={label}
        >
          ▾
        </button>
      )}
    </Popover>
  );
}
