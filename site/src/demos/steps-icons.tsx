import { Icon, Steps } from "antd-octane";

function UserIcon() {
  return (
    <Icon viewBox="0 0 24 24">
      <circle fill="none" stroke="currentColor" cx="12" cy="7" r="4" />
      <path fill="none" stroke="currentColor" d="M4 22v-3a8 8 0 0 1 16 0v3" />
    </Icon>
  );
}

export function IconsDemo() {
  return (
    <Steps
      current={1}
      items={[
        { title: "登录", icon: <UserIcon /> },
        {
          title: "确认",
          icon: (
            <Icon spin viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M20 12a8 8 0 1 1-8-8"
              />
            </Icon>
          ),
        },
        {
          title: "完成",
          icon: (
            <Icon viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="m4 12 5 5L20 6"
              />
            </Icon>
          ),
        },
      ]}
    />
  );
}
