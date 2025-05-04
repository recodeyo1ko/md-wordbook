import fs from "fs";
import path from "path";

export type WordEntry = {
  title: string;
  meaning: string;
  example: string;
  tags: string[];
  memo: string;
};

// 汎用的な Markdown パース関数
export function parseMarkdown(markdown: string): WordEntry[] {
  const lines = markdown.split("\n");

  const words: WordEntry[] = [];
  let current: Partial<WordEntry> = {};
  let state: "idle" | "word" = "idle";

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("## ")) {
      if (current.title) {
        words.push(current as WordEntry);
        current = {};
      }
      current.title = line.replace(/^## /, "").trim();
      state = "word";
    } else if (state === "word") {
      if (line.startsWith("- 意味:")) {
        current.meaning = line.replace("- 意味:", "").trim();
      } else if (line.startsWith("- 例文:")) {
        current.example = line.replace("- 例文:", "").trim();
      } else if (line.startsWith("- タグ:")) {
        const raw = line.replace("- タグ:", "").trim();
        current.tags = raw ? raw.split(",").map((s) => s.trim()) : [];
      } else if (line.startsWith("- メモ:")) {
        current.memo = line.replace("- メモ:", "").trim();
      }
    }
  }

  if (current.title) {
    words.push(current as WordEntry);
  }

  return words;
}

// ファイル読み込み込みで使いたい場合
export function parseMarkdownFile(filePath: string): WordEntry[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return parseMarkdown(content);
}
