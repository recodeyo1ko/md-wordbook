import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "@/lib/parser"; // ✅ 修正ポイント

const WORDS_DIR = path.join(process.cwd(), "words");

export function loadAllWordEntries() {
  let allEntries = [];

  const files = fs.readdirSync(WORDS_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(WORDS_DIR, file);
    const entries = parseMarkdownFile(filePath); // ✅ 修正ポイント
    allEntries = allEntries.concat(entries);
  }

  return allEntries;
}
