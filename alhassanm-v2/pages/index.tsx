'use client';

import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Check,
  Clipboard,
  Copy,
  DatabaseZap,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Monogram from '../components/Monogram';
import ProjectCard from '../components/ProjectCard';
import StatusBadge from '../components/StatusBadge';
import FeaturedPreview from '../components/FeaturedPreview';
import { projects as fallbackProjects } from '../data/projects';
import { fetchPublicProjects } from '../lib/portfolio';

const services = [
  [
    GraduationCap,
    'بناء المنصات التعليمية',
    'تجارب رقمية تخدم المدرسة والمعلم والطالب ببنية واضحة.',
  ],
  [
    BarChart3,
    'تحليل البيانات ولوحات القيادة',
    'تحويل البيانات إلى مؤشرات تساعد على القراءة واتخاذ القرار.',
  ],
  [
    DatabaseZap,
    'أتمتة وإدارة السجلات',
    'تقليل العمل المتكرر وتنظيم السجلات وتسهيل الاسترجاع.',
  ],
  [
    Workflow,
    'تصميم الحلول المدرسية الرقمية',
    'حلول تبدأ من احتياج ميداني حقيقي وتنتهي بأداة عملية.',
  ],
  [
    FileCheck2,
    'أدوات الاختبارات والتقييم',
    'تنظيم التقييم والنتائج والمهارات المستهدفة في مسار أوضح.',
  ],
  [
    LayoutDashboard,
    'تحويل الإجراءات إلى تدفقات رقمية',
    'إعادة تصميم الخطوات اليدوية لتصبح أسرع وأكثر اتساقًا.',
  ],
] as const;

