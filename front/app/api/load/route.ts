import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseMarkdown } from "@/lib/parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  if (!user) {
    return NextResponse.json({ error: "User not specified" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "words", `${user}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "User file not found" }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const entries = parseMarkdown(content); // Markdown → WordEntry[]
  return NextResponse.json(entries);
}
