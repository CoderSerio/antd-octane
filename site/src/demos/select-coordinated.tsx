import { Select, Space } from "antd-octane";
import { useState } from "octane";

const cities: Record<string, string[]> = {
  浙江: ["杭州", "宁波", "温州"],
  江苏: ["南京", "苏州", "镇江"],
};
export function SelectCoordinatedDemo() {
  const [province, setProvince] = useState("浙江");
  const [city, setCity] = useState("杭州");
  return (
    <Space direction="vertical">
      <Space wrap>
        <Select
          aria-label="省份"
          value={province}
          options={Object.keys(cities).map((value) => ({
            value,
            label: value,
          }))}
          onChange={(next) => {
            if (typeof next !== "string") return;
            setProvince(next);
            setCity(cities[next][0]);
          }}
          style={{ width: 140 }}
        />
        <Select
          aria-label="城市"
          value={city}
          options={cities[province].map((value) => ({ value, label: value }))}
          onChange={(next) => {
            if (typeof next === "string") setCity(next);
          }}
          style={{ width: 140 }}
        />
      </Space>
      <span role="status">
        已选地址：{province} · {city}
      </span>
    </Space>
  );
}
