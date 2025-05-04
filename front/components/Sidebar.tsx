"use client";

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function Sidebar({ searchTerm, setSearchTerm }: SidebarProps) {
  return (
    <aside className="w-64 p-4 border-r min-h-screen bg-white">
      <div>
        <h2 className="font-semibold mb-1">単語検索</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="タイトル検索"
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    </aside>
  );
}
