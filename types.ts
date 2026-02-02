export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  mimeType: string;
  data: string; // base64
  name: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date;
  messages: Message[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  updatedAt: Date;
}

export interface User {
  name: string;
  plan: 'Free' | 'Pro';
  avatarUrl?: string;
}

export interface Settings {
  fullName: string;
  nickname: string;
  workFunction: string;
  preferences: string;
  notifications: boolean;
  allowTraining: boolean;
  theme: 'light' | 'auto' | 'dark';
  font: 'default' | 'sans' | 'system' | 'dyslexic';
  language: 'en' | 'ar';
}

export type ViewState = 'chat' | 'chats' | 'projects' | 'settings';

export type ModelType = 'fast' | 'pro';

export const MOCK_CHATS: ChatSession[] = [];

export const DEFAULT_SETTINGS: Settings = {
  fullName: 'Samer',
  nickname: 'Samer',
  workFunction: '',
  preferences: '',
  notifications: true,
  allowTraining: true,
  theme: 'dark',
  font: 'default',
  language: 'en'
};

// Translation Dictionary
export const TRANSLATIONS = {
  en: {
    newChat: 'New chat',
    chats: 'Chats',
    projects: 'Projects',
    artifacts: 'Artifacts',
    code: 'Code',
    recents: 'Recents',
    freePlan: 'Free plan',
    upgrade: 'Upgrade',
    backAtIt: 'Back at it,',
    placeholder: 'How can I help you today?',
    caution: 'biaza can make mistakes. Please use with caution.',
    settings: 'Settings',
    general: 'General',
    account: 'Account',
    privacy: 'Privacy',
    billing: 'Billing',
    capabilities: 'Capabilities',
    connectors: 'Connectors',
    biazaCode: 'biaza Code',
    profile: 'Profile',
    fullName: 'Full name',
    nickname: 'What should biaza call you?',
    workDesc: 'What best describes your work?',
    preferences: 'What personal preferences should biaza consider?',
    prefHint: 'Your preferences will apply to all conversations.',
    notifications: 'Notifications',
    responseComp: 'Response completions',
    responseHint: 'Get notified when biaza has finished a response.',
    appearance: 'Appearance',
    colorMode: 'Color mode',
    chatFont: 'Chat font',
    language: 'Language / اللغة',
    interfaceLang: 'Interface Language',
    comingSoon: 'Coming Soon',
    logout: 'Log out',
    deleteAccount: 'Delete Account',
    exportData: 'Export Data',
    paymentMethods: 'Payment Methods',
    invoices: 'Invoices',
    usage: 'Usage',
    allowTraining: 'Allow training on my data',
    betaFeatures: 'Beta Features',
    connectedApps: 'Connected Apps',
    enableCode: 'Enable biaza Code execution'
  },
  ar: {
    newChat: 'محادثة جديدة',
    chats: 'المحادثات',
    projects: 'المشاريع',
    artifacts: 'التحف',
    code: 'الكود',
    recents: 'الأخيرة',
    freePlan: 'خطة مجانية',
    upgrade: 'ترقية',
    backAtIt: 'أهلاً بعودتك،',
    placeholder: 'كيف يمكنني مساعدتك اليوم؟',
    caution: 'قد يرتكب biaza أخطاء. يرجى الاستخدام بحذر.',
    settings: 'الإعدادات',
    general: 'عام',
    account: 'الحساب',
    privacy: 'الخصوصية',
    billing: 'الفوترة',
    capabilities: 'القدرات',
    connectors: 'الموصلات',
    biazaCode: 'كود biaza',
    profile: 'الملف الشخصي',
    fullName: 'الاسم الكامل',
    nickname: 'ماذا يجب أن يناديك biaza؟',
    workDesc: 'ما هو أفضل وصف لعملك؟',
    preferences: 'ما هي التفضيلات الشخصية التي يجب أن يراعيها biaza؟',
    prefHint: 'ستنطبق تفضيلاتك على جميع المحادثات.',
    notifications: 'الإشعارات',
    responseComp: 'اكتمال الرد',
    responseHint: 'احصل على إشعار عند انتهاء biaza من الرد.',
    appearance: 'المظهر',
    colorMode: 'وضع الألوان',
    chatFont: 'خط المحادثة',
    language: 'اللغة / Language',
    interfaceLang: 'لغة الواجهة',
    comingSoon: 'قريباً',
    logout: 'تسجيل الخروج',
    deleteAccount: 'حذف الحساب',
    exportData: 'تصدير البيانات',
    paymentMethods: 'طرق الدفع',
    invoices: 'الفواتير',
    usage: 'الاستخدام',
    allowTraining: 'السماح بالتدريب على بياناتي',
    betaFeatures: 'ميزات تجريبية',
    connectedApps: 'التطبيقات المتصلة',
    enableCode: 'تفعيل تنفيذ كود biaza'
  }
};