import {
  Color,
  ColorPicker,
  type ColorPickerProps,
} from "../packages/antd-octane/src/color-picker";

const valid: ColorPickerProps = {
  value: new Color("#1677ff"),
  format: "hsb",
  onChange: (color, css) => void [color.toHsb(), css],
  disabledAlpha: true,
};
const jsx = <ColorPicker {...valid} />;
// @ts-expect-error Gradient mode is not supported by the solid-color API.
const gradient = <ColorPicker mode="gradient" />;
// @ts-expect-error Gradient arrays are not silently accepted.
const stops = <ColorPicker value={[{ color: "#fff", percent: 0 }]} />;
// @ts-expect-error Format choices are deliberately constrained.
const format = <ColorPicker format="hsl" />;
void [jsx, gradient, stops, format];
