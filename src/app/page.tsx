'use client';
import { useState } from 'react';
import { 
  Copy, 
  ExternalLink, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  LayoutDashboard, 
  Link as LinkIcon, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

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
    { 
      id: 1, 
      name: "Sweet Bonanza Pola Gacor", 
      url: "https://raw.githubusercontent.com/dev/main/sweetbonanza.js", 
      category: "Pragmatic Play", 
      description: "Config pola tinggi + bet range terupdate untuk server internasional.", 
      date: "2026-07-08" 
    },
    { 
      id: 2, 
      name: "Gates of Olympus Multiplier", 
      url: "https://raw.githubusercontent.com/dev/main/gates.js", 
      category: "Pragmatic Play", 
      description: "Fitur tumble, multiplier otomatis, dan integrasi RTP live API.", 
      date: "2026-07-07" 
    },
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
    if (!newLink.name || !newLink.url) return alert("Nama dan URL wajib diisi!");
    
    if (editingLink) {
      setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...newLink } : l));
    } else {
      setLinks([...links, { 
        ...newLink, 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0] 
      }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLink(null);
    setNewLink({ name: '', url: '', category: '', description: '' });
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // Kita bisa tambahkan toast notification di sini
    alert('✅ Link Raw berhasil dicopy ke clipboard!');
  };

  const deleteLink = (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus link ini?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1c] text-white">
      
      {/* --- SIDEBAR PREMIUM --- */}
      <aside className="fixed left-0 top-0 h-full w-72 glass border-r border-white/5 z-50 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">
              RAW<span className="text-sky-400">LINK</span>
            </h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 rounded-xl text-sky-400 border border-white/5">
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
              <LinkIcon size={20} /> My Links
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
              <Settings size={20} /> Settings
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button className="flex items-center gap-4 text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-72 flex-1 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <h2 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                Link Raw Manager
              </h2>
              <p className="text-slate-400 text-lg">Kelola aset digital raw link Anda dengan standar premium.</p>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="group flex items-center gap-3 bg-premium-gradient hover:opacity-90 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Tambah Link Baru
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau kategori..." 
              className="w-full max-w-2xl bg-white/5 border border-white/10 pl-16 pr-8 py-5 rounded-2xl text-lg focus:border-sky-500 focus:bg-white/[0.08] outline-none transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredLinks.map(link => (
              <div key={link.id} className="glass-card rounded-3xl p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs font-bold tracking-wider uppercase">
                    {link.category}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {setEditingLink(link); setNewLink(link); setModalOpen(true);}}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteLink(link.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 line-clamp-1">{link.name}</h3>
                <p className="text-slate-400 leading-relaxed mb-8 text-sm line-clamp-3">
                  {link.description}
                </p>

                <div className="mt-auto">
                  <div className="bg-black/40 p-4 rounded-xl font-mono text-xs text-sky-200/70 break-all border border-white/5 mb-6 relative group/code">
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover/code:opacity-100 transition-opacity rounded-xl"></div>
                    {link.url}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => copyLink(link.url)}
                      className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all border border-white/5"
                    >
                      <Copy size={18} /> Copy
                    </button>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 bg-premium-gradient rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                      Buka <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredLinks.length === 0 && (
            <div className="text-center py-24 glass rounded-3xl border-dashed border-2 border-white/10">
              <div className="text-slate-500 text-xl">Tidak ada link ditemukan.</div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL DIALOG --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="glass rounded-[2rem] p-10 w-full max-w-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-bold tracking-tight">
                {editingLink ? "Edit Data Link" : "Tambah Link Baru"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Nama Project</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Config API v1" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500 outline-none transition-all text-lg"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Kategori</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Backend / JS / Config" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500 outline-none transition-all"
                  value={newLink.category}
                  onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">URL Raw</label>
                <input 
                  type="text" 
                  placeholder="https://raw.githubusercontent.com/..." 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-sky-500 outline-none transition-all font-mono text-sm"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Deskripsi Singkat</label>
                <textarea 
                  placeholder="Jelaskan kegunaan link ini..." 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl h-32 focus:border-sky-500 outline-none transition-all resize-none"
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button 
                onClick={closeModal}
                className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-semibold hover:bg-white/5 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={saveLink}
                className="flex-1 py-4 bg-premium-gradient rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
