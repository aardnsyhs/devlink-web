import { NextRequest, NextResponse } from "next/server";
import { highlightCodeWithShikiAutoTheme } from "@/lib/shiki";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      highlightLines?: string;
      language?: string;
      showLineNumbers?: boolean;
    };

    const code = body.code?.trim() ?? "";
    const language = body.language?.trim() || "text";

    if (!code) {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 422 },
      );
    }

    const preview = await highlightCodeWithShikiAutoTheme(
      code,
      language,
      body.highlightLines,
      body.showLineNumbers ?? true,
    );

    return NextResponse.json(preview);
  } catch {
    return NextResponse.json(
      { message: "Failed to generate code preview" },
      { status: 500 },
    );
  }
}
