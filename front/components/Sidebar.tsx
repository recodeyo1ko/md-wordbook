"use client";

import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  users: string[];
  loginUser: string;
  setLoginUser: Dispatch<SetStateAction<string>>;
  viewUser: string;
  setViewUser: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  onAdd: () => void;
  onSave: () => Promise<void>;
}

export default function Sidebar({
  users,
  loginUser,
  setLoginUser,
  viewUser,
  setViewUser,
  searchTerm,
  setSearchTerm,
  onAdd,
  onSave,
}: SidebarProps) {
  return (
    <aside className="w-64 p-4 border-r border-gray-300 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">ログインユーザ（保存先）</h2>
        <select
          value={loginUser}
          onChange={(e) => setLoginUser(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">表示ユーザ（読み取り）</h2>
        <select
          value={viewUser}
          onChange={(e) => setViewUser(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="all">全ユーザ</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">単語名検索</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="単語名で検索..."
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button
        onClick={onAdd}
        className="w-full bg-green-600 text-white px-4 py-2 rounded mb-2"
      >
        ＋ 単語を追加
      </button>
      <button
        onClick={onSave}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded"
      >
        💾 mdファイルを更新する
      </button>
    </aside>
  );
}
