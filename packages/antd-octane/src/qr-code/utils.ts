/**
 * Rendering helpers adapted from @rc-component/qrcode 1.1.3 (MIT).
 * Its path and image calculations originate in qrcode.react (ISC).
 * See THIRD_PARTY_NOTICES.md for the source records and licenses.
 */
import type { QRCodeImageSettings } from "./interface";
import { qrcodegen } from "./vendor/qrcodegen";

export type Modules = boolean[][];
export interface Excavation {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface CalculatedImageSettings {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  excavation: Excavation | null;
  crossOrigin: QRCodeImageSettings["crossOrigin"];
}
export const ERROR_LEVEL_MAP = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
};
export const DEFAULT_SIZE = 128;
export const DEFAULT_LEVEL = "L";
export const DEFAULT_BACKGROUND_COLOR = "#FFFFFF";
export const DEFAULT_FRONT_COLOR = "#000000";
export const DEFAULT_NEED_MARGIN = false;
export const DEFAULT_MINVERSION = 1;

/** Join adjacent dark modules into horizontal path segments. */
export function generatePath(modules: Modules, margin = 0) {
  const ops: string[] = [];
  modules.forEach((row, y) => {
    let start: number | null = null;
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`,
        );
        start = null;
        return;
      }
      if (x === row.length - 1) {
        if (!cell) return;
        if (start === null)
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        else
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`,
          );
        return;
      }
      if (cell && start === null) start = x;
    });
  });
  return ops.join("");
}

export function excavateModules(modules: Modules, excavation: Excavation) {
  return modules.map((row, y) =>
    y < excavation.y || y >= excavation.y + excavation.h
      ? row
      : row.map((cell, x) =>
          x < excavation.x || x >= excavation.x + excavation.w ? cell : false,
        ),
  );
}

export function getImageSettings(
  cells: Modules,
  size: number,
  margin: number,
  imageSettings?: QRCodeImageSettings,
): CalculatedImageSettings | null {
  if (imageSettings == null) return null;
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * 0.1);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  // Default centering is relative to the encoded matrix. Renderers add the quiet zone.
  const x =
    imageSettings.x == null
      ? cells.length / 2 - w / 2
      : imageSettings.x * scale;
  const y =
    imageSettings.y == null
      ? cells.length / 2 - h / 2
      : imageSettings.y * scale;
  let excavation: Excavation | null = null;
  if (imageSettings.excavate) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    excavation = {
      x: floorX,
      y: floorY,
      w: Math.ceil(w + x - floorX),
      h: Math.ceil(h + y - floorY),
    };
  }
  return {
    x,
    y,
    w,
    h,
    excavation,
    opacity: imageSettings.opacity == null ? 1 : imageSettings.opacity,
    crossOrigin: imageSettings.crossOrigin,
  };
}

export function getMarginSize(includeMargin: boolean, marginSize?: number) {
  return marginSize != null
    ? Math.max(Math.floor(marginSize), 0)
    : includeMargin
      ? 4
      : 0;
}

export function supportsPath2D() {
  try {
    new Path2D().addPath(new Path2D());
  } catch {
    return false;
  }
  return true;
}
