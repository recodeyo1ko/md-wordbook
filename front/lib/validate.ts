import { WordEntry } from "./parser";

export type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export function validateWordEntry(entry: WordEntry): ValidationResult {
  if (!entry.title || entry.title.trim() === "") {
    return { isValid: false, message: "単語名が未入力です。" };
  }
  if (!entry.meaning || entry.meaning.trim() === "") {
    return { isValid: false, message: "意味が未入力です。" };
  }
  if (!Array.isArray(entry.tags)) {
    return { isValid: false, message: "タグは配列である必要があります。" };
  }

  return { isValid: true };
}
