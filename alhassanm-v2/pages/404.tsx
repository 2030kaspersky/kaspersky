import Head from 'next/head';
import { ArrowRight, SearchX } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>الصفحة غير موجودة | الحسن الرقمي</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader homePrefix="/" />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 pt-[72px]">
          <div className="max-w-lg text-center">
            <SearchX className="mx-auto h-12 w-12 text-[var(--primary)]" />
            <p className="mt-5 text-sm font-semibold text-[var(--primary)]">
              خطأ 404
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">الصفحة غير موجودة</h1>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              قد يكون الرابط قد تغيّر أو أن الصفحة المطلوبة غير متاحة ضمن
              البوابة.
            </p>
            <a href="/" className="button-primary mt-6">
              العودة إلى الرئيسية <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
