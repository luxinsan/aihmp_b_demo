import type { ReactNode } from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";

type PageShellProps = {
  title: string;
  children?: ReactNode;
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

export function PageShell({ children, title }: PageShellProps) {
  const metrics = getNavigationMetrics();
  return (
    <View className="page-shell">
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
      <View className="page-shell-body">{children ?? <View className="page-shell-blank" />}</View>
    </View>
  );
}
