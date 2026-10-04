import { Button, Image, Space } from "antd-octane";
import { useState } from "octane";

const picture = (color: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" fill="${color}"/><circle cx="370" cy="80" r="34" fill="#ffffff" opacity=".7"/><path d="M0 300 170 105 300 300M170 300 340 150 480 300" fill="#ffffff" opacity=".25"/><text x="24" y="270" font-family="sans-serif" font-size="28" fill="white">${label}</text></svg>`)}`;
export function BasicDemo() {
  return (
    <Image
      width={240}
      src={picture("#1677ff", "Blue mountains")}
      alt="蓝色山景"
      loading="lazy"
    />
  );
}
export function MoreDemo() {
  return (
    <Image.PreviewGroup>
      <Space wrap>
        <Image width={140} src={picture("#13a8a8", "Lake")} alt="绿色湖景" />
        <Image width={140} src={picture("#722ed1", "Sunset")} alt="紫色夕景" />
        <Image width={140} src={picture("#d46b08", "Desert")} alt="橙色沙丘" />
      </Space>
    </Image.PreviewGroup>
  );
}
export function ItemsDemo() {
  const images = [
    picture("#1677ff", "Blue mountains"),
    picture("#13a8a8", "Lake"),
    picture("#722ed1", "Sunset"),
  ];
  return (
    <Image.PreviewGroup
      items={[
        {
          src: images[0],
          alt: "蓝色山景",
          loading: "eager",
          referrerPolicy: "no-referrer",
        },
        images[1],
        images[2],
      ]}
      preview={{ countRender: (current, total) => `${current} / ${total}` }}
    >
      <Image width={180} src={images[0]} alt="蓝色山景" />
    </Image.PreviewGroup>
  );
}
export function CustomDemo() {
  return (
    <Image
      width={180}
      src={picture("#531dab", "Night sky")}
      alt="夜空"
      preview={{
        getContainer: "#root",
        forceRender: true,
        icons: { zoomIn: <span aria-hidden="true">＋</span> },
        imageRender: (originalNode, { image }) => (
          <div
            data-image-render="custom"
            style={{ display: "grid", justifyItems: "center", gap: 8 }}
          >
            {originalNode}
            <span style={{ color: "white", fontSize: 12 }}>{image.alt}</span>
          </div>
        ),
        toolbarRender: (originalNode, { actions }) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {originalNode}
            <button type="button" onClick={actions.onReset}>
              重置
            </button>
          </div>
        ),
      }}
    />
  );
}

export function ToolbarDemo() {
  return (
    <Image
      width={180}
      src={picture("#722ed1", "Toolbar")}
      alt="自定义工具栏"
      preview={{
        toolbarRender: (originalNode, { actions }) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {originalNode}
            <button type="button" onClick={actions.onReset}>
              重置
            </button>
          </div>
        ),
      }}
    />
  );
}

export function ImageRenderDemo() {
  return (
    <Image
      width={180}
      src={picture("#531dab", "Video preview")}
      alt="自定义预览内容"
      preview={{
        imageRender: () => (
          <video
            muted
            width="100%"
            controls
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
          />
        ),
        toolbarRender: () => null,
      }}
    />
  );
}

export function FallbackDemo() {
  return (
    <Image
      width={180}
      height={110}
      src="/missing-image.png"
      fallback={picture("#d9d9d9", "Fallback")}
      alt="加载失败时的占位图"
    />
  );
}

export function PlaceholderDemo() {
  return (
    <Image
      width={180}
      height={110}
      src={picture("#13a8a8", "Loading")}
      placeholder={
        <div style={{ width: "100%", height: "100px", background: "#f5f5f5" }}>
          加载中…
        </div>
      }
      alt="带占位内容的图片"
    />
  );
}

export function ControlledDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setVisible(true)}>打开预览</Button>
      <Image
        width={180}
        src={picture("#1677ff", "Controlled")}
        alt="受控预览"
        preview={{ visible, onVisibleChange: setVisible }}
      />
    </div>
  );
}

export function PreviewSrcDemo() {
  return (
    <Image
      width={180}
      src={picture("#722ed1", "Thumbnail")}
      alt="缩略图"
      preview={{ src: picture("#531dab", "Full size preview") }}
    />
  );
}

export function MaskDemo() {
  return (
    <Image
      width={180}
      src={picture("#d46b08", "Custom mask")}
      alt="自定义遮罩"
      preview={{ mask: <span style={{ color: "white" }}>查看大图</span> }}
    />
  );
}

export function NestedDemo() {
  return (
    <Image.PreviewGroup>
      <div style={{ display: "flex", gap: 8 }}>
        <Image width={120} src={picture("#1677ff", "One")} alt="第一张" />
        <Image width={120} src={picture("#13a8a8", "Two")} alt="第二张" />
      </div>
    </Image.PreviewGroup>
  );
}

export function TopProgressDemo() {
  const images = [
    picture("#1677ff", "Blue mountains"),
    picture("#13a8a8", "Lake"),
    picture("#722ed1", "Sunset"),
  ];
  return (
    <Image.PreviewGroup
      preview={{
        countRender: (current, total) => `当前 ${current} / 总计 ${total}`,
      }}
    >
      {images.map((src) => (
        <Image key={src} width={150} src={src} />
      ))}
    </Image.PreviewGroup>
  );
}

export function ImageInfoDemo() {
  const src = picture("#1677ff", "Image info");
  return (
    <Image
      src={src}
      width={200}
      height={200}
      alt="test"
      preview={{
        imageRender: (_, { image }) => <div>{JSON.stringify(image)}</div>,
        toolbarRender: (_, { image }) => <div>{JSON.stringify(image)}</div>,
      }}
    />
  );
}
