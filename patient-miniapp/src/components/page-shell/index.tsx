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
  if (process.env.TARO_ENV === "h5") {
    return {
      navBarHeight: 44,
      statusBarHeight: 0,
    };
  }

  const statusBarHeight = Taro.getWindowInfo().statusBarHeight ?? 20;
  const fallbackNavHeight = 44;

  if (typeof Taro.getMenuButtonBoundingClientRect !== "function") {
    return {
      navBarHeight: fallbackNavHeight,
      statusBarHeight,
    };
  }

  try {
    const capsuleRect = Taro.getMenuButtonBoundingClientRect();
    if (!capsuleRect?.height) {
      return {
        navBarHeight: fallbackNavHeight,
        statusBarHeight,
      };
    }

    const topGap = capsuleRect.top - statusBarHeight;
    return {
      navBarHeight: capsuleRect.height + topGap * 2,
      statusBarHeight,
    };
  } catch {
    return {
      navBarHeight: fallbackNavHeight,
      statusBarHeight,
    };
  }
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

const BOTTOM_SLOT_RESERVE_HEIGHT = 72;

export function PageShell({
  children,
  title,
  bottomSlot,
  bodyClassName,
  overlaySlot,
}: PageShellProps) {
  const metrics = getNavigationMetrics();
  const navHeight = metrics.statusBarHeight + metrics.navBarHeight;

  return (
    <View
      className={joinClassNames(
        "page-shell",
        bottomSlot ? "has-bottom-slot" : undefined,
      )}
      style={{
        paddingTop: `${navHeight}px`,
        paddingBottom: bottomSlot ? `calc(env(safe-area-inset-bottom) + ${BOTTOM_SLOT_RESERVE_HEIGHT}px)` : undefined,
      }}
    >
      <View className="page-shell-nav">
        <View className="page-shell-status-spacer" style={{ height: `${metrics.statusBarHeight}px` }} />
        <View className="page-shell-nav-bar" style={{ height: `${metrics.navBarHeight}px` }}>
          <Text className="page-shell-nav-title">{title}</Text>
        </View>
      </View>
      <View className={joinClassNames("page-shell-body", bodyClassName)}>
        <View className="page-shell-scroll">
          <View className="page-shell-scroll-content">
            {children}
          </View>
        </View>
      </View>
      {overlaySlot ? <View className="page-shell-overlay">{overlaySlot}</View> : null}
      {bottomSlot ? <View className="page-shell-bottom">{bottomSlot}</View> : null}
    </View>
  );
}
