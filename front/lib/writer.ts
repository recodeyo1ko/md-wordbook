import { WordEntry } from "./parser";

export function generateMarkdown(
  words: WordEntry[],
  title: string = "単語帳"
): string {
  let output = `# ${title}\n\n`;

  for (const word of words) {
    output += `## ${word.title}\n\n`;
    output += `- 意味: ${word.meaning}\n`;
    output += `- 例文: ${word.example}\n`;
    output += `- タグ: ${word.tags.join(", ")}\n`;
    output += `- メモ: ${word.memo}\n\n`;
  }

  return output.trim() + "\n";
}
