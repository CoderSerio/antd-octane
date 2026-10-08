# ColorPicker (development source)

This API is in development source, **not in the site's published npm version**.
The reference is Ant Design 5.29.3. This is a solid-color subset, not full visual
or API parity. It uses native Octane, FastColor, and the shared Popover.

Supported: controlled/uncontrolled `value` (`string | Color | null`) and `open`,
`onChange(color, css)`, `onChangeComplete(color)`, clearing, presets,
HEX/RGB/HSB display and format selection, alpha disabling, size/disabled,
`showText`, placement/trigger/container/arrow, provider theme/prefix/direction.
Strings support hex (3/4/6/8 digits) and comma-separated RGB(A), HSL(A), HSB(A).
The text editor rejects invalid/out-of-range values before emitting changes.
`Color` provides `cleared`, `toHex`, `toHexString`, `toRgb`, `toRgbString`,
`toHsb`, `toHsbString`, and `toCssString`. Clear emits a cleared transparent
Color plus `onClear`; `null` also represents an empty controlled value.
`disabledAlpha` makes user changes opaque; it does not rewrite supplied values.

The saturation/brightness panel supports pointer input; labeled native channel
sliders expose the same controls to keyboard users. Enter commits a text edit;
IME Enter is ignored. Escape closes and returns focus to the trigger. Popovers
inherit `getPopupContainer`; default body portals escape clipped containers.
A completed slider/drag/edit/preset selection emits `onChangeComplete`.

Not supported: gradients/mode, named CSS colors/CSS Color 4 syntax, eyedropper,
custom trigger children, panelRender/Picker/Presets subcomponents, semantic
styles/classNames, ColorPicker-specific component tokens, or translated panel
labels. Alias token overrides under `theme.components.ColorPicker` are supported.
The panel layout deliberately exposes keyboard-accessible H/S/B/A channels; it
is not a pixel-identical Ant Design panel. SSR/hydration is not certified.

Form.Item can bind `value`/`onChange`; values are Color instances after edits,
so serialize explicitly (for example `color.toHexString()`) before submission.
See `tests/browser/color-picker.html` for the source-only browser fixture.
