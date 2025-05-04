"use client";

import { useEffect, useMemo, useState } from "react";
import { WordEntry } from "@/lib/parser";
import WordModal from "@/components/WordModal";
import { validateWordEntry } from "@/lib/validate";
import Sidebar from "@/components/Sidebar";

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
  const [loginUser, setLoginUser] = useState<string>("");
  const [displayUser, setDisplayUser] = useState<string>("all");
  const [words, setWords] = useState<(WordEntry & { username?: string })[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          setLoginUser(data[0]);
          setDisplayUser("all");
        }
      });
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      const endpoint =
        displayUser === "all"
          ? "/api/load?user=all"
          : `/api/load?user=${displayUser}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setWords(data);
    };
    fetchWords().catch(() => {
      alert("単語の読み込みに失敗しました");
      setWords([]);
    });
  }, [displayUser]);

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

  const handleOpenEdit = (word: WordEntry & { username?: string }) => {
    if (word.username && word.username !== loginUser) return; // 他人の投稿は編集不可
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
        ? [...prev, { ...entry, username: loginUser }]
        : prev.map((w) =>
            w.title === entry.title ? { ...entry, username: loginUser } : w
          )
    );
  };

  const handleDelete = (title: string) => {
    setWords((prev) => prev.filter((w) => w.title !== title));
  };

  const handleSaveToFile = async () => {
    const myWords = words.filter((w) => w.username === loginUser);
    const invalid = myWords.find((w) => !validateWordEntry(w).isValid);
    if (invalid) {
      alert(`"${invalid.title}" のエントリに不備があります。保存できません。`);
      return;
    }

    try {
      await saveWordsToServer(loginUser, myWords);
      alert("保存しました！");
    } catch (err: any) {
      alert(err.message || "保存に失敗しました");
    }
  };

  return (
    <div className="flex">
      <Sidebar
        users={users}
        loginUser={loginUser}
        setLoginUser={setLoginUser}
        viewUser={displayUser}
        setViewUser={setDisplayUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={handleAdd}
        onSave={handleSaveToFile}
      />

      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">単語帳</h1>

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

        {filteredWords.map((word, index) => (
          <div
            key={index}
            onClick={() => handleOpenEdit(word)}
            className={`cursor-pointer border rounded-lg p-4 mb-4 shadow-sm hover:bg-gray-50 ${
              word.username !== loginUser
                ? "opacity-70 pointer-events-none"
                : ""
            }`}
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
            <p className="text-right text-xs text-gray-500 mt-2">
              投稿者: {word.username || "不明"}
            </p>
          </div>
        ))}

        <WordModal
          word={selectedWord ?? undefined}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          existingWords={words}
          isEditable={selectedWord?.username === loginUser || !selectedWord}
        />
      </main>
    </div>
  );
}
