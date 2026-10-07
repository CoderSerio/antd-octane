import { useMemo } from "octane";
import type { QRProps } from "../interface";
import {
  ERROR_LEVEL_MAP,
  getImageSettings,
  getMarginSize,
  type Modules,
} from "../utils";
import { qrcodegen } from "../vendor/qrcodegen";

/** Native equivalent of @rc-component/qrcode's shared encoder/geometry hook. */
export function useQRCode({
  value,
  level = "L",
  minVersion = 1,
  includeMargin = false,
  marginSize,
  imageSettings,
  size = 128,
  boostLevel = true,
}: QRProps) {
  const qrcode = useMemo(() => {
    try {
      const values = Array.isArray(value) ? value : [value];
      const segments = values.flatMap((text) =>
        qrcodegen.QrSegment.makeSegments(text),
      );
      // Keep this package's invalid-input fallback and minimum-version normalization.
      const minimum = Number.isFinite(minVersion)
        ? Math.min(40, Math.max(1, Math.floor(minVersion)))
        : 1;
      return qrcodegen.QrCode.encodeSegments(
        segments,
        ERROR_LEVEL_MAP[level],
        minimum,
        40,
        -1,
        boostLevel,
      );
    } catch {
      return null;
    }
  }, [value, level, minVersion, boostLevel]);
  return useMemo(() => {
    const cells: Modules = qrcode
      ? Array.from({ length: qrcode.size }, (_, y) =>
          Array.from({ length: qrcode.size }, (_, x) => qrcode.getModule(x, y)),
        )
      : [];
    const margin = getMarginSize(includeMargin, marginSize);
    return {
      qrcode,
      cells,
      margin,
      numCells: cells.length + margin * 2,
      calculatedImageSettings: qrcode
        ? getImageSettings(cells, size, margin, imageSettings)
        : null,
    };
  }, [qrcode, size, imageSettings, includeMargin, marginSize]);
}
