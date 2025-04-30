import * as React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";

export const SideNavi = () => {
  const [activeHref, setActiveHref] = React.useState(
    "#/page1"
  );
  return (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: "#/", text: "メニュー" }}
      onFollow={event => {
        if (!event.detail.external) {
          event.preventDefault();
          setActiveHref(event.detail.href);
        }
      }}
      items={[
        { type: "link", text: "ホーム", href: "/" },
        { type: "link", text: "リアルタイム翻訳", href: "/audio_translate" },
        { type: "link", text: "リアルタイム翻訳", href: "/audio_translate" },
        { type: "link", text: "議事録生成", href: "/meeting_minutes"},
        { type: "divider" }
      ]}
    />
  );
}