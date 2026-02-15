import React, { useEffect, useMemo, useState } from 'react';
import { InspirationPost, GalleryComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Upload, Heart, MessageSquare, User, X, ChevronLeft, ChevronRight, Send, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'amari_inspiration_posts_v1';
const COMMENTS_KEY = 'amari_gallery_comments_v1';

const DEFAULT_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format', story: 'The ocean whispers wedding vows to those who listen closely enough.', author: 'Amina Hassan & Carlos Rivera', tag: 'Ceremony' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format', story: 'Sunsets in Diani paint promises in colors only lovers understand.', author: 'Zara Patel & Marcus Ochieng', tag: 'Sunset' },
  { src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&auto=format', story: 'Every grain of sand holds a story waiting to be told.', author: 'Lena Thompson & David Mwangi', tag: 'Details' },
  { src: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&auto=format', story: 'Where the sky meets the sea, dreams take flight on golden wings.', author: 'Sophie Laurent & Ali Khamis', tag: 'Reception' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format', story: 'Palm trees stand as witnesses to countless love stories.', author: 'Emma Wilson & Rajesh Patel', tag: 'Beach' },
  { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format', story: 'The tide carries secrets of weddings past and futures yet to come.', author: 'Isabella Chen & Joseph Mwaura', tag: 'Venue' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format', story: 'Golden hour in Diani lasts longer than anywhere else on earth.', author: 'Nina Rodriguez & Samuel Kariuki', tag: 'Golden Hour' },
  { src: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format', story: 'Beach paths lead not just to water, but to forever.', author: 'Maya Singh & Thomas Kiprop', tag: 'Florals' },
  { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format', story: 'Coral reefs beneath hold more promises than any jewel box.', author: 'Olivia Brown & Hassan Ali', tag: 'Tropical' },
  { src: 'https://images.unsplash.com/photo-1525258946800-98cbbe049ae5?w=800&auto=format', story: 'Trade winds bring stories from across the Indian Ocean.', author: 'Grace Kim & Abdulrahman Mohamed', tag: 'Couple' },
  { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format', story: 'Where footprints in sand become the first chapter of forever.', author: 'Sophie Martin & Michael Kamau', tag: 'Decor' },
  { src: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format', story: 'The horizon in Diani is where dreams touch reality.', author: 'Ava Johnson & David Khamis', tag: 'Celebration' },
];

const InspirationGallery: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [galleryImages, setGalleryImages] = useState(DEFAULT_IMAGES);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/inspirations?active_only=true')
      .then((r) => r.ok ? r.json() : { posts: [] })
      .then((data) => {
        if (!mounted) return;
        const dbPosts = (data.posts || []) as any[];
        if (dbPosts.length > 0) {
          setGalleryImages(dbPosts.map((p: any) => ({
            src: p.image_url,
            story: p.story || '',
            author: p.author || '',
            tag: p.tag || '',
          })));
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);
  const [posts, setPosts] = useState<InspirationPost[]>([]);
  const [authorType, setAuthorType] = useState<InspirationPost['authorType']>(isAuthenticated ? 'User' : 'Guest');
  const [authorName, setAuthorName] = useState(isAuthenticated ? `${user?.firstName} ${user?.lastName}` : '');
  const [title, setTitle] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [story, setStory] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Comments state
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMENTS_KEY);
      if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setComments(parsed); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments)); } catch {}
  }, [comments]);

  const addComment = (imgIdx: number) => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    const name = isAuthenticated ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : 'Guest';
    const newComment: GalleryComment = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      imageIndex: imgIdx,
      authorName: name || 'Anonymous',
      text: trimmed,
      createdAt: Date.now(),
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const commentsForImage = (idx: number) => comments.filter(c => c.imageIndex === idx);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as InspirationPost[];
      if (Array.isArray(parsed)) setPosts(parsed);
    } catch {
      // Ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // Ignore storage write issues
    }
  }, [posts]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  const onSelectImageFile = (file: File | null) => {
    setError(null);
    if (!file) {
      setImageDataUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      setImageDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) {
        setError('Could not read the image file.');
        setImageDataUrl(null);
        return;
      }
      setImageDataUrl(result);
    };
    reader.onerror = () => {
      setError('Could not read the image file.');
      setImageDataUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = () => {
    setError(null);

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Please log in to share your inspiration.');
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedStory = story.trim();
    const trimmedAuthorName = authorName.trim();

    if (!imageDataUrl) {
      setError('Please upload an image.');
      return;
    }
    if (!trimmedTitle && !trimmedStory) {
      setError('Please add a title or a story.');
      return;
    }

    const newPost: InspirationPost = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      authorType,
      authorName: trimmedAuthorName,
      title: trimmedTitle,
      imageDataUrl,
      story: trimmedStory,
      createdAt: Date.now(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setAuthorName('');
    setTitle('');
    setImageDataUrl(null);
    setStory('');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amari-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=2400&auto=format&fit=crop" alt="Beach" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-amari-900/80 to-amari-950/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6 animate-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={13} className="text-amari-gold" />
            <span className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">Real Moments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-4">Inspiration Board</h1>
          <p className="text-white/50 max-w-xl mx-auto text-base sm:text-lg">Click any photo to view full-size and leave comments.</p>
        </div>
      </div>

      {/* ─── GALLERY GRID ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryImages.map((image, index) => {
            const imgComments = commentsForImage(index);
            return (
              <div
                key={index}
                onClick={() => { setLightboxIdx(index); setCommentText(''); }}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white cursor-pointer hover:shadow-xl hover:shadow-amari-500/5 hover:border-amari-200 transition-all duration-500"
              >
                <div className="relative">
                  <img src={image.src} alt={image.tag} loading="lazy" decoding="async" className="w-full h-auto min-h-[200px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white text-sm leading-relaxed drop-shadow-lg">{image.story}</p>
                    <p className="text-white/60 text-xs italic mt-1">— {image.author}</p>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="glass text-stone-700 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-2.5 py-1">{image.tag}</span>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">{image.author.split('&')[0].trim()}</span>
                  {imgComments.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-amari-500 font-bold">
                      <MessageSquare size={11} /> {imgComments.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── LIGHTBOX MODAL ────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <div className="relative w-full h-full sm:h-auto sm:max-w-5xl sm:mx-4 flex flex-col lg:flex-row bg-white sm:rounded-2xl overflow-hidden sm:max-h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Image side */}
            <div className="relative lg:w-3/5 bg-stone-900 flex items-center justify-center min-h-[200px] sm:min-h-[300px] lg:min-h-0 flex-shrink-0">
              <img src={galleryImages[lightboxIdx].src.replace('w=800', 'w=1200')} alt={galleryImages[lightboxIdx].tag} className="w-full h-full object-contain max-h-[40vh] sm:max-h-[50vh] lg:max-h-[90vh]" />
              {/* Nav arrows */}
              <button onClick={() => setLightboxIdx(lightboxIdx === 0 ? galleryImages.length - 1 : lightboxIdx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:scale-110 transition">
                <ChevronLeft size={20} className="text-stone-700" />
              </button>
              <button onClick={() => setLightboxIdx(lightboxIdx === galleryImages.length - 1 ? 0 : lightboxIdx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:scale-110 transition">
                <ChevronRight size={20} className="text-stone-700" />
              </button>
              <div className="absolute top-3 left-3 glass-dark text-white/80 text-xs font-bold rounded-full px-3 py-1">
                {lightboxIdx + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Info + Comments side */}
            <div className="lg:w-2/5 flex flex-col flex-1 min-h-0 lg:max-h-[90vh]">
              <div className="p-5 border-b border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amari-50 text-amari-600 text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1">{galleryImages[lightboxIdx].tag}</span>
                  <button onClick={() => setLightboxIdx(null)} className="text-stone-400 hover:text-stone-600 transition"><X size={20} /></button>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed italic">"{galleryImages[lightboxIdx].story}"</p>
                <p className="text-stone-400 text-xs mt-2">— {galleryImages[lightboxIdx].author}</p>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {commentsForImage(lightboxIdx).length === 0 ? (
                  <p className="text-stone-300 text-sm text-center py-6">No comments yet. Be the first!</p>
                ) : (
                  commentsForImage(lightboxIdx).map(c => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amari-300 to-amari-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {c.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-800">{c.authorName}</span>
                          <span className="text-[10px] text-stone-300">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-stone-600 text-xs leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment input */}
              <div className="p-3 border-t border-stone-100">
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addComment(lightboxIdx); }}
                    placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
                    disabled={!isAuthenticated}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amari-300 transition disabled:opacity-50"
                  />
                  <button
                    onClick={() => addComment(lightboxIdx)}
                    disabled={!isAuthenticated || !commentText.trim()}
                    className="bg-amari-500 text-white p-2 rounded-xl hover:bg-amari-600 transition disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPLOAD SECTION ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <div className="bg-white rounded-3xl shadow-sm border border-amari-100 p-6 md:p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Posting As</label>
            <select
              value={authorType}
              onChange={(e) => setAuthorType(e.target.value as InspirationPost['authorType'])}
              className="w-full bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900"
            >
              <option value="Guest">Guest</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Name (optional)</label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onSelectImageFile(e.target.files?.[0] ?? null)}
              className="w-full bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 file:mr-4 file:rounded-xl file:border-0 file:bg-amari-300 file:px-4 file:py-2 file:font-bold file:text-amari-900 hover:file:bg-amari-200"
            />
            {imageDataUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-amari-100 bg-white">
                <img src={imageDataUrl} alt="Selected upload" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset dinner rehearsal at the beach"
              className="w-full bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Story (optional)</label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share your experience, tips, or what you loved..."
              rows={4}
              className="w-full bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-amari-50 border border-amari-100 rounded-2xl px-4 py-3 text-sm text-amari-terracotta">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={submitPost}
            className="bg-amari-500 text-white px-6 py-3 rounded-xl hover:bg-amari-600 font-bold transition shadow-md"
          >
            Post
          </button>
        </div>
      </div>

      {sortedPosts.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Latest Posts</h3>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {sortedPosts.map((post) => (
              <div key={post.id} className="break-inside-avoid bg-white rounded-2xl border border-amari-100 overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={post.imageDataUrl || post.imageUrl || ''}
                    alt={post.title || 'Inspiration post'}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amari-500">
                      {post.authorType}{post.authorName ? ` • ${post.authorName}` : ''}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {post.title && (
                    <h4 className="text-lg font-serif font-bold text-amari-900 mb-2 leading-snug">{post.title}</h4>
                  )}
                  {post.story && (
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{post.story}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InspirationGallery;
