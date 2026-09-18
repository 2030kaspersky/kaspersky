export type GalleryAlbum = {
  id: string;
  slug: string;
  name: string;
  description: string;
  featured: boolean;
  sort_order: number;
  cover_item_id?: string | null;
  visible?: boolean;
  sharepoint_folder_id?: string | null;
  source_path?: string | null;
  updated_at?: string;
};

export type GalleryItem = {
  id: string;
  album_id?: string | null;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  mime_type?: string | null;
  visible?: boolean;
  featured: boolean;
  sort_order: number;
  project_slug?: string | null;
  source_provider?: string;
  source_item_id?: string | null;
  site_id?: string | null;
  drive_id?: string | null;
  source_path?: string | null;
  external_url?: string | null;
  thumbnail_url?: string | null;
  poster_url?: string | null;
  width?: number | null;
  height?: number | null;
  duration_seconds?: number | null;
  file_size?: number | null;
  updated_at?: string;
};

export type GallerySettings = {
  id: number;
  provider: string;
  integration_status: 'pending_authorization' | 'configured' | 'connected' | 'error';
  tenant_host?: string | null;
  site_path?: string | null;
  site_id?: string | null;
  drive_id?: string | null;
  root_folder_id?: string | null;
  library_name: string;
  root_path: string;
  last_sync_at?: string | null;
  last_sync_message?: string | null;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fwzqbjkbufmrrfmhqnik.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmd3pxYmprYnVmbXJyZm1ocW5payIsInJlZiI6ImZ3enFiamtidWZtcnJmbWhxbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTQ4ODAsImV4cCI6MjEwNTA3MDg4MH0.48HeUbNwAI-pkRMoW-bc0f0_PlweK4dKhNrT16jQgjA';

async function publicFetch(path: string) {
  const response = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error('تعذر تحميل معرض الأعمال');
  return response.json();
}

export async function fetchGallery() {
  const [albums, items] = await Promise.all([
    publicFetch('gallery_public_albums?select=*&order=sort_order.asc,name.asc'),
    publicFetch('gallery_public_items?select=*&order=sort_order.asc,title.asc'),
  ]);
  return {
    albums: (Array.isArray(albums) ? albums : []) as GalleryAlbum[],
    items: (Array.isArray(items) ? items : []) as GalleryItem[],
  };
}

export function galleryMediaUrl(item: Pick<GalleryItem, 'id' | 'external_url'>) {
  if (item.external_url) return item.external_url;
  return SUPABASE_URL + '/functions/v1/gallery-media?id=' + encodeURIComponent(item.id);
}

export async function galleryAdminRequest<T = any>(
  password: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(SUPABASE_URL + '/functions/v1/gallery-admin', {
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
        ? 'كلمة مرور الإدارة غير صحيحة'
        : data?.error || 'تعذر تنفيذ العملية'
    );
  }
  return data as T;
}
