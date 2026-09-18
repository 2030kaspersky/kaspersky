export type GalleryAlbum = {
  id: string;
  slug: string;
  name: string;
  description: string;
  featured: boolean;
  sort_order: number;
  cover_item_id?: string | null;
  updated_at?: string;
  visible?: boolean;
  source_path?: string | null;
};

export type GalleryItem = {
  id: string;
  album_id: string | null;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  mime_type: string | null;
  featured: boolean;
  sort_order: number;
  project_slug: string | null;
  thumbnail_url: string | null;
  poster_url: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  file_size: number | null;
  updated_at?: string;
  visible?: boolean;
  source_provider?: string;
  source_path?: string | null;
  external_url?: string | null;
  object_key?: string | null;
  local_relative_path?: string | null;
  content_hash?: string | null;
  sync_status?: 'manual' | 'synced' | 'pending_review' | 'missing_local' | 'error';
  synced_at?: string | null;
  original_modified_at?: string | null;
};

export type GallerySettings = {
  id?: number;
  provider: string;
  integration_status: 'pending_authorization' | 'configured' | 'connected' | 'error' | 'ready_for_r2_credentials' | 'local_sync_ready';
  sync_mode?: string;
  root_path: string;
  last_sync_at: string | null;
  last_sync_message: string | null;
  public_media_base_url?: string | null;
};

export type GalleryDevice = {
  id: string;
  name: string;
  active: boolean;
  last_seen_at: string | null;
  last_status: string | null;
  created_at?: string;
};

export type GalleryEvent = {
  id: number;
  event_type: string;
  relative_path: string | null;
  object_key: string | null;
  item_id: string | null;
  status: string;
  message: string | null;
  created_at: string;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fwzqbjkbufmrrfmhqnik.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3enFiamtidWZtcnJmbWhxbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTQ4ODAsImV4cCI6MjEwNTA3MDg4MH0.48HeUbNwAI-pkRMoW-bc0f0_PlweK4dKhNrT16jQgjA';

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
    publicFetch('gallery_public_items?select=*&order=sort_order.asc,updated_at.desc'),
  ]);
  return {
    albums: (Array.isArray(albums) ? albums : []) as GalleryAlbum[],
    items: (Array.isArray(items) ? items : []) as GalleryItem[],
  };
}

export function galleryMediaUrl(item: Pick<GalleryItem, 'id'>) {
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
