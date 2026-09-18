import type { Project, ProjectStatus } from '../data/projects';

export type PortfolioAdminProject = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  category: string;
  status: ProjectStatus;
  visible: boolean;
  featured: boolean;
  sort_order: number;
  public_url: string | null;
  tags: string[];
  sources: Array<Record<string, any>>;
  is_system: boolean;
  updated_at?: string;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fwzqbjkbufmrrfmhqnik.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3enFiamtidWZtcnJmbWhxbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTQ4ODAsImV4cCI6MjEwNTA3MDg4MH0.48HeUbNwAI-pkRMoW-bc0f0_PlweK4dKhNrT16jQgjA';

const accents: Project['accent'][] = ['cyan', 'teal', 'blue', 'gold', 'violet', 'green'];

function accentFor(slug: string): Project['accent'] {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return accents[hash % accents.length];
}

function toArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function rowToProject(row: any): Project {
  const tags = toArray(row.tags);
  return {
    id: row.id,
    slug: String(row.slug),
    name: String(row.name),
    shortDescription: String(row.short_description || ''),
    longDescription: String(row.long_description || row.short_description || ''),
    need: String(row.long_description || row.short_description || ''),
    category: String(row.category || 'أخرى'),
    status: String(row.status || 'قيد التطوير') as ProjectStatus,
    url: row.public_url || undefined,
    visible: row.visible,
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order || 100),
    tags,
    highlights: tags.length ? tags.slice(0, 3) : ['حل رقمي', 'واجهة عربية', 'تطوير مستمر'],
    year: '2026',
    accent: accentFor(String(row.slug)),
  };
}

async function publicFetch(path: string) {
  const response = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error('تعذر تحميل سجل المشاريع');
  return response.json();
}

export async function fetchPublicProjects(): Promise<Project[]> {
  const rows = await publicFetch(
    'portfolio_public_projects?select=*&order=sort_order.asc,name.asc'
  );
  return Array.isArray(rows) ? rows.map(rowToProject) : [];
}

export async function fetchPublicProject(slug: string): Promise<Project | null> {
  const rows = await publicFetch(
    'portfolio_public_projects?select=*&slug=eq.' +
      encodeURIComponent(slug) +
      '&limit=1'
  );
  return Array.isArray(rows) && rows[0] ? rowToProject(rows[0]) : null;
}

export async function adminRequest<T = any>(
  password: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(SUPABASE_URL + '/functions/v1/portfolio-admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'x-admin-password': password,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.error === 'unauthorized'
        ? 'كلمة المرور غير صحيحة'
        : data?.error || 'تعذر تنفيذ العملية'
    );
  }
  return data as T;
}
