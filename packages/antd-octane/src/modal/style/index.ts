// Adapted from Ant Design 5.29.3 components/modal/style/index.ts and confirm.ts (MIT).
// Theme values stay in the instance's CSS variables; selectors retain upstream weight.
import { escapeClass } from "../../style/useStyleRegister";

export function genModalStyle(
  prefixCls: string,
  hashId: string,
  antCls: string,
) {
  const cls = `.${escapeClass(prefixCls)}`;
  const hash = `:where(.${hashId})`;
  const panel = `${hash}${cls}`;
  const root = `${hash}${cls}-root`;
  const confirm = `${hash}${cls}-confirm`;
  const button = `.${escapeClass(antCls)}-btn`;
  return `
${panel}{box-sizing:border-box;font:var(--ao-font-size)/var(--ao-line) var(--ao-font);color:var(--ao-text);pointer-events:none;position:relative;top:100px;max-width:calc(100vw - var(--ao-modal-viewport-gap));margin:var(--ao-modal-margin-block) auto;padding-bottom:var(--ao-dialog-bottom-padding);outline:none}
${panel} *,${panel} *::before,${panel} *::after{box-sizing:border-box}
${panel} ${cls}-title{margin:0;color:var(--ao-dialog-title);font-weight:var(--ao-modal-weight);font-size:var(--ao-dialog-title-size);line-height:var(--ao-dialog-title-line);overflow-wrap:break-word}
${panel} ${cls}-content{position:relative;background-color:var(--ao-dialog-bg);background-clip:padding-box;border:0;border-radius:var(--ao-dialog-radius);box-shadow:var(--ao-dialog-shadow);pointer-events:auto;padding:var(--ao-dialog-padding)}
${panel} ${cls}-close{position:absolute;top:var(--ao-modal-close-offset);inset-inline-end:var(--ao-modal-close-offset);z-index:var(--ao-modal-close-z);padding:0;color:var(--ao-modal-close-color);font-weight:var(--ao-modal-weight);line-height:1;text-decoration:none;background:transparent;border-radius:var(--ao-modal-close-radius);width:var(--ao-modal-close-size);height:var(--ao-modal-close-size);border:0;outline:0;cursor:pointer;transition:color var(--ao-motion-mid),background-color var(--ao-motion-mid)}
${panel} ${cls}-close-x{display:flex;font-size:var(--ao-modal-close-font);font-style:normal;line-height:var(--ao-modal-close-size);justify-content:center;text-transform:none;text-rendering:auto}
${panel} ${cls}-close:disabled{pointer-events:none}
${panel} ${cls}-close:hover{color:var(--ao-modal-close-hover);background-color:var(--ao-modal-close-hover-bg);text-decoration:none}
${panel} ${cls}-close:active{background-color:var(--ao-modal-close-active-bg)}
${panel} ${cls}-close:focus-visible{outline:var(--ao-modal-focus);outline-offset:1px}
${panel} ${cls}-header{color:var(--ao-text);background:var(--ao-dialog-header);border-radius:var(--ao-dialog-radius) var(--ao-dialog-radius) 0 0;margin-bottom:var(--ao-modal-header-gap);padding:var(--ao-modal-header-padding);border-bottom:var(--ao-modal-header-border)}
${panel} ${cls}-body{font-size:var(--ao-font-size);line-height:var(--ao-line);overflow-wrap:break-word;padding:var(--ao-modal-body-padding)}
${panel} ${cls}-body ${cls}-body-skeleton{width:100%;height:100%;display:flex;justify-content:center;align-items:center;margin:var(--ao-dialog-margin) auto}
${panel} ${cls}-footer{text-align:end;background:var(--ao-dialog-footer);margin-top:var(--ao-modal-footer-gap);padding:var(--ao-modal-footer-padding);border-top:var(--ao-modal-footer-border);border-radius:var(--ao-modal-footer-radius)}
${panel} ${cls}-footer > ${button} + ${button}{margin-inline-start:var(--ao-dialog-button-gap)}
${root} ${cls}-wrap-rtl{direction:rtl}
${root} ${cls}-centered{text-align:center}
${root} ${cls}-centered::before{display:inline-block;width:0;height:100%;vertical-align:middle;content:""}
${root} ${cls}-centered ${cls}{top:0;display:inline-block;padding-bottom:0;text-align:start;vertical-align:middle}
${root} ${cls}-mask{box-sizing:border-box;position:fixed;inset:0;z-index:var(--ao-dialog-z);height:100%;background-color:var(--ao-dialog-mask);pointer-events:none}
${root} ${cls}-wrap{box-sizing:border-box;position:fixed;inset:0;z-index:var(--ao-dialog-z);overflow:auto;outline:0;-webkit-overflow-scrolling:touch}
${panel}[data-motion-phase="leave"] ${cls}-content{pointer-events:none}
${confirm}-rtl{direction:rtl}
${confirm}.ao-confirm-hide-header .ant-modal-header{display:none}
${confirm}${cls} ${cls}-body{padding:var(--ao-confirm-body-padding)}
${confirm} ${cls}-confirm-body-wrapper::before,${confirm} ${cls}-confirm-body-wrapper::after{display:table;content:""}
${confirm} ${cls}-confirm-body-wrapper::after{clear:both}
${confirm} ${cls}-confirm-body{display:flex;flex-wrap:nowrap;align-items:start}
${confirm} ${cls}-confirm-body > .anticon{flex:none;font-size:var(--ao-confirm-icon-size);margin-inline-end:var(--ao-confirm-icon-gap);margin-top:var(--ao-confirm-icon-top)}
${confirm} ${cls}-confirm-body-has-title > .anticon{margin-top:var(--ao-confirm-icon-title-top)}
${confirm} ${cls}-confirm-paragraph{display:flex;flex-direction:column;flex:auto;row-gap:var(--ao-confirm-paragraph-gap);max-width:calc(100% - var(--ao-confirm-paragraph-margin))}
${confirm} .anticon + ${cls}-confirm-paragraph{max-width:calc(100% - var(--ao-confirm-icon-size) - var(--ao-confirm-paragraph-margin))}
${confirm} ${cls}-confirm-title{color:var(--ao-confirm-title-color);font-weight:var(--ao-confirm-weight);font-size:var(--ao-dialog-title-size);line-height:var(--ao-dialog-title-line)}
${confirm} ${cls}-confirm-content{color:var(--ao-text);font-size:var(--ao-font-size);line-height:var(--ao-line)}
${confirm} ${cls}-confirm-btns{text-align:end;margin-top:var(--ao-confirm-btns-margin)}
${confirm} ${cls}-confirm-btns ${button} + ${button}{margin-bottom:0;margin-inline-start:var(--ao-dialog-button-gap)}
${confirm}-error ${cls}-confirm-body > .anticon{color:var(--ao-error)}
${confirm}-warning ${cls}-confirm-body > .anticon,${confirm}-confirm ${cls}-confirm-body > .anticon{color:var(--ao-warning)}
${confirm}-info ${cls}-confirm-body > .anticon{color:var(--ao-confirm-info)}
${confirm}-success ${cls}-confirm-body > .anticon{color:var(--ao-success)}
`;
}
