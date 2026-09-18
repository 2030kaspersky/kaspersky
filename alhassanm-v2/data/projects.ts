export type ProjectStatus = 'منشور' | 'قيد التطوير' | 'داخلي';

export type Project = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  need: string;
  category: string;
  status: ProjectStatus;
  url?: string;
  featured: boolean;
  tags: string[];
  highlights: string[];
  year: '2026';
  accent: 'cyan' | 'teal' | 'blue' | 'gold' | 'violet' | 'green';
};

export const projects: Project[] = [
  {
    slug: 'nabdh-madrasati',
    name: 'نبض مدرستي',
    shortDescription:
      'لوحة مؤشرات تساعد على قراءة أداء منصة مدرستي بصورة مباشرة ومنظمة.',
    longDescription:
      'مساحة رقمية تجمع مؤشرات منصة مدرستي في عرض واضح يدعم المتابعة ويختصر الوقت اللازم لقراءة البيانات.',
    need: 'توزع مؤشرات الأداء وصعوبة الوصول إلى قراءة سريعة تساعد فرق المدرسة على متابعة النشاط الرقمي.',
    category: 'لوحات مؤشرات',
    status: 'منشور',
    url: 'https://app-iawi8m.v2.appdeploy.ai/',
    featured: true,
    tags: ['مؤشرات', 'تحليل بيانات', 'تعليم رقمي'],
    highlights: [
      'عرض مركزي للمؤشرات',
      'قراءة سريعة للحالة',
      'واجهة مهيأة للمتابعة',
    ],
    year: '2026',
    accent: 'cyan',
  },
  {
    slug: 'basirah',
    name: 'بصيرة',
    shortDescription:
      'تحويل الملفات والنتائج إلى قراءة تحليلية قابلة للفهم والاستفادة.',
    longDescription:
      'أداة تحليل بيانات تهدف إلى تنظيم النتائج وعرضها في سياق بصري واضح يساعد على اكتشاف الأنماط ودعم القرار.',
    need: 'تحتاج البيانات الخام إلى معالجة وعرض مبسط حتى تصبح مفيدة في المتابعة واتخاذ القرار.',
    category: 'تحليل بيانات',
    status: 'قيد التطوير',
    featured: true,
    tags: ['تحليل', 'تقارير', 'رؤى'],
    highlights: [
      'تنظيم مصادر البيانات',
      'تلخيص النتائج',
      'مؤشرات قابلة للمراجعة',
    ],
    year: '2026',
    accent: 'teal',
  },
  {
    slug: 'himmah',
    name: 'هِمّة',
    shortDescription: 'منصة موحدة للإنجاز والنشاط المدرسي وتوثيق المبادرات.',
    longDescription:
      'منظومة رقمية لتنظيم الأنشطة والإنجازات والمبادرات المدرسية، مع مسار واضح للتوثيق والمتابعة.',
    need: 'تعدد قنوات توثيق الإنجازات وصعوبة الرجوع إلى سجل منظم للنشاط المدرسي.',
    category: 'منصات تعليمية',
    status: 'قيد التطوير',
    featured: true,
    tags: ['إنجاز', 'نشاط مدرسي', 'توثيق'],
    highlights: ['سجل موحد للإنجاز', 'تنظيم المبادرات', 'متابعة حالة التوثيق'],
    year: '2026',
    accent: 'blue',
  },
  {
    slug: 'rikaz',
    name: 'ركاز',
    shortDescription: 'سجل رقمي منظم يوثق إنجازات المعلم ومسيرته المهنية.',
    longDescription:
      'حل إداري مبسط يجمع إنجازات المعلم وأدلته المهنية في سجل قابل للتنظيم والمراجعة.',
    need: 'تشتت أدلة الإنجاز وصعوبة حفظها واستعادتها ضمن بنية موحدة وواضحة.',
    category: 'أنظمة إدارية',
    status: 'قيد التطوير',
    featured: true,
    tags: ['سجل مهني', 'توثيق', 'إدارة'],
    highlights: ['تصنيف الإنجازات', 'حفظ الأدلة', 'عرض منظم للمسيرة'],
    year: '2026',
    accent: 'gold',
  },
  {
    slug: 'school-top-ten',
    name: 'العشرة الأوائل',
    shortDescription:
      'واجهة مرنة للاحتفاء بالطلاب المتفوقين وعرض النتائج المتميزة.',
    longDescription:
      'منصة عرض مدرسية تقدم أسماء الطلاب المتفوقين بصورة واضحة ومناسبة للشاشات والمشاركة الرقمية.',
    need: 'الحاجة إلى طريقة رقمية منظمة وجذابة لإبراز التفوق الدراسي دون تعقيد.',
    category: 'منصات تعليمية',
    status: 'منشور',
    url: 'https://school-top10-platform.onrender.com/school/kasper-2026',
    featured: true,
    tags: ['تفوق', 'نتائج', 'عرض رقمي'],
    highlights: [
      'عرض واضح للنتائج',
      'تجربة مناسبة للشاشات',
      'وصول مباشر للمحتوى',
    ],
    year: '2026',
    accent: 'violet',
  },
  {
    slug: 'najran-schools-directory',
    name: 'دليل مدارس نجران',
    shortDescription: 'دليل رقمي سريع للوصول إلى بيانات مدارس المنطقة.',
    longDescription:
      'واجهة بحث واستكشاف تجمع معلومات المدارس وتسهّل الوصول إليها ضمن دليل رقمي مبسط.',
    need: 'الحاجة إلى نقطة وصول واحدة تختصر البحث المتفرق عن معلومات المدارس.',
    category: 'أدلة رقمية',
    status: 'منشور',
    url: 'https://najran-schools-directory.pages.dev',
    featured: false,
    tags: ['دليل', 'بحث', 'مدارس'],
    highlights: ['بحث مبسط', 'تنظيم البيانات', 'وصول سريع'],
    year: '2026',
    accent: 'green',
  },
  {
    slug: 'parents-directory',
    name: 'دليل أولياء الأمور',
    shortDescription: 'مرجع رقمي مبسط للخدمات والمعلومات التي تهم الأسرة.',
    longDescription:
      'دليل منظم يضع المعلومات والخدمات ذات الصلة بولي الأمر في تجربة وصول مباشرة وواضحة.',
    need: 'تشتت المعلومات التي يحتاجها أولياء الأمور بين مصادر متعددة.',
    category: 'أدلة رقمية',
    status: 'منشور',
    url: 'https://parents-directory-khalid.pages.dev',
    featured: false,
    tags: ['أولياء الأمور', 'دليل', 'خدمات'],
    highlights: ['تصنيف المحتوى', 'وصول مباشر', 'واجهة مبسطة'],
    year: '2026',
    accent: 'cyan',
  },
  {
    slug: 'technical-readiness',
    name: 'جاهزية تقنية',
    shortDescription:
      'أداة داخلية لقياس الجاهزية التقنية ومتابعة عناصر التحسين.',
    longDescription:
      'أداة تقييم تساعد على تنظيم عناصر الجاهزية ورصد الملاحظات وتحديد أولويات التحسين التقني.',
    need: 'الحاجة إلى تقييم منظم بدل المتابعة المتفرقة لعناصر التجهيز والجاهزية.',
    category: 'أدوات تحليل',
    status: 'داخلي',
    featured: false,
    tags: ['تقييم', 'جاهزية', 'متابعة'],
    highlights: ['قائمة تقييم منظمة', 'تحديد جوانب التحسين', 'متابعة داخلية'],
    year: '2026',
    accent: 'teal',
  },
  {
    slug: 'class-coverage',
    name: 'نظام انتظار الحصص',
    shortDescription: 'تنظيم حصص الانتظار وتوزيعها ومتابعتها بمرونة.',
    longDescription:
      'نظام إداري داخلي يساند توزيع حصص الانتظار وتسجيلها ضمن مسار واضح وسهل المتابعة.',
    need: 'العمل اليدوي في توزيع حصص الانتظار قد يسبب تكرارًا وصعوبة في التتبع.',
    category: 'أنظمة إدارية',
    status: 'داخلي',
    featured: false,
    tags: ['حصص', 'جدولة', 'إدارة'],
    highlights: ['تنظيم التوزيع', 'سجل للمتابعة', 'تقليل التكرار'],
    year: '2026',
    accent: 'blue',
  },
  {
    slug: 'school-healthcare',
    name: 'الرعاية الصحية المدرسية',
    shortDescription: 'تنظيم السجلات والمتابعات الصحية في البيئة المدرسية.',
    longDescription:
      'حل تنظيمي لتجميع المتابعات والسجلات الصحية المدرسية ضمن واجهة موحدة ومحكومة.',
    need: 'الحاجة إلى تنظيم المتابعات الصحية وتسهيل الرجوع إلى السجلات المرتبطة بها.',
    category: 'أنظمة إدارية',
    status: 'قيد التطوير',
    featured: false,
    tags: ['صحة مدرسية', 'سجلات', 'متابعة'],
    highlights: ['تنظيم السجلات', 'متابعة الحالات', 'وصول محكوم'],
    year: '2026',
    accent: 'green',
  },
  {
    slug: 'smart-admin-records',
    name: 'السجلات الإدارية الذكية',
    shortDescription: 'أتمتة السجلات اليومية وتسهيل الوصول إلى المعلومات.',
    longDescription:
      'منظومة إدارية تهدف إلى تحويل السجلات المتكررة إلى تدفقات رقمية أكثر تنظيمًا وسهولة في الاسترجاع.',
    need: 'تستهلك السجلات اليدوية وقتًا متكررًا وتزيد صعوبة البحث والمراجعة.',
    category: 'أنظمة إدارية',
    status: 'قيد التطوير',
    featured: false,
    tags: ['أتمتة', 'سجلات', 'إجراءات'],
    highlights: ['تقليل العمل المتكرر', 'تنظيم السجلات', 'بحث واسترجاع أسرع'],
    year: '2026',
    accent: 'violet',
  },
  {
    slug: 'e-assessment',
    name: 'الاختبارات والتقييم الإلكتروني',
    shortDescription: 'إنشاء تقييمات رقمية وقراءة النتائج بكفاءة.',
    longDescription:
      'منصة تعليمية لتجهيز الاختبارات الإلكترونية وتنظيم نتائجها وتحويلها إلى قراءة أوضح للمتابعة.',
    need: 'الحاجة إلى ربط إنشاء الاختبار بقراءة النتائج والمهارات المستهدفة ضمن مسار رقمي واحد.',
    category: 'منصات تعليمية',
    status: 'قيد التطوير',
    featured: false,
    tags: ['اختبارات', 'تقييم', 'نتائج'],
    highlights: ['إنشاء تقييمات رقمية', 'تنظيم النتائج', 'متابعة المهارات'],
    year: '2026',
    accent: 'gold',
  },
];

export const featuredProjects = projects.filter(project => project.featured);
export const publishedCount = projects.filter(
  project => project.status === 'منشور'
).length;
export const projectCategories = [
  'الكل',
  ...Array.from(new Set(projects.map(project => project.category))),
];
export const projectStatuses = ['الكل', 'منشور', 'قيد التطوير', 'داخلي'];
export const categoryCount = new Set(projects.map(project => project.category))
  .size;
