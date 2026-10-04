import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

const surface = process.argv[2] ?? "all";
const command = process.argv[3] ?? "dev";
const nextBin = "node_modules/next/dist/bin/next";
const settings = { store: { port: "3000" }, business: { port: "3001" } };

if (!["all", "store", "business"].includes(surface) || !["dev", "build", "start"].includes(command)) {
  console.error("Usage: node scripts/run-surface.mjs <all|store|business> <dev|build|start>");
  process.exit(1);
}
if (surface === "all" && command !== "dev") {
  console.error("The 'all' target is only supported for development.");
  process.exit(1);
}

const targets = surface === "all" ? ["store", "business"] : [surface];
const children = targets.map((target) => {
  const args = [command];
  if (command !== "build") args.push("-p", settings[target].port);
  return spawn(process.execPath, [nextBin, ...args], { env: { ...process.env, APP_SURFACE: target }, stdio: "inherit" });
});

const launcherParentPid = process.ppid;

const stopChildren = () => children.forEach((child) => {
  if (!child.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
});
process.on("SIGINT", stopChildren);
process.on("SIGTERM", stopChildren);
setInterval(() => {
  try {
    process.kill(launcherParentPid, 0);
  } catch {
    stopChildren();
    process.exit(0);
  }
}, 500).unref();
children.forEach((child) => child.on("exit", (code) => {
  if (code && code !== 0) { stopChildren(); process.exitCode = code; }
}));
