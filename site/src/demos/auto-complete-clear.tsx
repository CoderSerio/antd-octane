import { AutoComplete, Flex } from "antd-octane";
import { useState } from "octane";
export function AutoCompleteClearDemo() {
  const [clears, setClears] = useState(0);
  const [searched, setSearched] = useState("尚未搜索");
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <AutoComplete
        defaultValue="试试清除"
        options={[{ value: "Octane" }]}
        allowClear={{ clearIcon: "×" }}
        onClear={() => setClears((n) => n + 1)}
        onSearch={(text) => setSearched(text || "空字符串")}
        aria-label="可清除建议输入"
        style={{ width: "min(100%, 280px)" }}
      />
      <p>
        清除次数：{clears}；最近搜索：{searched}。清除同时更新值和搜索文本。
      </p>
    </Flex>
  );
}
