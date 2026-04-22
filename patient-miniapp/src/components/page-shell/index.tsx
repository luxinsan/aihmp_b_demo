import type { ReactNode } from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";

type PageShellProps = {
  title: string;
  children?: ReactNode;
  bottomSlot?: ReactNode;
  bodyClassName?: string;
  overlaySlot?: ReactNode;
};

function getNavigationMetrics() {
  const systemInfo = Taro.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight ?? 20;
  const fallbackNavHeight = 44;

  if (typeof Taro.getMenuButtonBoundingClientRect !== "function") {
    return {
      capsuleHeight: 32,
      capsuleWidth: 88,
      navBarHeight: fallbackNavHeight,
      statusBarHeight,
    };
  }

  try {
    const capsuleRect = Taro.getMenuButtonBoundingClientRect();
    if (!capsuleRect?.height) {
      return {
        capsuleHeight: 32,
        capsuleWidth: 88,
        navBarHeight: fallbackNavHeight,
        statusBarHeight,
      };
    }

    const topGap = capsuleRect.top - statusBarHeight;
    return {
      capsuleHeight: capsuleRect.height,
      capsuleWidth: capsuleRect.width,
      navBarHeight: capsuleRect.height + topGap * 2,
      statusBarHeight,
    };
  } catch {
    return {
      capsuleHeight: 32,
      capsuleWidth: 88,
      navBarHeight: fallbackNavHeight,
      statusBarHeight,
    };
  }
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function PageShell({ children, title, bottomSlot, bodyClassName, overlaySlot }: PageShellProps) {
  const metrics = getNavigationMetrics();
  const navHeight = metrics.statusBarHeight + metrics.navBarHeight;
  const bottomHeight = bottomSlot ? 96 : 0;

  return (
    <View
      className="page-shell"
      style={{
        paddingTop: `${navHeight}px`,
        paddingBottom: bottomSlot ? `${bottomHeight}px` : undefined,
      }}
    >
      <View className="page-shell-nav">
        <View className="page-shell-status-spacer" style={{ height: `${metrics.statusBarHeight}px` }} />
        <View className="page-shell-nav-bar" style={{ height: `${metrics.navBarHeight}px` }}>
          <Text className="page-shell-nav-title">{title}</Text>
          <View
            className="page-shell-nav-placeholder"
            style={{
              height: `${metrics.capsuleHeight}px`,
              width: `${metrics.capsuleWidth}px`,
            }}
          />
        </View>
      </View>
      <View className={joinClassNames("page-shell-body", bodyClassName)}>
        <View className="page-shell-scroll">
          {children ?? (
            <View className="page-shell-empty-state">
              <Text className="page-shell-empty-title">{title}</Text>
              <Text className="page-shell-empty-text">当前页面内容区已预留，后续模块在这个容器内继续构建。</Text>
            </View>
          )}
        </View>
      </View>
      {overlaySlot ? <View className="page-shell-overlay">{overlaySlot}</View> : null}
      {bottomSlot ? <View className="page-shell-bottom">{bottomSlot}</View> : null}
    </View>
  );
}
