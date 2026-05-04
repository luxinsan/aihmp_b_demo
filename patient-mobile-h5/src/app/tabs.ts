export type AppTabName = "home" | "plan" | "mine";

export type AppTab = {
  name: AppTabName;
  title: string;
  label: string;
  icon: string;
};

export const appTabs: AppTab[] = [
  {
    name: "home",
    title: "首页",
    label: "首页",
    icon: "wap-home-o",
  },
  {
    name: "plan",
    title: "健康计划",
    label: "健康计划",
    icon: "notes-o",
  },
  {
    name: "mine",
    title: "我的",
    label: "我的",
    icon: "user-o",
  },
];

export function getAppTabTitle(name: AppTabName) {
  return appTabs.find((tab) => tab.name === name)?.title ?? appTabs[0]!.title;
}
