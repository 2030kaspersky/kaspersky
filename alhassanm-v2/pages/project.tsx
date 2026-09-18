'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Home, Layers3, Loader2 } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import StatusBadge from '../components/StatusBadge';
import type { Project } from '../data/projects';
import { fetchPublicProject } from '../lib/portfolio';

export default function DynamicProjectPage() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const slug = String(router.query.slug || '');
    if (!slug) {
      setLoading(false);
      return;
    }
    fetchPublicProject(slug)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [router.isReady, router.query.slug]);

  if (loading) {
    return (
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <SiteHeader homePrefix='/' />
        <main className='grid min-h-screen place-items-center pt-[72px]'>
          <div className='text-center'>
            <Loader2 className='mx-auto h-8 w-8 animate-spin text-[var(--primary)]' />
            <p className='mt-4 text-sm text-[var(--muted)]'>جار تحميل المشروع…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <SiteHeader homePrefix='/' />
        <main className='grid min-h-[80vh] place-items-center px-4 pt-[72px] text-center'>
          <div>
            <p className='text-sm font-semibold text-[var(--primary)]'>غير متاح للعامة</p>
            <h1 className='mt-2 text-3xl font-bold'>المشروع غير موجود أو مخفي</h1>
            <p className='mt-4 text-[var(--muted)]'>يمكن أن يكون المشروع موجودًا في السجل لكنه غير مفعّل للعرض العام.</p>
            <a href='/#projects' className='button-primary mt-6'>العودة للمشاريع <ArrowRight className='h-4 w-4' /></a>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{project.name} | الحسن الرقمي</title>
        <meta name='description' content={project.shortDescription} />
      </Head>
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <SiteHeader homePrefix='/' />
        <main className='pt-[72px]'>
          <section className='border-b border-[var(--border)] bg-[var(--surface)]'>
            <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
              <nav aria-label='مسار التنقل' className='flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]'>
                <a href='/' className='inline-flex items-center gap-1 hover:text-[var(--foreground)]'><Home className='h-4 w-4' />الرئيسية</a>
                <span>/</span>
                <a href='/#projects' className='hover:text-[var(--foreground)]'>المشاريع</a>
                <span>/</span>
                <span className='text-[var(--foreground)]'>{project.name}</span>
              </nav>

              <div className='mt-8 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end'>
                <div>
                  <div className='flex flex-wrap items-center gap-3'>
                    <StatusBadge status={project.status} />
                    <span className='tag'>{project.category}</span>
                  </div>
                  <h1 className='mt-5 text-4xl font-extrabold leading-tight sm:text-5xl'>{project.name}</h1>
                  <p className='mt-5 max-w-3xl text-lg leading-9 text-[var(--muted)]'>{project.longDescription || project.shortDescription}</p>
                </div>
                <div className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
                  <p className='text-xs font-semibold text-[var(--primary)]'>حالة الإتاحة</p>
                  <p className='mt-2 text-sm leading-7 text-[var(--muted)]'>
                    {project.url ? 'المشروع متاح عبر رابط نشر خارجي.' : 'المشروع ظاهر في البوابة، لكن لا يوجد رابط تشغيل عام معتمد حاليًا.'}
                  </p>
                  {project.url && (
                    <a href={project.url} target='_blank' rel='noopener noreferrer' className='button-primary mt-5 w-full'>
                      فتح المشروع <ExternalLink className='h-4 w-4' />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className='py-14 sm:py-16'>
            <div className='mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8'>
              <article className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-2'>
                <p className='text-sm font-semibold text-[var(--primary)]'>عن المشروع</p>
                <h2 className='mt-2 text-2xl font-bold'>ملخص العمل</h2>
                <p className='mt-4 leading-8 text-[var(--muted)]'>{project.longDescription || project.shortDescription}</p>
              </article>
              <article className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-6'>
                <p className='text-sm font-semibold text-[var(--primary)]'>المجال</p>
                <h2 className='mt-2 text-xl font-bold'>{project.category}</h2>
                <div className='mt-4 flex flex-wrap gap-2'>{project.tags.map(tag => <span key={tag} className='tag'>{tag}</span>)}</div>
              </article>
            </div>
          </section>

          <section className='border-y border-[var(--border)] bg-[var(--surface)] py-14 sm:py-16'>
            <div className='mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-8'>
              <div>
                <p className='text-sm font-semibold text-[var(--primary)]'>خصائص العرض</p>
                <h2 className='mt-2 text-3xl font-bold'>جزء من السجل المركزي</h2>
                <p className='mt-4 leading-8 text-[var(--muted)]'>ظهور هذه الصفحة مرتبط مباشرة بقرار الإظهار أو الإخفاء من لوحة الإدارة.</p>
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                {project.highlights.map(item => (
                  <div key={item} className='flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4'>
                    <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-emerald-400' />
                    <span>{item}</span>
                  </div>
                ))}
                <div className='flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4'>
                  <Layers3 className='mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]' />
                  <span>مرتبط بمنظومة alhassanm.sa</span>
                </div>
              </div>
            </div>
          </section>

          <section className='py-12'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <a href='/#projects' className='button-secondary'>العودة إلى جميع المشاريع <ArrowRight className='h-4 w-4' /></a>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
