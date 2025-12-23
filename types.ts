
export enum IdeaCategory {
  TECHNOLOGY = 'Technology',
  COMMUNITY = 'Community',
  SUSTAINABILITY = 'Sustainability',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  ART = 'Art',
  INCLUSION = 'Inclusion'
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  likes: number;
  dislikes: number;
  createdAt: Date;
  author: string;
}

export type SupportedLanguage = 'en' | 'es' | 'nl' | 'ar' | 'uk' | 'zh' | 'de';

export interface LanguageContent {
  dashboard: string;
  addIdea: string;
  export: string;
  search: string;
  generateAI: string;
  submit: string;
  titlePlaceholder: string;
  descPlaceholder: string;
  authorPlaceholder: string;
  totalIdeas: string;
  topCategory: string;
  popularTitle: string;
  noIdeas: string;
}

export const DICTIONARY: Record<SupportedLanguage, LanguageContent> = {
  nl: {
    dashboard: "Dashboard",
    addIdea: "Idee Toevoegen",
    export: "Exporteren",
    search: "Zoeken...",
    generateAI: "AI Brainstorm",
    submit: "Idee Opslaan",
    titlePlaceholder: "Titel van je idee",
    descPlaceholder: "Beschrijf je innovatie...",
    authorPlaceholder: "Je naam",
    totalIdeas: "Totaal Ideeën",
    topCategory: "Populairste Categorie",
    popularTitle: "Meest Geliefd",
    noIdeas: "Geen ideeën gevonden."
  },
  en: {
    dashboard: "Dashboard",
    addIdea: "Add Idea",
    export: "Export",
    search: "Search...",
    generateAI: "AI Brainstorm",
    submit: "Save Idea",
    titlePlaceholder: "Idea title",
    descPlaceholder: "Describe your innovation...",
    authorPlaceholder: "Your name",
    totalIdeas: "Total Ideas",
    topCategory: "Top Category",
    popularTitle: "Most Loved",
    noIdeas: "No ideas found."
  },
  es: {
    dashboard: "Tablero",
    addIdea: "Añadir Idea",
    export: "Exportar",
    search: "Buscar...",
    generateAI: "Lluvia de ideas IA",
    submit: "Guardar Idea",
    titlePlaceholder: "Título de la idea",
    descPlaceholder: "Describe tu innovación...",
    authorPlaceholder: "Tu nombre",
    totalIdeas: "Ideas Totales",
    topCategory: "Categoría Principal",
    popularTitle: "Más Queridos",
    noIdeas: "No se encontraron ideas."
  },
  ar: {
    dashboard: "لوحة القيادة",
    addIdea: "إضافة فكرة",
    export: "تصدير",
    search: "بحث...",
    generateAI: "عصف ذهني بالذكاء الاصطناعي",
    submit: "حفظ الفكرة",
    titlePlaceholder: "عنوان الفكرة",
    descPlaceholder: "صف ابتكارك...",
    authorPlaceholder: "اسمك",
    totalIdeas: "إجمالي الأفكار",
    topCategory: "أعلى فئة",
    popularTitle: "الأكثر إعجاباً",
    noIdeas: "لم يتم العثور على أفكار."
  },
  uk: {
    dashboard: "Панель",
    addIdea: "Додати ідею",
    export: "Експорт",
    search: "Пошук...",
    generateAI: "AI Мозковий штурм",
    submit: "Зберегти ідею",
    titlePlaceholder: "Назва ідеї",
    descPlaceholder: "Опишіть свою інновацію...",
    authorPlaceholder: "Ваше ім'я",
    totalIdeas: "Всього ідей",
    topCategory: "Топ категорія",
    popularTitle: "Найпопулярніші",
    noIdeas: "Ідей не знайдено."
  },
  zh: {
    dashboard: "仪表板",
    addIdea: "添加想法",
    export: "导出",
    search: "搜索...",
    generateAI: "AI 头脑风暴",
    submit: "保存想法",
    titlePlaceholder: "想法标题",
    descPlaceholder: "描述您的创新...",
    authorPlaceholder: "您的名字",
    totalIdeas: "总想法数",
    topCategory: "热门类别",
    popularTitle: "最受喜爱",
    noIdeas: "未找到想法。"
  },
  de: {
    dashboard: "Dashboard",
    addIdea: "Idee hinzufügen",
    export: "Exportieren",
    search: "Suchen...",
    generateAI: "KI Brainstorming",
    submit: "Idee speichern",
    titlePlaceholder: "Ideentitel",
    descPlaceholder: "Beschreibe deine Innovation...",
    authorPlaceholder: "Dein Name",
    totalIdeas: "Gesamtideen",
    topCategory: "Top-Kategorie",
    popularTitle: "Meistgeliebt",
    noIdeas: "Keine Ideen gefunden."
  }
};
