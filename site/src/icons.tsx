import { Icon as AntIcon } from "antd-octane";

const paths = {
  search: "M21 21l-5-5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
  copy: "M9 5H5v16h12v-4M9 2h12v15H9z",
  check: "m4 12 5 5L20 6",
  moon: "M20.5 14a9 9 0 0 1-10.5-10.5A9 9 0 1 0 20.5 14Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  theme: "M3 4h18M3 12h18M3 20h18M7 1v6m10 2v6m-7 2v6",
  github:
    "M9 19c-4 1-4-2-6-2m12 5v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.8-1.6 6.8-7.4a5.8 5.8 0 0 0-1.6-4 5.4 5.4 0 0 0-.1-4s-1.3-.4-4.1 1.5a14 14 0 0 0-7 0C5.2-.3 3.9.1 3.9.1a5.4 5.4 0 0 0-.1 4 5.8 5.8 0 0 0-1.6 4c0 5.8 3.5 7 6.8 7.4a3.4 3.4 0 0 0-1 2.6V22",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  close: "m6 6 12 12M6 18 18 6",
};
export function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <AntIcon className="doc-icon" viewBox="0 0 24 24">
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </AntIcon>
  );
}
