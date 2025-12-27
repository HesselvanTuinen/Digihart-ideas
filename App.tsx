
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HologramHeader from './components/HologramHeader';
import Dashboard from './components/Dashboard';
import IdeaCard from './components/IdeaCard';
import { Idea, IdeaCategory, SupportedLanguage, DICTIONARY } from './types';
import { suggestAdminReply, generateStructuredIdeas } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";
import { 
  Plus, Search, Sparkles, X, Sun, Moon, Type, LayoutGrid, 
  BarChart3, Languages, Filter, AlertCircle, Bookmark,
  Shield, Key, LogOut, Trash2, Send, Wand2, Loader2, Check, ArrowRight, Share2, Info, Link as LinkIcon, Linkedin, Facebook, Twitter
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'digihart_ideas_v2';
const DRAFT_STORAGE_KEY = 'digihart_form_draft';
const BOOKMARKS_STORAGE_KEY = 'digihart_bookmarks';

const App: React.FC = () => {
  // --- States ---
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('nl');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ideas' | 'admin'>('dashboard');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'saved'>('newest');

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [adminReplyText, setAdminReplyText] = useState<Record<string, string>>({});
  const [suggestingReplyId, setSuggestingReplyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharingIdea, setSharingIdea] = useState<Idea | null>(null);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<IdeaCategory>(IdeaCategory.TECHNOLOGY);
  const [newAuthor, setNewAuthor] = useState('');
  const [refiningIdea, setRefiningIdea] = useState(false);
  const [lastDraftSave, setLastDraftSave] = useState<number | null>(null);

  // AI States
  const [aiTopic, setAiTopic] = useState('');
  const [aiStructuredResults, setAiStructuredResults] = useState<Partial<Idea>[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const t = DICTIONARY[language];
  
  const isApiKeyMissing = useMemo(() => {
    try {
      const key = process.env.API_KEY;
      return !key || key === 'undefined' || key.length < 5;
    } catch (e) {
      return true;
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Initial Setup & Persistence ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('digihart-theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    
    // Load ideas from localStorage
    const savedIdeas = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedIdeas) {
      try {
        const parsed = JSON.parse(savedIdeas);
        const revived = parsed.map((i: any) => ({ ...i, createdAt: new Date(i.createdAt) }));
        setIdeas(revived);
      } catch (e) {
        console.error("Failed to parse saved ideas", e);
      }
    } else {
      const initial: Idea[] = [
        { id: '1', title: 'Smart Energy Tiles', description: 'Stoeptegels die energie opwekken wanneer mensen eroverheen lopen.', category: IdeaCategory.SUSTAINABILITY, likes: 45, dislikes: 2, createdAt: new Date(Date.now() - 100000000), author: 'Thomas', adminResponse: 'Geweldig idee! We kijken of we een pilot kunnen starten op de Grote Markt.' },
        { id: '2', title: 'VR Inclusion Training', description: 'Empathie training via VR om diversiteit op de werkvloer te vergroten.', category: IdeaCategory.INCLUSION, likes: 89, dislikes: 1, createdAt: new Date(Date.now() - 50000000), author: 'Elena' },
        { id: '3', title: 'AI Health Tutor', description: 'Gepersonaliseerde AI assistent voor chronisch zieken.', category: IdeaCategory.HEALTH, likes: 32, dislikes: 12, createdAt: new Date(), author: 'Marcus' }
      ];
      setIdeas(initial);
    }

    // Load bookmarks
    const savedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

    // Load draft
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setNewTitle(draft.title || '');
        setNewDesc(draft.description || '');
        setNewCategory(draft.category || IdeaCategory.TECHNOLOGY);
        setNewAuthor(draft.author || '');
      } catch (e) {}
    }

    setIsInitialized(true);
  }, []);

  // Sync ideas
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ideas));
    }
  }, [ideas, isInitialized]);

  // Sync bookmarks
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isInitialized]);

  // Sync draft (Debounced)
  useEffect(() => {
    if (!isInitialized) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        title: newTitle,
        description: newDesc,
        category: newCategory,
        author: newAuthor
      }));
      setLastDraftSave(Date.now());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [newTitle, newDesc, newCategory, newAuthor, isInitialized]);

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
  const handleLike = useCallback((id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i));
  }, []);

  const handleDislike = useCallback((id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, dislikes: i.dislikes + 1 } : i));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      if (prev.includes(id)) {
        return prev.filter(bid => bid !== id);
      }
      return [...prev, id];
    });
  }, []);

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Description', 'Category', 'Author', 'Likes', 'Dislikes', 'Created At', 'Admin Response'];
    const csvContent = ideas.map(idea => [
      idea.id,
      `"${idea.title.replace(/"/g, '""')}"`,
      `"${idea.description.replace(/"/g, '""')}"`,
      idea.category,
      `"${idea.author.replace(/"/g, '""')}"`,
      idea.likes,
      idea.dislikes,
      new Date(idea.createdAt).toISOString(),
      `"${(idea.adminResponse || '').replace(/"/g, '""')}"`
    ].join(',')).join('\n');
    
    const blob = new Blob([headers.join(',') + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `digihart_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(language === 'nl' ? "Export gedownload!" : "Export downloaded!");
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
    if (selectedIdeaId === id) setSelectedIdeaId(null);
    setConfirmDeleteId(null);
    showToast(language === 'nl' ? "Idee verwijderd." : "Idea deleted.", "info");
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
    showToast(language === 'nl' ? "Reactie opgeslagen!" : "Reply saved!");
  };

  const handleSuggestReplyAction = async (idea: Idea) => {
    if (isApiKeyMissing) return;
    setSuggestingReplyId(idea.id);
    try {
      const languageMap: Record<SupportedLanguage, string> = {
        nl: 'Dutch', en: 'English', es: 'Spanish', de: 'German', ar: 'Arabic', zh: 'Chinese', uk: 'Ukrainian', fy: 'Frisian', fr: 'French'
      };
      const suggestion = await suggestAdminReply(idea, languageMap[language]);
      if (suggestion) {
        setAdminReplyText(prev => ({ ...prev, [idea.id]: suggestion }));
      }
    } finally {
      setSuggestingReplyId(null);
    }
  };

  const handleRefineIdea = async () => {
    if (!newTitle || !newDesc || isApiKeyMissing) return;
    setRefiningIdea(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a world-class innovation storyteller. Enhance this idea to be more creative, descriptive, and compelling. 
      Input Title: ${newTitle}
      Input Description: ${newDesc}
      Category: ${newCategory}
      Target Language: ${language}
      
      Instructions:
      1. Make the title punchy and evocative.
      2. Expand the description with a focus on impact and 'wow-factor'.
      3. Use vivid, sensory language.
      
      Provide ONLY valid JSON with keys "title" and "description".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          temperature: 0.9,
          thinkingConfig: { thinkingBudget: 3000 } // Deep reasoning for refinement
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      if (result.title) setNewTitle(result.title);
      if (result.description) setNewDesc(result.description);
      showToast(language === 'nl' ? "Idee creatief verrijkt!" : "Idea creatively enriched!");
    } catch (e) {
      showToast("AI Refinement error.", "error");
    } finally {
      setRefiningIdea(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'admin123') {
      setIsAdmin(true);
      setIsLoginOpen(false);
      setLoginPassword('');
      showToast(language === 'nl' ? "Beheer geactiveerd." : "Admin activated.", "success");
    } else {
      showToast(language === 'nl' ? "Fout wachtwoord." : "Invalid password.", "error");
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
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setActiveTab('ideas');
    setSelectedIdeaId(idea.id);
    showToast(language === 'nl' ? "Idee geplaatst!" : "Idea posted!");
  };

  const handleShareClick = (idea: Idea) => {
    setSharingIdea(idea);
    setIsShareOpen(true);
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    if (!sharingIdea) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrlRaw = `${baseUrl}?ideaId=${sharingIdea.id}`;
    const text = encodeURIComponent(`Bekijk dit innovatieve idee op DigiHart.nl: "${sharingIdea.title}"\n`);
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrlRaw)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrlRaw)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrlRaw)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${sharingIdea.title}\n${shareUrlRaw}`);
        showToast(t.linkCopied);
        setIsShareOpen(false);
        break;
    }
  };

  const handleAIBrainstorm = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    setAiStructuredResults([]);
    try {
      const languageMap: Record<SupportedLanguage, string> = {
        nl: 'Dutch', en: 'English', es: 'Spanish', de: 'German', ar: 'Arabic', zh: 'Chinese', uk: 'Ukrainian', fy: 'Frisian', fr: 'French'
      };
      const results = await generateStructuredIdeas(aiTopic, languageMap[language]);
      setAiStructuredResults(results);
    } catch (err) {
      showToast("AI error.", "error");
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

    if (sortBy === 'saved') {
      result = result.filter(i => bookmarks.includes(i.id));
    }

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'likes') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    }
    return result;
  }, [ideas, searchTerm, sortBy, bookmarks]);

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  return (
    <div className={`min-h-screen flex flex-col pb-safe bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${highContrast ? 'contrast-high' : ''}`}>
      <HologramHeader />
      
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
        {toast && (
          <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-slide-up pointer-events-auto
            ${toast.type === 'success' ? 'bg-cyan-500/90 text-white border-cyan-400' : 
              toast.type === 'error' ? 'bg-rose-500/90 text-white border-rose-400' : 
              'bg-slate-800/90 text-white border-slate-700'}
          `}>
            {toast.type === 'success' ? <Check size={18} /> : toast.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        )}
      </div>

      <nav className="sticky top-0 z-40 glass dark:bg-slate-950/90 backdrop-blur-xl border-b dark:border-slate-800 px-4 py-3 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1 rounded-2xl w-full md:w-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-cyan-500'}`}>
              <BarChart3 size={14} /> <span>{t.dashboard}</span>
            </button>
            <button onClick={() => setActiveTab('ideas')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'ideas' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-cyan-500'}`}>
              <LayoutGrid size={14} /> <span>{t.ideas}</span>
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab('admin')} className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'admin' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-rose-500'}`}>
                <Shield size={14} /> <span>{t.admin}</span>
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
                  className={`p-2 rounded-lg transition-colors ${highContrast ? 'text-cyan-500 bg-cyan-500/10' : 'text-slate-400 hover:text-cyan-500'}`}
                >
                  <Type size={18}/>
                </button>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                  className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
                </button>
                
                <div className="relative group">
                   <button className="flex items-center space-x-1 p-2 text-slate-400 hover:text-cyan-500 transition-colors"><Languages size={18}/></button>
                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                      <div className="grid grid-cols-1 divide-y dark:divide-slate-800">
                        {Object.keys(DICTIONARY).map(lang => (
                          <button key={lang} onClick={() => setLanguage(lang as SupportedLanguage)} className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-slate-50 dark:hover:bg-slate-800 ${language === lang ? 'text-cyan-500' : 'text-slate-500'}`}>
                            {lang === 'nl' ? 'Nederlands' : lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'de' ? 'Deutsch' : lang === 'ar' ? 'العربية' : lang === 'zh' ? '中文' : lang === 'uk' ? 'Українська' : lang === 'fy' ? 'Frysk' : lang === 'fr' ? 'Français' : lang}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                {isAdmin ? (
                  <button onClick={() => setIsAdmin(false)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                    <LogOut size={18} />
                  </button>
                ) : (
                  <button onClick={() => setIsLoginOpen(true)} className="p-2 text-slate-400 hover:text-cyan-500 transition-colors">
                    <Shield size={18} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow mb-24">
         {activeTab === 'dashboard' && (
           <Dashboard ideas={ideas} content={t} onExport={handleExport} />
         )}

         {activeTab === 'ideas' && (
           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-slide-up">
             <div className="w-full lg:w-3/5 space-y-6">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <Filter size={12} />
                   <span>{t.sortBy}</span>
                   <button onClick={() => setSortBy('newest')} className={`px-3 py-1 rounded-full transition-all ${sortBy === 'newest' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}>{t.newest}</button>
                   <button onClick={() => setSortBy('likes')} className={`px-3 py-1 rounded-full transition-all ${sortBy === 'likes' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}>{t.mostLoved}</button>
                   <button onClick={() => setSortBy('saved')} className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${sortBy === 'saved' ? 'bg-cyan-500 text-white shadow-md' : 'hover:text-cyan-500'}`}><Bookmark size={10} /> {t.bookmarks}</button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {filteredAndSortedIdeas.length > 0 ? filteredAndSortedIdeas.map(idea => (
                    <IdeaCard 
                      key={idea.id} idea={idea} 
                      onLike={handleLike} 
                      onDislike={handleDislike} 
                      onBookmark={() => toggleBookmark(idea.id)}
                      isBookmarked={bookmarks.includes(idea.id)}
                      onDelete={isAdmin ? handleDeleteIdea : undefined} 
                      onShare={handleShareClick}
                      onClick={() => setSelectedIdeaId(idea.id)} 
                      isSelected={idea.id === selectedIdeaId} 
                      isAdmin={isAdmin} t={t}
                    />
                  )) : (
                    <div className="text-center py-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{t.noIdeas}</p>
                    </div>
                  )}
                </div>
             </div>
             
             <div className="w-full lg:w-2/5">
                <div className="sticky top-32 glass dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl min-h-[400px] lg:min-h-[500px] border dark:border-slate-800 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles size={120} className="text-cyan-500" />
                    </div>
                    {selectedIdea ? (
                      <div className="space-y-6 animate-fade-in relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">{t.categories[selectedIdea.category]}</span>
                          <div className="flex gap-2">
                             <button onClick={() => toggleBookmark(selectedIdea.id)} className={`p-2 rounded-xl transition-all ${bookmarks.includes(selectedIdea.id) ? 'bg-yellow-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-yellow-500'}`}>
                               <Bookmark size={16} fill={bookmarks.includes(selectedIdea.id) ? "currentColor" : "none"} />
                             </button>
                             <button onClick={() => handleShareClick(selectedIdea)} className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all">
                               <Share2 size={16} />
                             </button>
                          </div>
                        </div>
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
                        <p className="text-xs font-black uppercase tracking-widest max-w-[200px]">{t.selectIdeaPrompt}</p>
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
                  <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter uppercase leading-none text-rose-500">{t.adminOverview}</h2>
                  <p className="text-slate-500 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-2 opacity-60">{t.adminSub}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.tableIdea}</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.tableAuthor}</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.tableModeration}</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t.tableAction}</th>
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
                                  <button onClick={() => handleSaveAdminReply(idea.id)} className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">
                                      <Send size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleSuggestReplyAction(idea)}
                                    disabled={suggestingReplyId === idea.id || isApiKeyMissing}
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
                            {confirmDeleteId === idea.id ? (
                                <div className="flex items-center gap-2 animate-fade-in bg-rose-600 p-2 rounded-xl">
                                    <button onClick={() => handleDeleteIdea(idea.id)} className="p-2 bg-white/20 rounded-lg text-white"><Check size={14} /></button>
                                    <button onClick={() => setConfirmDeleteId(null)} className="p-2 bg-black/20 rounded-lg text-white"><X size={14} /></button>
                                </div>
                            ) : (
                                <button onClick={() => setConfirmDeleteId(idea.id)} className="flex items-center space-x-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-500/30">
                                    <Trash2 size={14} /> <span>{t.delete}</span>
                                </button>
                            )}
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

      {/* Footer */}
      <footer className="w-full py-10 text-center border-t dark:border-slate-900/50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-600">
            DigiHart is onderdeel van Buurt-Kiosk ©️
          </p>
          <div className="mt-4 flex justify-center items-center space-x-4 opacity-30">
            <div className="h-px w-8 bg-slate-500"></div>
            <Sparkles size={14} className="text-slate-500" />
            <div className="h-px w-8 bg-slate-500"></div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-50">
        <button onClick={() => setIsAIOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-4 md:py-5 rounded-[2rem] shadow-2xl shadow-pink-600/30 hover:scale-105 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3">
          <Sparkles size={18}/> <span className="hidden sm:inline">{t.generateAI}</span><span className="sm:hidden">AI</span>
        </button>
        <button onClick={() => setIsFormOpen(true)} className="bg-cyan-600 text-white p-5 md:p-6 rounded-[1.8rem] md:rounded-[2rem] shadow-2xl shadow-cyan-600/30 hover:scale-105 transition-all active:scale-95 group">
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500"/>
        </button>
      </div>

      {/* Share Modal */}
      {isShareOpen && sharingIdea && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-cyan-500/20 rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl relative overflow-hidden">
              <button onClick={() => setIsShareOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={24}/></button>
              <div className="flex flex-col items-center text-center space-y-8">
                 <div className="p-5 bg-cyan-500/10 rounded-full text-cyan-500">
                    <Share2 size={32} />
                 </div>
                 <div className="space-y-2">
                   <h2 className="text-xl font-black uppercase tracking-widest dark:text-white">{t.shareTitle}</h2>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">{sharingIdea.title}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all group">
                       <Twitter size={24} className="text-cyan-500 group-hover:text-white" />
                       <span className="text-[8px] font-black uppercase">Twitter / X</span>
                    </button>
                    <button onClick={() => handleSocialShare('linkedin')} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group">
                       <Linkedin size={24} className="text-blue-600 group-hover:text-white" />
                       <span className="text-[8px] font-black uppercase">LinkedIn</span>
                    </button>
                    <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-blue-700 hover:text-white transition-all group">
                       <Facebook size={24} className="text-blue-700 group-hover:text-white" />
                       <span className="text-[8px] font-black uppercase">Facebook</span>
                    </button>
                    <button onClick={() => handleSocialShare('copy')} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-700 hover:text-white transition-all group">
                       <LinkIcon size={24} className="text-slate-600 group-hover:text-white" />
                       <span className="text-[8px] font-black uppercase">{t.copyLink}</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-cyan-500/20 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative">
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-slate-400"><X size={20}/></button>
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-500"><Key size={32} /></div>
                 <h2 className="text-xl font-black uppercase tracking-widest dark:text-white">{t.adminLogin}</h2>
                 <form onSubmit={handleAdminLogin} className="w-full space-y-4">
                    <input type="password" placeholder="Wachtwoord" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all text-center" autoFocus />
                    <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]">{t.verify}</button>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t.pwdHint}</p>
                 </form>
              </div>
           </div>
        </div>
      )}

      {isAIOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border-2 border-pink-500/20 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.15)]">
              <button onClick={() => setIsAIOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 transition-colors"><X size={28}/></button>
              <h2 className="text-2xl md:text-4xl font-black mb-1 flex items-center gap-3 dark:text-white tracking-tighter uppercase"><Sparkles className="text-pink-500 animate-pulse"/> {t.generateAI}</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-8">DigiHart AI Brainstormer</p>
              <div className="space-y-8">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.aiPromptLabel}</label>
                    <div className="flex gap-3">
                      <input type="text" value={aiTopic} onChange={(e)=>setAiTopic(e.target.value)} placeholder={t.aiInputPlaceholder} className="flex-grow bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-pink-500 font-bold dark:text-white transition-all" onKeyDown={(e) => e.key === 'Enter' && handleAIBrainstorm()} />
                      <button onClick={handleAIBrainstorm} disabled={aiLoading || !aiTopic || isApiKeyMissing} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 rounded-xl font-black shadow-lg shadow-pink-600/20 hover:scale-[1.05] transition-all disabled:opacity-30 uppercase text-[10px] tracking-widest">
                        {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                      </button>
                    </div>
                 </div>
                 {aiStructuredResults.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
                     {aiStructuredResults.map((result, idx) => (
                       <div key={idx} className="group flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-pink-500/10 rounded-[2rem] hover:border-pink-500/40 transition-all">
                         <div className="space-y-3">
                            <span className="text-[8px] font-black uppercase text-pink-500 tracking-widest">{t.categories[result.category as IdeaCategory]}</span>
                            <h4 className="text-sm font-black dark:text-white leading-tight">{result.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{result.description}</p>
                         </div>
                         <button onClick={() => {
                            setNewTitle(result.title || ''); setNewDesc(result.description || ''); setNewCategory(result.category as IdeaCategory);
                            setIsAIOpen(false); setIsFormOpen(true);
                         }} className="mt-6 w-full py-3 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-pink-500 hover:text-white transition-all group-hover:scale-[1.02]">
                            {t.adoptAI}
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
                 {aiLoading && (
                   <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="p-4 bg-pink-500/10 rounded-full animate-pulse"><Sparkles size={40} className="text-pink-500" /></div>
                      <p className="text-xs font-black uppercase tracking-widest text-pink-500 animate-pulse">{t.aiThinking}</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 md:p-10 shadow-2xl relative">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
             <div className="flex justify-between items-center mb-8">
               <div className="flex flex-col">
                 <h2 className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter uppercase">{t.addIdea}</h2>
                 {lastDraftSave && <span className="text-[8px] font-black uppercase text-emerald-500 mt-1">{t.draftSaved}</span>}
               </div>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24}/></button>
             </div>
             <form onSubmit={handleAddIdea} className="space-y-5">
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.titleLabel}</label>
                      <button type="button" onClick={handleRefineIdea} disabled={!newTitle || refiningIdea || isApiKeyMissing} className="flex items-center gap-1.5 text-[8px] font-black text-purple-500 uppercase hover:text-purple-400 disabled:opacity-30 transition-all">
                         {refiningIdea ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} {t.refineAI}
                      </button>
                   </div>
                   <input type="text" placeholder={t.titlePlaceholder} value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all" required/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.categoryLabel}</label>
                    <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white appearance-none cursor-pointer">
                      {Object.values(IdeaCategory).map(c => <option key={c} value={c}>{t.categories[c]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.authorLabel}</label>
                    <input type="text" placeholder={t.authorPlaceholder} value={newAuthor} onChange={(e)=>setNewAuthor(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none border-2 border-transparent focus:border-cyan-500 font-bold dark:text-white transition-all"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.descLabel}</label>
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
