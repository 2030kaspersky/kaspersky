'use client';

import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Film,
  FolderPlus,
  Image as ImageIcon,
  Link2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  StarOff,
  Trash2,
  X,
} from 'lucide-react';
import Monogram from '../../components/Monogram';
import {
  galleryAdminRequest,
  type GalleryAlbum,
  type GalleryItem,
  type GallerySettings,
} from '../../lib/gallery';

type AdminPayload = {
  albums: GalleryAlbum[];
  items: GalleryItem[];
  settings: GallerySettings;
};

const emptyAlbum: Partial<GalleryAlbum> = {
  slug: '',
  name: '',
  description: '',
  visible: false,
  featured: false,
  sort_order: 100,
};

const emptyItem: Partial<GalleryItem> = {
  title: '',
  description: '',
  media_type: 'image',
  visible: false,
  featured: false,
  sort_order: 100,
  source_provider: 'sharepoint',
  album_id: null,
  external_url: '',
  thumbnail_url: '',
  poster_url: '',
  project_slug: '',
};

export default function GalleryAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<GallerySettings | null>(null);
  const [integrationConfigured, setIntegrationConfigured] = useState(false);
  const [query, setQuery] = useState('');
  const [albumFilter, setAlbumFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [albumDraft, setAlbumDraft] = useState<Partial<GalleryAlbum> | null>(null);
  const [albumNew, setAlbumNew] = useState(false);
  const [itemDraft, setItemDraft] = useState<Partial<GalleryItem> | null>(null);
  const [itemNew, setItemNew] = useState(false);

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
      setAuthenticated(true);
      setAlbums(data.albums || []);
      setItems(data.items || []);
      setSettings(data.settings);
      const status = await galleryAdminRequest<any>(value, 'integration_status');
      setIntegrationConfigured(Boolean(status.configured));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر الدخول');
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  }

  async function reload() {
    setBusy(true);
    try {
      const data = await galleryAdminRequest<AdminPayload>(password, 'list');
      setAlbums(data.albums || []);
      setItems(data.items || []);
      setSettings(data.settings);
      const status = await galleryAdminRequest<any>(password, 'integration_status');
      setIntegrationConfigured(Boolean(status.configured));
      setMessage('تم تحديث بيانات المعرض');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر التحديث');
    } finally {
      setBusy(false);
    }
  }

  async function updateAlbum(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const data = await galleryAdminRequest<{ album: GalleryAlbum }>(password, 'album_update', { id, patch });
      setAlbums(values => values.map(value => value.id === id ? data.album : value));
      setMessage('تم حفظ الألبوم');
    } finally { setBusy(false); }
  }

  async function updateItem(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const data = await galleryAdminRequest<{ item: GalleryItem }>(password, 'item_update', { id, patch });
      setItems(values => values.map(value => value.id === id ? data.item : value));
      setMessage('تم حفظ العنصر');
    } finally { setBusy(false); }
  }

  async function saveAlbum(event: FormEvent) {
    event.preventDefault();
    if (!albumDraft) return;
    setBusy(true);
    try {
      if (albumNew) {
        const data = await galleryAdminRequest<{ album: GalleryAlbum }>(password, 'album_create', { album: albumDraft });
        setAlbums(values => [...values, data.album].sort((a,b) => a.sort_order - b.sort_order));
      } else if (albumDraft.id) {
        const patch = { ...albumDraft };
        delete (patch as any).id;
        delete (patch as any).slug;
        const data = await galleryAdminRequest<{ album: GalleryAlbum }>(password, 'album_update', { id: albumDraft.id, patch });
        setAlbums(values => values.map(value => value.id === albumDraft.id ? data.album : value));
      }
      setAlbumDraft(null);
      setAlbumNew(false);
      setMessage('تم حفظ بيانات الألبوم');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ الألبوم');
    } finally { setBusy(false); }
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    if (!itemDraft) return;
    setBusy(true);
    try {
      if (itemNew) {
        const data = await galleryAdminRequest<{ item: GalleryItem }>(password, 'item_create', { item: itemDraft });
        setItems(values => [...values, data.item].sort((a,b) => a.sort_order - b.sort_order));
      } else if (itemDraft.id) {
        const patch = { ...itemDraft };
        delete (patch as any).id;
        const data = await galleryAdminRequest<{ item: GalleryItem }>(password, 'item_update', { id: itemDraft.id, patch });
        setItems(values => values.map(value => value.id === itemDraft.id ? data.item : value));
      }
      setItemDraft(null);
      setItemNew(false);
      setMessage('تم حفظ العمل');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ العمل');
    } finally { setBusy(false); }
  }

  async function deleteItem(item: GalleryItem) {
    if (!window.confirm('حذف «' + item.title + '» من سجل المعرض؟ لن يتم حذف الملف من SharePoint.')) return;
    setBusy(true);
    try {
      await galleryAdminRequest(password, 'item_delete', { id: item.id });
      setItems(values => values.filter(value => value.id !== item.id));
      setMessage('تم حذف العنصر من سجل المعرض فقط');
    } finally { setBusy(false); }
  }

  async function deleteAlbum(album: GalleryAlbum) {
    if (!window.confirm('حذف ألبوم «' + album.name + '»؟ ستبقى العناصر موجودة لكن بدون ألبوم.')) return;
    setBusy(true);
    try {
      await galleryAdminRequest(password, 'album_delete', { id: album.id });
      setAlbums(values => values.filter(value => value.id !== album.id));
      setItems(values => values.map(item => item.album_id === album.id ? { ...item, album_id: null } : item));
      setMessage('تم حذف الألبوم');
    } finally { setBusy(false); }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return items.filter(item => {
      const searchText = (item.title + ' ' + (item.description || '')).toLocaleLowerCase('ar');
      return (!needle || searchText.includes(needle))
        && (albumFilter === 'all' || item.album_id === albumFilter)
        && (typeFilter === 'all' || item.media_type === typeFilter);
    });
  }, [items, query, albumFilter, typeFilter]);

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
            <input type='password' value={password} onChange={event => setPassword(event.target.value)} className='mt-6 h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 outline-none focus:border-cyan-300/50' placeholder='كلمة المرور' />
            <button disabled={busy} className='button-primary mt-4 w-full'>{busy ? <Loader2 className='h-4 w-4 animate-spin' /> : <ImageIcon className='h-4 w-4' />} دخول إدارة المعرض</button>
            {message && <p className='mt-3 text-center text-sm text-rose-300'>{message}</p>}
            <a href='/admin/' className='button-ghost mt-3 w-full'>العودة لإدارة المشاريع</a>
          </form>
        </div>
      </>
    );
  }

  const visibleItems = items.filter(item => item.visible).length;
  const imageCount = items.filter(item => item.media_type === 'image').length;
  const videoCount = items.filter(item => item.media_type === 'video').length;

  return (
    <>
      <Head><title>إدارة معرض الأعمال | الحسن الرقمي</title><meta name='robots' content='noindex,nofollow' /></Head>
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <header className='sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--background-alpha)] backdrop-blur-xl'>
          <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3'><Monogram className='h-11 w-11 text-[var(--primary)]' /><div><strong className='block'>إدارة معرض الأعمال</strong><span className='text-xs text-[var(--muted)]'>صور · فيديو · ألبومات · Microsoft 365</span></div></div>
            <div className='flex flex-wrap items-center gap-2'>
              <a href='/gallery/' target='_blank' className='button-secondary'><Eye className='h-4 w-4' />عرض المعرض</a>
              <a href='/admin/' className='button-ghost'>إدارة المشاريع <ArrowRight className='h-4 w-4' /></a>
              <button onClick={reload} disabled={busy} className='button-secondary'><RefreshCw className={'h-4 w-4 ' + (busy ? 'animate-spin' : '')} />تحديث</button>
            </div>
          </div>
        </header>

        <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <section className={'rounded-2xl border p-5 ' + (integrationConfigured ? 'border-emerald-400/25 bg-emerald-400/5' : 'border-amber-300/25 bg-amber-300/5')}>
            <div className='grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center'>
              <div className='flex items-start gap-4'>
                <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-xl ' + (integrationConfigured ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-300/10 text-amber-300')}>
                  {integrationConfigured ? <Link2 className='h-5 w-5' /> : <ShieldAlert className='h-5 w-5' />}
                </span>
                <div>
                  <p className='text-xs font-semibold text-[var(--muted)]'>Microsoft 365 / SharePoint</p>
                  <h2 className='mt-1 text-lg font-bold'>{integrationConfigured ? 'بيانات التطبيق موجودة — جاهز لاختبار الاتصال' : 'بانتظار تفويض مسؤول Microsoft 365'}</h2>
                  <p className='mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]'>
                    التخزين المستهدف: {settings?.tenant_host || 'nboys.sharepoint.com'} · مكتبة «{settings?.library_name || 'معرض أعمال الحسن الرقمي'}».
                    يمكن إدارة الألبومات والعناصر الآن، وسيُفعّل الاستيراد والمزامنة فور توفير بيانات التطبيق المعتمد.
                  </p>
                </div>
              </div>
              <span className='tag'>{settings?.integration_status === 'connected' ? 'متصل' : 'بانتظار التفويض'}</span>
            </div>
          </section>

          <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <Metric label='الألبومات' value={albums.length} icon={<FolderPlus className='h-5 w-5' />} />
            <Metric label='الصور' value={imageCount} icon={<ImageIcon className='h-5 w-5' />} />
            <Metric label='الفيديو' value={videoCount} icon={<Film className='h-5 w-5' />} />
            <Metric label='ظاهر للعامة' value={visibleItems} icon={<Eye className='h-5 w-5' />} />
          </div>

          {message && <div className='mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 text-sm text-[var(--primary)]'>{message}</div>}

          <section className='mt-8'>
            <div className='flex flex-wrap items-end justify-between gap-3'>
              <div><p className='text-xs font-semibold text-[var(--primary)]'>الألبومات</p><h2 className='mt-1 text-2xl font-bold'>تنظيم محتوى المعرض</h2></div>
              <button onClick={() => { setAlbumDraft({ ...emptyAlbum }); setAlbumNew(true); }} className='button-primary'><FolderPlus className='h-4 w-4' />ألبوم جديد</button>
            </div>
            <div className='mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
              {albums.map(album => (
                <article key={album.id} className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'><h3 className='truncate font-bold'>{album.name}</h3><p className='mt-1 text-xs text-[var(--muted)]'>{items.filter(item => item.album_id === album.id).length.toLocaleString('ar-SA')} عنصر</p></div>
                    <button onClick={() => updateAlbum(album.id, { visible: !album.visible })} className={album.visible ? 'text-emerald-400' : 'text-[var(--muted)]'} aria-label={album.visible ? 'إخفاء الألبوم' : 'إظهار الألبوم'}>{album.visible ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}</button>
                  </div>
                  <p className='mt-3 min-h-12 text-xs leading-6 text-[var(--muted)]'>{album.description || 'بدون وصف'}</p>
                  <div className='mt-4 flex items-center gap-2'>
                    <button onClick={() => updateAlbum(album.id, { featured: !album.featured })} className='button-ghost'>{album.featured ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}</button>
                    <button onClick={() => { setAlbumDraft({ ...album }); setAlbumNew(false); }} className='button-ghost'><Pencil className='h-4 w-4' />تعديل</button>
                    <button onClick={() => deleteAlbum(album)} className='button-ghost text-rose-400'><Trash2 className='h-4 w-4' /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className='mt-10 border-t border-[var(--border)] pt-8'>
            <div className='flex flex-wrap items-end justify-between gap-3'>
              <div><p className='text-xs font-semibold text-[var(--primary)]'>الوسائط</p><h2 className='mt-1 text-2xl font-bold'>الصور ومقاطع الفيديو</h2></div>
              <button onClick={() => { setItemDraft({ ...emptyItem }); setItemNew(true); }} className='button-primary'><Plus className='h-4 w-4' />إضافة عمل</button>
            </div>

            <div className='mt-5 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 lg:grid-cols-[1fr_auto_auto]'>
              <label className='relative'><Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]' /><input value={query} onChange={event => setQuery(event.target.value)} placeholder='ابحث في عناصر المعرض…' className='admin-input pr-10' /></label>
              <select value={albumFilter} onChange={event => setAlbumFilter(event.target.value)} className='admin-input lg:w-52'><option value='all'>كل الألبومات</option>{albums.map(album => <option key={album.id} value={album.id}>{album.name}</option>)}</select>
              <select value={typeFilter} onChange={event => setTypeFilter(event.target.value)} className='admin-input lg:w-40'><option value='all'>كل الأنواع</option><option value='image'>صور</option><option value='video'>فيديو</option></select>
            </div>

            <div className='mt-5 grid gap-4'>
              {filtered.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--border)] py-14 text-center text-sm text-[var(--muted)]'>لا توجد عناصر مطابقة. يمكنك إضافة عنصر يدويًا الآن، أو انتظار تفعيل مزامنة SharePoint.</div>
              ) : filtered.map(item => (
                <article key={item.id} className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-4'>
                  <div className='grid gap-4 lg:grid-cols-[72px_1fr_auto] lg:items-center'>
                    <div className='grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)]'>
                      {item.thumbnail_url ? <img src={item.thumbnail_url} alt='' className='h-full w-full object-cover' /> : item.media_type === 'video' ? <Film className='h-6 w-6' /> : <ImageIcon className='h-6 w-6' />}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap gap-2'><span className='tag'>{item.media_type === 'video' ? 'فيديو' : 'صورة'}</span><span className='tag'>{albums.find(a => a.id === item.album_id)?.name || 'بدون ألبوم'}</span><span className='tag'>{item.source_provider || 'sharepoint'}</span></div>
                      <h3 className='mt-2 truncate font-bold'>{item.title}</h3>
                      <p className='mt-1 line-clamp-1 text-xs text-[var(--muted)]'>{item.description || item.source_path || 'بدون وصف'}</p>
                    </div>
                    <div className='flex flex-wrap gap-2 lg:justify-end'>
                      <button onClick={() => updateItem(item.id, { visible: !item.visible })} className={item.visible ? 'button-primary' : 'button-secondary'}>{item.visible ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}{item.visible ? 'ظاهر' : 'مخفي'}</button>
                      <button onClick={() => updateItem(item.id, { featured: !item.featured })} className='button-secondary'>{item.featured ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}</button>
                      <button onClick={() => { setItemDraft({ ...item }); setItemNew(false); }} className='button-ghost'><Pencil className='h-4 w-4' />تعديل</button>
                      <button onClick={() => deleteItem(item)} className='button-ghost text-rose-400'><Trash2 className='h-4 w-4' /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className='mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
            <div className='flex items-start gap-3'><Sparkles className='mt-0.5 h-5 w-5 text-[var(--primary)]' /><div><h2 className='font-bold'>ما الذي سيتغير بعد اعتماد Microsoft؟</h2><p className='mt-1 max-w-3xl text-sm leading-7 text-[var(--muted)]'>سيضاف الاستيراد والمزامنة المباشرة مع مكتبة SharePoint، وتُحفظ المعرّفات الداخلية فقط. عند العرض، يحصل الموقع على رابط مؤقت للوسيط ويشغله داخل Lightbox أو مشغل الفيديو دون نقل المستخدم إلى SharePoint.</p></div></div>
          </section>
        </main>

        {albumDraft && (
          <Modal title={albumNew ? 'ألبوم جديد' : 'تعديل الألبوم'} onClose={() => { setAlbumDraft(null); setAlbumNew(false); }}>
            <form onSubmit={saveAlbum} className='grid gap-4 sm:grid-cols-2'>
              <Field label='اسم الألبوم'><input required value={albumDraft.name || ''} onChange={e => setAlbumDraft({ ...albumDraft, name: e.target.value })} className='admin-input' /></Field>
              <Field label='المعرّف slug'><input required disabled={!albumNew} dir='ltr' value={albumDraft.slug || ''} onChange={e => setAlbumDraft({ ...albumDraft, slug: e.target.value.replace(/\s+/g,'-').toLowerCase() })} className='admin-input disabled:opacity-60' /></Field>
              <Field label='المسار المقترح في SharePoint'><input value={albumDraft.source_path || ''} onChange={e => setAlbumDraft({ ...albumDraft, source_path: e.target.value })} className='admin-input' /></Field>
              <Field label='الترتيب'><input type='number' value={albumDraft.sort_order ?? 100} onChange={e => setAlbumDraft({ ...albumDraft, sort_order: Number(e.target.value) })} className='admin-input' /></Field>
              <Field label='الوصف' full><textarea rows={4} value={albumDraft.description || ''} onChange={e => setAlbumDraft({ ...albumDraft, description: e.target.value })} className='admin-input h-auto py-3' /></Field>
              <div className='sm:col-span-2 flex flex-wrap gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4'><label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(albumDraft.visible)} onChange={e => setAlbumDraft({ ...albumDraft, visible: e.target.checked })} />ظاهر للعامة</label><label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(albumDraft.featured)} onChange={e => setAlbumDraft({ ...albumDraft, featured: e.target.checked })} />مميز</label></div>
              <ModalActions busy={busy} onCancel={() => { setAlbumDraft(null); setAlbumNew(false); }} />
            </form>
          </Modal>
        )}

        {itemDraft && (
          <Modal title={itemNew ? 'إضافة عمل' : 'تعديل العمل'} onClose={() => { setItemDraft(null); setItemNew(false); }}>
            <form onSubmit={saveItem} className='grid gap-4 sm:grid-cols-2'>
              <Field label='العنوان'><input required value={itemDraft.title || ''} onChange={e => setItemDraft({ ...itemDraft, title: e.target.value })} className='admin-input' /></Field>
              <Field label='النوع'><select value={itemDraft.media_type || 'image'} onChange={e => setItemDraft({ ...itemDraft, media_type: e.target.value as any })} className='admin-input'><option value='image'>صورة</option><option value='video'>فيديو</option></select></Field>
              <Field label='الألبوم'><select value={itemDraft.album_id || ''} onChange={e => setItemDraft({ ...itemDraft, album_id: e.target.value || null })} className='admin-input'><option value=''>بدون ألبوم</option>{albums.map(album => <option key={album.id} value={album.id}>{album.name}</option>)}</select></Field>
              <Field label='الترتيب'><input type='number' value={itemDraft.sort_order ?? 100} onChange={e => setItemDraft({ ...itemDraft, sort_order: Number(e.target.value) })} className='admin-input' /></Field>
              <Field label='رابط مباشر مؤقت/اختباري' full><input dir='ltr' value={itemDraft.external_url || ''} onChange={e => setItemDraft({ ...itemDraft, external_url: e.target.value })} className='admin-input' placeholder='https://…' /><span className='mt-1 block text-[11px] text-[var(--muted)]'>بعد تفعيل SharePoint لن تحتاج إلى روابط عامة دائمة.</span></Field>
              <Field label='رابط الصورة المصغرة'><input dir='ltr' value={itemDraft.thumbnail_url || ''} onChange={e => setItemDraft({ ...itemDraft, thumbnail_url: e.target.value })} className='admin-input' /></Field>
              <Field label='Poster للفيديو'><input dir='ltr' value={itemDraft.poster_url || ''} onChange={e => setItemDraft({ ...itemDraft, poster_url: e.target.value })} className='admin-input' /></Field>
              <Field label='ربط بمشروع'><input dir='ltr' value={itemDraft.project_slug || ''} onChange={e => setItemDraft({ ...itemDraft, project_slug: e.target.value })} className='admin-input' placeholder='project-slug' /></Field>
              <Field label='المصدر'><select value={itemDraft.source_provider || 'sharepoint'} onChange={e => setItemDraft({ ...itemDraft, source_provider: e.target.value })} className='admin-input'><option value='sharepoint'>SharePoint</option><option value='manual'>رابط يدوي</option></select></Field>
              <Field label='الوصف' full><textarea rows={4} value={itemDraft.description || ''} onChange={e => setItemDraft({ ...itemDraft, description: e.target.value })} className='admin-input h-auto py-3' /></Field>
              <div className='sm:col-span-2 flex flex-wrap gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4'><label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(itemDraft.visible)} onChange={e => setItemDraft({ ...itemDraft, visible: e.target.checked })} />ظاهر للعامة</label><label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(itemDraft.featured)} onChange={e => setItemDraft({ ...itemDraft, featured: e.target.checked })} />مميز</label></div>
              <ModalActions busy={busy} onCancel={() => { setItemDraft(null); setItemNew(false); }} />
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'><div className='flex items-center justify-between text-[var(--primary)]'>{icon}<strong className='text-3xl'>{value.toLocaleString('ar-SA')}</strong></div><p className='mt-3 text-xs text-[var(--muted)]'>{label}</p></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className='fixed inset-0 z-[90] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm'><div className='mx-auto my-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl'><div className='flex items-center justify-between border-b border-[var(--border)] p-5'><h2 className='text-xl font-bold'>{title}</h2><button onClick={onClose} className='icon-button'><X className='h-5 w-5' /></button></div><div className='p-5'>{children}</div></div></div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? 'sm:col-span-2' : ''}><span className='mb-2 block text-sm font-semibold'>{label}</span>{children}</label>;
}

function ModalActions({ busy, onCancel }: { busy: boolean; onCancel: () => void }) {
  return <div className='sm:col-span-2 flex justify-end gap-2 border-t border-[var(--border)] pt-4'><button type='button' onClick={onCancel} className='button-ghost'>إلغاء</button><button disabled={busy} className='button-primary'><Save className='h-4 w-4' />حفظ</button></div>;
}
