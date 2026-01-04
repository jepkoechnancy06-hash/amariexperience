import React, { useEffect, useMemo, useState } from 'react';
import { InspirationPost } from '../types';

const STORAGE_KEY = 'amari_inspiration_posts_v1';

const IMAGES = [
  { src: '/whatsapp-1.jpeg', story: 'Coconuts form a committee to debate which palm is tallest. Sand approves.', author: 'Chloe Davis & Jabari Kamau' },
  { src: '/whatsapp-2.jpeg', story: 'The ocean whispers wedding vows to those who listen closely enough.', author: 'Amina Hassan & Carlos Rivera' },
  { src: '/whatsapp-3.jpeg', story: 'Sunsets in Diani paint promises in colors only lovers understand.', author: 'Zara Patel & Marcus Ochieng' },
  { src: '/whatsapp-4.jpeg', story: 'Every grain of sand holds a story waiting to be told.', author: 'Lena Thompson & David Mwangi' },
  { src: '/whatsapp-5.jpeg', story: 'Where the sky meets the sea, dreams take flight on golden wings.', author: 'Sophie Laurent & Ali Khamis' },
  { src: '/whatsapp-6.jpeg', story: 'Palm trees stand as witnesses to countless love stories.', author: 'Emma Wilson & Rajesh Patel' },
  { src: '/whatsapp-7.jpeg', story: 'The tide carries secrets of weddings past and futures yet to come.', author: 'Isabella Chen & Joseph Mwaura' },
  { src: '/whatsapp-8.jpeg', story: 'Golden hour in Diani lasts longer than anywhere else on earth.', author: 'Nina Rodriguez & Samuel Kariuki' },
  { src: '/whatsapp-9.jpeg', story: 'Beach paths lead not just to water, but to forever.', author: 'Maya Singh & Thomas Kiprop' },
  { src: '/whatsapp-10.jpeg', story: 'Coral reefs beneath hold more promises than any jewel box.', author: 'Olivia Brown & Hassan Ali' },
  { src: '/whatsapp-11.jpeg', story: 'Trade winds bring stories from across the Indian Ocean.', author: 'Grace Kim & Abdulrahman Mohamed' },
  { src: '/whatsapp-12.jpeg', story: 'Where footprints in sand become the first chapter of forever.', author: 'Sophie Martin & Michael Kamau' },
  { src: '/whatsapp-13.jpeg', story: 'The horizon in Diani is where dreams touch reality.', author: 'Ava Johnson & David Khamis' },
];

const InspirationGallery: React.FC = () => {
  const [posts, setPosts] = useState<InspirationPost[]>([]);
  const [authorType, setAuthorType] = useState<InspirationPost['authorType']>('Guest');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [story, setStory] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=2400&auto=format&fit=crop"
            alt="Beach celebration details"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amari-900/80 via-amari-600/60 to-amari-400/40"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            Real Moments
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-lg leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Inspiration Board
          </h2>
          <p className="mt-6 text-white/95 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Where love stories meet ocean breeze. Share your coastal wedding dreams and discover magic in every sunset.
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-in slide-in-from-bottom-6 duration-1000 delay-300">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <div className="w-2 h-2 bg-amari-300 rounded-full animate-pulse"></div>
              <span>Live Gallery</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <div className="w-2 h-2 bg-amari-400 rounded-full"></div>
              <span>Community Stories</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8 md:p-12 mb-12">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-amari-50 border border-amari-100 px-5 py-2 text-amari-500 text-[10px] font-bold uppercase tracking-[0.25em]">
            Gallery
          </span>
          <h3 className="mt-4 text-2xl md:text-3xl font-serif font-bold text-amari-900">Coastal Moments</h3>
          <p className="mt-3 text-stone-600">A few beachy details to spark ideas.</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {IMAGES.map((image, index) => (
            <div
              key={index}
              className="break-inside-avoid group relative overflow-hidden rounded-3xl border border-amari-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amari-200/50"
            >
              <div className="relative">
                <img
                  src={image.src}
                  alt="Wedding Inspiration"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover transform transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-4">
                  <div className="text-white text-center">
                    <p className="text-sm font-medium leading-relaxed drop-shadow-lg mb-2">{image.story}</p>
                    <p className="text-xs font-light italic text-white/80">— {image.author}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center rounded-full bg-amari-50 border border-amari-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amari-600">
                    Gallery
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
  );
};

export default InspirationGallery;
