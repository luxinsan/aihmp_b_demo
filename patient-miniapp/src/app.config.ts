export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/health-plan/index",
    "pages/mine/index"
  ],
  window: {
    navigationStyle: "custom",
    backgroundColor: "#f4f7fb",
    backgroundTextStyle: "light"
  },
  tabBar: {
    color: "#7a8699",
    selectedColor: "#1f6feb",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        iconPath: "assets/tabbar/home.png",
        selectedIconPath: "assets/tabbar/home-active.png",
        text: "首页"
      },
      {
        pagePath: "pages/health-plan/index",
        iconPath: "assets/tabbar/plan.png",
        selectedIconPath: "assets/tabbar/plan-active.png",
        text: "健康计划"
      },
      {
        pagePath: "pages/mine/index",
        iconPath: "assets/tabbar/mine.png",
        selectedIconPath: "assets/tabbar/mine-active.png",
        text: "我的"
      }
    ]
  }
});
