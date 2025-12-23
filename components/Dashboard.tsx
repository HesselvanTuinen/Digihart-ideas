
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Idea, IdeaCategory, LanguageContent } from '../types';
import { Download, TrendingUp, Lightbulb, PieChart as PieIcon, Activity } from 'lucide-react';

interface DashboardProps {
  ideas: Idea[];
  content: LanguageContent;
  onExport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ideas, content, onExport }) => {
  const stats = useMemo(() => {
    const total = ideas.length;
    const categoryCounts = ideas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entries = Object.entries(categoryCounts) as [string, number][];
    const topCat = entries.sort((a, b) => b[1] - a[1])[0];
    
    const chartData = Object.values(IdeaCategory).map(cat => ({
      name: cat,
      value: categoryCounts[cat] || 0
    })).filter(d => d.value > 0);

    const totalEngagement = ideas.reduce((acc, i) => acc + i.likes + i.dislikes, 0);

    return { total, topCategory: topCat ? topCat[0] : 'N/A', chartData, totalEngagement };
  }, [ideas]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#d946ef'];

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b dark:border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter uppercase leading-none">{content.dashboard}</h2>
          <p className="text-slate-500 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-2 opacity-60">Real-time Innovation Metrics</p>
        </div>
        <button onClick={onExport} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-xl shadow-cyan-600/20 text-xs font-black uppercase tracking-widest hover:bg-cyan-700 transition-colors active:scale-95">
          <Download size={14} />
          <span>{content.export}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2rem] shadow-xl relative overflow-hidden group border dark:border-slate-800">
            <div className="absolute -right-6 -top-6 text-cyan-500/5 group-hover:scale-125 transition-transform duration-1000"><Lightbulb size={140}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{content.totalIdeas}</p>
            <h3 className="text-4xl md:text-6xl font-black dark:text-white leading-none">{stats.total}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2rem] shadow-xl relative overflow-hidden group border dark:border-slate-800">
            <div className="absolute -right-6 -top-6 text-pink-500/5 group-hover:scale-125 transition-transform duration-1000"><PieIcon size={140}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{content.topCategory}</p>
            <h3 className="text-2xl md:text-3xl font-black dark:text-white truncate uppercase tracking-tighter">{stats.topCategory}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2rem] shadow-xl relative overflow-hidden group border dark:border-slate-800 sm:col-span-2 lg:col-span-1">
            <div className="absolute -right-6 -top-6 text-emerald-500/5 group-hover:scale-125 transition-transform duration-1000"><Activity size={140}/></div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Engagement</p>
            <h3 className="text-4xl md:text-6xl font-black dark:text-white leading-none">{stats.totalEngagement}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border dark:border-slate-800 h-[350px] md:h-[450px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 md:mb-10 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-500" /> Verspreiding Categorieën
            </h4>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} width={80} />
                  <Tooltip cursor={{fill: 'rgba(14, 165, 233, 0.05)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontWeight: 800, background: '#0f172a', color: '#fff', fontSize: '10px'}} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={15}>
                      {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border dark:border-slate-800 h-[350px] md:h-[450px] flex flex-col items-center">
            <h4 className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <PieIcon size={14} className="text-pink-500" /> Aandeel per Sectie
            </h4>
            <div className="h-full w-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          data={stats.chartData}
                          innerRadius="60%"
                          outerRadius="85%"
                          paddingAngle={8}
                          dataKey="value"
                      >
                          {stats.chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                          ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px'}} />
                  </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
