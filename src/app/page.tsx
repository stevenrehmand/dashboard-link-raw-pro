'use client';
import { useState, useEffect } from 'react';
import { 
  FolderPlus, Folder, ChevronRight, Plus, Search, 
  Edit2, Trash2, Copy, ExternalLink, LogOut, 
  Code, Eye, X, ShieldCheck, Globe, Database, Link as LinkIcon
} from 'lucide-react';

// --- Types ---
interface Project {
  id: string;
  name: string;
  description: string;
}

interface RawEndpoint {
  id: string;
  projectId: string;
  name: string;
  url: string;
  category: string;
  date: string;
}

export default function FolderProjectDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', name: 'Project SEO Asia', description: 'Raw files for Asia300 project' },
    { id: 'p2', name: 'Backend Config', description: 'Main system configuration raw' }
  ]);
  const [rawLinks, setRawLinks] = useState<RawEndpoint[]>([
    { id: 'r1', projectId: 'p1', name: 'Terms Conditions TXT', url: 'https://contentsatudunia.pages.dev/konten/vicc-inter/terms-conditions.txt', category: 'Content', date: '2024-05-20' }
  ]);

  // UI State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1');
  const [search, setSearch] = useState('');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newEndpoint, setNewEndpoint] = useState({ id: '', name: '', url: '', category: '', projectId: '' });

  // --- Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kakuzu' && password === 'TerbangTerusKontenQue88') setIsLoggedIn(true);
    else alert('Akses Ditolak!');
  };

  const createProject = () => {
    if (!newProject.name) return alert('Nama project wajib diisi');
    const p = { ...newProject, id: 'p' + Date.now() };
    setProjects([...projects, p]);
    setProjectModalOpen(false);
    setNewProject({ name: '', description: '' });
  };

  const saveEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.url) return alert('Lengkapi data endpoint!');
    if (newEndpoint.id) {
      setRawLinks(rawLinks.map(r => r.id === newEndpoint.id ? { ...newEndpoint, date: r.date } : r));
    } else {
      setRawLinks([{ ...newEndpoint, id: 'r' + Date.now(), projectId: selectedProjectId, date: new Date().toLocaleDateString() }, ...rawLinks]);
    }
    setEndpointModalOpen(false);
    setNewEndpoint({ id: '', name: '', url: '', category: '', projectId: '' });
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);
  const filteredEndpoints = rawLinks.filter(r => 
    r.projectId === selectedProjectId && 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <div className="glass w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl mb-4 text-blue-500"><ShieldCheck size={40} /></div>
            <h1 className="text-3xl font-black text-white">RAW<span className="text-blue-500">PRO</span></h1>
            <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Project Manager Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" className="w-full bg-white/5 border border-white/10 py-4 px-5 rounded-xl outline-none focus:border-blue-500 text-white" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 py-4 px-5 rounded-xl outline-none focus:border-blue-500 text-white" onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">SIGN IN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050505] text-slate-300">
      
      {/* --- SIDEBAR PROJECT --- */}
      <aside className="w-80 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Database size={20}/></div>
          <h2 className="text-xl font-bold tracking-tighter text-white uppercase italic">Terminal.</h2>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">My Projects</h3>
          <button onClick={() => setProjectModalOpen(true)} className="p-1 hover:text-blue-500 transition-colors"><FolderPlus size={18}/></button>
        </div>

        <nav className="space-y-1 overflow-y-auto flex-1 pr-2">
          {projects.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${selectedProjectId === p.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <Folder size={18} className={selectedProjectId === p.id ? 'text-white' : 'text-blue-500'} />
                {p.name}
              </div>
              <ChevronRight size={14} className={`transition-transform ${selectedProjectId === p.id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </nav>

        <button onClick={() => setIsLoggedIn(false)} className="mt-6 flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-500 font-bold transition-all border-t border-white/5">
          <LogOut size={18}/> Logout System
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="xl:ml-80 flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">
                <Globe size={14}/> {currentProject?.name} / Endpoints
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Project Dashboard</h1>
              <p className="text-slate-500 mt-1">{currentProject?.description}</p>
            </div>
            <button 
              onClick={() => setEndpointModalOpen(true)}
              className="bg-white text-black px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-2"
            >
              <Plus size={20}/> New Endpoint
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
            <input 
              type="text" placeholder="Cari endpoint di project ini..." 
              className="w-full bg-white/5 border border-white/10 py-3.5 pl-12 pr-6 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* ENDPOINT LIST */}
          <div className="space-y-4">
            {filteredEndpoints.length > 0 ? filteredEndpoints.map(endpoint => (
              <div key={endpoint.id} className="glass p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-500/30 transition-all premium-shadow">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="bg-white/5 p-4 rounded-2xl text-blue-500"><Code size={24}/></div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{endpoint.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      <span className="text-blue-500 font-bold uppercase">{endpoint.category}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px] md:max-w-md">{endpoint.url}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button onClick={() => { setViewRaw(endpoint); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Eye size={18}/></button>
                  <button onClick={() => { navigator.clipboard.writeText(endpoint.url); alert('URL Endpoint Berhasil di Copy!'); }} className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-xs uppercase tracking-widest">
                    <Copy size={16}/> Copy Link
                  </button>
                  <button onClick={() => { if(confirm('Hapus endpoint ini?')) setRawLinks(rawLinks.filter(r => r.id !== endpoint.id)); }} className="p-3 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 glass rounded-[3rem] border-dashed border-2 border-white/10">
                <LinkIcon className="mx-auto text-slate-600 mb-4" size={48}/>
                <p className="text-slate-500 font-medium italic">Belum ada endpoint di project ini.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL PROJECT --- */}
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-200">
          <div className="glass w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 italic">New Folder Project</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Project Name (e.g. Project A)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
              <textarea placeholder="Short description..." className="w-full h-24 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setProjectModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Cancel</button>
                <button onClick={createProject} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Create Folder</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL ENDPOINT --- */}
      {endpointModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-200">
          <div className="glass w-full max-w-2xl p-10 rounded-[3rem] border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">Add Endpoint to {currentProject?.name}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Endpoint Name (e.g. API Login)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" value={newEndpoint.name} onChange={e => setNewEndpoint({...newEndpoint, name: e.target.value})} />
                <input type="text" placeholder="Category (e.g. JS / CSS / TXT)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm" value={newEndpoint.category} onChange={e => setNewEndpoint({...newEndpoint, category: e.target.value})} />
              </div>
              <input type="text" placeholder="Raw URL / Endpoint URL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-sm font-mono" value={newEndpoint.url} onChange={e => setNewEndpoint({...newEndpoint, url: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setEndpointModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Discard</button>
                <button onClick={saveEndpoint} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Save Endpoint</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW URL --- */}
      {viewRaw && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col p-6 lg:p-16 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em]">{viewRaw.name}</h2>
            <button onClick={() => setViewRaw(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white"><X size={20}/></button>
          </div>
          <div className="flex-1 bg-zinc-900/50 rounded-3xl border border-white/5 p-8 lg:p-12 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-blue-600/10 rounded-full text-blue-500 mb-6"><Globe size={64}/></div>
            <h3 className="text-2xl font-bold text-white mb-2">Endpoint Active</h3>
            <p className="text-slate-500 mb-8 max-w-lg font-mono text-sm break-all">{viewRaw.url}</p>
            <div className="flex gap-4">
              <button onClick={() => { navigator.clipboard.writeText(viewRaw.url); alert('Copied!'); }} className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/5 uppercase text-xs tracking-widest">Copy Link</button>
              <a href={viewRaw.url} target="_blank" className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all uppercase text-xs tracking-widest flex items-center gap-2">Open Raw <ExternalLink size={16}/></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
