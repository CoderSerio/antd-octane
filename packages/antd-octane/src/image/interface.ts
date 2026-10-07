import type {
  CSSProperties,
  HTMLAttributes,
  ImgHTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import type { PopupContainer } from "../config-provider/context";

/** Dialog options inherited by rc-image's preview, expressed with native DOM types. */
export interface ImagePreviewDialogProps {
  title?: OctaneNode;
  footer?: OctaneNode;
  width?: string | number;
  height?: string | number;
  bodyStyle?: CSSProperties;
  maskStyle?: CSSProperties;
  wrapStyle?: CSSProperties;
  bodyProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  maskProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  wrapProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  panelRef?: Ref<HTMLDivElement>;
  classNames?: Partial<
    Record<
      "header" | "body" | "footer" | "mask" | "content" | "wrapper",
      string
    >
  >;
  styles?: Partial<
    Record<
      "header" | "body" | "footer" | "mask" | "content" | "wrapper",
      CSSProperties
    >
  >;
  modalRender?: (node: OctaneNode) => OctaneNode;
  mousePosition?: { x: number; y: number } | null;
  animation?: string;
  maskAnimation?: string;
  transitionName?: string;
  maskTransitionName?: string;
}

export interface ImagePreviewConfig extends ImagePreviewDialogProps {
  visible?: boolean;
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
  src?: string;
  mask?: OctaneNode;
  maskClassName?: string;
  rootClassName?: string;
  closeIcon?: OctaneNode;
  icons?: {
    rotateLeft?: OctaneNode;
    rotateRight?: OctaneNode;
    zoomIn?: OctaneNode;
    zoomOut?: OctaneNode;
    close?: OctaneNode;
    left?: OctaneNode;
    right?: OctaneNode;
    flipX?: OctaneNode;
    flipY?: OctaneNode;
  };
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  movable?: boolean;
  onTransform?: (info: {
    transform: ImageTransform;
    action: ImageTransformAction;
  }) => void;
  imageRender?: (
    originalNode: OctaneNode,
    info: { transform: ImageTransform; image: ImageInfo; current?: number },
  ) => OctaneNode;
  toolbarRender?: (
    originalNode: OctaneNode,
    info: ImageToolbarRenderInfo,
  ) => OctaneNode;
  getContainer?: string | PopupContainer | (() => PopupContainer) | false;
  forceRender?: boolean;
  /** @deprecated Use destroyOnHidden. */
  destroyOnClose?: boolean;
  destroyOnHidden?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  focusTriggerAfterClose?: boolean;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  afterOpenChange?: (open: boolean) => void;
}

export interface ImageTransform {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}
export interface ImageInfo {
  url: string;
  alt: string;
  width?: string | number;
  height?: string | number;
}
export interface ImageToolbarRenderInfo {
  icons: {
    prevIcon?: OctaneNode;
    nextIcon?: OctaneNode;
    flipYIcon: OctaneNode;
    flipXIcon: OctaneNode;
    rotateLeftIcon: OctaneNode;
    rotateRightIcon: OctaneNode;
    zoomOutIcon: OctaneNode;
    zoomInIcon: OctaneNode;
  };
  actions: {
    onActive: (offset: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void;
    onClose: () => void;
  };
  transform: ImageTransform;
  current?: number;
  total?: number;
  image: ImageInfo;
}
export type ImageTransformAction =
  | "flipY"
  | "flipX"
  | "rotateLeft"
  | "rotateRight"
  | "zoomIn"
  | "zoomOut"
  | "close"
  | "prev"
  | "next"
  | "wheel"
  | "doubleClick"
  | "move"
  | "dragRebound"
  | "touchZoom"
  | "reset";
export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "style" | "onClick"> {
  prefixCls?: string;
  previewPrefixCls?: string;
  preview?: boolean | ImagePreviewConfig;
  fallback?: string;
  placeholder?: OctaneNode | boolean;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
  /** @deprecated Use preview.onVisibleChange. */
  onPreviewClose?: (visible: boolean, prevVisible: boolean) => void;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  style?: CSSProperties;
}
export interface ImagePreviewGroupProps {
  children?: OctaneNode;
  items?: (string | ImageElementProps)[];
  fallback?: string;
  previewPrefixCls?: string;
  icons?: ImagePreviewConfig["icons"];
  preview?:
    | boolean
    | (Omit<
        ImagePreviewConfig,
        "mask" | "maskClassName" | "onVisibleChange"
      > & {
        onVisibleChange?: (
          visible: boolean,
          prevVisible: boolean,
          current: number,
        ) => void;
        current?: number;
        onChange?: (current: number, previous: number) => void;
        countRender?: (current: number, total: number) => OctaneNode;
      });
}
export interface Entry {
  id: string;
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  props?: ImageElementProps;
}
export type ImageElementProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  | "src"
  | "crossOrigin"
  | "decoding"
  | "draggable"
  | "loading"
  | "referrerPolicy"
  | "sizes"
  | "srcSet"
  | "useMap"
  | "alt"
>;
