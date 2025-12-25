
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

export type SupportedLanguage = 'en' | 'nl' | 'es' | 'de' | 'ar';

export interface LanguageContent {
  dashboard: string;
  ideas: string;
  admin: string;
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
  engagement: string;
  activeCategories: string;
  sortBy: string;
  newest: string;
  mostLoved: string;
  selectIdeaPrompt: string;
  adminOverview: string;
  adminSub: string;
  tableIdea: string;
  tableAuthor: string;
  tableModeration: string;
  tableAction: string;
  delete: string;
  verify: string;
  pwdHint: string;
  aiPromptLabel: string;
  aiInputPlaceholder: string;
  aiThinking: string;
  refineAI: string;
  adoptAI: string;
  titleLabel: string;
  categoryLabel: string;
  descLabel: string;
  authorLabel: string;
  shareTitle: string;
  copyLink: string;
  linkCopied: string;
  categories: Record<IdeaCategory, string>;
}

export const DICTIONARY: Record<SupportedLanguage, LanguageContent> = {
  nl: {
    dashboard: "Dashboard",
    ideas: "Ideeën",
    admin: "Beheer",
    addIdea: "Idee Toevoegen",
    export: "Export (CSV)",
    search: "Zoeken...",
    generateAI: "AI Brainstorm",
    submit: "Idee Opslaan",
    titlePlaceholder: "Titel van je idee",
    descPlaceholder: "Beschrijf je innovatie...",
    authorPlaceholder: "Je naam",
    totalIdeas: "Totaal Ideeën",
    topCategory: "Top Categorie",
    popularTitle: "Meest Geliefd",
    noIdeas: "Geen ideeën gevonden.",
    adminLogin: "Admin Inlog",
    adminActive: "Beheermodus Actief",
    deleteConfirm: "Weet je zeker dat je dit wilt verwijderen?",
    adminReply: "Beheerder Reactie",
    replyPlaceholder: "Schrijf een reactie...",
    saveReply: "Opslaan",
    topIdeasChart: "Top 5 Populaire Ideeën",
    timelineChart: "Ideeën over de Tijd",
    categoryChart: "Verdeling per Categorie",
    engagement: "Totale Betrokkenheid",
    activeCategories: "Actieve Categorieën",
    sortBy: "Sorteer op:",
    newest: "Nieuwste",
    mostLoved: "Meest Geliefd",
    selectIdeaPrompt: "Selecteer een idee voor details",
    adminOverview: "Beheer Overzicht",
    adminSub: "Systeembeheer & Moderatie",
    tableIdea: "Idee",
    tableAuthor: "Auteur",
    tableModeration: "Moderatie Reactie",
    tableAction: "Actie",
    delete: "Verwijder",
    verify: "Verifiëren",
    pwdHint: "Wachtwoord: admin123",
    aiPromptLabel: "Waar wil je over brainstormen?",
    aiInputPlaceholder: "Bijv: Duurzame energie in de wijk...",
    aiThinking: "Gemini denkt na...",
    refineAI: "Verfijn met AI",
    adoptAI: "Dit idee uitwerken",
    titleLabel: "Titel",
    categoryLabel: "Categorie",
    descLabel: "Omschrijving",
    authorLabel: "Auteur",
    shareTitle: "Deel op Social Media",
    copyLink: "Kopieer Link",
    linkCopied: "Link gekopieerd!",
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
    ideas: "Ideas",
    admin: "Admin",
    addIdea: "Add Idea",
    export: "Export (CSV)",
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
    deleteConfirm: "Are you sure you want to delete this?",
    adminReply: "Admin Response",
    replyPlaceholder: "Write a response...",
    saveReply: "Save",
    topIdeasChart: "Top 5 Popular Ideas",
    timelineChart: "Ideas Over Time",
    categoryChart: "Category Distribution",
    engagement: "Total Engagement",
    activeCategories: "Active Categories",
    sortBy: "Sort by:",
    newest: "Newest",
    mostLoved: "Most Loved",
    selectIdeaPrompt: "Select an idea to view details",
    adminOverview: "Admin Overview",
    adminSub: "System Management & Moderation",
    tableIdea: "Idea",
    tableAuthor: "Author",
    tableModeration: "Moderation Reply",
    tableAction: "Action",
    delete: "Delete",
    verify: "Verify",
    pwdHint: "Password: admin123",
    aiPromptLabel: "What do you want to brainstorm about?",
    aiInputPlaceholder: "E.g.: Green energy in the neighborhood...",
    aiThinking: "Gemini is thinking...",
    refineAI: "Refine with AI",
    adoptAI: "Develop this idea",
    titleLabel: "Title",
    categoryLabel: "Category",
    descLabel: "Description",
    authorLabel: "Author",
    shareTitle: "Share on Social Media",
    copyLink: "Copy Link",
    linkCopied: "Link copied!",
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
    ideas: "Ideas",
    admin: "Admin",
    addIdea: "Añadir Idea",
    export: "Exportar (CSV)",
    search: "Buscar...",
    generateAI: "IA Brainstorm",
    submit: "Guardar Idea",
    titlePlaceholder: "Título de la idea",
    descPlaceholder: "Describe tu innovación...",
    authorPlaceholder: "Tu nombre",
    totalIdeas: "Ideas Totales",
    topCategory: "Categoría Principal",
    popularTitle: "Más Queridos",
    noIdeas: "No se encontraron ideas.",
    adminLogin: "Admin Login",
    adminActive: "Modo Admin Activo",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esto?",
    adminReply: "Respuesta de Admin",
    replyPlaceholder: "Escribe una respuesta...",
    saveReply: "Guardar",
    topIdeasChart: "Top 5 Ideas Populares",
    timelineChart: "Ideas en el Tiempo",
    categoryChart: "Distribución por Categoría",
    engagement: "Compromiso Total",
    activeCategories: "Categorías Activas",
    sortBy: "Ordenar por:",
    newest: "Más nuevos",
    mostLoved: "Más amados",
    selectIdeaPrompt: "Selecciona una idea para ver detalles",
    adminOverview: "Resumen de Admin",
    adminSub: "Gestión y Moderación del Sistema",
    tableIdea: "Idea",
    tableAuthor: "Autor",
    tableModeration: "Respuesta de Moderación",
    tableAction: "Acción",
    delete: "Eliminar",
    verify: "Verificar",
    pwdHint: "Contraseña: admin123",
    aiPromptLabel: "¿Sobre qué quieres hacer un brainstorm?",
    aiInputPlaceholder: "Ej: Energía verde en el barrio...",
    aiThinking: "Gemini está pensando...",
    refineAI: "Refinar con IA",
    adoptAI: "Desarrollar esta idea",
    titleLabel: "Título",
    categoryLabel: "Categoría",
    descLabel: "Descripción",
    authorLabel: "Autor",
    shareTitle: "Compartir en Redes Sociales",
    copyLink: "Copiar Enlace",
    linkCopied: "¡Enlace copiado!",
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
  de: {
    dashboard: "Dashboard",
    ideas: "Ideen",
    admin: "Admin",
    addIdea: "Idee hinzufügen",
    export: "Export (CSV)",
    search: "Suchen...",
    generateAI: "KI Brainstorm",
    submit: "Idee speichern",
    titlePlaceholder: "Ideentitel",
    descPlaceholder: "Beschreibe deine Innovation...",
    authorPlaceholder: "Dein Name",
    totalIdeas: "Ideen gesamt",
    topCategory: "Top-Kategorie",
    popularTitle: "Beliebteste",
    noIdeas: "Keine Ideen gefunden.",
    adminLogin: "Admin-Login",
    adminActive: "Admin-Modus aktiv",
    deleteConfirm: "Möchtest du das wirklich löschen?",
    adminReply: "Admin-Antwort",
    replyPlaceholder: "Antwort schreiben...",
    saveReply: "Speichern",
    topIdeasChart: "Top 5 Beliebte Ideen",
    timelineChart: "Ideen im Zeitverlauf",
    categoryChart: "Verteilung nach Kategorie",
    engagement: "Gesamt-Engagement",
    activeCategories: "Aktive Kategorien",
    sortBy: "Sortieren nach:",
    newest: "Neueste",
    mostLoved: "Beliebteste",
    selectIdeaPrompt: "Wähle eine Idee für Details",
    adminOverview: "Admin-Übersicht",
    adminSub: "Systemverwaltung & Moderation",
    tableIdea: "Idee",
    tableAuthor: "Autor",
    tableModeration: "Moderationsantwort",
    tableAction: "Aktion",
    delete: "Löschen",
    verify: "Verifizieren",
    pwdHint: "Passwort: admin123",
    aiPromptLabel: "Worüber möchtest du brainstormen?",
    aiInputPlaceholder: "Z.B.: Grüne Energie im Viertel...",
    aiThinking: "Gemini denkt nach...",
    refineAI: "Mit KI verfeinern",
    adoptAI: "Diese Idee ausarbeiten",
    titleLabel: "Titel",
    categoryLabel: "Kategorie",
    descLabel: "Beschreibung",
    authorLabel: "Autor",
    shareTitle: "Auf Social Media teilen",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "Technologie",
      [IdeaCategory.COMMUNITY]: "Gemeinschaft",
      [IdeaCategory.SUSTAINABILITY]: "Nachhaltigkeit",
      [IdeaCategory.EDUCATION]: "Bildung",
      [IdeaCategory.HEALTH]: "Gesundheit",
      [IdeaCategory.ART]: "Kunst",
      [IdeaCategory.INCLUSION]: "Inklusion"
    }
  },
  ar: {
    dashboard: "لوحة القيادة",
    ideas: "الأفكار",
    admin: "الإدارة",
    addIdea: "إضافة فكرة",
    export: "تصدير (CSV)",
    search: "بحث...",
    generateAI: "عصف ذهني ذكي",
    submit: "حفظ الفكرة",
    titlePlaceholder: "عنوان الفكرة",
    descPlaceholder: "صف ابتكارك...",
    authorPlaceholder: "اسمك",
    totalIdeas: "إجمالي الأفكار",
    topCategory: "الفئة الأعلى",
    popularTitle: "الأكثر إعجاباً",
    noIdeas: "لم يتم العثور على أفكار.",
    adminLogin: "دخول المسؤول",
    adminActive: "وضع المسؤول نشط",
    deleteConfirm: "هل أنت متأكد من الحذف؟",
    adminReply: "رد الإدارة",
    replyPlaceholder: "اكتب رداً...",
    saveReply: "حفظ",
    topIdeasChart: "أفضل 5 أفكار",
    timelineChart: "الأفكار مع مرور الوقت",
    categoryChart: "توزيع الفئات",
    engagement: "إجمالي التفاعل",
    activeCategories: "الفئات النشطة",
    sortBy: "ترتيب حسب:",
    newest: "الأحدث",
    mostLoved: "الأكثر إعجاباً",
    selectIdeaPrompt: "اختر فكرة لعرض التفاصيل",
    adminOverview: "نظرة عامة على الإدارة",
    adminSub: "إدارة النظام والاعتدال",
    tableIdea: "الفكرة",
    tableAuthor: "المؤلف",
    tableModeration: "رد الاعتدال",
    tableAction: "الإجراء",
    delete: "حذف",
    verify: "تحقق",
    pwdHint: "كلمة المرور: admin123",
    aiPromptLabel: "ما الذي تريد العصف الذهني حوله؟",
    aiInputPlaceholder: "مثال: الطاقة الخضراء في الحي...",
    aiThinking: "جيميني يفكر...",
    refineAI: "تحسين بالذكاء الاصطناعي",
    adoptAI: "تطوير هذه الفكرة",
    titleLabel: "العنوان",
    categoryLabel: "الفئة",
    descLabel: "الوصف",
    authorLabel: "المؤلف",
    shareTitle: "مشاركة على التواصل الاجتماعي",
    copyLink: "نسخ الرابط",
    linkCopied: "تم نسخ الرابط!",
    categories: {
      [IdeaCategory.TECHNOLOGY]: "تكنولوجيا",
      [IdeaCategory.COMMUNITY]: "مجتمع",
      [IdeaCategory.SUSTAINABILITY]: "استدامة",
      [IdeaCategory.EDUCATION]: "تعليم",
      [IdeaCategory.HEALTH]: "صحة",
      [IdeaCategory.ART]: "فن",
      [IdeaCategory.INCLUSION]: "شمول"
    }
  }
};
