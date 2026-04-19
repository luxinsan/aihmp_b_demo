import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sharedSource = resolve(projectRoot, "..", "shared", "mock", "patient-profile.json");
const sharedStaticWorkspaceSource = resolve(projectRoot, "..", "shared", "mock", "static-workspace.json");
const parityTargetDir = resolve(projectRoot, "public", "parity");
const parityTarget = resolve(parityTargetDir, "patient-profile.json");
const parityStaticWorkspaceTarget = resolve(parityTargetDir, "static-workspace.json");

mkdirSync(parityTargetDir, { recursive: true });
copyFileSync(sharedSource, parityTarget);
copyFileSync(sharedStaticWorkspaceSource, parityStaticWorkspaceTarget);

console.log("[sync:parity-patient] 已同步 shared/mock/patient-profile.json -> public/parity/patient-profile.json");
console.log("[sync:parity-patient] 已同步 shared/mock/static-workspace.json -> public/parity/static-workspace.json");
