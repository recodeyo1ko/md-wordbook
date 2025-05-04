// app/api/load/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { parseMarkdown } from "@/lib/parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  const dir = path.join(process.cwd(), "words");

  if (!user) {
    return NextResponse.json({ error: "User not specified" }, { status: 400 });
  }

  // 全ユーザのデータを返す
  if (user === "all") {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    const result = files.flatMap((file) => {
      const content = fs.readFileSync(path.join(dir, file), "utf-8");
      const words = parseMarkdown(content);
      const username = path.basename(file, ".md");
      return words.map((w) => ({ ...w, username }));
    });
    return NextResponse.json(result);
  }

  // 特定ユーザのデータを返す
  const filePath = path.join(dir, `${user}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "User file not found" }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const entries = parseMarkdown(content).map((entry) => ({
    ...entry,
    username: user,
  }));
  return NextResponse.json(entries);
}
