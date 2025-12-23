
import React from 'react';
import { ThumbsUp, ThumbsDown, Clock, User, Tag } from 'lucide-react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onLike, onDislike, onClick, isSelected }) => {
  const categoryColors: Record<string, string> = {
    'Technology': 'border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-cyan-500/5',
    'Community': 'border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5',
    'Sustainability': 'border-green-500 text-green-600 dark:text-green-400 shadow-green-500/5',
    'Education': 'border-blue-500 text-blue-600 dark:text-blue-400 shadow-blue-500/5',
    'Health': 'border-red-500 text-red-600 dark:text-red-400 shadow-red-500/5',
    'Art': 'border-purple-500 text-purple-600 dark:text-purple-400 shadow-purple-500/5',
    'Inclusion': 'border-pink-500 text-pink-600 dark:text-pink-400 shadow-pink-500/5',
  };

  const colorClass = categoryColors[idea.category] || 'border-slate-500 text-slate-600 shadow-slate-500/5';

  return (
    <div 
      onClick={onClick}
      className={`group relative w-full text-left bg-white dark:bg-slate-900 border-s-[6px] ${colorClass.split(' ')[0]} p-6 rounded-e-2xl shadow-lg transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl
        ${isSelected ? 'ring-2 ring-cyan-500 dark:ring-cyan-400 bg-cyan-50/10 dark:bg-cyan-900/10' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
           <div className="flex items-center space-x-2">
             <Tag size={12} className={colorClass.split(' ')[1]} />
             <span className={`text-[9px] font-black uppercase tracking-widest ${colorClass.split(' ')[1]}`}>
               {idea.category}
             </span>
           </div>
           <h3 className="text-xl font-black mt-2 dark:text-white leading-tight">
             {idea.title}
           </h3>
        </div>
        <div className="flex flex-col items-center space-y-2 ml-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onLike(idea.id); }} 
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-cyan-500 hover:scale-110 transition-all flex flex-col items-center min-w-[40px]"
            >
                <ThumbsUp size={18} />
                <span className="text-[10px] font-black mt-1">{idea.likes}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDislike(idea.id); }} 
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-pink-500 hover:scale-110 transition-all flex flex-col items-center min-w-[40px]"
            >
                <ThumbsDown size={18} />
                <span className="text-[10px] font-black mt-1">{idea.dislikes}</span>
            </button>
        </div>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
        {idea.description}
      </p>
      
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t dark:border-slate-800 pt-4">
          <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white text-[8px]">
                {idea.author.substring(0, 2).toUpperCase()}
              </div>
              <span>{idea.author}</span>
          </div>
          <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>
      </div>
    </div>
  );
};

export default IdeaCard;
