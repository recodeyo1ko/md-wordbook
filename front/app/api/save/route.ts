// app/api/save/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateMarkdown } from "@/lib/writer";
import { WordEntry } from "@/lib/parser";

export async function POST(req: Request) {
  try {
    const { username, words } = await req.json();

    if (!username || !Array.isArray(words)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const markdown = generateMarkdown(words, `${username}`);
    const filePath = path.join(process.cwd(), "words", `${username}.md`);
    fs.writeFileSync(filePath, markdown, "utf-8");

    return NextResponse.json({ message: "保存しました" });
  } catch (err: any) {
    console.error("保存失敗:", err);
    return NextResponse.json(
      { error: err.message || "保存中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
