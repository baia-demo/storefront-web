import { NextResponse } from "next/server";

interface ReportPayload {
  title?: string;
  description?: string;
  page?: string;
  reporter?: string;
}

export async function POST(request: Request) {
  const token = process.env.REPORTS_GITHUB_TOKEN;
  const repo = process.env.REPORTS_REPO ?? "baia-demo/bug-reports";

  if (!token) {
    return NextResponse.json(
      { error: "github_token_not_configured" },
      { status: 500 }
    );
  }

  let payload: ReportPayload;
  try {
    payload = (await request.json()) as ReportPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const title = payload.title?.trim();
  const description = payload.description?.trim();

  if (!title || !description) {
    return NextResponse.json(
      { error: "title_and_description_required" },
      { status: 400 }
    );
  }

  const reporter = payload.reporter?.trim() || "anonymous";
  const page = payload.page?.trim() || "unknown";

  const body = [
    description,
    "",
    "---",
    "",
    `**Reportado por:** ${reporter}`,
    `**Página:** ${page}`,
    `**User agent:** ${request.headers.get("user-agent") ?? "unknown"}`,
    `**Reportado em:** ${new Date().toISOString()}`,
  ].join("\n");

  const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
    },
    body: JSON.stringify({
      title: `[ShopFlow] ${title}`,
      body,
      labels: ["needs-triage"],
    }),
  });

  if (!ghRes.ok) {
    const errText = await ghRes.text();
    return NextResponse.json(
      { error: "github_api_failed", status: ghRes.status, detail: errText },
      { status: 502 }
    );
  }

  const issue = (await ghRes.json()) as { number: number; html_url: string };
  return NextResponse.json({
    number: issue.number,
    url: issue.html_url,
  });
}
