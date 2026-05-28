import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pagesOut = join(root, "pages-out");

const checks = [
  {
    name: "root navigation includes platform admin entry",
    file: join(pagesOut, "index.html"),
    includes: "./m/",
  },
  {
    name: "root navigation includes admin entry",
    file: join(pagesOut, "index.html"),
    includes: "./b/",
  },
  {
    name: "root navigation includes patient entry",
    file: join(pagesOut, "index.html"),
    includes: "./c/",
  },
  {
    name: "B end bundle uses GitHub Pages base path",
    file: join(pagesOut, "b", "index.html"),
    includes: "/aihmp_b_demo/b/assets/",
  },
  {
    name: "M end bundle uses GitHub Pages base path",
    file: join(pagesOut, "m", "index.html"),
    includes: "/aihmp_b_demo/m/assets/",
  },
  {
    name: "patient H5 bundle uses GitHub Pages base path",
    file: join(pagesOut, "patient-h5", "index.html"),
    includes: "/aihmp_b_demo/patient-h5/assets/",
  },
  {
    name: "C end shell bundle uses GitHub Pages base path",
    file: join(pagesOut, "c", "index.html"),
    includes: "/aihmp_b_demo/c/assets/",
  },
];

function readRequiredFile(file) {
  if (!existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }

  return readFileSync(file, "utf8");
}

for (const check of checks) {
  const content = readRequiredFile(check.file);

  if (!content.includes(check.includes)) {
    throw new Error(`${check.name}: expected ${check.includes} in ${check.file}`);
  }
}

const patientShellAssetsDir = join(pagesOut, "c", "assets");

if (!existsSync(patientShellAssetsDir)) {
  throw new Error(`Missing patient shell assets directory: ${patientShellAssetsDir}`);
}

const patientShellJs = readdirSync(patientShellAssetsDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => readFileSync(join(patientShellAssetsDir, file), "utf8"))
  .join("\n");

if (!patientShellJs.includes("/aihmp_b_demo/patient-h5/")) {
  throw new Error("Patient shell Pages bundle does not point iframe to /aihmp_b_demo/patient-h5/");
}

console.log("Pages preview artifact checks passed.");
