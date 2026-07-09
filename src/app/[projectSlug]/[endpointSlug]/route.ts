import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectSlug: string; endpointSlug: string } }
) {
  const { projectSlug, endpointSlug } = params;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  // GitHub Path
  const path = `${projectSlug}/${endpointSlug}.txt`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 } // No cache
    });

    if (!res.ok) return new Response("Error: Raw File Not Found on GitHub", { status: 404 });

    const data = await res.json();
    const rawText = Buffer.from(data.content, 'base64').toString('utf-8');

    return new Response(rawText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response("Server Connection Error", { status: 500 });
  }
}
