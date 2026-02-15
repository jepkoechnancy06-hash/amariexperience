// Cache for site images to avoid redundant fetches per session
let cache: Record<string, string> | null = null;
let fetching: Promise<Record<string, string>> | null = null;

/**
 * Fetches all site images from the API and returns a lookup map.
 * Key format: "page:slot" → image_url
 */
async function loadSiteImages(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (fetching) return fetching;

  fetching = fetch('/api/admin/site-images')
    .then((res) => (res.ok ? res.json() : { images: [] }))
    .then((data) => {
      const map: Record<string, string> = {};
      for (const img of data.images || []) {
        map[`${img.page}:${img.slot}`] = img.image_url;
      }
      cache = map;
      return map;
    })
    .catch(() => {
      return {} as Record<string, string>;
    })
    .finally(() => {
      fetching = null;
    });

  return fetching;
}

/**
 * Get a site image URL for a given page and slot.
 * Returns the managed URL if one exists, otherwise the provided default.
 */
export async function getSiteImage(page: string, slot: string, defaultUrl: string): Promise<string> {
  const map = await loadSiteImages();
  return map[`${page}:${slot}`] || defaultUrl;
}

/**
 * Invalidate the cache (call after admin updates).
 */
export function invalidateSiteImageCache() {
  cache = null;
}
