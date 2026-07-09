import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { path, content } = await req.json();
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    // Cek SHA file (jika ingin update file yang sudah ada)
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let sha = undefined;
    if (checkRes.ok) {
      const existingFileData = await checkRes.json();
      sha = existingFileData.sha;
    }

    // Upload ke GitHub
    const uploadRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Deployment: Update raw file ${path}`,
        content: Buffer.from(content).toString('base64'),
        sha: sha
      }),
    });

    const result = await uploadRes.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
