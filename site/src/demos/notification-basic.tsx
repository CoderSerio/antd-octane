import { Button, notification, Space } from "antd-octane";
export function BasicDemo() {
  const [api, holder] = notification.useNotification({ maxCount: 3 });
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          onClick={() =>
            api.success({
              message: "发布完成",
              description: "新版本已就绪，可以继续浏览文档。",
            })
          }
        >
          成功通知
        </Button>
        <Button
          onClick={() =>
            api.info({
              message: "自动关闭通知",
              description: "移入通知可暂停倒计时，移出后继续。",
              duration: 2,
            })
          }
        >
          自动关闭通知
        </Button>
        {(
          [
            "topLeft",
            "topRight",
            "bottomLeft",
            "bottomRight",
            "top",
            "bottom",
          ] as const
        ).map((placement) => (
          <Button
            key={placement}
            onClick={() =>
              api.open({
                message: `位置：${placement}`,
                description: "点击关闭按钮结束提示。",
                placement,
                duration: 0,
              })
            }
          >
            {placement}
          </Button>
        ))}
      </Space>
    </>
  );
}
export function MoreDemo() {
  const [api, holder] = notification.useNotification();
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          onClick={() =>
            api.open({
              key: "task",
              message: "导出任务",
              description: "报告已生成，等待确认。",
              duration: 0,
              actions: (
                <Button type="primary" onClick={() => api.destroy("task")}>
                  确认收到
                </Button>
              ),
            })
          }
        >
          显示任务
        </Button>
        <Button
          onClick={() =>
            api.success({
              key: "task",
              message: "任务已更新",
              description: "相同 key 会替换现有内容。",
              duration: 0,
            })
          }
        >
          更新通知
        </Button>
        <Button onClick={() => api.destroy()}>清空通知</Button>
      </Space>
    </>
  );
}
