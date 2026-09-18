'use client';

import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Eye,
  EyeOff,
  Images,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Star,
  StarOff,
  X,
} from 'lucide-react';
import Monogram from '../components/Monogram';
import { adminRequest, type PortfolioAdminProject } from '../lib/portfolio';

const emptyDraft: Partial<PortfolioAdminProject> = {
  slug: '',
  name: '',
  short_description: '',
  long_description: '',
  category: 'أخرى',
  status: 'قيد التطوير',
  visible: false,
  featured: false,
  sort_order: 500,
  public_url: null,
  tags: [],
  sources: [{ platform: 'يدوي', kind: 'manual' }],
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [projects, setProjects] = useState<PortfolioAdminProject[]>([]);
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'visible' | 'hidden'>('all');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [editing, setEditing] = useState<Partial<PortfolioAdminProject> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('portfolio-admin-password');
    if (!stored) return;
    setPassword(stored);
    login(stored, false);
  }, []);

  async function login(value = password, remember = true) {
    if (!value) return;
    setBusy(true);
    setMessage('');
    try {
      await adminRequest(value, 'login');
      if (remember) sessionStorage.setItem('portfolio-admin-password', value);
      setAuthenticated(true);
      await loadProjects(value);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تسجيل الدخول');
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  }

  async function loadProjects(value = password) {
    const data = await adminRequest<{ projects: PortfolioAdminProject[] }>(value, 'list');
    setProjects(data.projects || []);
  }

  async function quickUpdate(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const data = await adminRequest<{ project: PortfolioAdminProject }>(password, 'update', { id, patch });
      setProjects(items => items.map(item => item.id === id ? data.project : item));
      setMessage('تم حفظ التغيير');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ التغيير');
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      const normalized = {
        ...editing,
        tags: typeof editing.tags === 'string'
          ? String(editing.tags).split(',').map(tag => tag.trim()).filter(Boolean)
          : editing.tags || [],
        sort_order: Number(editing.sort_order || 500),
        public_url: editing.public_url || null,
      };
      if (isNew) {
        const data = await adminRequest<{ project: PortfolioAdminProject }>(password, 'create', { project: normalized });
        setProjects(items => [...items, data.project].sort((a, b) => a.sort_order - b.sort_order));
      } else if (editing.id) {
        const patch = { ...normalized };
        delete (patch as any).id;
        delete (patch as any).slug;
        delete (patch as any).is_system;
        delete (patch as any).updated_at;
        const data = await adminRequest<{ project: PortfolioAdminProject }>(password, 'update', { id: editing.id, patch });
        setProjects(items => items.map(item => item.id === editing.id ? data.project : item));
      }
      setEditing(null);
      setIsNew(false);
      setMessage('تم حفظ بيانات المشروع');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ المشروع');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (newPassword.length < 12) {
      setMessage('كلمة المرور الجديدة يجب أن تكون 12 حرفًا على الأقل');
      return;
    }
    setBusy(true);
    try {
      await adminRequest(password, 'change_password', { newPassword });
      setPassword(newPassword);
      sessionStorage.setItem('portfolio-admin-password', newPassword);
      setNewPassword('');
      setMessage('تم تغيير كلمة مرور لوحة الإدارة');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تغيير كلمة المرور');
    } finally {
      setBusy(false);
    }
  }

  const statuses = useMemo(() => ['الكل', ...Array.from(new Set(projects.map(item => item.status)))], [projects]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return projects.filter(item => {
      const text = (item.name + ' ' + item.slug + ' ' + item.category + ' ' + (item.short_description || '')).toLocaleLowerCase('ar');
      const matchesSearch = !needle || text.includes(needle);
      const matchesVisibility = visibility === 'all' || (visibility === 'visible' ? item.visible : !item.visible);
      const matchesStatus = statusFilter === 'الكل' || item.status === statusFilter;
      return matchesSearch && matchesVisibility && matchesStatus;
    });
  }, [projects, query, visibility, statusFilter]);

  const stats = {
    total: projects.length,
    visible: projects.filter(item => item.visible).length,
    hidden: projects.filter(item => !item.visible).length,
    featured: projects.filter(item => item.featured).length,
  };

  if (!authenticated) {
    return (
      <>
        <Head><title>لوحة إدارة الحسن الرقمي</title><meta name='robots' content='noindex,nofollow' /></Head>
        <div className='grid min-h-screen place-items-center bg-[var(--background)] px-4 text-[var(--foreground)]'>
          <form onSubmit={event => { event.preventDefault(); login(); }} className='w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl'>
            <Monogram className='mx-auto h-16 w-16 text-[var(--primary)]' />
            <p className='mt-4 text-center text-sm font-semibold text-[var(--primary)]'>الحسن الرقمي</p>
            <h1 className='mt-1 text-center text-2xl font-bold'>لوحة إدارة المشاريع</h1>
            <p className='mt-2 text-center text-sm leading-7 text-[var(--muted)]'>الدخول مخصص لإدارة ما يظهر للعامة وما يبقى مخفيًا.</p>
            <label className='mt-6 block text-sm font-semibold'>كلمة المرور</label>
            <input type='password' value={password} onChange={event => setPassword(event.target.value)} className='mt-2 h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 outline-none focus:border-cyan-300/50' autoComplete='current-password' />
            <button disabled={busy} className='button-primary mt-4 w-full'><ShieldCheck className='h-4 w-4' />{busy ? 'جار التحقق…' : 'دخول لوحة الإدارة'}</button>
            {message && <p className='mt-3 text-center text-sm text-rose-300'>{message}</p>}
            <a href='/' className='button-ghost mt-3 w-full'>العودة للبوابة</a>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>إدارة المشاريع | الحسن الرقمي</title><meta name='robots' content='noindex,nofollow' /></Head>
      <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
        <header className='sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--background-alpha)] backdrop-blur-xl'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3'><Monogram className='h-11 w-11 text-[var(--primary)]' /><div><strong className='block'>لوحة إدارة الحسن الرقمي</strong><span className='text-xs text-[var(--muted)]'>سجل المشاريع المركزي</span></div></div>
            <div className='flex flex-wrap items-center gap-2'>
              <a href='/admin/gallery/' className='button-secondary'><Images className='h-4 w-4' />معرض الأعمال</a>
              <button onClick={() => loadProjects()} disabled={busy} className='button-secondary'><RefreshCw className='h-4 w-4' />تحديث</button>
              <button onClick={() => { sessionStorage.removeItem('portfolio-admin-password'); setAuthenticated(false); setPassword(''); }} className='button-ghost'><LogOut className='h-4 w-4' />خروج</button>
            </div>
          </div>
        </header>

        <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <Stat label='إجمالي السجل' value={stats.total} />
            <Stat label='ظاهر للعامة' value={stats.visible} tone='success' />
            <Stat label='مخفي' value={stats.hidden} />
            <Stat label='مميز' value={stats.featured} tone='primary' />
          </div>

          <div className='mt-7 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 lg:flex-row lg:items-center'>
            <label className='relative flex-1'><Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]' /><input value={query} onChange={event => setQuery(event.target.value)} placeholder='ابحث بالاسم أو المعرّف أو المجال…' className='h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-10 pl-3 text-sm outline-none focus:border-cyan-300/50' /></label>
            <select value={visibility} onChange={event => setVisibility(event.target.value as any)} className='h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm'>
              <option value='all'>الكل: ظاهر ومخفي</option><option value='visible'>الظاهر فقط</option><option value='hidden'>المخفي فقط</option>
            </select>
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className='h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm'>
              {statuses.map(item => <option key={item}>{item}</option>)}
            </select>
            <button onClick={() => { setEditing({ ...emptyDraft }); setIsNew(true); }} className='button-primary'><Plus className='h-4 w-4' />إضافة مشروع</button>
          </div>

          {message && <div role='status' className='mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 text-sm text-[var(--primary)]'>{message}</div>}

          <div className='mt-6 grid gap-4'>
            {filtered.map(item => (
              <article key={item.id} className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
                <div className='grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center'>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='tag'>{item.category}</span>
                      <span className='tag'>{item.status}</span>
                      {item.is_system && <span className='tag'>بنية النظام</span>}
                      {item.sources?.slice(0, 4).map((source, index) => <span key={index} className='tag'>{String(source.platform || 'مصدر')}</span>)}
                    </div>
                    <h2 className='mt-3 text-xl font-bold'>{item.name}</h2>
                    <p className='mt-1 text-xs text-[var(--muted)]' dir='ltr'>{item.slug}</p>
                    <p className='mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]'>{item.short_description || 'لا يوجد وصف مختصر حتى الآن.'}</p>
                  </div>
                  <div className='flex flex-wrap items-center gap-2 lg:justify-end'>
                    <button disabled={busy} onClick={() => quickUpdate(item.id, { visible: !item.visible })} className={item.visible ? 'button-primary' : 'button-secondary'}>
                      {item.visible ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                      {item.visible ? 'ظاهر' : 'مخفي'}
                    </button>
                    <button disabled={busy} onClick={() => quickUpdate(item.id, { featured: !item.featured })} className='button-secondary'>
                      {item.featured ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}
                      {item.featured ? 'مميز' : 'تمييز'}
                    </button>
                    <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className='button-ghost'><Pencil className='h-4 w-4' />تعديل</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className='mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'>
            <div className='flex items-center gap-3'><KeyRound className='h-5 w-5 text-[var(--primary)]' /><div><h2 className='font-bold'>أمان لوحة الإدارة</h2><p className='text-sm text-[var(--muted)]'>غيّر كلمة المرور بعد أول دخول واحفظها في مكان آمن.</p></div></div>
            <form onSubmit={changePassword} className='mt-4 flex flex-col gap-3 sm:flex-row'>
              <input type='password' value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder='كلمة مرور جديدة — 12 حرفًا على الأقل' className='h-11 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 outline-none focus:border-cyan-300/50' />
              <button disabled={busy} className='button-secondary'><Save className='h-4 w-4' />تغيير كلمة المرور</button>
            </form>
          </section>
        </main>

        {editing && (
          <div className='fixed inset-0 z-[80] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm'>
            <div className='mx-auto my-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl'>
              <div className='flex items-center justify-between border-b border-[var(--border)] p-5'><div><p className='text-xs font-semibold text-[var(--primary)]'>{isNew ? 'مشروع جديد' : 'تحرير المشروع'}</p><h2 className='mt-1 text-xl font-bold'>{editing.name || 'بدون اسم'}</h2></div><button onClick={() => { setEditing(null); setIsNew(false); }} className='icon-button' aria-label='إغلاق'><X className='h-5 w-5' /></button></div>
              <form onSubmit={saveDraft} className='grid gap-4 p-5 sm:grid-cols-2'>
                <Field label='اسم المشروع'><input required value={editing.name || ''} onChange={event => setEditing({ ...editing, name: event.target.value })} className='admin-input' /></Field>
                <Field label='المعرّف slug'><input required disabled={!isNew} dir='ltr' value={editing.slug || ''} onChange={event => setEditing({ ...editing, slug: event.target.value.replace(/\s+/g, '-').toLowerCase() })} className='admin-input disabled:opacity-60' /></Field>
                <Field label='المجال'><input value={editing.category || ''} onChange={event => setEditing({ ...editing, category: event.target.value })} className='admin-input' /></Field>
                <Field label='الحالة'><select value={editing.status || 'قيد التطوير'} onChange={event => setEditing({ ...editing, status: event.target.value as any })} className='admin-input'><option>منشور</option><option>قيد التطوير</option><option>داخلي</option><option>تجريبي</option><option>مؤرشف</option><option>متوقف</option></select></Field>
                <Field label='الترتيب'><input type='number' value={editing.sort_order ?? 500} onChange={event => setEditing({ ...editing, sort_order: Number(event.target.value) })} className='admin-input' /></Field>
                <Field label='رابط المشروع'><input dir='ltr' value={editing.public_url || ''} onChange={event => setEditing({ ...editing, public_url: event.target.value })} className='admin-input' placeholder='https://…' /></Field>
                <Field label='وصف مختصر' full><textarea rows={3} value={editing.short_description || ''} onChange={event => setEditing({ ...editing, short_description: event.target.value })} className='admin-input h-auto py-3' /></Field>
                <Field label='وصف تفصيلي' full><textarea rows={5} value={editing.long_description || ''} onChange={event => setEditing({ ...editing, long_description: event.target.value })} className='admin-input h-auto py-3' /></Field>
                <Field label='الوسوم — افصل بينها بفاصلة' full><input value={Array.isArray(editing.tags) ? editing.tags.join(', ') : String(editing.tags || '')} onChange={event => setEditing({ ...editing, tags: event.target.value as any })} className='admin-input' /></Field>
                <div className='sm:col-span-2 flex flex-wrap items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4'>
                  <label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(editing.visible)} onChange={event => setEditing({ ...editing, visible: event.target.checked })} />عرض للعامة</label>
                  <label className='flex items-center gap-2'><input type='checkbox' checked={Boolean(editing.featured)} onChange={event => setEditing({ ...editing, featured: event.target.checked })} />مشروع مميز</label>
                </div>
                <div className='sm:col-span-2 flex justify-end gap-2 border-t border-[var(--border)] pt-4'><button type='button' onClick={() => { setEditing(null); setIsNew(false); }} className='button-ghost'>إلغاء</button><button disabled={busy} className='button-primary'><Save className='h-4 w-4' />حفظ</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'success' | 'primary' }) {
  const toneClass = tone === 'success' ? 'text-emerald-400' : tone === 'primary' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]';
  return <div className='rounded-xl border border-[var(--border)] bg-[var(--card)] p-5'><p className='text-xs text-[var(--muted)]'>{label}</p><strong className={'mt-2 block text-3xl ' + toneClass}>{value.toLocaleString('ar-SA')}</strong></div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? 'sm:col-span-2' : ''}><span className='mb-2 block text-sm font-semibold'>{label}</span>{children}</label>;
}
