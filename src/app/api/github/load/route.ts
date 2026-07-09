import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: "Env vars missing" }, { status: 500 });
  }

  try {
    // 1. Ambil daftar isi repo (untuk cari folder/project)
    const resFolders = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!resFolders.ok) return NextResponse.json({ projects: [], links: [] });

    const items = await resFolders.json();
    // Abaikan folder .next, src, atau file sistem lainnya jika ada
    const ignoredFolders = ['src', 'public', 'node_modules', '.next', '.git'];
    const folders = items.filter((item: any) => item.type === 'dir' && !ignoredFolders.includes(item.name));

    let allProjects: any[] = [];
    let allLinks: any[] = [];

    // 2. Scan setiap folder untuk mencari file .txt
    for (const folder of folders) {
      const projectId = folder.sha;
      allProjects.push({
        id: projectId,
        name: folder.name.replace(/-/g, ' ').toUpperCase(),
        slug: folder.name
      });

      const resFiles = await fetch(folder.url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });

      if (resFiles.ok) {
        const files = await resFiles.json();
        for (const file of files) {
          if (file.name.endsWith('.txt')) {
            // Ambil konten raw dari GitHub
            const resContent = await fetch(file.download_url, { cache: 'no-store' });
            const content = await resContent.text();

            allLinks.push({
              id: file.sha,
              projectId: projectId,
              name: file.name.replace('.txt', ''),
              slug: file.name.replace('.txt', ''),
              content: content,
              date: new Date().toLocaleDateString()
            });
          }
        }
      }
    }

    return NextResponse.json({ projects: allProjects, links: allLinks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load data from GitHub" }, { status: 500 });
  }
}