const subdomains = [
  'nabdh.alhassanm.sa',
  'basirah.alhassanm.sa',
  'himmah.alhassanm.sa',
  'rikaz.alhassanm.sa',
  'apps.alhassanm.sa',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [status, setStatus] = useState('الكل');
  const [notice, setNotice] = useState('');
  const [catalog, setCatalog] = useState(fallbackProjects);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicProjects()
      .then(items => {
        if (!cancelled && items.length) setCatalog(items);
      })
      .catch(() => {
        // Keep the bundled fallback so the public portal remains available.
      })
      .finally(() => {
        if (!cancelled) setCatalogReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredCatalog = useMemo(
    () => catalog.filter(project => project.featured),
    [catalog]
  );
  const categories = useMemo(
    () => ['الكل', ...Array.from(new Set(catalog.map(project => project.category)))],
    [catalog]
  );
  const statuses = useMemo(
    () => ['الكل', ...Array.from(new Set(catalog.map(project => project.status)))],
    [catalog]
  );
  const publishedTotal = useMemo(
    () => catalog.filter(project => project.status === 'منشور').length,
    [catalog]
  );
  const categoryTotal = useMemo(
    () => new Set(catalog.map(project => project.category)).size,
    [catalog]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return catalog.filter(project => {
      const matchesQuery =
        !normalized ||
        (
          project.name +
          ' ' +
          project.shortDescription +
          ' ' +
          project.tags.join(' ')
        )
          .toLocaleLowerCase('ar')
          .includes(normalized);
      const matchesCategory =
        category === 'الكل' || project.category === category;
      const matchesStatus = status === 'الكل' || project.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [query, category, status, catalog]);

  const copyValue = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(message);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      setNotice(message);
    }
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <>
      <Head>
        <title>الحسن الرقمي | بوابة الحسن علي ماطر مدخلي</title>
        <meta
          name="description"
          content="البوابة الرسمية لمشاريع الحسن علي ماطر مدخلي التقنية والتعليمية: منصات، تحليلات، لوحات مؤشرات، وأدوات رقمية تحت alhassanm.sa."
        />
        <link rel="canonical" href="https://alhassanm.sa/" />
        <meta property="og:title" content="الحسن الرقمي | alhassanm.sa" />
        <meta
          property="og:description"
          content="بوابة مركزية للمشاريع التقنية والتعليمية والحلول الرقمية."
        />
        <meta property="og:url" content="https://alhassanm.sa/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alhassanm.sa/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://alhassanm.sa/og-image.svg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              name: 'الحسن الرقمي',
              url: 'https://alhassanm.sa/',
              mainEntity: {
                '@type': 'Person',
                name: 'الحسن علي ماطر مدخلي',
                url: 'https://alhassanm.sa/',
              },
              isPartOf: {
                '@type': 'WebSite',
                name: 'الحسن الرقمي',
                url: 'https://alhassanm.sa/',
                inLanguage: 'ar',
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader observeSections />
        <main>
          <section id="home" className="scroll-mt-24 pt-[72px]">
            <div className="mx-auto grid min-h-[570px] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
              <div className="animate-enter">
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                  <span className="h-px w-8 bg-[var(--primary)]" />
                  الحسن الرقمي · alhassanm.sa
                </p>
                <h1 className="mt-5 max-w-3xl text-[2.35rem] font-extrabold leading-[1.35] sm:text-5xl lg:text-[3.45rem]">
                  حلول رقمية تُبنى
                  <br />
                  <span className="text-[var(--primary)]">من احتياج حقيقي</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  أصمم وأطوّر حلولًا في التعليم الرقمي، تحليل البيانات، تطوير
                  المنصات، وأتمتة الإجراءات لتصبح الأعمال أوضح وأسهل.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#projects" className="button-primary">
                    استعرض المشاريع <ArrowLeft className="h-4 w-4" />
                  </a>
                  <a href="#identity" className="button-secondary">
                    تعرّف على الهوية الرقمية <ShieldCheck className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 border-t border-[var(--border)] pt-5">
                  {[
                    [catalog.length, 'مشروعًا'],
                    [publishedTotal, 'مشاريع منشورة'],
                    [categoryTotal, 'مجالات'],
                  ].map(([value, label]) => (
                    <div key={String(label)}>
                      <strong className="block text-2xl text-[var(--primary)]">
                        {Number(value).toLocaleString('ar-SA')}
                      </strong>
                      <span className="text-xs text-[var(--muted)]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-enter relative mx-auto w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monogram className="h-12 w-12 text-[var(--primary)]" />
                    <div>
                      <strong className="block">منظومة الحسن الرقمية</strong>
                      <span className="text-xs text-[var(--primary)]" dir="ltr">
                        alhassanm.sa
                      </span>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div className="my-5 h-px bg-[var(--border)]" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-4">
                    <p className="text-xs text-[var(--muted)]">
                      المحور المركزي
                    </p>
                    <p className="mt-1 font-bold">
                      حلول تعليمية وتقنية مترابطة
                    </p>
                  </div>
                  {featuredCatalog.slice(0, 4).map(project => (
                    <div
                      key={project.slug}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3"
                    >
                      <span className="mb-2 block h-1 w-8 rounded-full bg-[var(--primary)]" />
                      <p className="text-sm font-bold">{project.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {project.category}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  منظومة تنمو تدريجيًا تحت نطاق واحد
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="مشاريع مميزة"
                title="منظومات رقمية ذات غرض واضح"
                description="خمسة مشاريع تمثل محاور العمل الأساسية، مع معاينات تفاعلية مصغرة تحاكي طبيعة كل منصة ببيانات تجريبية واضحة."
              />
              <div className="mt-9 grid gap-5 lg:grid-cols-2">
                {featuredCatalog.map(project => (
                  <article
                    key={project.slug}
                    className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
                  >
                    <div className="grid min-h-[300px] sm:grid-cols-[1fr_.75fr]">
                      <div className="flex flex-col p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[var(--primary)]">
                            {project.category}
                          </span>
                          <StatusBadge status={project.status} />
                        </div>
                        <h3 className="mt-5 text-2xl font-bold">
                          {project.name}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                          {project.shortDescription}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-2 pt-6">
                          <a
                            href={'/project/?slug=' + encodeURIComponent(project.slug)}
                            className="button-secondary"
                          >
                            التفاصيل <ArrowLeft className="h-4 w-4" />
                          </a>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button-ghost"
                            >
                              فتح المشروع <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-[var(--border)] bg-[var(--surface)] p-4 sm:border-r sm:border-t-0">
                        <FeaturedPreview project={project} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="جميع المشاريع"
                title="استكشف منظومة الأعمال"
                description="ابحث بالاسم أو الوصف، وصفِّ النتائج حسب المجال وحالة النشر."
              />
              <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
                <label className="relative">
                  <span className="sr-only">البحث في المشاريع</span>
                  <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="ابحث في المشاريع..."
                    className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pr-12 pl-4 text-sm outline-none transition focus:border-cyan-300/50"
                  />
                </label>
                <div
                  className="grid grid-cols-2 gap-2 sm:flex"
                  role="group"
                  aria-label="تصفية حسب الحالة"
                >
                  {statuses.map(item => (
                    <button
                      key={item}
                      onClick={() => setStatus(item)}
                      aria-pressed={status === item}
                      className={
                        status === item ? 'filter-active' : 'filter-button'
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="mt-3 flex gap-2 overflow-x-auto pb-2"
                role="group"
                aria-label="تصفية حسب الفئة"
              >
                {categories.map(item => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={
                      category === item ? 'filter-active' : 'filter-button'
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p
                className="mt-4 text-sm text-[var(--muted)]"
                aria-live="polite"
              >
                {!catalogReady && (
                  <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" aria-label="جار تحديث السجل" />
                )}
                {filtered.length.toLocaleString('ar-SA')} من{' '}
                {catalog.length.toLocaleString('ar-SA')} مشروعًا
              </p>
              {filtered.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map(project => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] py-14 text-center">
                  <Search className="mx-auto h-7 w-7 text-[var(--muted)]" />
                  <p className="mt-3 font-medium">لا توجد نتائج مطابقة</p>
                  <button
                    className="button-ghost mt-3"
                    onClick={() => {
                      setQuery('');
                      setCategory('الكل');
                      setStatus('الكل');
                    }}
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              )}
            </div>
          </section>

          <section
            id="services"
            className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="الخدمات الرقمية"
                title="من الفكرة إلى أداة قابلة للاستخدام"
                description="قدرات مترابطة لبناء حلول عملية بهيكل واضح وتجربة استخدام مدروسة."
              />
              <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
                {services.map(([Icon, title, text]) => (
                  <article key={title} className="bg-[var(--background)] p-6">
                    <Icon className="h-6 w-6 text-[var(--primary)]" />
                    <h3 className="mt-4 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="latest" className="scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="أحدث الأعمال"
                title="ما يجري تطويره الآن"
                description="نظرة قابلة للتوسع على أحدث المشاريع والتحديثات ضمن منظومة 2026."
              />
              <div className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {catalog.slice(0, 4).map((project, index) => (
                  <a
                    key={project.slug}
                    href={'/project/?slug=' + encodeURIComponent(project.slug)}
                    className="group grid gap-3 py-5 sm:grid-cols-[64px_1fr_auto] sm:items-center"
                  >
                    <span className="text-sm font-bold text-[var(--primary)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <strong className="block text-lg">{project.name}</strong>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {project.shortDescription}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-sm text-[var(--muted)] group-hover:text-[var(--primary)]">
                      {project.status}
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.65fr_1.35fr] lg:items-center lg:px-8">
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">
                  منظومة النطاقات
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  نطاق واحد، مسارات متعددة
                </h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">
                  بنية مخطط لها لتجميع المنصات تدريجيًا تحت alhassanm.sa.
                  النطاقات الفرعية المعروضة قيد الربط وليست خدمات عاملة حاليًا.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                <div className="mx-auto flex w-fit items-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3">
                  <Network className="h-5 w-5 text-[var(--primary)]" />
                  <strong dir="ltr">alhassanm.sa</strong>
                </div>
                <div className="mx-auto h-8 w-px bg-[var(--border)]" />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {subdomains.map(domain => (
                    <div
                      key={domain}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-center"
                    >
                      <p className="break-all text-xs font-semibold" dir="ltr">
                        {domain}
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        قيد الربط
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="identity" className="scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-8">
              <div>
                <SectionHeading
                  label="الهوية الرقمية"
                  title="نقطة الوصول الرسمية والموثوقة"
                  description="يمثل alhassanm.sa المظلة الرقمية لأعمال الحسن علي ماطر مدخلي، وستنتقل المنصات إليه تدريجيًا عند اكتمال الربط."
                />
                <div className="mt-5 flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Check className="h-5 w-5 text-emerald-400" />
                  هوية موحدة للمشاريع والمنصات
                </div>
              </div>
              <div className="rounded-xl border border-cyan-300/20 bg-[var(--card)] p-6 shadow-2xl sm:p-8">
                <div className="flex items-center gap-4">
                  <Monogram className="h-16 w-16 text-[var(--primary)]" />
                  <div>
                    <p className="text-sm text-[var(--muted)]">النطاق الرسمي</p>
                    <p className="mt-1 text-2xl font-bold" dir="ltr">
                      alhassanm.sa
                    </p>
                  </div>
                </div>
                <button
                  className="button-primary mt-6 w-full"
                  onClick={() =>
                    copyValue('alhassanm.sa', 'تم نسخ النطاق بنجاح')
                  }
                >
                  <Copy className="h-4 w-4" />
                  نسخ النطاق
                </button>
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20"
          >
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
              <p className="text-sm font-semibold text-[var(--primary)]">
                تواصل
              </p>
              <h2 className="mt-2 text-3xl font-bold">قناة التواصل الرسمية</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">
                البريد الرسمي ما يزال قيد التجهيز؛ يمكنك نسخ العنوان للاحتفاظ به
                دون أن يوحي ذلك بأنه متاح للاستقبال حاليًا.
              </p>
              <div className="mx-auto mt-7 max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="text-xs text-[var(--muted)]">
                  البريد الرسمي — قيد التجهيز
                </p>
                <p className="mt-2 text-lg font-semibold" dir="ltr">
                  info@alhassanm.sa
                </p>
                <button
                  className="button-secondary mt-4 w-full"
                  onClick={() =>
                    copyValue('info@alhassanm.sa', 'تم نسخ البريد بنجاح')
                  }
                >
                  <Clipboard className="h-4 w-4" />
                  نسخ البريد
                </button>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-emerald-400/30 bg-slate-950 px-4 py-3 text-sm text-white shadow-2xl"
          >
            {notice}
          </div>
        )}
      </div>
    </>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-[var(--primary)]">{label}</p>
      <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}
