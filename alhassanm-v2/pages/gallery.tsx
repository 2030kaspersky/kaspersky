'use client';

import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Film,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Play,
  Search,
  X,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import {
  fetchGallery,
  galleryMediaUrl,
  type GalleryAlbum,
  type GalleryItem,
} from '../lib/gallery';

type FilterType = 'الكل' | 'image' | 'video';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumId, setAlbumId] = useState('all');
  const [mediaType, setMediaType] = useState<FilterType>('الكل');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery()
      .then(data => {
        setAlbums(data.albums);
        setItems(data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [active]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return items.filter(item => {
      const matchesAlbum = albumId === 'all' || item.album_id === albumId;
      const matchesType = mediaType === 'الكل' || item.media_type === mediaType;
      const matchesQuery =
        !needle ||
        (item.title + ' ' + (item.description || ''))
          .toLocaleLowerCase('ar')
          .includes(needle);
      return matchesAlbum && matchesType && matchesQuery;
    });
  }, [items, albumId, mediaType, query]);

  const activeAlbum = albums.find(album => album.id === albumId);

  return (
    <>
      <Head>
        <title>معرض الأعمال | الحسن الرقمي</title>
        <meta
          name='description'
          content='معرض أعمال الحسن علي ماطر مدخلي: تصاميم، صور، واجهات رقمية، ومقاطع فيديو تُعرض داخل البوابة.'
        />
        <meta property='og:title' content='معرض الأعمال | الحسن الرقمي' />
        <meta property='og:description' content='مجموعة مختارة من التصاميم والأعمال المرئية والمشاريع الرقمية.' />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>

      <div className='min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]'>
        <SiteHeader homePrefix='/' />

        <main className='pt-[72px]'>
          <section className='relative overflow-hidden border-b border-[var(--border)]'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(100,217,232,.12),transparent_38%)]' aria-hidden='true' />
            <div className='relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-20'>
              <div className='max-w-3xl'>
                <p className='text-sm font-bold text-[var(--primary)]'>معرض الأعمال</p>
                <h1 className='mt-3 text-4xl font-extrabold leading-tight sm:text-5xl'>
                  الأعمال المرئية
                  <span className='block text-[var(--primary)]'>في مساحة واحدة</span>
                </h1>
                <p className='mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]'>
                  تصاميم وصور وواجهات ومقاطع فيديو تُستعرض وتُشغّل داخل الحسن الرقمي،
                  مع تنظيمها في ألبومات مستقلة والتحكم الكامل بما يظهر للعامة.
                </p>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='gallery-stat'><strong>{items.filter(i => i.media_type === 'image').length.toLocaleString('ar-SA')}</strong><span>صورة</span></div>
                <div className='gallery-stat'><strong>{items.filter(i => i.media_type === 'video').length.toLocaleString('ar-SA')}</strong><span>فيديو</span></div>
              </div>
            </div>
          </section>

          <section className='sticky top-[72px] z-30 border-b border-[var(--border)] bg-[color:var(--background-alpha)] backdrop-blur-xl'>
            <div className='mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8'>
              <div className='grid gap-3 lg:grid-cols-[1fr_auto]'>
                <label className='relative'>
                  <span className='sr-only'>البحث في المعرض</span>
                  <Search className='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]' />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder='ابحث في الأعمال...'
                    className='h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pr-10 pl-4 text-sm outline-none focus:border-cyan-300/50'
                  />
                </label>
                <div className='flex gap-2 overflow-x-auto pb-1 lg:pb-0'>
                  {[
                    ['الكل', 'الكل'],
                    ['الصور', 'image'],
                    ['الفيديو', 'video'],
                  ].map(([label, value]) => (
                    <button
                      key={value}
                      onClick={() => setMediaType(value as FilterType)}
                      className={mediaType === value ? 'filter-active' : 'filter-button'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {albums.length > 0 && (
                <div className='mt-3 flex gap-2 overflow-x-auto pb-1'>
                  <button onClick={() => setAlbumId('all')} className={albumId === 'all' ? 'filter-active' : 'filter-button'}>كل الألبومات</button>
                  {albums.map(album => (
                    <button
                      key={album.id}
                      onClick={() => setAlbumId(album.id)}
                      className={albumId === album.id ? 'filter-active' : 'filter-button'}
                    >
                      {album.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
            {activeAlbum && (
              <div className='mb-7 max-w-2xl'>
                <p className='text-xs font-semibold text-[var(--primary)]'>الألبوم المحدد</p>
                <h2 className='mt-1 text-2xl font-bold'>{activeAlbum.name}</h2>
                {activeAlbum.description && <p className='mt-2 leading-7 text-[var(--muted)]'>{activeAlbum.description}</p>}
              </div>
            )}

            {loading ? (
              <div className='grid min-h-[320px] place-items-center text-center'>
                <div><Loader2 className='mx-auto h-8 w-8 animate-spin text-[var(--primary)]' /><p className='mt-3 text-sm text-[var(--muted)]'>جار تحميل المعرض…</p></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-20 text-center'>
                <div className='mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--primary)]'><ImageIcon className='h-6 w-6' /></div>
                <h2 className='mt-5 text-xl font-bold'>المعرض جاهز لاستقبال الأعمال</h2>
                <p className='mx-auto mt-2 max-w-lg leading-7 text-[var(--muted)]'>
                  لا توجد أعمال ظاهرة ضمن هذا التصنيف حاليًا. العناصر الجديدة تبقى مخفية حتى يتم اعتمادها من لوحة الإدارة.
                </p>
              </div>
            ) : (
              <>
                <p className='mb-5 text-sm text-[var(--muted)]'>{filtered.length.toLocaleString('ar-SA')} عملًا</p>
                <div className='gallery-grid'>
                  {filtered.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActive(item)}
                      className={'gallery-card ' + (index % 7 === 0 ? 'gallery-card-wide' : '')}
                      aria-label={'فتح ' + item.title}
                    >
                      <div className='gallery-media'>
                        {item.media_type === 'image' ? (
                          <img src={item.thumbnail_url || galleryMediaUrl(item)} alt={item.title} loading='lazy' />
                        ) : item.poster_url || item.thumbnail_url ? (
                          <img src={item.poster_url || item.thumbnail_url || ''} alt='' loading='lazy' />
                        ) : (
                          <div className='grid h-full place-items-center bg-[var(--surface)] text-[var(--primary)]'><Film className='h-10 w-10' /></div>
                        )}
                        <span className='gallery-overlay' />
                        <span className='gallery-kind'>
                          {item.media_type === 'video' ? <><Play className='h-3.5 w-3.5 fill-current' /> فيديو</> : <><ImageIcon className='h-3.5 w-3.5' /> صورة</>}
                        </span>
                        <span className='gallery-expand'><Maximize2 className='h-4 w-4' /></span>
                      </div>
                      <div className='p-4 text-right'>
                        <h3 className='font-bold'>{item.title}</h3>
                        {item.description && <p className='mt-1 line-clamp-2 text-xs leading-6 text-[var(--muted)]'>{item.description}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className='border-t border-[var(--border)] bg-[var(--surface)] py-10'>
            <div className='mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8'>
              <div>
                <p className='font-bold'>الحسن الرقمي · معرض الأعمال</p>
                <p className='mt-1 text-sm text-[var(--muted)]'>الملفات الأصلية محفوظة في OneDrive، ونسخ العرض تُزامن تلقائيًا إلى Cloudflare R2 وتعمل داخل البوابة.</p>
              </div>
              <a href='/' className='button-secondary'>العودة إلى البوابة <ArrowRight className='h-4 w-4' /></a>
            </div>
          </section>
        </main>

        <SiteFooter />

        {active && (
          <div
            className='fixed inset-0 z-[90] grid place-items-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6'
            role='dialog'
            aria-modal='true'
            aria-label={active.title}
            onClick={() => setActive(null)}
          >
            <div className='relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl' onClick={event => event.stopPropagation()}>
              <div className='flex items-center justify-between border-b border-white/10 px-4 py-3 text-white'>
                <div className='min-w-0'><h2 className='truncate font-bold'>{active.title}</h2>{active.description && <p className='mt-0.5 truncate text-xs text-slate-400'>{active.description}</p>}</div>
                <button onClick={() => setActive(null)} className='grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-white/10' aria-label='إغلاق'><X className='h-5 w-5' /></button>
              </div>
              <div className='grid min-h-0 flex-1 place-items-center overflow-auto bg-black'>
                {active.media_type === 'image' ? (
                  <img src={galleryMediaUrl(active)} alt={active.title} className='max-h-[82vh] max-w-full object-contain' />
                ) : (
                  <video
                    src={galleryMediaUrl(active)}
                    poster={active.poster_url || active.thumbnail_url || undefined}
                    controls
                    autoPlay
                    playsInline
                    preload='metadata'
                    className='max-h-[82vh] w-full max-w-6xl bg-black'
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
