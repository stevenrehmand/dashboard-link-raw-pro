'use client';
import { useState } from 'react';
import { 
  Lock, User, LayoutDashboard, Link as LinkIcon, 
  Plus, Search, Edit2, Trash2, Copy, 
  ExternalLink, LogOut, Code, Eye, X, ShieldCheck
} from 'lucide-react';

interface RawData {
  id: string;
  name: string;
  content: string;
  category: string;
  date: string;
}

export default function PremiumApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState<RawData | null>(null);
  const [links, setLinks] = useState<RawData[]>([
    { 
      id: '1', 
      name: 'Main Config API v1', 
      content: '{\n  "api_key": "raw_772199x",\n  "status": "online",\n  "version": "2.0.1"\n}', 
      category: 'Production', 
      date: '2024-05-20' 
    }
  ]);
  const [form, setForm] = useState({ id: '', name: '', content: '', category: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Akses Ditolak: Kredensial Salah!');
    }
  };

  const saveLink = () => {
    if (!form.name || !form.content) return alert('Nama dan Konten wajib diisi!');
    if (form.id) {
      setLinks(links.map(l => l.id === form.id ? { ...form, date: l.date } : l));
    } else {
      setLinks([{ ...form, id: Date.now().toString(), date: new Date().toLocaleDateString() }, ...links]);
    }
    setModalOpen(false);
    setForm({ id: '', name: '', content: '', category: '' });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <div className="glass w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl mb-4 text-blue-500">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">RAW<span className="text-blue-500">PRO</span></h1>
            <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Encrypted Terminal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Username" className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-blue-500 text-white transition-all" onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-blue-500 text-white transition-all" onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">ACCESS DASHBOARD</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Code size={20}/></div>
          <h2 className="text-xl font-bold tracking-tighter text-white">RAWPRO.</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl font-bold border border-blue-500/20 transition-all">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-white transition-all">
            <LinkIcon size={20}/> Repositories
          </button>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-4 text-red-500/60 hover:text-red-500 px-4 py-3 transition-all font-bold">
          <LogOut size={20}/> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="xl:ml-72 flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Control Panel</h1>
              <p className="text-slate-500 font-medium">Manage your raw data and API snippets.</p>
            </div>
            <button onClick={() => { setForm({ id: '', name: '', content: '', category: '' }); setModalOpen(true); }} className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-2">
              <Plus size={20}/> Create New Raw
            </button>
          </div>

          <div className="relative mb-10 max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20}/>
            <input type="text" placeholder="Search by name..." className="w-full bg-white/5 border border-white/10 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-blue-600 focus:bg-white/10 transition-all" onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {links.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map(link => (
              <div key={link.id} className="glass p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all premium-shadow group border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">{link.category || 'General'}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setForm(link); setModalOpen(true); }} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16}/></button>
                    <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{link.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setViewRaw(link)} className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold border border-white/10 transition-all text-xs uppercase tracking-widest">
                    <Eye size={18}/> View Raw
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(link.content); alert('Copied to Clipboard!'); }} className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white transition-all text-xs uppercase tracking-widest shadow-lg shadow-blue-600/10">
                    <Copy size={18}/> Copy Text
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-200">
          <div className="glass w-full max-w-2xl p-10 rounded-[3rem] border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-10 tracking-tighter italic">Entry System.</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Project Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input type="text" placeholder="Category" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              <textarea placeholder="Paste your raw text/code here..." className="w-full h-64 bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-blue-500 font-mono text-sm resize-none" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-5 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Discard changes</button>
                <button onClick={saveLink} className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest text-[10px]">Confirm & Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Raw */}
      {viewRaw && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col p-6 lg:p-16 animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{viewRaw.name}</h2>
              <p className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mt-1 italic">Raw Data Output</p>
            </div>
            <button onClick={() => setViewRaw(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white"><X size={24}/></button>
          </div>
          <div className="flex-1 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 lg:p-12 overflow-auto font-mono text-blue-200/60 leading-relaxed text-sm shadow-inner">
            <pre className="whitespace-pre-wrap">{viewRaw.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
