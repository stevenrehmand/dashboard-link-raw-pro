import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectSlug: string; endpointSlug: string } }
) {
  // Ambil parameter slug dari URL
  const { projectSlug, endpointSlug } = params;
  
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  // LOGIKA PERBAIKAN: 
  // Jika user mengetik 'kontena.txt', gunakan langsung.
  // Jika user mengetik 'kontena' saja, tambahkan '.txt'.
  const fileName = endpointSlug.endsWith('.txt') ? endpointSlug : `${endpointSlug}.txt`;
  const path = `${projectSlug}/${fileName}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json"
      },
      cache: 'no-store'
    });

    if (!res.ok) {
        // Jika masih gagal, kita coba tampilkan pesan yang lebih detail untuk debug
        return new Response(`Raw File Not Found: ${path}`, { status: 404 });
    }

    const data = await res.json();
    
    // GitHub mengirim konten dalam format base64, kita ubah kembali ke teks biasa
    const rawText = Buffer.from(data.content, 'base64').toString('utf-8');

    return new Response(rawText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*', // Penting agar bisa dipanggil script lain
      },
    });
  } catch (err) {
    return new Response("Server Connection Error", { status: 500 });
  }
}
