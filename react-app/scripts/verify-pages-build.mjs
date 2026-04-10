import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const distRoot = resolve(projectRoot, "dist");
const indexPath = resolve(distRoot, "index.html");

function fail(message) {
  console.error(`[verify:pages] ${message}`);
  process.exit(1);
}

if (!existsSync(indexPath)) {
  fail("未找到 dist/index.html，请先执行 Pages 构建。");
}

const html = readFileSync(indexPath, "utf8");
const assetPathPattern = /\/aihmp_b_demo\/assets\/[^"' )]+/g;
const assetPaths = [...html.matchAll(assetPathPattern)].map((match) => match[0]);

if (assetPaths.length === 0) {
  fail("没有在 dist/index.html 中找到 /aihmp_b_demo/assets/ 资源路径。");
}

const invalidRootAssetPattern = /(?:src|href)=["']\/assets\//;
if (invalidRootAssetPattern.test(html)) {
  fail("检测到未加仓库前缀的 /assets/ 资源路径，这会导致 GitHub Pages 子路径部署异常。");
}

for (const assetPath of assetPaths) {
  const relativePath = assetPath.replace("/aihmp_b_demo/", "");
  const filePath = resolve(distRoot, relativePath);
  if (!existsSync(filePath)) {
    fail(`资源文件不存在：${relativePath}`);
  }
}

console.log("[verify:pages] Pages 构建路径检查通过。");
console.log(`[verify:pages] 已验证 ${assetPaths.length} 个资源引用。`);
