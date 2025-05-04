// app/page.tsx
import { loadAllWordEntries } from "@/lib/loader";
import { WordEntry } from "@/lib/parser";
import WordClient from "./WordClient"; // クライアント側の処理を分離

export default async function Page() {
  const words: WordEntry[] = await loadAllWordEntries();
  return <WordClient />; // クライアントコンポーネントを使用
}
