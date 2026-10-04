import type { CalendarLocale } from "../calendar";
import type { TableLocale } from "../table";

/** Locale fields consumed by the native data display components. */
export interface Locale {
  locale: string;
  global?: { placeholder?: string; close?: string };
  Calendar?: CalendarLocale;
  Table?: TableLocale;
  Empty?: { description?: string };
  Image?: { preview?: string };
  Modal?: { okText?: string; cancelText?: string; justOkText?: string };
  Popconfirm?: { okText?: string; cancelText?: string };
  Tour?: { Previous?: string; Next?: string; Finish?: string };
  QRCode?: { expired?: string; refresh?: string; scanned?: string };
  Pagination?: {
    items_per_page?: string;
    jump_to?: string;
    jump_to_confirm?: string;
    page?: string;
    prev_page?: string;
    next_page?: string;
    prev_5?: string;
    next_5?: string;
    prev_3?: string;
    next_3?: string;
    page_size?: string;
  };
}

export { default as useLocale } from "./useLocale";
