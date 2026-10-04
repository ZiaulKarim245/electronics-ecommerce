import "server-only"
import { apiConfig } from "./config";

export async function backendRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Frontend-Key", apiConfig.frontendKey);
  return fetch(`${apiConfig.baseUrl}/${path.replace(/^\//, "")}`, { ...init, headers });
}
