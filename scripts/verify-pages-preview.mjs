import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pagesOut = join(root, "pages-out");

const checks = [
  {
    name: "admin bundle uses GitHub Pages base path",
    file: join(pagesOut, "admin", "index.html"),
    includes: "/aihmp_b_demo/admin/assets/",
  },
  {
    name: "patient H5 bundle uses GitHub Pages base path",
    file: join(pagesOut, "patient-h5", "index.html"),
    includes: "/aihmp_b_demo/patient-h5/assets/",
  },
  {
    name: "patient shell bundle uses GitHub Pages base path",
    file: join(pagesOut, "patient", "index.html"),
    includes: "/aihmp_b_demo/patient/assets/",
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

const patientShellAssetsDir = join(pagesOut, "patient", "assets");

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
