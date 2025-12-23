
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid } from 'recharts';
import { Idea, IdeaCategory, LanguageContent } from '../types';
import { Download, TrendingUp, Lightbulb, PieChart as PieIcon, Activity, ListChecks } from 'lucide-react';

interface DashboardProps {
  ideas: Idea[];
  content: LanguageContent;
  onExport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ideas, content, onExport }) => {
  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#d946ef'];

  const stats = useMemo(() => {
    const total = ideas.length;
    
    // Category Counts with translated labels
    const categoryCounts = ideas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entries = Object.entries(categoryCounts) as [IdeaCategory, number][];
    const topCatRaw = entries.sort((a, b) => b[1] - a[1])[0];
    const topCategoryLabel = topCatRaw ? content.categories[topCatRaw[0]] : 'N/A';
    
    // Pie Chart Data
    const categoryData = Object.values(IdeaCategory).map(cat => ({
      name: content.categories[cat],
      value: categoryCounts[cat] || 0
    })).filter(d => d.value > 0);

    // Top 5 Ideas by Likes
    const topIdeasData = [...ideas]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map(i => ({
        name: i.title.length > 15 ? i.title.substring(0, 15) + '...' : i.title,
        likes: i.likes,
        fullTitle: i.title
      }));

    // Timeline Data (Ideas per day)
    const timelineMap = ideas.reduce((acc, idea) => {
      const date = new Date(idea.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineData = Object.entries(timelineMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalEngagement = ideas.reduce((acc, i) => acc + i.likes + i.dislikes, 0);

    return { total, topCategory: topCategoryLabel, categoryData, topIdeasData, timelineData, totalEngagement };
  }, [ideas, content]);

  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b dark:border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter uppercase leading-none">{content.dashboard}</h2>
          <p className="text-slate-500 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-2 opacity-60">Deep Insight Metrics & Visualizations</p>
        </div>
        <button onClick={onExport} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-cyan-600/20 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95">
          <Download size={14} />
          <span>{content.export}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border dark:border-slate-800 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-cyan-500/10 group-hover:scale-125 transition-transform duration-1000"><Lightbulb size={100}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{content.totalIdeas}</p>
            <h3 className="text-4xl font-black dark:text-white leading-none">{stats.total}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border dark:border-slate-800 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-pink-500/10 group-hover:scale-125 transition-transform duration-1000"><PieIcon size={100}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{content.topCategory}</p>
            <h3 className="text-xl font-black dark:text-white truncate uppercase tracking-tighter">{stats.topCategory}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border dark:border-slate-800 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:scale-125 transition-transform duration-1000"><Activity size={100}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Engagement</p>
            <h3 className="text-4xl font-black dark:text-white leading-none">{stats.totalEngagement}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border dark:border-slate-800 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-purple-500/10 group-hover:scale-125 transition-transform duration-1000"><ListChecks size={100}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Categories Active</p>
            <h3 className="text-4xl font-black dark:text-white leading-none">{stats.categoryData.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Ideas Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800 h-[400px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-500" /> {content.topIdeasChart}
            </h4>
            <div className="h-full pb-12">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topIdeasData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#0ea5e910'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 800}}
                    />
                    <Bar dataKey="likes" radius={[10, 10, 0, 0]} barSize={40}>
                        {stats.topIdeasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800 h-[400px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Activity size={14} className="text-purple-500" /> {content.timelineChart}
            </h4>
            <div className="h-full pb-12">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timelineData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px'}} />
                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution (Translated) */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800 h-[400px] flex flex-col items-center lg:col-span-2">
            <h4 className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <PieIcon size={14} className="text-pink-500" /> {content.categoryChart}
            </h4>
            <div className="h-full w-full pb-10 flex flex-col md:flex-row items-center">
              <div className="h-full w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stats.categoryData}
                            innerRadius="60%"
                            outerRadius="85%"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stats.categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 px-8">
                {stats.categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-[10px] font-black dark:text-slate-300 uppercase tracking-tighter">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
