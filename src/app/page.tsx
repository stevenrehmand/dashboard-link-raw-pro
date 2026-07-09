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

  const [projects, setProjects] = useState<Project[]>([]);
  const [rawLinks, setRawLinks] = useState<RawEndpoint[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [search, setSearch] = useState('');
  
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState<RawEndpoint | null>(null);
  
  const [newProject, setNewProject] = useState({ id: '', name: '' });
  const [newEndpoint, setNewEndpoint] = useState({ id: '', name: '', content: '', projectId: '' });

  useEffect(() => { if (typeof window !== 'undefined') setBaseUrl(window.location.origin); }, []);

  const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

  // --- FUNGSI UNTUK MENGHASILKAN URL LENGKAP DENGAN .txt ---
  const getGeneratedUrl = (endpoint: RawEndpoint) => {
    return `${baseUrl}/raw/${currentProject?.slug}/${endpoint.slug}.txt`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kakuzu' && password === 'TerbangTerusKontenQue88') setIsLoggedIn(true);
    else alert('Invalid Access Key');
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const syncToGithub = async (path: string, content: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });
      if (!res.ok) throw new Error("GitHub Sync Failed");
      return true;
    } catch (err) {
      alert("Failed to sync with GitHub. Pastikan sudah REDEPLOY di Vercel setelah isi Env Vars.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Logic Project (Create / Edit / Delete) ---
  const saveProject = () => {
    if (!newProject.name) return alert('Nama Project wajib diisi!');
    if (newProject.id) {
      setProjects(projects.map(p => p.id === newProject.id ? { ...newProject, slug: slugify(newProject.name) } : p));
    } else {
      const p = { id: 'p' + Date.now(), name: newProject.name, slug: slugify(newProject.name) };
      setProjects([...projects, p]);
      if (!selectedProjectId) setSelectedProjectId(p.id);
    }
    setProjectModalOpen(false);
    setNewProject({ id: '', name: '' });
  };

  const deleteProject = (id: string) => {
    if (confirm('Menghapus Project ini akan menghapus semua Endpoint di dalamnya. Lanjutkan?')) {
      setProjects(projects.filter(p => p.id !== id));
      setRawLinks(rawLinks.filter(r => r.projectId !== id));
      if (selectedProjectId === id) {
        // Pilih project pertama yang tersisa, jika ada
        setSelectedProjectId(projects.filter(p => p.id !== id)[0]?.id || '');
      }
    }
  };

  // --- Logic Endpoint (Create / Edit / Delete) ---
  const saveEndpoint = async () => {
    if (!newEndpoint.name || !newEndpoint.content) return alert("Nama Endpoint dan Konten wajib diisi!");
    
    const pSlug = currentProject?.slug;
    const eSlug = slugify(newEndpoint.name);
    const path = `${pSlug}/${eSlug}.txt`; // Path di GitHub

    const success = await syncToGithub(path, newEndpoint.content);
    if (success) {
      if (newEndpoint.id) {
        // Edit Endpoint
        setRawLinks(rawLinks.map(r => r.id === newEndpoint.id ? { ...newEndpoint, slug: eSlug, date: new Date().toLocaleDateString() } : r));
      } else {
        // New Endpoint
        setRawLinks([{ ...newEndpoint, id: 'r' + Date.now(), projectId: selectedProjectId, slug: eSlug, date: new Date().toLocaleDateString() }, ...rawLinks]);
      }
      setEndpointModalOpen(false);
      setNewEndpoint({ id: '', name: '', content: '', projectId: '' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202] p-6 text-white font-sans">
        <div className="glass w-full max-w-md p-12 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="text-center mb-10 text-blue-500 flex flex-col items-center">
            <ShieldCheck size={50} className="mb-4" />
            <h1 className="text-3xl font-black italic text-white tracking-tighter">RAW<span className="text-blue-500 not-italic">PRO</span></h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Access ID" className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-blue-600 text-sm font-sans" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Access Key" className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:border-blue-600 text-sm font-sans" onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Authorize Terminal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#020202] text-slate-300 font-sans">
      <aside className="w-80 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12 text-white italic">
            <Database size={24} className="text-blue-600" /> <span className="font-black text-xl tracking-tighter">RAWPRO.</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Repositories</h3>
          <button onClick={() => { setNewProject({id: '', name: ''}); setProjectModalOpen(true); }} className="p-2 bg-blue-600 text-white rounded-xl hover:scale-110 transition-all"><Plus size={16}/></button>
        </div>
        <nav className="space-y-2 overflow-y-auto flex-1">
          {projects.map(p => (
            <div key={p.id} className="group relative">
                <button onClick={() => setSelectedProjectId(p.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${selectedProjectId === p.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
                  <Folder size={18} /> <span className="font-bold text-sm">{p.name}</span>
                </button>
                {/* --- TOMBOL EDIT & DELETE PROJECT --- */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => { e.stopPropagation(); setNewProject(p); setProjectModalOpen(true); }} className="p-2 hover:text-white text-slate-500 transition-colors"><Edit2 size={12}/></button>
                   <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }} className="p-2 hover:text-red-500 text-slate-500 transition-colors"><Trash2 size={12}/></button>
                </div>
            </div>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-8 flex items-center gap-3 text-red-500/60 font-black uppercase text-[10px] tracking-widest"><LogOut size={16}/> Kill Session</button>
      </aside>

      <main className="xl:ml-80 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          {selectedProjectId ? (
            <>
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h1 className="text-5xl font-black text-white tracking-tighter">{currentProject?.name}</h1>
                  <p className="font-mono text-xs text-blue-500 mt-2">raw-srv:/raw/{currentProject?.slug}/</p>
                </div>
                <button onClick={() => { setNewEndpoint({ id: '', name: '', content: '', projectId: selectedProjectId }); setEndpointModalOpen(true); }} className="bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl animate-pulse"><Plus size={20}/> New Endpoint</button>
              </div>

              <div className="space-y-4">
                {rawLinks.filter(r => r.projectId === selectedProjectId).map(endpoint => (
                  <div key={endpoint.id} className="glass p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="p-5 bg-white/5 rounded-3xl text-blue-500"><FileText size={24}/></div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{endpoint.name}.txt</h3>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest break-all">
                          {getGeneratedUrl(endpoint)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setViewRaw(endpoint)} className="p-4 bg-white/5 rounded-2xl hover:text-white"><Eye size={20}/></button>
                      {/* --- TOMBOL EDIT ENDPOINT --- */}
                      <button onClick={() => { setNewEndpoint(endpoint); setEndpointModalOpen(true); }} className="p-4 bg-white/5 rounded-2xl hover:text-blue-500 transition-all"><Edit2 size={20}/></button>
                      <button onClick={() => { navigator.clipboard.writeText(getGeneratedUrl(endpoint)); alert('Link Raw Berhasil di Copy!'); }} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500">Copy URL</button>
                      <button onClick={() => { if(confirm('Hapus endpoint ini?')) setRawLinks(rawLinks.filter(r => r.id !== endpoint.id)); }} className="p-4 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center text-slate-800">
               <Database size={100} className="mb-8 opacity-10" />
               <h2 className="text-2xl font-bold">Select a repository to begin.</h2>
            </div>
          )}
        </div>
      </main>

      {/* MODAL ENDPOINT */}
      {endpointModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="glass w-full max-w-4xl p-12 rounded-[3.5rem] border-white/10 shadow-2xl relative overflow-hidden font-sans">
            {loading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 text-blue-500 font-bold uppercase tracking-widest">Pushing to GitHub...</div>}
            <h2 className="text-4xl font-black text-white mb-10 tracking-tighter uppercase italic">{newEndpoint.id ? 'Edit Endpoint Details' : 'Raw Deployment Detail'}</h2>
            <input type="text" placeholder="File Identifier (ex: config-asia)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white mb-6 outline-none focus:border-blue-500 font-bold" value={newEndpoint.name} onChange={e => setNewEndpoint({...newEndpoint, name: e.target.value})} />
            <textarea placeholder="Paste your TXT/HTML/Code here..." className="w-full h-96 bg-black/50 border border-white/10 p-8 rounded-[2rem] outline-none focus:border-blue-500 text-blue-200 font-mono text-sm mb-10 resize-none leading-relaxed" value={newEndpoint.content} onChange={e => setNewEndpoint({...newEndpoint, content: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setEndpointModalOpen(false)} className="flex-1 text-slate-500 font-bold uppercase text-xs tracking-widest">Discard</button>
              <button onClick={saveEndpoint} className="flex-2 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/30">Deploy to Repository</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROJECT */}
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center font-sans">
          <div className="glass w-full max-w-md p-12 rounded-[3rem] border-white/10 shadow-2xl text-center">
             <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase italic">{newProject.id ? 'Edit Workspace' : 'Create Workspace'}</h2>
             <input type="text" placeholder="Workspace Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white mb-8 outline-none focus:border-blue-500 text-center font-bold" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
             <div className="flex gap-4">
                <button onClick={() => setProjectModalOpen(false)} className="flex-1 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                <button onClick={saveProject} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Initialize</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {viewRaw && (
        <div className="fixed inset-0 bg-black/98 z-[200] flex flex-col p-12 animate-in fade-in duration-500 font-sans">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{viewRaw.name}.txt</h2>
                <p className="text-blue-500 font-mono text-[10px] mt-1">{getGeneratedUrl(viewRaw)}</p>
              </div>
              <button onClick={() => setViewRaw(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white"><X size={24}/></button>
           </div>
           <div className="flex-1 bg-zinc-900/50 rounded-[3rem] border border-white/5 p-12 overflow-auto font-mono text-sm text-blue-100/60 leading-relaxed shadow-inner">
              <pre className="whitespace-pre-wrap">{viewRaw.content}</pre>
           </div>
        </div>
      )}
    </div>
  );
}
