import { Button, Space, Tag } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Space wrap>
      <Tag>Tag 1</Tag>
      <Tag>
        <a
          href="https://github.com/ant-design/ant-design/issues/1862"
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </a>
      </Tag>
      <Tag closeIcon onClose={(event) => event.preventDefault()}>
        Prevent Default
      </Tag>
      <Tag
        closeIcon={<span aria-hidden="true">×</span>}
        onClose={() => undefined}
      >
        Tag 2
      </Tag>
      <Tag
        closable={{
          closeIcon: <span aria-hidden="true">⌫</span>,
          "aria-label": "Close Button",
        }}
        onClose={() => undefined}
      >
        Tag 3
      </Tag>
    </Space>
  );
}
export function MoreDemo() {
  const [checked, set] = useState(false);
  return (
    <Space wrap>
      <Tag closable>可关闭</Tag>
      <Tag closable onClose={(event) => event.preventDefault()}>
        取消关闭
      </Tag>
      <Tag.CheckableTag checked={checked} onChange={set}>
        只看已读
      </Tag.CheckableTag>
    </Space>
  );
}

export function ColorsDemo() {
  return (
    <Space wrap>
      {[
        "magenta",
        "red",
        "volcano",
        "orange",
        "gold",
        "lime",
        "green",
        "cyan",
        "blue",
        "geekblue",
        "purple",
      ].map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </Space>
  );
}

export function InverseColorsDemo() {
  return (
    <Space wrap>
      {[
        "magenta",
        "red",
        "volcano",
        "orange",
        "gold",
        "lime",
        "green",
        "cyan",
        "blue",
        "geekblue",
        "purple",
      ].map((color) => (
        <Tag key={color} color={`${color}-inverse`}>
          {color}
        </Tag>
      ))}
    </Space>
  );
}

export function DynamicDemo() {
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  return (
    <Space wrap>
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={() => setTags(tags.filter((item) => item !== tag))}
        >
          {tag}
        </Tag>
      ))}
      <Button
        size="small"
        onClick={() => setTags([...tags, `Tag ${tags.length + 1}`])}
      >
        添加
      </Button>
    </Space>
  );
}

export function SelectableDemo() {
  const [selected, setSelected] = useState<string[]>(["电影"]);
  return (
    <Space wrap>
      {["电影", "音乐", "书籍"].map((item) => (
        <Tag.CheckableTag
          key={item}
          checked={selected.includes(item)}
          onChange={(checked) =>
            setSelected(
              checked
                ? [...selected, item]
                : selected.filter((value) => value !== item),
            )
          }
        >
          {item}
        </Tag.CheckableTag>
      ))}
    </Space>
  );
}

export function IconDemo() {
  return (
    <Space wrap>
      <Tag icon={<span aria-hidden="true">✓</span>} color="success">
        完成
      </Tag>
      <Tag icon={<span aria-hidden="true">!</span>} color="warning">
        提醒
      </Tag>
      <Tag icon={<span aria-hidden="true">×</span>} color="error">
        失败
      </Tag>
    </Space>
  );
}

export function StatusDemo() {
  return (
    <Space wrap>
      <Tag color="success">成功</Tag>
      <Tag color="processing">处理中</Tag>
      <Tag color="warning">警告</Tag>
      <Tag color="error">错误</Tag>
      <Tag color="default">默认</Tag>
    </Space>
  );
}

export function BorderlessDemo() {
  return (
    <Space wrap>
      <Tag bordered={false} color="success">
        无边框成功
      </Tag>
      <Tag bordered={false} color="processing">
        无边框处理中
      </Tag>
      <Tag bordered={false} color="error">
        无边框错误
      </Tag>
    </Space>
  );
}

export function DraggableDemo() {
  const [tags, setTags] = useState(["标签一", "标签二", "标签三"]);
  return (
    <Space wrap>
      {tags.map((tag, index) => (
        <Tag
          key={tag}
          onClick={() => {
            if (index === 0) return;
            const next = [...tags];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            setTags(next);
          }}
        >
          {tag}
        </Tag>
      ))}
      <span>点击标签向前移动</span>
    </Space>
  );
}

export function AnimationDemo() {
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const addTag = () => {
    if (inputValue && !tags.includes(inputValue))
      setTags([...tags, inputValue]);
    setInputValue("");
    setInputVisible(false);
  };
  return (
    <div>
      <div
        style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{ display: "inline-block", transition: "all 200ms" }}
          >
            <Tag
              closable
              onClose={(event) => {
                event.preventDefault();
                setTags(tags.filter((item) => item !== tag));
              }}
            >
              {tag}
            </Tag>
          </span>
        ))}
      </div>
      {inputVisible ? (
        <input
          aria-label="新标签"
          value={inputValue}
          onInput={(event) => setInputValue(event.currentTarget.value)}
          onBlur={addTag}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTag();
          }}
          style={{ width: 78 }}
        />
      ) : (
        <Tag onClick={() => setInputVisible(true)} bordered={false}>
          + New Tag
        </Tag>
      )}
    </div>
  );
}
