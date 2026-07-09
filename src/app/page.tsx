'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Plus, Search, Trash2, Edit2 } from 'lucide-react';

interface RawLink {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  date: string;
}

export default function PremiumRawDashboard() {
  const [links, setLinks] = useState<RawLink[]>([
    { id: 1, name: "Sweet Bonanza Pola Gacor", url: "https://raw.githubusercontent.com/yourusername/repo/main/sweetbonanza.js", category: "Pragmatic Play", description: "Config pola tinggi + bet range terupdate", date: "2026-07-08" },
    { id: 2, name: "Gates of Olympus Multiplier", url: "https://raw.githubusercontent.com/yourusername/repo/main/gates.js", category: "Pragmatic Play", description: "Fitur tumble, multiplier, dan RTP live", date: "2026-07-07" },
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<RawLink | null>(null);
  const [newLink, setNewLink] = useState({ name: '', url: '', category: '', description: '' });

  const filteredLinks = links.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  const saveLink = () => {
    if (!newLink.name || !newLink.url) return alert("Nama dan URL wajib!");
    if (editingLink) {
      setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...newLink } : l));
    } else {
      setLinks([...links, { ...newLink, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    setModalOpen(false);
    setEditingLink(null);
    setNewLink({ name: '', url: '', category: '', description: '' });
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('✅ Link Raw berhasil dicopy!');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Sidebar Premium */}
      <div className="fixed left-0 top-0 h-full w-80 glass border-r border-blue-500/20 z-50">
        <div className="p-10">
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            RAW<span className="text-white">LINK</span>
          </h1>
          <p className="text-slate-400 mt-2">Premium Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-6xl font-bold tracking-tight">Link Raw Manager</h2>
              <p className="text-xl text-slate-400 mt-3">Koleksi profesional raw link kamu</p>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 px-10 py-5 rounded-3xl text-lg font-semibold shadow-xl shadow-sky-500/30"
            >
              <Plus size={28} /> Tambah Link Baru
            </button>
          </div>

          <div className="relative mb-12 max-w-2xl">
            <Search className="absolute left-6 top-6 text-slate-400" size={26} />
            <input
              type="text"
              placeholder="Cari nama atau kategori..."
              className="w-full bg-white/5 border border-white/10 pl-20 py-6 rounded-3xl text-xl focus:border-sky-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredLinks.map(link => (
              <div key={link.id} className="card glass rounded-3xl p-8 border border-white/10">
                <div className="flex justify-between items-start">
                  <span className="px-6 py-2 bg-sky-500/10 text-sky-400 rounded-full text-sm font-medium">{link.category}</span>
                  <div className="flex gap-4">
                    <button onClick={() => {setEditingLink(link); setNewLink(link); setModalOpen(true);}} className="text-slate-400 hover:text-white"><Edit2 size={22} /></button>
                    <button onClick={() => {if(confirm('Hapus link ini?')) setLinks(links.filter(l => l.id !== link.id));}} className="text-slate-400 hover:text-red-500"><Trash2 size={22} /></button>
                  </div>
                </div>

                <h3 className="text-3xl font-semibold mt-8 mb-4">{link.name}</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{link.description}</p>

                <div className="bg-black/40 p-5 rounded-2xl font-mono text-sm text-sky-100 break-all border border-white/10 mb-8">
                  {link.url}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => copyLink(link.url)} className="flex-1 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all">
                    <Copy size={22} /> Copy Raw
                  </button>
                  <a href={link.url} target="_blank" className="flex-1 py-5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl font-medium flex items-center justify-center gap-2">
                    Buka Link <ExternalLink size={22} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Mewah */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="glass rounded-3xl p-12 w-full max-w-lg border border-sky-500/30">
            <h3 className="text-4xl font-bold mb-10">{editingLink ? "Edit Link" : "Tambah Link Baru"}</h3>
            
            <input type="text" placeholder="Nama Link" className="w-full mb-6 p-5 bg-white/5 border border-white/10 rounded-2xl text-lg" value={newLink.name} onChange={(e) => setNewLink({...newLink, name: e.target.value})} />
            <input type="text" placeholder="Kategori" className="w-full mb-6 p-5 bg-white/5 border border-white/10 rounded-2xl text-lg" value={newLink.category} onChange={(e) => setNewLink({...newLink, category: e.target.value})} />
            <input type="text" placeholder="URL Raw Lengkap" className="w-full mb-6 p-5 bg-white/5 border border-white/10 rounded-2xl text-lg" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} />
            <textarea placeholder="Deskripsi" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl h-32 text-lg" value={newLink.description} onChange={(e) => setNewLink({...newLink, description: e.target.value})} />

            <div className="flex gap-4 mt-10">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-5 border border-white/20 rounded-2xl text-lg">Batal</button>
              <button onClick={saveLink} className="flex-1 py-5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl text-lg font-semibold">Simpan Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
