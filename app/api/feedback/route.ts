import { NextResponse } from "next/server";

interface ReportPayload {
  type?: string;
  description?: string;
  email?: string;
  page?: string;
}

const TYPE_LABELS: Record<string, string> = {
  bug: "Problema",
  improvement: "Sugestão",
  question: "Dúvida",
  unclear: "Outro",
};

function deriveTitle(type: string, description: string): string {
  const typeLabel = TYPE_LABELS[type] ?? "Contato";
  const firstLine = description.split(/\r?\n/, 1)[0]?.trim() ?? "";
  const trimmed = firstLine.length > 80
    ? firstLine.slice(0, 77).trimEnd() + "..."
    : firstLine;
  return `[${typeLabel}] ${trimmed || "(sem detalhes)"}`;
}

export async function POST(request: Request) {
  const token = process.env.REPORTS_GITHUB_TOKEN;
  const repo = process.env.REPORTS_REPO ?? "baia-demo/user-feedback";

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

  const type = payload.type?.trim();
  const description = payload.description?.trim();
  const email = payload.email?.trim();

  if (!type || !TYPE_LABELS[type]) {
    return NextResponse.json(
      { error: "invalid_type" },
      { status: 400 }
    );
  }
  if (!description) {
    return NextResponse.json(
      { error: "description_required" },
      { status: 400 }
    );
  }
  if (!email) {
    return NextResponse.json(
      { error: "email_required" },
      { status: 400 }
    );
  }

  const page = payload.page?.trim() || "unknown";
  const title = deriveTitle(type, description);

  const body = [
    `**Tipo informado pelo usuário:** ${TYPE_LABELS[type]} (\`${type}\`)`,
    "",
    "**Descrição:**",
    "",
    description,
    "",
    "---",
    "",
    `**E-mail do reportador:** ${email}`,
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
      title,
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
