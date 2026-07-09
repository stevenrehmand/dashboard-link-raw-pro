'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Plus, Search, Trash2, Edit } from 'lucide-react';

interface RawLink {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  date: string;
}

export default function RawLinkDashboard() {
  const [links, setLinks] = useState<RawLink[]>([
    { id: 1, name: "Sweet Bonanza Pola Gacor", url: "https://raw.githubusercontent.com/yourusername/repo/main/sweetbonanza.js", category: "Pragmatic Play", description: "Config pola tinggi + bet range terupdate", date: "2026-07-08" },
    { id: 2, name: "Gates of Olympus Multiplier", url: "https://raw.githubusercontent.com/yourusername/repo/main/gates.js", category: "Pragmatic Play", description: "Fitur tumble, multiplier, dan RTP live", date: "2026-07-07" },
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [newLink, setNewLink] = useState({ name: '', url: '', category: '', description: '' });

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(search.toLowerCase()) || link.category.toLowerCase().includes(search.toLowerCase())
  );

  const saveLink = () => {
    if (!newLink.name || !newLink.url) return alert("Nama dan URL wajib diisi!");
    
    if (editingLink) {
      setLinks(links.map(l => l.id === editingLink.id ? {...l, ...newLink} : l));
    } else {
      setLinks([...links, {...newLink, id: Date.now(), date: new Date().toISOString().split('T')[0]}]);
    }
    setModalOpen(false);
    setEditingLink(null);
    setNewLink({ name: '', url: '', category: '', description: '' });
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('✅ Link berhasil dicopy!');
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-[#0f172a] border-r border-[#1e40af] z-50">
        <div className="p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">RAWLINK</h1>
          <p className="text-slate-400 mt-1">Dashboard Profesional</p>
        </div>
      </div>

      <div className="ml-72 p-10">
        <div className="flex justify-between mb-12">
          <div>
            <h2 className="text-5xl font-bold">Link Raw Manager</h2>
            <p className="text-slate-400 mt-2 text-xl">Tema Biru Navy + Sky Blue</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="bg-sky-500 hover:bg-sky-600 px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold">
            <Plus size={24} /> Tambah Link
          </button>
        </div>

        <div className="relative max-w-xl mb-10">
          <Search className="absolute left-6 top-5 text-slate-400" size={22} />
          <input type="text" placeholder="Cari link..." className="w-full bg-[#1e2937] border border-slate-600 pl-16 py-5 rounded-3xl text-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredLinks.map(link => (
            <div key={link.id} className="bg-[#172554] border border-[#3b82f6]/30 rounded-3xl p-8 hover:border-sky-400 transition-all">
              <div className="flex justify-between">
                <span className="px-5 py-2 bg-sky-500/10 text-sky-400 rounded-full text-sm">{link.category}</span>
                <div className="flex gap-3">
                  <button onClick={() => { setEditingLink(link); setNewLink(link); setModalOpen(true); }}><Edit size={20} /></button>
                  <button onClick={() => { if(confirm('Hapus?')) setLinks(links.filter(l => l.id !== link.id)); }}><Trash2 size={20} className="text-red-400" /></button>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mt-6">{link.name}</h3>
              <p className="text-slate-400 mt-3 line-clamp-2">{link.description}</p>
              <div className="mt-6 bg-[#0f172a] p-4 rounded-2xl text-sm font-mono text-sky-200 break-all">{link.url}</div>
              <div className="mt-8 flex gap-4">
                <button onClick={() => copyLink(link.url)} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl">Copy</button>
                <a href={link.url} target="_blank" className="flex-1 py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl text-center">Buka</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#1e2937] p-10 rounded-3xl w-full max-w-md">
            <h3 className="text-3xl font-bold mb-8">{editingLink ? "Edit Link" : "Tambah Link Baru"}</h3>
            <input type="text" placeholder="Nama Link" className="w-full mb-4 p-4 bg-[#0f172a] rounded-2xl" value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})} />
            <input type="text" placeholder="Kategori" className="w-full mb-4 p-4 bg-[#0f172a] rounded-2xl" value={newLink.category} onChange={e => setNewLink({...newLink, category: e.target.value})} />
            <input type="text" placeholder="URL Raw" className="w-full mb-4 p-4 bg-[#0f172a] rounded-2xl" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
            <textarea placeholder="Deskripsi" className="w-full p-4 bg-[#0f172a] rounded-2xl h-28" value={newLink.description} onChange={e => setNewLink({...newLink, description: e.target.value})} />
            <div className="flex gap-4 mt-8">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-4 border border-slate-600 rounded-2xl">Batal</button>
              <button onClick={saveLink} className="flex-1 py-4 bg-sky-500 rounded-2xl font-semibold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
