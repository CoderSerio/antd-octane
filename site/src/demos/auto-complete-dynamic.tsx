import { AutoComplete, Flex } from "antd-octane";
import { useState } from "octane";
export function AutoCompleteDynamicDemo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <AutoComplete
        options={options}
        onSearch={(text) =>
          setOptions(
            !text || text.includes("@")
              ? []
              : ["example.com", "mail.com", "octane.dev"].map((domain) => ({
                  value: `${text}@${domain}`,
                })),
          )
        }
        allowClear
        aria-label="邮箱建议"
        placeholder="输入邮箱前缀"
        style={{ width: "min(100%, 280px)" }}
      />
      <p>
        输入前缀生成建议；包含 @ 后停止补全。建议由应用计算，不会发起网络请求。
      </p>
    </Flex>
  );
}
