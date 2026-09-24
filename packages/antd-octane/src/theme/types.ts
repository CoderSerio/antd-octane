import type { CSSProperties } from "octane";
import type { AliasToken, MapToken, SeedToken } from "./vendor/interface";

export type { AliasToken, MapToken, SeedToken };
export type MappingAlgorithm = (
  seed: SeedToken,
  previous?: MapToken,
) => MapToken;

/** Supported Button component tokens in the first alpha. */
export interface ButtonToken {
  fontWeight: CSSProperties["fontWeight"];
  iconGap: number;
  defaultShadow: string;
  primaryShadow: string;
  dangerShadow: string;
  primaryColor: string;
  dangerColor: string;
  defaultColor: string;
  defaultBg: string;
  defaultBorderColor: string;
  defaultHoverBg: string;
  defaultHoverColor: string;
  defaultHoverBorderColor: string;
  defaultActiveBg: string;
  defaultActiveColor: string;
  defaultActiveBorderColor: string;
  borderColorDisabled: string;
  defaultGhostColor: string;
  defaultGhostBorderColor: string;
  ghostBg: string;
  paddingInline: number;
  paddingInlineLG: number;
  paddingInlineSM: number;
  contentFontSize: number;
  contentFontSizeLG: number;
  contentFontSizeSM: number;
  textTextColor: string;
  textTextHoverColor: string;
  textTextActiveColor: string;
  textHoverBg: string;
  linkHoverBg: string;
}

export type ButtonTheme = Partial<AliasToken & ButtonToken> & {
  algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
};
export interface InputToken {
  paddingBlock: number;
  paddingBlockSM: number;
  paddingBlockLG: number;
  paddingInline: number;
  paddingInlineSM: number;
  paddingInlineLG: number;
  activeBorderColor: string;
  hoverBorderColor: string;
  activeShadow: string;
  errorActiveShadow: string;
  warningActiveShadow: string;
  hoverBg: string;
  activeBg: string;
  inputFontSize: number;
  inputFontSizeSM: number;
  inputFontSizeLG: number;
}
export type ComponentTheme<T = object> = Partial<AliasToken & T> & {
  algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
};
export interface ThemeConfig {
  token?: Partial<AliasToken>;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  components?: {
    Button?: ButtonTheme;
    Input?: ComponentTheme<InputToken>;
    Checkbox?: ComponentTheme;
    Divider?: ComponentTheme<{
      textPaddingInline: string | number;
      orientationMargin: number;
      verticalMarginInline: number;
    }>;
    Switch?: ComponentTheme<{
      trackHeight: number;
      trackHeightSM: number;
      trackMinWidth: number;
      trackMinWidthSM: number;
      trackPadding: number;
      handleSize: number;
      handleSizeSM: number;
      handleBg: string;
      handleShadow: string;
    }>;
  };
  inherit?: boolean;
}
