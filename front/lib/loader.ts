import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "@/lib/parser";

const WORDS_DIR = path.join(process.cwd(), "words");

export function loadAllWordEntries() {
  let allEntries = [] as any[];

  const files = fs.readdirSync(WORDS_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(WORDS_DIR, file);
    const entries = parseMarkdownFile(filePath);
    allEntries = allEntries.concat(entries);
  }

  return allEntries;
}
