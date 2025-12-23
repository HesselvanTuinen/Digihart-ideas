
import React, { useState, useEffect, useMemo } from 'react';
import HologramHeader from './components/HologramHeader';
import Dashboard from './components/Dashboard';
import IdeaCard from './components/IdeaCard';
import { Idea, IdeaCategory, SupportedLanguage, DICTIONARY } from './types';
import { generateBrainstormIdeas, suggestAdminReply } from './services/geminiService';
import { 
  Plus, Search, Sparkles, X, Sun, Moon, Type, LayoutGrid, 
  BarChart3, Languages, ChevronRight, Filter, AlertCircle, 
  Shield, Key, LogOut, Trash2, Send, Wand2, Loader2
} from 'lucide-react';

const App: React.FC = () => {
  // --- States ---
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>('nl');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ideas' | 'admin'>('dashboard');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [adminReplyText, setAdminReplyText] = useState<Record<string, string>>({});
  const [suggestingReplyId, setSuggestingReplyId] = useState<string | null>(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<IdeaCategory>(IdeaCategory.TECHNOLOGY);
  const [newAuthor, setNewAuthor] = useState('');

  // AI States
  const [aiTopic, setAiTopic] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const t = DICTIONARY[language];
  
  const isApiKeyMissing = useMemo(() => {
    try {
      const env = (window as any).process?.env || (typeof process !== 'undefined' ? process.env : null);
      const key = env?.API_KEY;
      return !key || key === 'undefined' || key.length < 5;
    } catch (e) {
      return true;
    }
  }, []);

  // --- Initial Setup ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('digihart-theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    
    const initial: Idea[] = [
      { id: '1', title: 'Smart Energy Tiles', description: 'Stoeptegels die energie opwekken wanneer mensen eroverheen lopen.', category: IdeaCategory.SUSTAINABILITY, likes: 45, dislikes: 2, createdAt: new Date(Date.now() - 100000000), author: 'Thomas', adminResponse: 'Geweldig idee! We kijken of we een pilot kunnen starten op de Grote Markt.' },
      { id: '2', title: 'VR Inclusion Training', description: 'Empathie training via VR om diversiteit op de werkvloer te vergroten.', category: IdeaCategory.INCLUSION, likes: 89, dislikes: 1, createdAt: new Date(Date.now() - 50000000), author: 'Elena' },
      { id: '3', title: 'AI Health Tutor', description: 'Gepersonaliseerde AI assistent voor chronisch zieken.', category: IdeaCategory.HEALTH, likes: 32, dislikes: 12, createdAt: new Date(), author: 'Marcus' }
    ];
    setIdeas(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('digihart-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // --- Handlers ---
  const handleLike = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i));
  };

  const handleDislike = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, dislikes: i.dislikes + 1 } : i));
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      setIdeas(prev => prev.filter(i => i.id !== id));
      if (selectedIdeaId === id) setSelectedIdeaId(null);
    }
  };

  const handleSaveAdminReply = (id: string) => {
    const reply = adminReplyText[id];
    if (!reply) return;
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, adminResponse: reply } : i));
    setAdminReplyText(prev => {
        const next = {...prev};
        delete next[id];
        return next;
    });
  };

  const handleSuggestReplyAction = async (idea: Idea) => {
    if (isApiKeyMissing) return;
    setSuggestingReplyId(idea.id);
    try {
      const suggestion = await suggestAdminReply(idea, language === 'nl' ? 'Nederlands' : 'English');
      if (suggestion) {
        setAdminReplyText(prev => ({ ...prev, [idea.id]: suggestion }));
      }
    } finally {
      setSuggestingReplyId(null);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'admin123') {
      setIsAdmin(true);
      setIsLoginOpen(false);
      setLoginPassword('');
    } else {
      alert("Fout wachtwoord!");
    }
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    const idea: Idea = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      author: newAuthor || 'Innovator'
    };
    setIdeas([idea, ...ideas]);
    setIsFormOpen(false);
    setNewTitle(''); setNewDesc(''); setNewAuthor('');
    setActiveTab('ideas');
    setSelectedIdeaId(idea.id);
  };

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Category', 'Author', 'Likes', 'Dislikes', 'Created At', 'Description', 'Admin Response'];
    const csvData = ideas.map(i => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      `"${i.author.replace(/"/g, '""')}"`,
      i.likes,
      i.dislikes,
      i.createdAt.toISOString(),
      `"${i.description.replace(/"/g, '""')}"`,
      `"${(i.adminResponse || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `digihart_ideas_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAIBrainstorm = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const result = await generateBrainstormIdeas(aiTopic, newCategory, language === 'nl' ? 'Nederlands' : 'English');
      setAiResult(result);
    } catch (err) {
      setAiResult("Er is een onverwachte fout opgetreden bij de AI-aanroep.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredAndSortedIdeas = useMemo(() => {
    let result = ideas.filter(i => 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result = [...result].sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [ideas, searchTerm, sortBy]);

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  return (
    <div className={`min-h-screen flex flex-col pb-safe bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${highContrast ? 'contrast-high' : ''}`}>
      <HologramHeader />
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 glass dark:bg-slate-950/90 backdrop-blur-xl border-b dark:border-slate-800 px-4 py-3 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1 rounded-2xl w-full md:w-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-cyan-500'}`}>
              <BarChart3 size={14} /> <span>{t.dashboard}</span>
            </button>
            <button onClick={() => setActiveTab('ideas')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'ideas' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-cyan-500'}`}>
              <LayoutGrid size={14} /> <span>Ideeën</span>
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab('admin')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'admin' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-rose-500'}`}>
                <Shield size={14} /> <span>Beheer</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-3 w-full md:w-auto rtl:space-x-reverse">
             <div className="relative flex-grow md:flex-grow-0 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={14}/>
                <input 
                  type="text" 
                  placeholder={t.search} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-cyan-500 text-xs font-bold w-full md:w-48 transition-all dark:text-white"
                />
             </div>
             
             <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <button 
                  onClick={() => setHighContrast(!highContrast)} 
                  title="Contrast"
                  className={`p-2 rounded-lg transition-colors ${highContrast ? 'text-cyan-500 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-500'}`}
                >
                  <Type size={18}/>
                </button>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                  title="Thema"
                  className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
                </button>
                
                <div className="relative group">
                   <button className="flex items-center space-x-1 p-2 text-slate-400 hover:text-cyan-500 transition-colors"><Languages size={18}/></button>
                   <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                      {Object.keys(DICTIONARY).map(lang => (
                        <button key={lang} onClick={() => setLanguage(lang as SupportedLanguage)} className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-slate-50 dark:hover:bg-slate-800 ${language === lang ? 'text-cyan-500' : 'text-slate-500'}`}>
                          {lang}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                {isAdmin ? (
                  <button onClick={() => setIsAdmin(false)} title="Uitloggen" className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                    <LogOut size={18} />
                  </button>
                ) : (
                  <button onClick={() => setIsLoginOpen(true)} title="Admin Login" className="p-2 text-slate-400 hover:text-cyan-500 transition-colors">
                    <Shield size={18} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow mb-24">
         {activeTab === 'dashboard' && (
           <Dashboard ideas={ideas} content={t} onExport={handleExport} />
         )}

         {activeTab === 'ideas' && (
           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-slide-up">
             <div className="w-full lg:w-3/5 space-y-6">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <Filter size={12} />
                   <span>Sorteer:</span>
                   <button onClick={() => setSortBy('newest')} className={`px-3 py-1 rounded-full transition-all ${sortBy === 'newest' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}>Nieuwste</button>
                   <button onClick={() => setSortBy('likes')} className={`px-3 py-1 rounded-full transition-all ${sortBy === 'likes' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}>Meest Geliefd</button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {filteredAndSortedIdeas.length > 0 ? filteredAndSortedIdeas.map(idea => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      onLike={handleLike} 
                      onDislike={handleDislike} 
                      onDelete={isAdmin ? handleDeleteIdea : undefined}
                      onClick={() => setSelectedIdeaId(idea.id)} 
                      isSelected={idea.id === selectedIdeaId}
                      isAdmin={isAdmin}
                    />
                  )) : (
                    <div className="text-center py-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{t.noIdeas}</p>
                    </div>
                  )}
                </div>
             </div>
             
             {/* Detail Sidebar */}
             <div className="w-full lg:w-2/5">
                <div className="sticky top-32 glass dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl min-h-[400px] lg:min-h-[500px] border dark:border-slate-800 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles size={120} className="text-cyan-500" />
                    </div>
                    {selectedIdea ? (
                      <div className="space-y-6 animate-fade-in relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">{t.categories[selectedIdea.category]}</span>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white leading-[1.1] tracking-tight">{selectedIdea.title}</h2>
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border dark:border-slate-800">
                           <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">{selectedIdea.description}</p>
                        </div>
                        {selectedIdea.adminResponse && (
                          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl">
                             <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-2 flex items-center gap-2"><Shield size={12}/> DigiHart Team</p>
                             <p className="text-sm dark:text-rose-100 italic leading-relaxed">"{selectedIdea.adminResponse}"</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-6 border-t dark:border-slate-800">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg uppercase">
                                {selectedIdea.author.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-black dark:text-white uppercase tracking-widest">{selectedIdea.author}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30 pt-10">
                        <div className="p-5 rounded-full bg-slate-200 dark:bg-slate-800">
                          <LayoutGrid size={40} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest max-w-[200px]">Selecteer een idee om details te bekijken</p>
                      </div>
                    )}
                </div>
             </div>
           </div>
         )}

         {activeTab === 'admin' && isAdmin && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b dark:border-slate-800 pb-6 gap-4">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter uppercase leading-none text-rose-500">Beheer Overzicht</h2>
                  <p className="text-slate-500 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-2 opacity-60">Systeembeheer & Moderatie</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Idee</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Auteur</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Moderatie Reactie</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Beheer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {ideas.map(idea => (
                      <tr key={idea.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-6 align-top">
                          <p className="text-sm font-black dark:text-white truncate max-w-xs">{idea.title}</p>
                          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{t.categories[idea.category]}</p>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold dark:text-slate-300 align-top">{idea.author}</td>
                        <td className="px-8 py-6 align-top">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                               <textarea 
                                placeholder={t.replyPlaceholder} 
                                value={adminReplyText[idea.id] ?? (idea.adminResponse || '')}
                                onChange={(e) => setAdminReplyText(prev => ({ ...prev, [idea.id]: e.target.value }))}
                                className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-rose-500 w-72 h-20 resize-none transition-all dark:text-white"
                               />
                               <div className="flex flex-col space-y-2">
                                  <button 
                                    onClick={() => handleSaveAdminReply(idea.id)} 
                                    title={t.saveReply}
                                    className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                                  >
                                      <Send size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleSuggestReplyAction(idea)}
                                    disabled={suggestingReplyId === idea.id || isApiKeyMissing}
                                    title="Stel reactie voor (AI)"
                                    className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                  >
                                      {suggestingReplyId === idea.id ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                  </button>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right align-top">
                          <div className="flex flex-col items-end space-y-2">
                            <button 
                                onClick={() => handleDeleteIdea(idea.id)} 
                                className="flex items-center space-x-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-500/30"
                            >
                                <Trash2 size={14} />
                                <span>Verwijder</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
         )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-50">
        <button 
          onClick={() => setIsAIOpen(true)} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-4 md:py-5 rounded-[2rem] shadow-2xl shadow-pink-600/30 hover:scale-105 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3"
        >
          <Sparkles size={18}/> <span className="hidden sm:inline">{t.generateAI}</span><span className="sm:hidden">AI</span>
        </button>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-cyan-600 text-white p-5 md:p-6 rounded-[1.8rem] md:rounded-[2rem] shadow-2xl shadow-cyan-600/30 hover:scale-105 transition-all active:scale-95 group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500"/>
        </button>
      </div>

      {/* Admin Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-cyan-500/20 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative">
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-slate-400"><X size={20}/></button>
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-500">
                    <Key size={32} />
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-widest dark:text-white">{t.adminLogin}</h2>
                 <form onSubmit={handleAdminLogin} className="w-full space-y-4">
                    <input 
                      type="password" 
                      placeholder="Wachtwoord" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all text-center"
                      autoFocus
                    />
                    <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]">Verifiëren</button>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Wachtwoord: admin123</p>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* AI Modal */}
      {isAIOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-pink-500/20 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.15)]">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Sparkles size={200} className="text-pink-500"/></div>
              <button onClick={() => setIsAIOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 transition-colors"><X size={28}/></button>
              
              <h2 className="text-2xl md:text-4xl font-black mb-1 flex items-center gap-3 dark:text-white tracking-tighter uppercase"><Sparkles className="text-pink-500 animate-pulse"/> {t.generateAI}</h2>
              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inspiratie Trefwoord</label>
                    <input type="text" value={aiTopic} onChange={(e)=>setAiTopic(e.target.value)} placeholder="Bijv: Groene mobiliteit, VR zorg..." className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-pink-500 font-bold dark:text-white transition-all" disabled={isApiKeyMissing && !aiTopic}/>
                 </div>
                 <button onClick={handleAIBrainstorm} disabled={aiLoading || !aiTopic || isApiKeyMissing} className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-5 rounded-[1.8rem] font-black shadow-2xl shadow-pink-600/30 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-20 uppercase tracking-[0.2em] text-[10px]">
                   {aiLoading ? "Synthesizing..." : "Activeer Brainstorm"}
                 </button>
                 {aiResult && (
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] mt-6 max-h-60 overflow-y-auto border-2 border-pink-500/10 custom-scrollbar animate-fade-in">
                     <pre className="whitespace-pre-wrap text-[13px] dark:text-slate-200 font-sans leading-relaxed">{aiResult}</pre>
                     <div className="mt-6 flex gap-3">
                       <button onClick={()=>{setNewDesc(aiResult); setIsAIOpen(false); setIsFormOpen(true);}} className="flex-grow py-3.5 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-colors">Importeer Concepten</button>
                       <button onClick={()=>setAiResult('')} className="p-3.5 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-xl"><X size={16}/></button>
                     </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Add Idea Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 md:p-10 shadow-2xl relative">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter uppercase">{t.addIdea}</h2>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24}/></button>
             </div>
             <form onSubmit={handleAddIdea} className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titel</label>
                   <input type="text" placeholder={t.titlePlaceholder} value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all" required/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categorie</label>
                    <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white appearance-none cursor-pointer">
                      {Object.values(IdeaCategory).map(c => <option key={c} value={c}>{t.categories[c]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auteur</label>
                    <input type="text" placeholder={t.authorPlaceholder} value={newAuthor} onChange={(e)=>setNewAuthor(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Omschrijving</label>
                   <textarea placeholder={t.descPlaceholder} value={newDesc} onChange={(e)=>setNewDesc(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl h-32 md:h-40 resize-none outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all" required></textarea>
                </div>
                <button type="submit" className="w-full bg-cyan-600 text-white py-5 rounded-[1.8rem] font-black shadow-xl shadow-cyan-600/20 hover:scale-[1.02] transition-transform active:scale-95 uppercase tracking-[0.2em] text-[10px]">
                  {t.submit}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
