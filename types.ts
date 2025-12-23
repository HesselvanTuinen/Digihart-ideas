
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
  adminResponse?: string;
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
  adminLogin: string;
  adminActive: string;
  deleteConfirm: string;
  adminReply: string;
  replyPlaceholder: string;
  saveReply: string;
  topIdeasChart: string;
  timelineChart: string;
  categoryChart: string;
  categories: Record<IdeaCategory, string>;
}

export const DICTIONARY: Record<SupportedLanguage, LanguageContent> = {
  nl: {
    dashboard: "Dashboard",
    addIdea: "Idee Toevoegen",
    export: "Export naar Excel (CSV)",
    search: "Zoeken...",
    generateAI: "AI Brainstorm",
    submit: "Idee Opslaan",
    titlePlaceholder: "Titel van je idee",
    descPlaceholder: "Beschrijf je innovatie...",
    authorPlaceholder: "Je naam",
    totalIdeas: "Totaal Ideeën",
    topCategory: "Populairste Categorie",
    popularTitle: "Meest Geliefd",
    noIdeas: "Geen ideeën gevonden.",
    adminLogin: "Admin Inlog",
    adminActive: "Beheermodus Actief",
    deleteConfirm: "Weet je zeker dat je dit idee wilt verwijderen?",
    adminReply: "Reactie van Beheer",
    replyPlaceholder: "Schrijf een reactie als admin...",
    saveReply: "Reactie Opslaan",
    topIdeasChart: "Top 5 Populairste Ideeën",
    timelineChart: "Ideeën over de Tijd",
    categoryChart: "Verdeling per Categorie",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Technologie",
      [IdeaCategory.COMMUNITY]: "Gemeenschap",
      [IdeaCategory.SUSTAINABILITY]: "Duurzaamheid",
      [IdeaCategory.EDUCATION]: "Educatie",
      [IdeaCategory.HEALTH]: "Gezondheid",
      [IdeaCategory.ART]: "Kunst",
      [IdeaCategory.INCLUSION]: "Inclusie"
    }
  },
  en: {
    dashboard: "Dashboard",
    addIdea: "Add Idea",
    export: "Export to Excel (CSV)",
    search: "Search...",
    generateAI: "AI Brainstorm",
    submit: "Save Idea",
    titlePlaceholder: "Idea title",
    descPlaceholder: "Describe your innovation...",
    authorPlaceholder: "Your name",
    totalIdeas: "Total Ideas",
    topCategory: "Top Category",
    popularTitle: "Most Loved",
    noIdeas: "No ideas found.",
    adminLogin: "Admin Login",
    adminActive: "Admin Mode Active",
    deleteConfirm: "Are you sure you want to delete this idea?",
    adminReply: "Admin Response",
    replyPlaceholder: "Write a response as admin...",
    saveReply: "Save Response",
    topIdeasChart: "Top 5 Popular Ideas",
    timelineChart: "Ideas Over Time",
    categoryChart: "Category Distribution",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Technology",
      [IdeaCategory.COMMUNITY]: "Community",
      [IdeaCategory.SUSTAINABILITY]: "Sustainability",
      [IdeaCategory.EDUCATION]: "Education",
      [IdeaCategory.HEALTH]: "Health",
      [IdeaCategory.ART]: "Art",
      [IdeaCategory.INCLUSION]: "Inclusion"
    }
  },
  es: {
    dashboard: "Tablero",
    addIdea: "Añadir Idea",
    export: "Exportar a Excel (CSV)",
    search: "Buscar...",
    generateAI: "Lluvia de ideas IA",
    submit: "Guardar Idea",
    titlePlaceholder: "Título de la idea",
    descPlaceholder: "Describe tu innovación...",
    authorPlaceholder: "Tu nombre",
    totalIdeas: "Ideas Totales",
    topCategory: "Categoría Principal",
    popularTitle: "Más Queridos",
    noIdeas: "No se encontraron ideas.",
    adminLogin: "Admin",
    adminActive: "Modo Admin Activo",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta idea?",
    adminReply: "Respuesta de Admin",
    replyPlaceholder: "Escribe una respuesta...",
    saveReply: "Guardar Respuesta",
    topIdeasChart: "Top 5 Ideas Populares",
    timelineChart: "Ideas en el Tiempo",
    categoryChart: "Distribución por Categoría",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Tecnología",
      [IdeaCategory.COMMUNITY]: "Comunidad",
      [IdeaCategory.SUSTAINABILITY]: "Sostenibilidad",
      [IdeaCategory.EDUCATION]: "Educación",
      [IdeaCategory.HEALTH]: "Salud",
      [IdeaCategory.ART]: "Arte",
      [IdeaCategory.INCLUSION]: "Inclusión"
    }
  },
  ar: {
    dashboard: "لوحة القيادة",
    addIdea: "إضافة فكرة",
    export: "تصدير إلى إكسل",
    search: "بحث...",
    generateAI: "عصف ذهني بالذكاء الاصطناعي",
    submit: "حفظ الفكرة",
    titlePlaceholder: "عنوان الفكرة",
    descPlaceholder: "صف ابتكارك...",
    authorPlaceholder: "اسمك",
    totalIdeas: "إجمالي الأفكار",
    topCategory: "أعلى فئة",
    popularTitle: "الأكثر إعجاباً",
    noIdeas: "لم يتم العثور على أفكار.",
    adminLogin: "تسجيل دخول المسؤول",
    adminActive: "وضع المسؤول نشط",
    deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه الفكرة؟",
    adminReply: "رد المسؤول",
    replyPlaceholder: "اكتب رداً كمسؤول...",
    saveReply: "حفظ الرد",
    topIdeasChart: "أفضل 5 أفكار",
    timelineChart: "الأفكار مع مرور الوقت",
    categoryChart: "توزيع الفئات",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "تكنولوجيا",
      [IdeaCategory.COMMUNITY]: "مجتمع",
      [IdeaCategory.SUSTAINABILITY]: "استدامة",
      [IdeaCategory.EDUCATION]: "تعليم",
      [IdeaCategory.HEALTH]: "صحة",
      [IdeaCategory.ART]: "فن",
      [IdeaCategory.INCLUSION]: "شمولية"
    }
  },
  uk: {
    dashboard: "Панель",
    addIdea: "Додати ідею",
    export: "Експорт в Excel",
    search: "Пошук...",
    generateAI: "AI Мозковий штурм",
    submit: "Зберегти ідею",
    titlePlaceholder: "Назва ідеї",
    descPlaceholder: "Опишіть свою інновацію...",
    authorPlaceholder: "Ваше ім'я",
    totalIdeas: "Всього ідей",
    topCategory: "Топ категорія",
    popularTitle: "Найпопулярніші",
    noIdeas: "Ідей не знайдено.",
    adminLogin: "Вхід адміністратора",
    adminActive: "Режим адміна активний",
    deleteConfirm: "Ви впевнені, що хочете видалити цю ідею?",
    adminReply: "Відповідь адміна",
    replyPlaceholder: "Напишіть відповідь...",
    saveReply: "Зберегти",
    topIdeasChart: "Топ 5 ідей",
    timelineChart: "Ідеї в часі",
    categoryChart: "Розподіл за категоріями",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Технології",
      [IdeaCategory.COMMUNITY]: "Спільнота",
      [IdeaCategory.SUSTAINABILITY]: "Сталий розвиток",
      [IdeaCategory.EDUCATION]: "Освіта",
      [IdeaCategory.HEALTH]: "Здоров'я",
      [IdeaCategory.ART]: "Мистецтво",
      [IdeaCategory.INCLUSION]: "Інклюзія"
    }
  },
  zh: {
    dashboard: "仪表板",
    addIdea: "添加想法",
    export: "导出至 Excel",
    search: "搜索...",
    generateAI: "AI 头脑风暴",
    submit: "保存想法",
    titlePlaceholder: "想法标题",
    descPlaceholder: "描述您的创新...",
    authorPlaceholder: "您的名字",
    totalIdeas: "总想法数",
    topCategory: "热门类别",
    popularTitle: "最受喜爱",
    noIdeas: "未找到想法。",
    adminLogin: "管理员登录",
    adminActive: "管理员模式已激活",
    deleteConfirm: "您确定要删除这个想法吗？",
    adminReply: "管理员回复",
    replyPlaceholder: "作为管理员回复...",
    saveReply: "保存回复",
    topIdeasChart: "前 5 个想法",
    timelineChart: "想法时间轴",
    categoryChart: "类别分布",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "技术",
      [IdeaCategory.COMMUNITY]: "社区",
      [IdeaCategory.SUSTAINABILITY]: "可持续性",
      [IdeaCategory.EDUCATION]: "教育",
      [IdeaCategory.HEALTH]: "健康",
      [IdeaCategory.ART]: "艺术",
      [IdeaCategory.INCLUSION]: "包容性"
    }
  },
  de: {
    dashboard: "Dashboard",
    addIdea: "Idee hinzufügen",
    export: "Als Excel exportieren",
    search: "Suchen...",
    generateAI: "KI Brainstorming",
    submit: "Idee speichern",
    titlePlaceholder: "Ideentitel",
    descPlaceholder: "Beschreibe deine Innovation...",
    authorPlaceholder: "Dein Name",
    totalIdeas: "Gesamtideen",
    topCategory: "Top-Kategorie",
    popularTitle: "Meistgeliebt",
    noIdeas: "Keine Ideen gefunden.",
    adminLogin: "Admin Login",
    adminActive: "Admin-Modus Aktiv",
    deleteConfirm: "Bist du sicher, dass du diese Idee löschen möchtest?",
    adminReply: "Admin-Antwort",
    replyPlaceholder: "Schreibe eine Antwort...",
    saveReply: "Antwort speichern",
    topIdeasChart: "Top 5 Ideen",
    timelineChart: "Ideen Zeitstrahl",
    categoryChart: "Kategorie-Verteilung",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Technologie",
      [IdeaCategory.COMMUNITY]: "Gemeinschaft",
      [IdeaCategory.SUSTAINABILITY]: "Nachhaltigkeit",
      [IdeaCategory.EDUCATION]: "Bildung",
      [IdeaCategory.HEALTH]: "Gesundheit",
      [IdeaCategory.ART]: "Kunst",
      [IdeaCategory.INCLUSION]: "Inklusion"
    }
  }
};
