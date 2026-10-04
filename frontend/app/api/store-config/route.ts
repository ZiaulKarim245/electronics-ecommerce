import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_STORE_CONFIG, type StoreConfig } from "@/lib/storeConfig";

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "store-config.json");

function readConfigFile(): StoreConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        checkoutTemplate: ["modern", "precise", "lucrative"].includes(parsed.checkoutTemplate)
          ? parsed.checkoutTemplate
          : DEFAULT_STORE_CONFIG.checkoutTemplate,
        productLineTemplate: ["modern", "precise", "lucrative"].includes(parsed.productLineTemplate)
          ? parsed.productLineTemplate
          : DEFAULT_STORE_CONFIG.productLineTemplate,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_STORE_CONFIG;
}

function writeConfigFile(config: StoreConfig): void {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write store-config.json:", err);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET() {
  const config = readConfigFile();
  return NextResponse.json(config, {
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readConfigFile();
    const next: StoreConfig = {
      ...current,
      ...(body.checkoutTemplate ? { checkoutTemplate: body.checkoutTemplate } : {}),
      ...(body.productLineTemplate ? { productLineTemplate: body.productLineTemplate } : {}),
      updatedAt: new Date().toISOString(),
    };
    writeConfigFile(next);
    return NextResponse.json(next, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400, headers: corsHeaders });
  }
}
