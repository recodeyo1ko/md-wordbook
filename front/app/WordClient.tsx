"use client";

import { useEffect, useMemo, useState } from "react";
import { WordEntry } from "@/lib/parser";
import WordModal from "@/components/WordModal";
import { validateWordEntry } from "@/lib/validate";

// 保存API
async function saveWordsToServer(username: string, words: WordEntry[]) {
  const res = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, words }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "保存に失敗しました");
  return result;
}

export default function WordClient() {
  const [users, setUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [words, setWords] = useState<WordEntry[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // ユーザー一覧取得
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) setUsername(data[0]); // 初期選択
      });
  }, []);

  // 単語帳を読み込み
  useEffect(() => {
    if (!username) return;
    fetch(`/api/load?user=${username}`)
      .then((res) => res.json())
      .then(setWords)
      .catch(() => {
        alert("単語の読み込みに失敗しました");
        setWords([]);
      });
  }, [username]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    words.forEach((w) => w.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [words]);

  const filteredWords = words.filter((word) => {
    const matchesSearch = word.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? word.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleOpenEdit = (word: WordEntry) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedWord(null);
    setIsModalOpen(true);
  };

  const handleSave = (entry: WordEntry, isNew: boolean) => {
    setWords((prev) =>
      isNew
        ? [...prev, entry]
        : prev.map((w) => (w.title === entry.title ? entry : w))
    );
  };

  const handleDelete = (title: string) => {
    setWords((prev) => prev.filter((w) => w.title !== title));
  };

  const handleSaveToFile = async () => {
    const invalid = words.find((w) => !validateWordEntry(w).isValid);
    if (invalid) {
      alert(`"${invalid.title}" のエントリに不備があります。保存できません。`);
      return;
    }

    try {
      await saveWordsToServer(username, words);
      alert("保存しました！");
    } catch (err: any) {
      alert(err.message || "保存に失敗しました");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">単語帳</h1>

      {/* ユーザー選択 */}
      <label className="block mb-2">ユーザー名：</label>
      <select
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-3 py-2 rounded mb-4"
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>

      {/* 検索 */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="単語名で検索..."
        className="border px-3 py-2 w-full rounded mb-4"
      />

      {/* タグフィルター */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded ${
            selectedTag === null ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          全てのタグ
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded ${
              selectedTag === tag ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 追加・保存ボタン */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ＋ 単語を追加
        </button>
        <button
          onClick={handleSaveToFile}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          💾 保存する
        </button>
      </div>

      {/* 単語表示 */}
      {filteredWords.map((word, index) => (
        <div
          key={index}
          onClick={() => handleOpenEdit(word)}
          className="cursor-pointer border rounded-lg p-4 mb-4 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-1">{word.title}</h2>
          <p>
            <strong>意味:</strong> {word.meaning}
          </p>
          <p>
            <strong>例文:</strong> {word.example}
          </p>
          <p>
            <strong>タグ:</strong> {word.tags.join(", ")}
          </p>
          <p>
            <strong>メモ:</strong> {word.memo}
          </p>
        </div>
      ))}

      {/* 編集・追加・削除モーダル */}
      <WordModal
        word={selectedWord ?? undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        existingWords={words}
      />
    </div>
  );
}
