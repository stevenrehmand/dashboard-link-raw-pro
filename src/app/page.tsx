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
    {
      id: 1,
      name: "Sweet Bonanza Pola Gacor",
      url: "https://raw.githubusercontent.com/yourusername/repo/main/sweetbonanza.js",
      category: "Pragmatic Play",
      description: "Config pola tinggi + bet range terupdate",
      date: "2026-07-08"
    },
    {
      id: 2,
      name: "Gates of Olympus Multiplier",
      url: "https://raw.githubusercontent.com/yourusername/repo/main/gates.js",
      category: "Pragmatic Play",
      description: "Fitur tumble, multiplier, dan RTP live",
      date: "2026-07-07"
    }
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<RawLink | null>(null);
  const [newLink, setNewLink] = useState({ name: '', url: '', category: '', description: '' });

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(search.toLowerCase()) || 
    link.category.toLowerCase().includes(search.toLowerCase())
  );

  const saveLink = () => {
    if (!newLink.name || !newLink.url) {
      alert("Nama dan URL wajib diisi!");
      return;
    }

    if (editingLink) {
      setLinks(links.map(link => 
        link.id === editingLink.id ? { ...link, ...newLink } : link
      ));
    } else {
      setLinks([...links, { ...newLink, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }

    setNewLink({ name: '', url: '', category: '', description: '' });
    setEditingLink(null);
    setModalOpen(false);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('✅ Link raw berhasil dicopy!');
  };

  const startEdit = (link: RawLink) => {
    setEditingLink(link);
    setNewLink({ name: link.name, url: link.url, category: link.category, description: link.description });
    setModalOpen(true);
  };

  const deleteLink = (id: number) => {
    if (confirm('Yakin hapus link ini?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1428] text-slate-200">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-[#0f172a] border-r border-[#1e40af] z-50">
        <div className="p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            RAW<span className="text-sky-400">LINK</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Professional Dashboard</p>
        </div>

        <div className="px-6 mt-8 space-y-1">
          <div className="px-5 py-4 bg-[#1e40af] text-white rounded-2xl font-medium flex items-center gap-3">
            📋 Semua Link Raw
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-bold tracking-tight">Link Raw Manager</h2>
            <p className="text-slate-400 mt-3 text-xl">Kelola semua raw link dengan cepat & profesional</p>
          </div>

          <button 
            onClick={() => { setEditingLink(null); setNewLink({ name: '', url: '', category: '', description: '' }); setModalOpen(true); }}
            className="flex items-center gap-3 bg-sky-500 hover:bg-sky-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
          >
            <Plus size={26} /> Tambah Link Baru
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-2xl">
          <Search className="absolute left-6 top-4 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="Cari nama link, kategori, atau deskripsi..."
            className="w-full bg-[#1e2937] border border-[#334155] pl-16 py-5 rounded-3xl text-lg focus:border-sky-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredLinks.map(link => (
            <div key={link.id} className="bg-[#172554] border border-[#3b82f6]/30 rounded-3xl p-8 hover:border-sky-400 transition-all group">
              <div className="flex justify-between items-start">
                <span className="px-5 py-2 bg-sky-500/10 text-sky-400 text-sm font-medium rounded-full">
                  {link.category}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => startEdit(link)} className="text-slate-400 hover:text-white">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-6 mb-3">{link.name}</h3>
              <p className="text-slate-400 line-clamp-3 mb-8">{link.description}</p>

              <div className="bg-[#0f172a] p-5 rounded-2xl font-mono text-sm text-sky-200 break-all border border-slate-700 mb-8">
                {link.url}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => copyLink(link.url)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Copy size={20} /> Copy Raw
                </button>
                <a 
                  href={link.url} 
                  target="_blank"
                  className="flex-1 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                >
                  Buka <ExternalLink size={20} />
                </a>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">Ditambahkan • {link.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="bg-[#1e2937] border border-slate-600 rounded-3xl w-full max-w-lg p-10">
            <h3 className="text-3xl font-bold mb-8 text-white">
              {editingLink ? 'Edit Link' : 'Tambah Link Raw Baru'}
            </h3>

            <div className="space-y-6">
              <input type="text" placeholder="Nama Link" className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl px-6 py-4 text-lg" value={newLink.name} onChange={(e) => setNewLink({...newLink, name: e.target.value})} />
              <input type="text" placeholder="Kategori (Pragmatic, PG Soft, dll)" className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl px-6 py-4 text-lg" value={newLink.category} onChange={(e) => setNewLink({...newLink, category: e.target.value})} />
              <input type="text" placeholder="URL Raw Lengkap" className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl px-6 py-4 text-lg" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} />
              <textarea placeholder="Deskripsi link" className="w-full bg-[#0f172a] border border-slate-600 rounded-2xl px-6 py-4 h-28 text-lg" value={newLink.description} onChange={(e) => setNewLink({...newLink, description: e.target.value})} />
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-4 border border-slate-600 rounded-2xl font-medium">Batal</button>
              <button onClick={saveLink} className="flex-1 py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-semibold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
