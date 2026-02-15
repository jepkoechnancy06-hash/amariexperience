import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon, Upload, Trash2, Save, Plus, Eye, EyeOff,
  ArrowLeft, RefreshCw, Check, X, GripVertical, Edit3, Camera,
  Home, Info, Users, Sparkles, AlertCircle, ExternalLink
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
interface SiteImage {
  id: string;
  page: string;
  slot: string;
  image_url: string;
  alt_text: string;
  updated_at: string;
}

interface InspirationPost {
  id: string;
  image_url: string;
  title: string;
  story: string;
  author: string;
  tag: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ── Slot definitions per page ────────────────────────────────
const PAGE_SLOTS: Record<string, { slot: string; label: string; description: string; defaultUrl: string }[]> = {
  homepage: [
    {
      slot: 'hero',
      label: 'Hero Background',
      description: 'The main hero image at the top of the homepage',
      defaultUrl: 'https://parkside.pewa.ke/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-29-at-8.44.09-PM.jpeg',
    },
  ],
  about: [
    {
      slot: 'hero',
      label: 'About Hero Background',
      description: 'The hero banner image at the top of the About Us page',
      defaultUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2400&auto=format',
    },
    {
      slot: 'founder',
      label: 'Founder Profile Photo',
      description: 'Photo of the founder in the "Meet Our Founder" section',
      defaultUrl: '/fionaprofilepic.jpeg',
    },
  ],
  community: [
    {
      slot: 'hero',
      label: 'Community Hero Background',
      description: 'The hero banner image at the top of the Community page',
      defaultUrl: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=2400&auto=format',
    },
  ],
};

const TABS = [
  { key: 'homepage', label: 'Homepage', icon: <Home size={16} /> },
  { key: 'about', label: 'About', icon: <Info size={16} /> },
  { key: 'community', label: 'Community', icon: <Users size={16} /> },
  { key: 'inspirations', label: 'Inspirations', icon: <Sparkles size={16} /> },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// ── Helper: convert File to base64 data URL ──────────────────
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Helper: auth headers ─────────────────────────────────────
function authHeaders(): Record<string, string> {
  const token = document.cookie
    .split('; ')
    .find((c) => c.startsWith('auth_token='))
    ?.split('=')[1];
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall(url: string, method: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const AdminSiteMedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('homepage');
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [inspirations, setInspirations] = useState<InspirationPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch site images ────────────────────────────────────
  const fetchSiteImages = useCallback(async () => {
    try {
      const data = await apiCall('/api/admin/site-images', 'GET');
      setSiteImages(data.images || []);
    } catch (e) {
      console.error('Failed to fetch site images:', e);
    }
  }, []);

  // ── Fetch inspirations ───────────────────────────────────
  const fetchInspirations = useCallback(async () => {
    try {
      const data = await apiCall('/api/admin/inspirations', 'GET');
      setInspirations(data.posts || []);
    } catch (e) {
      console.error('Failed to fetch inspirations:', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSiteImages(), fetchInspirations()]).finally(() => setLoading(false));
  }, [fetchSiteImages, fetchInspirations]);

  // ── Get current image for a page+slot ────────────────────
  const getImage = (page: string, slot: string): SiteImage | undefined =>
    siteImages.find((img) => img.page === page && img.slot === slot);

  // ── Save / upsert a site image ───────────────────────────
  const saveSiteImage = async (page: string, slot: string, imageUrl: string, altText: string) => {
    const key = `${page}_${slot}`;
    setSaving(key);
    try {
      await apiCall('/api/admin/site-images', 'POST', { page, slot, image_url: imageUrl, alt_text: altText });
      await fetchSiteImages();
      showToast('Image updated successfully');
    } catch (e: any) {
      showToast(e.message || 'Failed to save image', 'error');
    } finally {
      setSaving(null);
    }
  };

  // ── Delete a site image ──────────────────────────────────
  const deleteSiteImage = async (id: string) => {
    if (!confirm('Reset this image to default?')) return;
    setSaving(id);
    try {
      await apiCall('/api/admin/site-images', 'DELETE', { id });
      await fetchSiteImages();
      showToast('Image reset to default');
    } catch (e: any) {
      showToast(e.message || 'Failed to reset image', 'error');
    } finally {
      setSaving(null);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-stone-400 hover:text-stone-600 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900">Site Media Manager</h1>
              <p className="text-xs text-stone-400">Manage photos across all pages</p>
            </div>
          </div>
          <button
            onClick={() => { fetchSiteImages(); fetchInspirations(); }}
            className="text-stone-400 hover:text-stone-600 transition-colors p-2 rounded-lg hover:bg-stone-100"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-amari-500 text-amari-600'
                    : 'border-transparent text-stone-400 hover:text-stone-600 hover:border-stone-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-amari-200 border-t-amari-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'inspirations' ? (
          <InspirationsManager
            posts={inspirations}
            onRefresh={fetchInspirations}
            showToast={showToast}
          />
        ) : (
          <PageImageManager
            page={activeTab}
            slots={PAGE_SLOTS[activeTab] || []}
            siteImages={siteImages}
            getImage={getImage}
            saveSiteImage={saveSiteImage}
            deleteSiteImage={deleteSiteImage}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  PAGE IMAGE MANAGER (Homepage / About / Community)
// ══════════════════════════════════════════════════════════════
interface PageImageManagerProps {
  page: string;
  slots: { slot: string; label: string; description: string; defaultUrl: string }[];
  siteImages: SiteImage[];
  getImage: (page: string, slot: string) => SiteImage | undefined;
  saveSiteImage: (page: string, slot: string, imageUrl: string, altText: string) => Promise<void>;
  deleteSiteImage: (id: string) => Promise<void>;
  saving: string | null;
}

const PageImageManager: React.FC<PageImageManagerProps> = ({
  page, slots, getImage, saveSiteImage, deleteSiteImage, saving,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 capitalize">{page} Photos</h2>
        <p className="text-stone-500 text-sm mt-1">
          Upload or paste URLs for images on the {page} page. Changes take effect immediately.
        </p>
      </div>

      <div className="grid gap-8">
        {slots.map((slotDef) => (
          <ImageSlotCard
            key={slotDef.slot}
            page={page}
            slotDef={slotDef}
            currentImage={getImage(page, slotDef.slot)}
            onSave={saveSiteImage}
            onDelete={deleteSiteImage}
            isSaving={saving === `${page}_${slotDef.slot}`}
          />
        ))}
      </div>
    </div>
  );
};

// ── Individual Image Slot Card ───────────────────────────────
interface ImageSlotCardProps {
  page: string;
  slotDef: { slot: string; label: string; description: string; defaultUrl: string };
  currentImage: SiteImage | undefined;
  onSave: (page: string, slot: string, imageUrl: string, altText: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

const ImageSlotCard: React.FC<ImageSlotCardProps> = ({
  page, slotDef, currentImage, onSave, onDelete, isSaving,
}) => {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayUrl = currentImage?.image_url || slotDef.defaultUrl;
  const isCustom = !!currentImage;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Image must be under 4 MB');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPreviewUrl(dataUrl);
    setMode('upload');
  };

  const handleSave = async () => {
    const imageUrl = mode === 'url' ? urlInput.trim() : previewUrl;
    if (!imageUrl) return;
    await onSave(page, slotDef.slot, imageUrl, altInput.trim());
    setUrlInput('');
    setPreviewUrl(null);
    setAltInput('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const hasPendingChange = mode === 'url' ? !!urlInput.trim() : !!previewUrl;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Camera size={18} className="text-amari-400" />
              {slotDef.label}
            </h3>
            <p className="text-stone-400 text-xs mt-1">{slotDef.description}</p>
          </div>
          {isCustom && (
            <span className="bg-amari-50 text-amari-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amari-100">
              Custom
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current image preview */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Current Image</p>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <img src={displayUrl} alt={currentImage?.alt_text || slotDef.label} className="w-full h-full object-cover" />
              {isCustom && (
                <button
                  onClick={() => onDelete(currentImage!.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                  title="Reset to default"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            {isCustom && (
              <p className="text-[10px] text-stone-400 mt-2">
                Updated {new Date(currentImage!.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Upload new image */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Replace Image</p>

            {/* Mode toggle */}
            <div className="flex gap-1 mb-3 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setMode('url')}
                className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                  mode === 'url' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <ExternalLink size={12} className="inline mr-1" /> Paste URL
              </button>
              <button
                onClick={() => setMode('upload')}
                className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                  mode === 'upload' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Upload size={12} className="inline mr-1" /> Upload File
              </button>
            </div>

            {mode === 'url' ? (
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 rounded-xl py-6 text-center hover:border-amari-300 hover:bg-amari-50/50 transition-colors"
                >
                  <Upload size={24} className="mx-auto text-stone-400 mb-2" />
                  <p className="text-sm text-stone-500 font-medium">Click to select image</p>
                  <p className="text-[10px] text-stone-400 mt-1">Max 4 MB · JPG, PNG, WebP</p>
                </button>
              </div>
            )}

            {/* Preview of new image */}
            {(mode === 'url' && urlInput.trim()) && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img src={urlInput.trim()} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            {(mode === 'upload' && previewUrl) && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Alt text */}
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              placeholder="Alt text (optional)"
              className="w-full mt-3 px-4 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
            />

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!hasPendingChange || isSaving}
              className="mt-3 w-full bg-amari-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amari-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={15} /> Save Image</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  INSPIRATIONS MANAGER
// ══════════════════════════════════════════════════════════════
interface InspirationsManagerProps {
  posts: InspirationPost[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const InspirationsManager: React.FC<InspirationsManagerProps> = ({ posts, onRefresh, showToast }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    image_url: '',
    title: '',
    story: '',
    author: '',
    tag: '',
    sort_order: 0,
    is_active: true,
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({ image_url: '', title: '', story: '', author: '', tag: '', sort_order: 0, is_active: true });
    setUploadPreview(null);
    setMode('url');
    setEditingId(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (post: InspirationPost) => {
    setForm({
      image_url: post.image_url,
      title: post.title,
      story: post.story,
      author: post.author,
      tag: post.tag,
      sort_order: post.sort_order,
      is_active: post.is_active,
    });
    setEditingId(post.id);
    setShowForm(true);
    setMode('url');
    setUploadPreview(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) { alert('Image must be under 4 MB'); return; }
    const dataUrl = await fileToDataUrl(file);
    setUploadPreview(dataUrl);
    setMode('upload');
  };

  const handleSave = async () => {
    const imageUrl = mode === 'upload' && uploadPreview ? uploadPreview : form.image_url.trim();
    if (!imageUrl) { showToast('Image URL is required', 'error'); return; }

    setSaving(true);
    try {
      const payload = { ...form, image_url: imageUrl };
      if (editingId) {
        await apiCall('/api/admin/inspirations', 'PUT', { id: editingId, ...payload });
        showToast('Inspiration updated');
      } else {
        await apiCall('/api/admin/inspirations', 'POST', payload);
        showToast('Inspiration added');
      }
      await onRefresh();
      resetForm();
    } catch (e: any) {
      showToast(e.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inspiration post?')) return;
    try {
      await apiCall('/api/admin/inspirations', 'DELETE', { id });
      await onRefresh();
      showToast('Inspiration deleted');
    } catch (e: any) {
      showToast(e.message || 'Failed to delete', 'error');
    }
  };

  const toggleActive = async (post: InspirationPost) => {
    try {
      await apiCall('/api/admin/inspirations', 'PUT', { id: post.id, is_active: !post.is_active });
      await onRefresh();
      showToast(post.is_active ? 'Hidden from gallery' : 'Shown in gallery');
    } catch (e: any) {
      showToast(e.message || 'Failed to toggle', 'error');
    }
  };

  const imagePreview = mode === 'upload' && uploadPreview ? uploadPreview : form.image_url.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Inspirations Gallery</h2>
          <p className="text-stone-500 text-sm mt-1">
            Manage the curated inspiration photos shown on the gallery and community pages. {posts.length} posts total.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-amari-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amari-700 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      {/* ── Form (add / edit) ──────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-stone-900">
              {editingId ? 'Edit Inspiration' : 'New Inspiration'}
            </h3>
            <button onClick={resetForm} className="text-stone-400 hover:text-stone-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: image */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Image</p>

              <div className="flex gap-1 mb-3 bg-stone-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('url')}
                  className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                    mode === 'url' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                  }`}
                >
                  <ExternalLink size={12} className="inline mr-1" /> URL
                </button>
                <button
                  onClick={() => setMode('upload')}
                  className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                    mode === 'upload' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                  }`}
                >
                  <Upload size={12} className="inline mr-1" /> Upload
                </button>
              </div>

              {mode === 'url' ? (
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
                />
              ) : (
                <div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-stone-300 rounded-xl py-6 text-center hover:border-amari-300 hover:bg-amari-50/50 transition-colors"
                  >
                    <Upload size={24} className="mx-auto text-stone-400 mb-2" />
                    <p className="text-sm text-stone-500 font-medium">Click to select</p>
                    <p className="text-[10px] text-stone-400 mt-1">Max 4 MB</p>
                  </button>
                </div>
              )}

              {imagePreview && (
                <div className="mt-3 aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>

            {/* Right: fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="A beautiful moment..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Story</label>
                <textarea
                  value={form.story}
                  onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
                  placeholder="The ocean whispers wedding vows..."
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    placeholder="Amina & Carlos"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Tag</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    placeholder="Ceremony"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amari-300 focus:border-amari-300 transition"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        form.is_active ? 'bg-amari-500' : 'bg-stone-300'
                      }`}
                      onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          form.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-stone-700">
                      {form.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-amari-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amari-700 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><Save size={15} /> {editingId ? 'Update' : 'Add'} Inspiration</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Posts grid ─────────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Sparkles size={40} className="mx-auto text-stone-300 mb-4" />
          <h3 className="text-lg font-bold text-stone-700 mb-2">No inspiration posts yet</h3>
          <p className="text-stone-400 text-sm mb-6">Add your first inspiration photo to get started.</p>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-amari-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amari-700 transition-all inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden group transition-all ${
              post.is_active ? 'border-stone-200' : 'border-red-200 opacity-60'
            }`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={post.image_url} alt={post.title || post.tag} className="w-full h-full object-cover" />
                {!post.is_active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Hidden</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleActive(post)}
                    className="bg-white/90 backdrop-blur p-1.5 rounded-lg hover:bg-white transition-colors shadow"
                    title={post.is_active ? 'Hide' : 'Show'}
                  >
                    {post.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(post)}
                    className="bg-white/90 backdrop-blur p-1.5 rounded-lg hover:bg-white transition-colors shadow"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500/90 text-white backdrop-blur p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {post.tag && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {post.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                {post.title && <p className="text-sm font-bold text-stone-800 truncate">{post.title}</p>}
                {post.story && <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{post.story}</p>}
                {post.author && <p className="text-[10px] text-stone-400 mt-1.5 font-medium">— {post.author}</p>}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400">Order: {post.sort_order}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    post.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {post.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSiteMedia;
