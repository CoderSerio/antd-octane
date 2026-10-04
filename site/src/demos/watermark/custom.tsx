// Adapted from Ant Design 5.29.3 watermark/demo/custom.tsx (MIT).

import {
  Flex,
  Input,
  InputNumber,
  Slider,
  Typography,
  Watermark,
} from "antd-octane";
import { useState } from "octane";

const content = `The light-speed iteration of the digital world makes products more complex. However, human consciousness and attention resources are limited. Facing this design contradiction, the pursuit of natural interaction will be the consistent direction of Ant Design.`;

function rgbaFromHex(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "rgba(0, 0, 0, 0.15)";
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.15)`;
}

export default function App() {
  const [watermarkContent, setWatermarkContent] = useState("Ant Design");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [zIndex, setZIndex] = useState(11);
  const [rotate, setRotate] = useState(-22);
  const [gap, setGap] = useState<[number, number]>([100, 100]);
  const [offset, setOffset] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const watermarkOffset =
    offset[0] === null && offset[1] === null
      ? undefined
      : ([offset[0] ?? 0, offset[1] ?? 0] as [number, number]);

  return (
    <Flex gap="middle" align="stretch" style={{ minHeight: 600 }}>
      <Watermark
        content={watermarkContent}
        zIndex={zIndex}
        rotate={rotate}
        gap={gap}
        offset={watermarkOffset}
        font={{ color: rgbaFromHex(color), fontSize }}
        style={{ flex: 1, minWidth: 0 }}
      >
        <div
          style={{
            minHeight: 600,
            padding: "20px 16px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Typography>
            <Typography.Paragraph>{content}</Typography.Paragraph>
            <Typography.Paragraph>
              Natural user cognition: According to cognitive psychology, about
              80% of external information is obtained through visual channels.
              The most important visual elements in the interface design,
              including layout, colors, illustrations, icons, etc., should fully
              absorb the laws of nature, thereby reducing the user&apos;s
              cognitive cost and bringing authentic and smooth feelings. In some
              scenarios, opportunely adding other sensory channels such as
              hearing, touch can create a richer and more natural product
              experience.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Natural user behavior: In the interaction with the system, the
              designer should fully understand the relationship between users,
              system roles, and task objectives, and also contextually organize
              system functions and services. At the same time, a series of
              methods such as behavior analysis, artificial intelligence and
              sensors could be applied to assist users to make effective
              decisions and reduce extra operations of users, to save
              users&apos; mental and physical resources and make human-computer
              interaction more natural.
            </Typography.Paragraph>
          </Typography>
          <img
            draggable={false}
            style={{
              zIndex: 10,
              width: "100%",
              maxWidth: 800,
              position: "relative",
            }}
            src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
            alt="Ant Design illustration"
          />
        </div>
      </Watermark>
      <Flex
        vertical
        gap="middle"
        style={{
          width: 280,
          flexShrink: 0,
          borderInlineStart: "1px solid #eee",
          paddingInlineStart: 16,
          boxSizing: "border-box",
        }}
      >
        <div>
          <div>Content</div>
          <Input
            value={watermarkContent}
            onChange={(event) => setWatermarkContent(event.target.value)}
          />
        </div>
        <div>
          <div>Color</div>
          <div
            style={{
              width: 40,
              height: 40,
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              position: "relative",
              overflow: "hidden",
              backgroundImage:
                "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
              backgroundSize: "16px 16px",
            }}
          >
            <input
              aria-label="Color"
              type="color"
              value={color}
              onInput={(event) =>
                setColor((event.target as HTMLInputElement).value)
              }
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <div>
          <div>FontSize</div>
          <Slider
            value={fontSize}
            min={1}
            max={100}
            onChange={(value) => setFontSize(value as number)}
          />
        </div>
        <div>
          <div>zIndex</div>
          <Slider
            value={zIndex}
            min={0}
            max={100}
            onChange={(value) => setZIndex(value as number)}
          />
        </div>
        <div>
          <div>Rotate</div>
          <Slider
            value={rotate}
            min={-180}
            max={180}
            onChange={(value) => setRotate(value as number)}
          />
        </div>
        <div>
          <div>Gap</div>
          <Flex gap="small">
            <InputNumber
              value={gap[0]}
              onChange={(value) => setGap([value ?? 0, gap[1]])}
              style={{ width: "100%" }}
              aria-label="gapX"
            />
            <InputNumber
              value={gap[1]}
              onChange={(value) => setGap([gap[0], value ?? 0])}
              style={{ width: "100%" }}
              aria-label="gapY"
            />
          </Flex>
        </div>
        <div>
          <div>Offset</div>
          <Flex gap="small">
            <InputNumber
              value={offset[0]}
              onChange={(value) => setOffset([value, offset[1]])}
              placeholder="offsetLeft"
              style={{ width: "100%" }}
              aria-label="offsetLeft"
            />
            <InputNumber
              value={offset[1]}
              onChange={(value) => setOffset([offset[0], value])}
              placeholder="offsetTop"
              style={{ width: "100%" }}
              aria-label="offsetTop"
            />
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
}
