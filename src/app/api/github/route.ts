import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Paksa agar tidak di-cache sebagai halaman statis

export async function POST(req: NextRequest) {
  try {
    const { path, content } = await req.json();
    
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: "Missing Env Vars" }, { status: 500 });
    }

    // 1. Cek SHA
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    let sha = undefined;
    if (checkRes.ok) {
      const existingFile = await checkRes.json();
      sha = existingFile.sha;
    }

    // 2. Upload
    const uploadRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Cloud Save: ${path}`,
        content: Buffer.from(content).toString('base64'),
        sha: sha
      }),
    });

    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      return NextResponse.json({ error: errData.message }, { status: uploadRes.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
