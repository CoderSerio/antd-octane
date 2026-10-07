// Ant Design 5.29.3 components/config-provider/PropWarning.tsx (MIT).
import { devUseWarning } from "../_util/warning";

export interface PropWarningProps {
  dropdownMatchSelectWidth?: boolean;
}

export default function PropWarning({
  dropdownMatchSelectWidth,
}: PropWarningProps) {
  const warning = devUseWarning("ConfigProvider");
  warning.deprecated(
    dropdownMatchSelectWidth === undefined,
    "dropdownMatchSelectWidth",
    "popupMatchSelectWidth",
  );
  return null;
}
