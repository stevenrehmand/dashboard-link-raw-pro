'use client';
import { useState, useEffect } from 'react';
import { 
  Lock, User, LayoutDashboard, Link as LinkIcon, 
  Plus, Search, Edit2, Trash2, Copy, 
  ExternalLink, LogOut, Code, Eye, X, Check
} from 'lucide-react';

// --- DATA TYPE ---
interface RawData {
  id: string;
  name: string;
  content: string;
  category: string;
  date: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState<RawData | null>(null);
  
  // CRUD States
  const [links, setLinks] = useState<RawData[]>([
    { 
      id: '1', 
      name: 'Main Config API', 
      content: '{\n  "status": "active",\n  "version": "1.0.4",\n  "key": "premium_992x"\n}', 
      category: 'System', 
      date: '2024-05-20' 
    }
  ]);
  const [form, setForm] = useState({ id: '', name: '', content: '', category: '' });

  // Login Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Akses Ditolak: Username atau Password salah!');
    }
  };

  // CRUD Logic
  const saveLink = () => {
    if (!form.name || !form.content) return alert('Lengkapi data!');
    if (form.id) {
      setLinks(links.map(l => l.id === form.id ? { ...form, date: l.date } : l));
    } else {
      setLinks([{ ...form, id: Date.now().toString(), date: new Date().toLocaleDateString() }, ...links]);
    }
    setModalOpen(false);
    setForm({ id: '', name: '', content: '', category: '' });
  };

  const deleteLink = (id: string) => {
    if(confirm('Hapus data ini secara permanen?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  // --- VIEW: LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="glass w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px]"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-4">
              <Lock className="text-blue-500" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter">RAW<span className="text-blue-500">PRO</span></h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-widest uppercase">Secure Access Terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-lg"><Code size={20}/></div>
          <h2 className="text-xl font-bold">RAWLINK <span className="font-light text-slate-400">PRO</span></h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl font-semibold border border-blue-600/20">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <LinkIcon size={20}/> My Repository
          </button>
        </nav>

        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-4 text-red-500/70 hover:text-red-500 px-4 py-3 transition-all font-medium">
          <LogOut size={20}/> Logout System
        </button>
      </aside>

      {/* Main Content */}
      <main className="xl:ml-72 flex-1 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black mb-2">Workspace</h1>
              <p className="text-slate-500">Kelola endpoint raw txt Anda secara profesional.</p>
            </div>
            <button 
              onClick={() => { setForm({ id: '', name: '', content: '', category: '' }); setModalOpen(true); }}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all shadow-xl"
            >
              <Plus size={20}/> Create New Raw
            </button>
          </header>

          {/* Search */}
          <div className="relative mb-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
            <input 
              type="text" 
              placeholder="Filter by name or category..." 
              className="w-full max-w-md bg-white/5 border border-white/10 py-4 pl-14 pr-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white/[0.07] transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map(link => (
              <div key={link.id} className="glass p-8 rounded-[2rem] glass-hover transition-all">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {link.category || 'General'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setForm(link); setModalOpen(true); }} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16}/></button>
                    <button onClick={() => deleteLink(link.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{link.name}</h3>
                <p className="text-slate-500 text-xs mb-8">Dibuat pada {link.date}</p>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setViewRaw(link)}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all border border-white/5"
                  >
                    <Eye size={16}/> View Raw
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(link.content); alert('Copied!'); }}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Copy size={16}/> Copy Text
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- MODAL FORM --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass w-full max-w-2xl p-10 rounded-[2.5rem] border-white/10 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">{form.id ? 'Update Asset' : 'New Raw Asset'}</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Name" 
                  className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                />
                <input 
                  type="text" placeholder="Category" 
                  className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="Paste your raw text/code here..." 
                className="w-full h-64 bg-white/5 border border-white/10 p-5 rounded-xl outline-none focus:border-blue-500 font-mono text-sm resize-none"
                value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold">CANCEL</button>
                <button onClick={saveLink} className="flex-1 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW RAW --- */}
      {viewRaw && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col p-6 md:p-12 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">{viewRaw.name}</h2>
              <p className="text-blue-500 text-sm">Previewing Raw Content</p>
            </div>
            <button onClick={() => setViewRaw(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all">
              <X size={24}/>
            </button>
          </div>
          <div className="flex-1 bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase font-bold">Text Content</span>
              <button onClick={() => { navigator.clipboard.writeText(viewRaw.content); alert('Copied!'); }} className="text-xs hover:text-blue-500 flex items-center gap-2">
                <Copy size={12}/> Copy All
              </button>
            </div>
            <pre className="flex-1 p-8 overflow-auto text-sm text-blue-100/80 leading-relaxed font-mono">
              {viewRaw.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
