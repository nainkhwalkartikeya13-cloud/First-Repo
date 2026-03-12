// server.js — ESM-safe entry point
// We must load the .env file BEFORE any other imports so that env vars
// are available when module-level code in config/* runs.
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, ".env") }); // resolves to backend/.env regardless of CWD

import "./index.js";
