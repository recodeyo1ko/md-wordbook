"use client";

import { useEffect, useState } from "react";
import { WordEntry } from "@/lib/parser";
import { validateWordEntry } from "@/lib/validate";

type Props = {
  word?: WordEntry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: WordEntry, isNew: boolean) => void;
  onDelete?: (title: string) => void;
  existingWords: WordEntry[];
  isEditable: boolean; // 追加
};

export default function WordModal({
  word,
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingWords,
  isEditable, // 追加
}: Props) {
  const [form, setForm] = useState<WordEntry>({
    title: "",
    meaning: "",
    example: "",
    tags: [],
    memo: "",
  });

  useEffect(() => {
    if (word) {
      setForm(word);
    } else {
      setForm({ title: "", meaning: "", example: "", tags: [], memo: "" });
    }
  }, [word, isOpen]);

  const handleChange = (key: keyof WordEntry, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "tags" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  const isTitleDuplicate = (title: string): boolean => {
    const lower = title.toLowerCase().trim();
    return existingWords.some(
      (w) =>
        w.title.toLowerCase().trim() === lower &&
        (!word || w.title !== word.title)
    );
  };

  const handleSave = () => {
    const result = validateWordEntry(form);
    if (!result.isValid) {
      alert(result.message);
      return;
    }

    if (isTitleDuplicate(form.title)) {
      alert(`「${form.title}」という単語はすでに登録されています。`);
      return;
    }

    onSave(form, !word);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {word ? "単語を閲覧" : "単語を追加"}
        </h2>

        <label className="block mb-2">単語名</label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
          disabled={!isEditable}
        />

        <label className="block mb-2">意味</label>
        <textarea
          value={form.meaning}
          onChange={(e) => handleChange("meaning", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
          disabled={!isEditable}
        />

        <label className="block mb-2">例文</label>
        <textarea
          value={form.example}
          onChange={(e) => handleChange("example", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
          disabled={!isEditable}
        />

        <label className="block mb-2">タグ（カンマ区切り）</label>
        <input
          value={form.tags.join(", ")}
          onChange={(e) => handleChange("tags", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
          disabled={!isEditable}
        />

        <label className="block mb-2">メモ</label>
        <textarea
          value={form.memo}
          onChange={(e) => handleChange("memo", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
          disabled={!isEditable}
        />

        <div className="flex justify-between mt-4">
          {word && onDelete && isEditable && (
            <button
              onClick={() => {
                if (confirm("削除しますか？")) {
                  onDelete(word.title);
                  onClose();
                }
              }}
              className="text-red-500"
            >
              削除
            </button>
          )}
          <div className="ml-auto space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              閉じる
            </button>
            {isEditable && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                保存
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
