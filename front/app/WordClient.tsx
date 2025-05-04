"use client";

import { useEffect, useMemo, useState } from "react";
import { WordEntry } from "@/lib/parser";
import Sidebar from "@/components/Sidebar";
import TagFilter from "@/components/TagFilter";

export default function WordClient() {
  const [words, setWords] = useState<(WordEntry & { username?: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/load?user=all")
      .then((res) => res.json())
      .then(setWords)
      .catch(() => {
        alert("読み込みに失敗しました");
        setWords([]);
      });
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    words.forEach((w) => w.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [words]);

  const filteredWords = words.filter((w) => {
    const matchTitle = w.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = selectedTag ? w.tags?.includes(selectedTag) : true;
    return matchTitle && matchTag;
  });

  return (
    <div className="flex">
      <Sidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">単語一覧</h1>

        <TagFilter
          tags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        {filteredWords.map((word, index) => (
          <div key={index} className="border p-4 rounded shadow-sm mb-4">
            <h2 className="text-xl font-semibold">{word.title}</h2>

            {word.meaning && (
              <p className="mt-1">
                <strong>意味:</strong> {word.meaning}
              </p>
            )}

            {word.example && (
              <p className="mt-1">
                <strong>例文:</strong> {word.example}
              </p>
            )}

            {word.tags && word.tags.length > 0 && (
              <p className="mt-1">
                <strong>タグ:</strong> {word.tags.join(", ")}
              </p>
            )}

            {word.memo && (
              <p className="mt-1">
                <strong>メモ:</strong> {word.memo}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2 text-right">
              投稿者: {word.username ?? "不明"}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
