'use client';

import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  LogOut,
  Pencil,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Star,
  StarOff,
  Video,
  X,
} from 'lucide-react';
import Monogram from '../../components/Monogram';
import {
  galleryAdminRequest,
  galleryMediaUrl,
  type GalleryAlbum,
  type GalleryDevice,
  type GalleryEvent,
  type GalleryItem,
  type GallerySettings,
} from '../../lib/gallery';

type AdminPayload = {
  albums: GalleryAlbum[];
  items: GalleryItem[];
  settings: GallerySettings;
  devices: GalleryDevice[];
  events: GalleryEvent[];
};

export default function GalleryAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [payload, setPayload] = useState<AdminPayload>({
    albums: [],
    items: [],
    settings: {
      provider: 'local_onedrive_r2',
      integration_status: 'ready_for_r2_credentials',
      root_path: 'Alhassan Digital/Gallery',
      last_sync_at: null,
      last_sync_message: null,
    },
    devices: [],
    events: [],
  });
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'visible' | 'hidden' | 'review'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('portfolio-admin-password');
    if (!stored) return;
    setPassword(stored);
    login(stored);
  }, []);

  async function login(value = password) {
    if (!value) return;
    setBusy(true);
    setMessage('');
    try {
      const data = await galleryAdminRequest<AdminPayload>(value, 'list');
      sessionStorage.setItem('portfolio-admin-password', value);
      setPayload(data);
      setAuthenticated(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تسجيل الدخول');
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  }

  async function reload() {
    setBusy(true);
    try {
      setPayload(await galleryAdminRequest<AdminPayload>(password, 'list'));
      setMessage('تم تحديث بيانات المعرض');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تحديث المعرض');
    } finally {
      setBusy(false);
    }
  }

  async function updateItem(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const result = await galleryAdminRequest<{ item: GalleryItem }>(password, 'item_update', { id, patch });
      setPayload(current => ({
        ...current,
        items: current.items.map(item => item.id === id ? result.item : item),
      }));
      setMessage('تم حفظ التغيير');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ التغيير');
    } finally {
      setBusy(false);
    }
  }

  async function updateAlbum(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const result = await galleryAdminRequest<{ album: GalleryAlbum }>(password, 'album_update', { id, patch });
      setPayload(current => ({
        ...current,
        albums: current.albums.map(album => album.id === id ? result.album : album),
      }));
      setMessage('تم حفظ الألبوم');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ الألبوم');
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    await updateItem(editing.id, {
      title: editing.title,
      description: editing.description,
      album_id: editing.album_id,
      project_slug: editing.project_slug || null,
      sort_order: Number(editing.sort_order || 500),
      visible: Boolean(editing.visible),
      featured: Boolean(editing.featured),
    });
    setEditing(null);
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return payload.items.filter(item => {
      const text = (
        item.title + ' ' +
        (item.description || '') + ' ' +
        (item.local_relative_path || item.source_path || '')
      ).toLocaleLowerCase('ar');
      const matchesQuery = !needle || text.includes(needle);
      const matchesVisibility =
        visibility === 'all' ||
        (visibility === 'visible' && item.visible) ||
        (visibility === 'hidden' && !item.visible) ||
        (visibility === 'review' && item.sync_status === 'pending_review');
      const matchesType = typeFilter === 'all' || item.media_type === typeFilter;
      return matchesQuery && matchesVisibility && matchesType;
    });
  }, [payload.items, query, visibility, typeFilter]);

  const pending = payload.items.filter(item => item.sync_status === 'pending_review').length;
  const devices = payload.devices || [];
  const events = payload.events || [];
  const device = devices[0];
  const syncReady = payload.settings?.integration_status === 'local_sync_ready';

  if (!authenticated) {
    return (
      <>
        <Head><title>إدارة معرض الأعمال | الحسن الرقمي</title><meta name='robots' content='noindex,nofollow' /></Head>
        <div className='grid min-h-screen place-items-center bg-[var(--background)] px-4 text-[var(--foreground)]'>
          <form onSubmit={event => { event.preventDefault(); login(); }} className='w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl'>
            <Monogram className='mx-auto h-16 w-16 text-[var(--primary)]' />
            <p className='mt-4 text-center text-sm font-semibold text-[var(--primary)]'>الحسن الرقمي</p>
            <h1 className='mt-1 text-center text-2xl font-bold'>إدارة معرض الأعمال</h1>
            <p className='mt-2 text-center text-sm leading-7 text-[var(--muted)]'>استخدم نفس كلمة مرور لوحة إدارة المشاريع.</p>
            <input
              type='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
              className='mt-6 h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 outline-none focus:border-cyan-300/50'
              placeholder='كلمة المرور'
            />
            <button disabled={busy} className='button-primary mt-4 w-full'>
              <ShieldCheck className='h-4 w-4' />
              {busy ? 'جار التحقق…' : 'دخول إدارة المعرض'}
            </button>
            {message && <p className='mt-3 text-center text-sm text-rose-300'>{message}</p>}
            <a href='/admin/' className='button-ghost mt-3 w-full'>العودة لإدارة المشاريع</a>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>إدارة معرض الأعمال | الحسن الرقمي</title><meta name='robots' content='noindex,nofollow' /></Head>
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <header className='sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--background-alpha)] backdrop-blur-xl'>
          <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3'>
              <Monogram className='h-11 w-11 text-[var(--primary)]' />
              <div>
                <strong className='block'>إدارة معرض الأعمال</strong>
                <span className='text-xs text-[var(--muted)]'>OneDrive محلي → Cloudflare R2 → الحسن الرقمي</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <a href='/gallery/' target='_blank' className='button-secondary'><Eye className='h-4 w-4' />عرض المعرض</a>
              <a href='/admin/' className='button-secondary'><ArrowRight className='h-4 w-4' />المشاريع</a>
              <button onClick={reload} disabled={busy} className='button-secondary'><RefreshCw className={'h-4 w-4 ' + (busy ? 'animate-spin' : '')} />تحديث</button>
              <button onClick={() => { sessionStorage.removeItem('portfolio-admin-password'); setAuthenticated(false); }} className='button-ghost'><LogOut className='h-4 w-4' />خروج</button>
            </div>
          </div>
        </header>

        <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <section className={'rounded-2xl border p-5 ' + (syncReady ? 'border-emerald-400/25 bg-emerald-400/5' : 'border-amber-300/25 bg-amber-300/5')}>
            <div className='grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center'>
              <div>
                <p className='text-xs font-semibold text-[var(--primary)]'>حالة المزامنة المحلية</p>
                <h2 className='mt-1 text-lg font-bold'>{syncReady ? 'أداة Windows متصلة' : 'البنية جاهزة — بانتظار إعداد R2 في أداة Windows'}</h2>
                <p className='mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]'>{payload.settings?.last_sync_message || 'لم تتم مزامنة أي ملف بعد.'}</p>
              </div>
              <div className='flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3'>
                <HardDrive className='h-5 w-5 text-[var(--primary)]' />
                <div>
                  <strong className='block text-sm'>{device?.name || 'Windows OneDrive Sync'}</strong>
                  <span className='text-xs text-[var(--muted)]'>{device?.last_seen_at ? 'آخر اتصال: ' + new Date(device.last_seen_at).toLocaleString('ar-SA') : 'لم يتصل بعد'}</span>
                </div>
              </div>
            </div>
          </section>

          <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <Metric label='إجمالي العناصر' value={payload.items.length} />
            <Metric label='ظاهر للعامة' value={payload.items.filter(item => item.visible).length} />
            <Metric label='بانتظار المراجعة' value={pending} />
            <Metric label='الألبومات' value={payload.albums.length} />
          </div>

          {message && <div className='mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 text-sm text-[var(--primary)]'>{message}</div>}

          <section className='mt-8'>
            <div className='flex items-end justify-between gap-3'>
              <div><p className='text-xs font-semibold text-[var(--primary)]'>الألبومات</p><h2 className='mt-1 text-2xl font-bold'>تنظيم مجلدات OneDrive</h2></div>
            </div>
            <div className='mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
              {payload.albums.map(album => (
                <article key={album.id} className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div><h3 className='font-bold'>{album.name}</h3><p className='mt-1 text-xs text-[var(--muted)]'>{payload.items.filter(item => item.album_id === album.id).length.toLocaleString('ar-SA')} عنصر</p></div>
                    <button onClick={() => updateAlbum(album.id, { visible: !album.visible })} className={album.visible ? 'text-emerald-400' : 'text-[var(--muted)]'} aria-label={album.visible ? 'إخفاء الألبوم' : 'إظهار الألبوم'}>{album.visible ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}</button>
                  </div>
                  <p className='mt-3 min-h-12 text-xs leading-6 text-[var(--muted)]'>{album.description || 'ألبوم تمت مزامنته من مجلد OneDrive.'}</p>
                  <button onClick={() => updateAlbum(album.id, { featured: !album.featured })} className='button-ghost mt-2'>{album.featured ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}{album.featured ? 'مميز' : 'تمييز'}</button>
                </article>
              ))}
            </div>
          </section>

          <section className='mt-10 border-t border-[var(--border)] pt-8'>
            <div><p className='text-xs font-semibold text-[var(--primary)]'>الوسائط</p><h2 className='mt-1 text-2xl font-bold'>الصور ومقاطع الفيديو</h2></div>

            <div className='mt-5 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 lg:grid-cols-[1fr_auto_auto]'>
              <label className='relative'>
                <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]' />
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder='ابحث بالعنوان أو المسار…' className='admin-input pr-10' />
              </label>
              <select value={visibility} onChange={event => setVisibility(event.target.value as any)} className='admin-input lg:w-48'>
                <option value='all'>كل الحالات</option>
                <option value='review'>بانتظار المراجعة</option>
                <option value='visible'>الظاهر</option>
                <option value='hidden'>المخفي</option>
              </select>
              <select value={typeFilter} onChange={event => setTypeFilter(event.target.value as any)} className='admin-input lg:w-40'>
                <option value='all'>الصور والفيديو</option>
                <option value='image'>صور</option>
                <option value='video'>فيديو</option>
              </select>
            </div>

            <div className='mt-5 grid gap-4'>
              {filtered.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--border)] py-14 text-center text-sm text-[var(--muted)]'>لا توجد عناصر مطابقة. الملفات الجديدة ستظهر هنا بعد تشغيل أداة المزامنة.</div>
              ) : filtered.map(item => (
                <article key={item.id} className='grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[150px_1fr_auto] md:items-center'>
                  <div className='aspect-video overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]'>
                    {item.media_type === 'image' ? (
                      <img src={galleryMediaUrl(item)} alt={item.title} className='h-full w-full object-cover' />
                    ) : (
                      <div className='grid h-full place-items-center'><Video className='h-8 w-8 text-[var(--primary)]' /></div>
                    )}
                  </div>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap gap-2'>
                      <span className='tag'>{item.media_type === 'image' ? 'صورة' : 'فيديو'}</span>
                      <span className='tag'>{item.sync_status || 'manual'}</span>
                      <span className='tag'>{payload.albums.find(album => album.id === item.album_id)?.name || 'بدون ألبوم'}</span>
                    </div>
                    <h3 className='mt-2 truncate font-bold'>{item.title}</h3>
                    <p className='mt-1 break-all text-xs text-[var(--muted)]' dir='ltr'>{item.local_relative_path || item.source_path || ''}</p>
                  </div>
                  <div className='flex flex-wrap gap-2 md:max-w-52 md:justify-end'>
                    <button disabled={busy} onClick={() => updateItem(item.id, { visible: !item.visible })} className={item.visible ? 'button-primary' : 'button-secondary'}>{item.visible ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}{item.visible ? 'ظاهر' : 'مخفي'}</button>
                    <button disabled={busy} onClick={() => updateItem(item.id, { featured: !item.featured })} className='button-secondary'>{item.featured ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}تمييز</button>
                    <button onClick={() => setEditing({ ...item })} className='button-ghost'><Pencil className='h-4 w-4' />تعديل</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {events.length > 0 && (
            <section className='mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
              <h2 className='font-bold'>آخر عمليات المزامنة</h2>
              <div className='mt-4 divide-y divide-[var(--border)]'>
                {events.slice(0, 10).map(event => (
                  <div key={event.id} className='grid gap-2 py-3 text-sm sm:grid-cols-[120px_1fr_auto] sm:items-center'>
                    <span>{event.event_type === 'upsert' ? 'مزامنة ملف' : event.event_type === 'heartbeat' ? 'اتصال الأداة' : event.event_type}</span>
                    <span className='truncate text-xs text-[var(--muted)]' dir='ltr'>{event.relative_path || ''}</span>
                    <span className='text-xs text-[var(--muted)]'>{new Date(event.created_at).toLocaleString('ar-SA')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {editing && (
          <div className='fixed inset-0 z-[80] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm'>
            <div className='mx-auto my-8 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl'>
              <div className='flex items-center justify-between border-b border-[var(--border)] p-5'>
                <div><p className='text-xs font-semibold text-[var(--primary)]'>تحرير عنصر المعرض</p><h2 className='mt-1 text-xl font-bold'>{editing.title}</h2></div>
                <button onClick={() => setEditing(null)} className='icon-button' aria-label='إغلاق'><X className='h-5 w-5' /></button>
              </div>
              <form onSubmit={saveEdit} className='grid gap-4 p-5 sm:grid-cols-2'>
                <Field label='العنوان' full><input value={editing.title} onChange={event => setEditing({ ...editing, title: event.target.value })} className='admin-input' /></Field>
                <Field label='الألبوم'>
                  <select value={editing.album_id || ''} onChange={event => setEditing({ ...editing, album_id: event.target.value || null })} className='admin-input'>
                    <option value=''>بدون ألبوم</option>
                    {payload.albums.map(album => <option key={album.id} value={album.id}>{album.name}</option>)}
                  </select>
                </Field>
                <Field label='مشروع مرتبط'><input value={editing.project_slug || ''} onChange={event => setEditing({ ...editing, project_slug: event.target.value })} className='admin-input' dir='ltr' /></Field>
                <Field label='الترتيب'><input type='number' value={editing.sort_order} onChange={event => setEditing({ ...editing, sort_order: Number(event.target.value) })} className='admin-input' /></Field>
                <Field label='الوصف' full><textarea rows={4} value={editing.description || ''} onChange={event => setEditing({ ...editing, description: event.target.value })} className='admin-input h-auto py-3' /></Field>
                <div className='sm:col-span-2 flex flex-wrap gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4'>
                  <label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(editing.visible)} onChange={event => setEditing({ ...editing, visible: event.target.checked })} />عرض للعامة</label>
                  <label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(editing.featured)} onChange={event => setEditing({ ...editing, featured: event.target.checked })} />مميز</label>
                </div>
                <div className='sm:col-span-2 flex justify-end gap-2'>
                  <button type='button' onClick={() => setEditing(null)} className='button-ghost'>إلغاء</button>
                  <button disabled={busy} className='button-primary'><Save className='h-4 w-4' />حفظ</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'><strong className='block text-3xl text-[var(--primary)]'>{value.toLocaleString('ar-SA')}</strong><span className='mt-2 block text-xs text-[var(--muted)]'>{label}</span></div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? 'sm:col-span-2' : ''}><span className='mb-2 block text-sm font-semibold'>{label}</span>{children}</label>;
}
