'use client';
import { useState, useEffect } from 'react';
import { 
  FolderPlus, Folder, ChevronRight, Plus, Search, 
  Edit2, Trash2, Copy, ExternalLink, LogOut, 
  Code, Eye, X, ShieldCheck, Globe, Database, Link as LinkIcon, FileText
} from 'lucide-react';

interface Project { id: string; name: string; slug: string; }
interface RawEndpoint { id: string; projectId: string; name: string; content: string; date: string; slug: string; }

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [rawLinks, setRawLinks] = useState<RawEndpoint[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [search, setSearch] = useState('');
  
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState<RawEndpoint | null>(null);
  
  const [newProject, setNewProject] = useState({ id: '', name: '' });
  const [newEndpoint, setNewEndpoint] = useState({ id: '', name: '', content: '', projectId: '' });

  const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

  // --- 1. PERSISTENCE LOGIN & LOAD DATA ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
      const session = localStorage.getItem('rawpro_session');
      if (session === 'active') {
        setIsLoggedIn(true);
        loadDataFromGithub();
      } else {
        setInitialLoading(false);
      }
    }
  }, []);

  const loadDataFromGithub = async () => {
    setInitialLoading(true);
    try {
      const res = await fetch('/api/github/load');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        setRawLinks(data.links);
        if (data.projects.length > 0) setSelectedProjectId(data.projects[0].id);
      }
    } catch (err) {
      console.error("Load failed");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kakuzu' && password === 'TerbangTerusKontenQue88') {
      setIsLoggedIn(true);
      localStorage.setItem('rawpro_session', 'active');
      loadDataFromGithub();
    } else {
      alert('Invalid Access Key');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rawpro_session');
    setIsLoggedIn(false);
  };

  // --- 2. GITHUB SYNC LOGIC ---
  const syncToGithub = async (path: string, content: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });
      return res.ok;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getGeneratedUrl = (endpoint: RawEndpoint) => {
    const p = projects.find(proj => proj.id === endpoint.projectId);
    return `${baseUrl}/raw/${p?.slug}/${endpoint.slug}.txt`;
  };

  const saveEndpoint = async () => {
    if (!newEndpoint.name || !newEndpoint.content) return;
    const pSlug = projects.find(p => p.id === selectedProjectId)?.slug;
    const eSlug = slugify(newEndpoint.name);
    const path = `${pSlug}/${eSlug}.txt`;

    const success = await syncToGithub(path, newEndpoint.content);
    if (success) {
      await loadDataFromGithub(); // Refresh data agar sinkron dengan GitHub
      setEndpointModalOpen(false);
      setNewEndpoint({ id: '', name: '', content: '', projectId: '' });
      alert("Deployed Successfully to GitHub");
    }
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // --- UI RENDER ---
  if (initialLoading && isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202]">
        <div className="text-blue-500 animate-pulse font-black tracking-tighter text-2xl italic">CONNECTING TO GITHUB NODE...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202] p-6 text-white">
        <div className="glass w-full max-w-md p-12 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="text-center mb-10 text-blue-500 flex flex-col items-center">
            <ShieldCheck size={50} className="mb-4" />
            <h1 className="text-3xl font-black italic text-white tracking-tighter uppercase">Raw<span className="text-blue-500 not-italic">Pro</span></h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Access ID" className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-blue-600 text-sm" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Access Key" className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-blue-600 text-sm" onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Authorize Terminal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#020202] text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-80 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12 text-white italic">
            <Database size={24} className="text-blue-600" /> <span className="font-black text-xl tracking-tighter">RAWPRO.</span>
        </div>
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Repositories</h3>
          <button onClick={() => setProjectModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-xl hover:scale-110 transition-all"><Plus size={16}/></button>
        </div>
        <nav className="space-y-2 overflow-y-auto flex-1">
          {projects.map(p => (
            <div key={p.id} className="group relative">
               <button onClick={() => setSelectedProjectId(p.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${selectedProjectId === p.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
                 <Folder size={18} /> <span className="font-bold text-sm">{p.name}</span>
               </button>
               <button onClick={() => alert('Delete logic via API')} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 flex items-center gap-3 text-red-500/60 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-all"><LogOut size={16}/> Kill Session</button>
      </aside>

      {/* Main Content */}
      <main className="xl:ml-80 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          {selectedProjectId ? (
            <>
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h1 className="text-5xl font-black text-white tracking-tighter">{currentProject?.name}</h1>
                  <p className="font-mono text-xs text-blue-500 mt-2 tracking-widest uppercase opacity-50">Node: /raw/{currentProject?.slug}/</p>
                </div>
                <button onClick={() => setEndpointModalOpen(true)} className="bg-white text-black px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl animate-pulse"><Plus size={20}/> New Endpoint</button>
              </div>

              <div className="space-y-4">
                {rawLinks.filter(r => r.projectId === selectedProjectId).map(endpoint => (
                  <div key={endpoint.id} className="glass p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="p-5 bg-white/5 rounded-3xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><FileText size={24}/></div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{endpoint.name}.txt</h3>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest break-all opacity-50">
                          {getGeneratedUrl(endpoint)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setViewRaw(endpoint)} className="p-4 bg-white/5 rounded-2xl hover:text-white transition-all"><Eye size={20}/></button>
                      <button onClick={() => { setNewEndpoint(endpoint); setEndpointModalOpen(true); }} className="p-4 bg-white/5 rounded-2xl hover:text-blue-500 transition-all"><Edit2 size={20}/></button>
                      <button onClick={() => { navigator.clipboard.writeText(getGeneratedUrl(endpoint)); alert('Link Raw Berhasil di Copy!'); }} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">Copy URL</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center text-slate-800 opacity-20">
               <Database size={100} className="mb-8" />
               <h2 className="text-2xl font-bold uppercase tracking-widest">No Active Workspace</h2>
            </div>
          )}
        </div>
      </main>

      {/* Modal Endpoint */}
      {endpointModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="glass w-full max-w-5xl p-12 rounded-[3.5rem] border-white/10 shadow-2xl relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 text-blue-500 font-black uppercase tracking-[0.5em] animate-pulse">Syncing to GitHub Repository...</div>}
            <h2 className="text-4xl font-black text-white mb-10 tracking-tighter uppercase italic">{newEndpoint.id ? 'Edit Endpoint' : 'New Deployment'}</h2>
            <input type="text" placeholder="Endpoint Identifier" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white mb-6 outline-none focus:border-blue-500 font-bold" value={newEndpoint.name} onChange={e => setNewEndpoint({...newEndpoint, name: e.target.value})} />
            <textarea placeholder="Paste your Raw Content here..." className="w-full h-[50vh] bg-black/50 border border-white/10 p-8 rounded-[2rem] outline-none focus:border-blue-500 text-blue-200 font-mono text-xs mb-10 resize-none leading-relaxed" value={newEndpoint.content} onChange={e => setNewEndpoint({...newEndpoint, content: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setEndpointModalOpen(false)} className="flex-1 text-slate-500 font-bold uppercase text-xs tracking-widest">Discard</button>
              <button onClick={saveEndpoint} className="flex-2 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/30">Commit Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
