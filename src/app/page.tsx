'use client';
import { useState, useEffect } from 'react';
import { 
  FolderPlus, Folder, ChevronRight, Plus, Search, 
  Edit2, Trash2, Copy, ExternalLink, LogOut, 
  Code, Eye, X, ShieldCheck, Globe, Database, Link as LinkIcon, FileText
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  slug: string;
}

interface RawEndpoint {
  id: string;
  projectId: string;
  name: string;
  content: string; 
  category: string;
  date: string;
  slug: string;
}

export default function ProfessionalRawDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  // Data State (Mulai dari Kosong)
  const [projects, setProjects] = useState<Project[]>([]);
  const [rawLinks, setRawLinks] = useState<RawEndpoint[]>([]);

  // UI State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [viewRaw, setViewRaw] = useState<RawEndpoint | null>(null);
  
  const [newProject, setNewProject] = useState({ id: '', name: '' });
  const [newEndpoint, setNewEndpoint] = useState({ id: '', name: '', content: '', category: '', projectId: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const slugify = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kakuzu' && password === 'TerbangTerusKontenQue88') setIsLoggedIn(true);
    else alert('Kredensial Salah!');
  };

  const saveProject = () => {
    if (!newProject.name) return alert('Nama project wajib!');
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
    if (confirm('Hapus Project dan semua file didalamnya?')) {
      setProjects(projects.filter(p => p.id !== id));
      setRawLinks(rawLinks.filter(r => r.projectId !== id));
      if (selectedProjectId === id) setSelectedProjectId('');
    }
  };

  const saveEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.content) return alert('Nama dan Konten wajib!');
    if (newEndpoint.id) {
      setRawLinks(rawLinks.map(r => r.id === newEndpoint.id ? { ...newEndpoint, slug: slugify(newEndpoint.name), date: r.date } : r));
    } else {
      setRawLinks([{ 
        ...newEndpoint, 
        id: 'r' + Date.now(), 
        projectId: selectedProjectId, 
        slug: slugify(newEndpoint.name),
        date: new Date().toLocaleDateString() 
      }, ...rawLinks]);
    }
    setEndpointModalOpen(false);
    setNewEndpoint({ id: '', name: '', content: '', category: '', projectId: '' });
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);
  const filteredEndpoints = rawLinks.filter(r => r.projectId === selectedProjectId && r.name.toLowerCase().includes(search.toLowerCase()));

  const getGeneratedUrl = (endpoint: RawEndpoint) => {
    return `${baseUrl}/${slugify(currentProject?.name || '')}/${endpoint.slug}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202] p-6 text-white font-sans">
        <div className="glass w-full max-w-md p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl mb-4 text-blue-500"><ShieldCheck size={40} /></div>
                <h1 className="text-3xl font-black italic">RAW<span className="text-blue-500 not-italic">PRO</span></h1>
                <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Secure Terminal Access</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Username" className="w-full bg-white/5 border border-white/10 py-4 px-5 rounded-xl outline-none focus:border-blue-500 text-white text-sm" onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 py-4 px-5 rounded-xl outline-none focus:border-blue-500 text-white text-sm" onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest">Sign-In</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#020202] text-slate-300 font-sans">
      <aside className="w-80 glass border-r border-white/5 fixed h-full hidden xl:flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-12 px-2 text-white">
          <Database size={24} className="text-blue-600"/>
          <h2 className="text-xl font-black tracking-tighter italic">RAWPRO.</h2>
        </div>
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Project Folders</h3>
          <button onClick={() => { setNewProject({id: '', name: ''}); setProjectModalOpen(true); }} className="p-1.5 bg-blue-600 text-white rounded-lg hover:scale-110 transition-all"><FolderPlus size={16}/></button>
        </div>
        <nav className="space-y-2 overflow-y-auto flex-1">
          {projects.map(p => (
            <div key={p.id} className="group relative">
              <button onClick={() => setSelectedProjectId(p.id)} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${selectedProjectId === p.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
                <Folder size={18} className={selectedProjectId === p.id ? 'text-white' : 'text-blue-500'} />
                <span className="font-bold text-sm">{p.name}</span>
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setNewProject(p); setProjectModalOpen(true); }} className="p-2 text-slate-500 hover:text-white"><Edit2 size={12}/></button>
                 <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-6 flex items-center gap-3 px-4 py-4 text-red-500/60 hover:text-red-500 font-bold transition-all border-t border-white/5 uppercase text-[10px] tracking-widest"><LogOut size={16}/> Terminate Session</button>
      </aside>

      <main className="xl:ml-80 flex-1 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {selectedProjectId ? (
            <>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">{currentProject?.name}</h1>
                  <p className="text-slate-500 mt-1 font-mono text-xs italic">/{slugify(currentProject?.name || '')}/</p>
                </div>
                <button onClick={() => { setNewEndpoint({ id: '', name: '', content: '', category: '', projectId: selectedProjectId }); setEndpointModalOpen(true); }} className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all shadow-2xl flex items-center gap-3 uppercase text-[10px] tracking-widest font-sans"><Plus size={18}/> New Endpoint</button>
              </div>
              <div className="space-y-4">
                {filteredEndpoints.map(endpoint => (
                  <div key={endpoint.id} className="glass p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-500/40 transition-all">
                    <div className="flex items-center gap-5 w-full md:w-auto overflow-hidden font-sans">
                      <div className="bg-white/5 p-4 rounded-2xl text-blue-500 shrink-0"><FileText size={24}/></div>
                      <div className="overflow-hidden">
                        <h3 className="text-lg font-bold text-white truncate">{endpoint.name}.txt</h3>
                        <p className="text-[10px] font-mono text-slate-600 truncate">{getGeneratedUrl(endpoint)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button onClick={() => setViewRaw(endpoint)} className="p-3 bg-white/5 rounded-xl hover:text-white"><Eye size={18}/></button>
                      <button onClick={() => { setNewEndpoint(endpoint); setEndpointModalOpen(true); }} className="p-3 bg-white/5 rounded-xl hover:text-blue-500"><Edit2 size={18}/></button>
                      <button onClick={() => { navigator.clipboard.writeText(getGeneratedUrl(endpoint)); alert('Link Raw Berhasil di Copy!'); }} className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20"><Copy size={14} className="inline mr-2"/> Copy URL</button>
                      <button onClick={() => setRawLinks(rawLinks.filter(r => r.id !== endpoint.id))} className="p-3 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                <Folder size={64} className="text-slate-800 mb-6"/>
                <h2 className="text-2xl font-bold text-white mb-2">Pilih Project di Sidebar</h2>
                <p className="text-slate-600 max-w-xs">Buat atau pilih folder project untuk mulai membuat endpoint raw.</p>
             </div>
          )}
        </div>
      </main>

      {/* MODAL PROJECT */}
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="glass w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl font-sans">
            <h2 className="text-2xl font-black text-white mb-8 italic uppercase">Folder Project</h2>
            <input type="text" placeholder="Nama Project (Contoh: Project SEO)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 text-white mb-6" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setProjectModalOpen(false)} className="flex-1 text-slate-600 font-bold uppercase text-[10px] tracking-widest">Batal</button>
              <button onClick={saveProject} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Simpan Folder</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ENDPOINT */}
      {endpointModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 font-sans">
          <div className="glass w-full max-w-2xl p-10 rounded-[3rem] border-white/10 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-8 uppercase italic italic">Raw Endpoint Detail</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <input type="text" placeholder="Nama File (Contoh: terms-conditions)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-white" value={newEndpoint.name} onChange={e => setNewEndpoint({...newEndpoint, name: e.target.value})} />
               <input type="text" placeholder="Kategori (Contoh: TXT)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-white" value={newEndpoint.category} onChange={e => setNewEndpoint({...newEndpoint, category: e.target.value})} />
            </div>
            <textarea placeholder="Paste Konten Teks/Script Anda di sini..." className="w-full h-80 bg-black/40 border border-white/10 p-6 rounded-3xl outline-none focus:border-blue-500 text-blue-100/70 font-mono text-xs resize-none leading-relaxed mb-6" value={newEndpoint.content} onChange={e => setNewEndpoint({...newEndpoint, content: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setEndpointModalOpen(false)} className="flex-1 text-slate-600 font-bold uppercase text-[10px] tracking-widest">Discard</button>
              <button onClick={saveEndpoint} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30">Save Endpoint</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW RAW */}
      {viewRaw && (
        <div className="fixed inset-0 bg-black/98 z-[200] flex flex-col p-6 lg:p-16 font-sans">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{viewRaw.name}.txt</h2>
              <p className="text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase">{getGeneratedUrl(viewRaw)}</p>
            </div>
            <button onClick={() => setViewRaw(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white"><X size={24}/></button>
          </div>
          <div className="flex-1 bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 lg:p-12 overflow-auto font-mono text-sm text-blue-100/60 leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap">{viewRaw.content}</pre>
          </div>
          <div className="mt-8 flex justify-center">
             <button onClick={() => { navigator.clipboard.writeText(getGeneratedUrl(viewRaw)); alert('URL dicopy!'); }} className="px-10 py-5 bg-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-2xl">Copy Live URL</button>
          </div>
        </div>
      )}
    </div>
  );
}
