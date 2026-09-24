import { Button } from "antd-octane";
import { useState } from "octane";
export function StatesDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-row">
      <Button type="primary" loading={loading} onClick={() => setLoading(true)}>
        提交请求
      </Button>
      <Button onClick={() => setLoading(false)} disabled={!loading}>
        结束加载
      </Button>
      <Button type="primary" danger>
        危险操作
      </Button>
      <Button disabled>Disabled</Button>
      <Button type="primary" disabled>
        Disabled primary
      </Button>
    </div>
  );
}
