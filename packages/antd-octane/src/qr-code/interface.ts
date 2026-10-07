import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";

export type QRCodeLevel = "L" | "M" | "Q" | "H";
export type QRCodeStatus = "active" | "expired" | "loading" | "scanned";
export type QRCodeCrossOrigin =
  | "anonymous"
  | "use-credentials"
  | ""
  | undefined;

export interface QRCodeLocale {
  expired: string;
  scanned: string;
  refresh: string;
}

export interface QRCodeImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
  opacity?: number;
  crossOrigin?: QRCodeCrossOrigin;
}

export interface QRProps {
  value: string | string[];
  boostLevel?: boolean;
  size?: number;
  level?: QRCodeLevel;
  bgColor?: string;
  fgColor?: string;
  style?: CSSProperties;
  /** @deprecated Use marginSize instead. */
  includeMargin?: boolean;
  marginSize?: number;
  imageSettings?: QRCodeImageSettings;
  title?: string;
  minVersion?: number;
}

export interface QRCodeProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "color" | "style" | "title" | "value"
    >,
    Omit<QRProps, "style"> {
  type?: "canvas" | "svg";
  prefixCls?: string;
  icon?: string;
  iconSize?: number | { width: number; height: number };
  color?: string;
  errorLevel?: QRCodeLevel;
  bordered?: boolean;
  status?: QRCodeStatus;
  onRefresh?: () => void;
  statusRender?: (info: QRCodeStatusRenderInfo) => OctaneNode;
  rootClassName?: string;
  style?: CSSProperties;
}

export interface QRCodeStatusRenderInfo {
  status: Exclude<QRCodeStatus, "active">;
  locale: QRCodeLocale;
  onRefresh?: () => void;
}

export type StatusRenderInfo = QRCodeStatusRenderInfo;
export type QRPropsCanvas = QRProps &
  Omit<
    HTMLAttributes<HTMLCanvasElement>,
    "value" | "style" | "ref" | "size" | "title"
  > & { ref?: Ref<HTMLCanvasElement> };
export type QRPropsSvg = QRProps &
  Omit<
    HTMLAttributes<SVGSVGElement>,
    "value" | "style" | "ref" | "size" | "title"
  > & { ref?: Ref<SVGSVGElement> };
export type ImageSettings = QRCodeImageSettings;
export type QRStatus = QRCodeStatus;
