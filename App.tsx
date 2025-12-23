
import React, { useState, useEffect, useMemo } from 'react';
import HologramHeader from './components/HologramHeader';
import Dashboard from './components/Dashboard';
import IdeaCard from './components/IdeaCard';
import { Idea, IdeaCategory, SupportedLanguage, DICTIONARY } from './types';
import { generateBrainstormIdeas } from './services/geminiService';
import { Plus, Search, Sparkles, X, Sun, Moon, Type, LayoutGrid, BarChart3, Languages, ChevronRight, Filter, TrendingUp, Clock } from 'lucide-react';

const App: React.FC = () => {
  // --- States ---
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>('nl');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ideas'>('dashboard');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');

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
  const isApiKeyMissing = !process.env.API_KEY || process.env.API_KEY === 'undefined';

  // --- Initial Setup ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('digihart-theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    
    // Demo data
    const initial: Idea[] = [
      { id: '1', title: 'Smart Energy Tiles', description: 'Stoeptegels die energie opwekken wanneer mensen eroverheen lopen.', category: IdeaCategory.SUSTAINABILITY, likes: 45, dislikes: 2, createdAt: new Date(Date.now() - 100000000), author: 'Thomas' },
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

  const handleAIBrainstorm = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    const result = await generateBrainstormIdeas(aiTopic, newCategory, language === 'nl' ? 'Nederlands' : 'English');
    setAiResult(result);
    setAiLoading(false);
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
    <div className={`min-h-screen flex flex-col pb-safe ${highContrast ? 'contrast-high' : ''}`}>
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
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-3 w-full md:w-auto rtl:space-x-reverse">
             <div className="relative flex-grow md:flex-grow-0 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={14}/>
                <input 
                  type="text" 
                  placeholder={t.search} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-cyan-500 text-xs font-bold w-full md:w-48 transition-all"
                />
             </div>
             
             <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <button 
                  onClick={() => setHighContrast(!highContrast)} 
                  title="Toggle High Contrast"
                  className={`p-2 rounded-lg transition-colors ${highContrast ? 'text-cyan-500 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-500'}`}
                >
                  <Type size={18}/>
                </button>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                  title="Toggle Theme"
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
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow mb-24">
         {activeTab === 'dashboard' ? (
           <Dashboard ideas={ideas} content={t} onExport={() => {}} />
         ) : (
           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-slide-up">
             <div className="w-full lg:w-3/5 space-y-6">
                {/* Sorting Controls */}
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <Filter size={12} />
                   <span>Sorteer:</span>
                   <button 
                    onClick={() => setSortBy('newest')} 
                    className={`px-3 py-1 rounded-full transition-all ${sortBy === 'newest' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}
                   >
                     Nieuwste
                   </button>
                   <button 
                    onClick={() => setSortBy('likes')} 
                    className={`px-3 py-1 rounded-full transition-all ${sortBy === 'likes' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}
                   >
                     Meest Geliefd
                   </button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {filteredAndSortedIdeas.length > 0 ? filteredAndSortedIdeas.map(idea => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      onLike={handleLike} 
                      onDislike={handleDislike} 
                      onClick={() => setSelectedIdeaId(idea.id)} 
                      isSelected={idea.id === selectedIdeaId}
                    />
                  )) : (
                    <div className="text-center py-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{t.noIdeas}</p>
                    </div>
                  )}
                </div>
             </div>
             
             {/* Detail Sidebar - Visible on Desktop, Modal-like on Mobile? */}
             <div className="w-full lg:w-2/5">
                <div className="sticky top-32 glass dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl min-h-[400px] lg:min-h-[500px] border dark:border-slate-800 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles size={120} className="text-cyan-500" />
                    </div>
                    {selectedIdea ? (
                      <div className="space-y-6 animate-fade-in relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">{selectedIdea.category}</span>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white leading-[1.1] tracking-tight">{selectedIdea.title}</h2>
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border dark:border-slate-800">
                           <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">{selectedIdea.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t dark:border-slate-800">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg">
                                {selectedIdea.author.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-black dark:text-white uppercase tracking-widest">{selectedIdea.author}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <button className="p-4 bg-cyan-600 text-white rounded-2xl shadow-xl shadow-cyan-600/20 hover:scale-105 transition-transform"><ChevronRight /></button>
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
      </main>

      {/* Floating Action Button - Enhanced for Mobile Accessibility */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-50">
        <button 
          onClick={() => setIsAIOpen(true)} 
          aria-label="AI Brainstorm"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-4 md:py-5 rounded-[2rem] shadow-2xl shadow-pink-600/30 hover:scale-105 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3"
        >
          <Sparkles size={18}/> <span className="hidden sm:inline">{t.generateAI}</span><span className="sm:hidden">AI</span>
        </button>
        <button 
          onClick={() => setIsFormOpen(true)} 
          aria-label="Voeg idee toe"
          className="bg-cyan-600 text-white p-5 md:p-6 rounded-[1.8rem] md:rounded-[2rem] shadow-2xl shadow-cyan-600/30 hover:scale-105 transition-all active:scale-95 group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500"/>
        </button>
      </div>

      {/* Modals - Optimized for Mobile Screens */}
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
                    <div className="relative">
                      <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white appearance-none cursor-pointer">
                        {Object.values(IdeaCategory).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                    </div>
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

      {isAIOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-pink-500/20 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Sparkles size={200} className="text-pink-500"/></div>
              <button onClick={() => setIsAIOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 transition-colors"><X size={28}/></button>
              
              <h2 className="text-2xl md:text-4xl font-black mb-1 flex items-center gap-3 dark:text-white tracking-tighter uppercase"><Sparkles className="text-pink-500 animate-pulse"/> {t.generateAI}</h2>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-8 opacity-60">Synthesize New Innovation Concepts</p>
              
              {isApiKeyMissing && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl mb-8 flex items-start gap-4">
                  <div className="p-2 bg-amber-500 rounded-xl text-white"><LayoutGrid size={16}/></div>
                  <div>
                    <h4 className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-1">API_KEY Ontbreekt</h4>
                    <p className="text-slate-400 text-[9px] font-medium leading-relaxed">Voeg een Gemini API Key toe aan je omgevingsvariabelen om het neurale netwerk te activeren.</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inspiratie Trefwoord</label>
                    <input type="text" value={aiTopic} onChange={(e)=>setAiTopic(e.target.value)} placeholder="Bijv: Groene mobiliteit, VR zorg..." className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-pink-500 font-bold dark:text-white" disabled={isApiKeyMissing}/>
                 </div>
                 <button 
                  onClick={handleAIBrainstorm} 
                  disabled={aiLoading || !aiTopic || isApiKeyMissing} 
                  className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-5 rounded-[1.8rem] font-black shadow-2xl shadow-pink-600/30 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-20 uppercase tracking-[0.2em] text-[10px]"
                 >
                   {aiLoading ? "Synthesizing..." : "Activeer Brainstorm"}
                 </button>
                 {aiResult && (
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] mt-6 max-h-60 overflow-y-auto border-2 border-pink-500/10 custom-scrollbar">
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
    </div>
  );
};

export default App;
