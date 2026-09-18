import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Home,
  Layers3,
} from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import ProjectCard from '../../components/ProjectCard';
import StatusBadge from '../../components/StatusBadge';
import { projects, type Project } from '../../data/projects';

type Props = {
  project: Project;
  related: Project[];
};

export default function ProjectDetails({ project, related }: Props) {
  const canonical = 'https://alhassanm.sa/projects/' + project.slug + '/';
  return (
    <>
      <Head>
        <title>{project.name} | الحسن الرقمي</title>
        <meta name="description" content={project.shortDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={project.name + ' | الحسن الرقمي'} />
        <meta property="og:description" content={project.shortDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alhassanm.sa/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: project.name,
              description: project.shortDescription,
              url: canonical,
              creator: {
                '@type': 'Person',
                name: 'الحسن علي ماطر مدخلي',
                url: 'https://alhassanm.sa/',
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader homePrefix="../../" />
        <main className="pt-[72px]">
          <section className="border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <nav
                aria-label="مسار التنقل"
                className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]"
              >
                <a
                  href="../../"
                  className="inline-flex items-center gap-1 hover:text-[var(--foreground)]"
                >
                  <Home className="h-4 w-4" />
                  الرئيسية
                </a>
                <span>/</span>
                <a
                  href="../../#projects"
                  className="hover:text-[var(--foreground)]"
                >
                  المشاريع
                </a>
                <span>/</span>
                <span className="text-[var(--foreground)]">{project.name}</span>
              </nav>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={project.status} />
                    <span className="tag">{project.category}</span>
                    <span className="tag">{project.year}</span>
                  </div>
                  <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                    {project.name}
                  </h1>
                  <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--muted)]">
                    {project.longDescription}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    حالة الإتاحة
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {project.url
                      ? 'المشروع منشور ويمكن فتحه من الرابط الخارجي المعتمد.'
                      : project.status === 'داخلي'
                        ? 'أداة داخلية لا يتوفر لها رابط عام.'
                        : 'المشروع قيد التطوير والربط، ولا يوجد رابط عام معتمد حاليًا.'}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary mt-5 w-full"
                    >
                      فتح المشروع <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="py-14 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
              <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-2">
                <p className="text-sm font-semibold text-[var(--primary)]">
                  الاحتياج الذي يخدمه
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  لماذا بُني هذا المشروع؟
                </h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">
                  {project.need}
                </p>
              </article>
              <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <p className="text-sm font-semibold text-[var(--primary)]">
                  المجال
                </p>
                <h2 className="mt-2 text-xl font-bold">{project.category}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-8">
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">
                  أبرز الخصائص
                </p>
                <h2 className="mt-2 text-3xl font-bold">نطاق عملي واضح</h2>
                <p className="mt-4 leading-8 text-[var(--muted)]">
                  تعكس هذه النقاط طبيعة المشروع الحالية دون إضافة ادعاءات غير
                  موثقة.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.highlights.map(item => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
                  <span>جزء من منظومة alhassanm.sa الرقمية</span>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    مشاريع أخرى قد تهمك
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    تابع استكشاف المنظومة
                  </h2>
                </div>
                <a href="../../#projects" className="button-secondary">
                  العودة للمشاريع <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {related.map(item => (
                  <ProjectCard key={item.slug} project={item} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map(project => ({ params: { slug: project.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug || '');
  const project = projects.find(item => item.slug === slug);
  if (!project) return { notFound: true };
  const related = projects
    .filter(
      item =>
        item.slug !== project.slug &&
        (item.category === project.category || item.featured)
    )
    .slice(0, 3);
  return { props: { project, related } };
};
