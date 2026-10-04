import "server-only"
function requiredEnvironmentValue(name: "BACKEND_API_BASE_URL" | "FRONTEND_API_KEY") {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const apiConfig = {
  baseUrl: requiredEnvironmentValue("BACKEND_API_BASE_URL"),
  frontendKey: requiredEnvironmentValue("FRONTEND_API_KEY"),
};
