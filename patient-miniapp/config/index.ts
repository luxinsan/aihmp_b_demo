import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import { resolve } from "node:path";
import devConfig from "./dev";
import prodConfig from "./prod";

export default defineConfig<"webpack5">(async (merge, { mode }) => {
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "aihmp-patient-miniapp",
    date: "2026-04-19",
    designWidth: 375,
    deviceRatio: {
      375: 2
    },
    sourceRoot: "src",
    outputRoot: "dist",
    framework: "react",
    compiler: "webpack5",
    plugins: ["@tarojs/plugin-platform-weapp"],
    alias: {
      "@": resolve(__dirname, "..", "src")
    },
    mini: {
      compile: {
        include: [resolve(__dirname, "..", "..", "shared")]
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        url: {
          enable: true,
          config: {
            limit: 1024
          }
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: "module",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        }
      }
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
      compile: {
        include: [resolve(__dirname, "..", "..", "shared")]
      }
    }
  };

  if (mode === "development") {
    return merge({}, baseConfig, devConfig);
  }

  return merge({}, baseConfig, prodConfig);
});
