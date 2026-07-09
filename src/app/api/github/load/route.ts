import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {
    // 1. Ambil daftar folder (sebagai Project)
    const resFolders = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!resFolders.ok) return NextResponse.json({ projects: [], links: [] });

    const items = await resFolders.json();
    const folders = items.filter((item: any) => item.type === 'dir');

    const allProjects: any[] = [];
    const allLinks: any[] = [];

    // 2. Loop setiap folder untuk ambil file .txt didalamnya
    for (const folder of folders) {
      allProjects.push({
        id: folder.sha,
        name: folder.name.replace(/-/g, ' '),
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
            // Ambil konten file untuk ditampilkan di edit/view
            const resContent = await fetch(file.download_url);
            const content = await resContent.text();

            allLinks.push({
              id: file.sha,
              projectId: folder.sha,
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
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
