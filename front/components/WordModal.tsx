"use client";

import { useEffect, useState, useMemo } from "react";
import { WordEntry } from "@/lib/parser";
import { validateWordEntry } from "@/lib/validate";
import CreatableSelect from "react-select/creatable";

type Props = {
  word?: WordEntry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: WordEntry, isNew: boolean) => void;
  onDelete?: (title: string) => void;
  existingWords: WordEntry[];
};

export default function WordModal({
  word,
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingWords,
}: Props) {
  const [form, setForm] = useState<WordEntry>({
    title: "",
    meaning: "",
    example: "",
    tags: [],
    memo: "",
  });

  // 全タグ候補一覧を生成（重複なし）
  const tagOptions = useMemo(() => {
    const tagSet = new Set<string>();
    existingWords.forEach((w) => w.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).map((tag) => ({ value: tag, label: tag }));
  }, [existingWords]);

  useEffect(() => {
    if (word) {
      setForm(word);
    } else {
      setForm({ title: "", meaning: "", example: "", tags: [], memo: "" });
    }
  }, [word, isOpen]);

  const isTitleDuplicate = (title: string): boolean => {
    const lower = title.toLowerCase().trim();
    return existingWords.some(
      (w) =>
        w.title.toLowerCase().trim() === lower &&
        (!word || w.title !== word.title)
    );
  };

  const handleChange = (key: keyof WordEntry, value: any) => {
    if (key === "tags") {
      setForm((prev) => ({
        ...prev,
        tags: value.map((v: any) => v.value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
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
          {word ? "単語を編集" : "単語を追加"}
        </h2>

        <label className="block mb-2">単語名</label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
        />

        <label className="block mb-2">意味</label>
        <textarea
          value={form.meaning}
          onChange={(e) => handleChange("meaning", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
        />

        <label className="block mb-2">例文</label>
        <textarea
          value={form.example}
          onChange={(e) => handleChange("example", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
        />

        <label className="block mb-2">タグ（複数選択可、新規登録は入力）</label>
        <CreatableSelect
          isMulti
          value={form.tags.map((tag) => ({ value: tag, label: tag }))}
          onChange={(selected) => handleChange("tags", selected)}
          options={tagOptions}
          className="mb-3"
        />

        <label className="block mb-2">メモ</label>
        <textarea
          value={form.memo}
          onChange={(e) => handleChange("memo", e.target.value)}
          className="w-full border px-3 py-1 mb-3"
        />

        <div className="flex justify-between mt-4">
          {word && onDelete && (
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
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
