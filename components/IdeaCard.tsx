
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, Tag, Trash2, ShieldCheck, Check, X as XIcon, Share2, Bookmark } from 'lucide-react';
import { Idea, LanguageContent } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  onDelete?: (id: string) => void;
  onShare?: (idea: Idea) => void;
  onClick?: () => void;
  isSelected?: boolean;
  isAdmin?: boolean;
  t: LanguageContent;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onLike, onDislike, onBookmark, isBookmarked, onDelete, onShare, onClick, isSelected, isAdmin, t }) => {
  const [isConfirming, setIsConfirming] = useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete && onDelete(idea.id);
    setIsConfirming(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(false);
  };

  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`group relative w-full text-left bg-white dark:bg-slate-900 border-s-[6px] ${colorClass.split(' ')[0]} p-6 rounded-e-2xl shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10
        ${isSelected ? 'ring-2 ring-cyan-500 dark:ring-cyan-400 bg-cyan-50/10 dark:bg-cyan-900/10' : ''}
      `}
      onKeyDown={(e) => { if(e.key === 'Enter') onClick?.(); }}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark?.(idea.id); }}
          className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-300 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
          title="Save Idea"
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onShare?.(idea); }}
          className="p-2 text-slate-300 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all"
          title="Share"
        >
          <Share2 size={16} />
        </button>

        {isAdmin && (
          <>
            {!isConfirming ? (
              <button 
                onClick={handleDeleteClick}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                title={t.delete}
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-slide-up bg-rose-600 p-1 rounded-xl shadow-lg">
                <button 
                  onClick={confirmDelete}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={cancelDelete}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-lg transition-colors"
                >
                  <XIcon size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
           <div className="flex items-center space-x-2">
             <Tag size={12} className={colorClass.split(' ')[1]} />
             <span className={`text-[9px] font-black uppercase tracking-widest ${colorClass.split(' ')[1]}`}>
               {t.categories[idea.category]}
             </span>
           </div>
           <h3 className="text-xl font-black mt-2 dark:text-white leading-tight pr-12 transition-colors group-hover:text-cyan-500 dark:group-hover:text-cyan-400">
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
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
        {idea.description}
      </p>

      {idea.adminResponse && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-rose-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">{t.adminReply}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-rose-200/70 font-bold italic leading-relaxed">
            "{idea.adminResponse}"
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t dark:border-slate-800 pt-4">
          <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white text-[8px] font-black uppercase shadow-sm">
                {idea.author.substring(0, 2).toUpperCase()}
              </div>
              <span className="group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{idea.author}</span>
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
