import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectSlug: string; endpointSlug: string } }
) {
  const { projectSlug, endpointSlug } = params;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${projectSlug}/${endpointSlug}.txt`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) return new Response("Raw File Not Found", { status: 404 });

    const data = await res.json();
    const rawText = Buffer.from(data.content, 'base64').toString('utf-8');

    return new Response(rawText, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}
