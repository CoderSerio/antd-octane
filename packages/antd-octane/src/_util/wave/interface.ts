import type { AliasToken } from "../../theme/types";

export const TARGET_CLS = "ant-wave-target";
export type WaveComponent = "Tag" | "Button" | "Checkbox" | "Radio" | "Switch";
export type ShowWaveEffect = (
  element: HTMLElement,
  info: {
    className: string;
    token: AliasToken;
    component?: WaveComponent;
    event: MouseEvent;
    /** Octane's static stylesheet does not generate a CSS-in-JS hash. */
    hashId: string;
  },
) => void;
export interface WaveConfig {
  disabled?: boolean;
  showEffect?: ShowWaveEffect;
}
