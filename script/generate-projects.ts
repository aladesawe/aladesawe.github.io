import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { storage } from "../server/storage.ts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

async function generateProjects() {
  const projects = await storage.getProjects();
  
  const outputDir = resolve(__dirname, "..", "client", "public");
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(
    resolve(outputDir, "projects.json"),
    JSON.stringify(projects, null, 2)
  );

  console.log("Generated projects.json");
}

generateProjects().catch((err) => {
  console.error("Failed to generate projects.json:", err);
  process.exit(1);
});
