import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { INITIAL_BUDGET, INITIAL_GUESTS } from '../constants';
import { BudgetItem, Guest, ItineraryItem } from '../types';
import { Plus, Trash2, PieChart as PieIcon, Users, Calendar, MapPin, Edit3, Check, X, DollarSign, UserCheck, UserX, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITINERARY_STORAGE_KEY = 'amari_guest_itinerary_v1';
const BUDGET_STORAGE_KEY = 'amari_budget_v1';
const TOTAL_BUDGET_KEY = 'amari_total_budget_v1';
const GUESTS_STORAGE_KEY = 'amari_guests_v1';
const CURRENCY_STORAGE_KEY = 'amari_currency_v1';
const CHART_COLORS_KEY = 'amari_chart_colors_v1';
const WISHLIST_KEY = 'amari_wishlist_v1';
const WISHLIST_DATA_KEY = 'amari_wishlist_data_v1';
const USD_TO_KSH = 129;

const COLORS = [
  '#8b6f47', '#b8956a', '#6b5436', '#d4b896', '#a3845c', '#e8d5bc',
];

const RSVP_OPTIONS: Array<Guest['rsvpStatus']> = ['Pending', 'Confirmed', 'Declined'];

const PlanningTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'budget' | 'guests' | 'timeline' | 'itinerary'>('saved');

  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  });

  const [savedVendors, setSavedVendors] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_DATA_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        if (Array.isArray(all)) return all;
      }
    } catch {}
    return [];
  });

  const refreshSavedFromStorage = () => {
    try {
      const idsRaw = localStorage.getItem(WISHLIST_KEY);
      setSavedIds(idsRaw ? new Set(JSON.parse(idsRaw)) : new Set());
    } catch {
      setSavedIds(new Set());
    }

    try {
      const dataRaw = localStorage.getItem(WISHLIST_DATA_KEY);
      const all = dataRaw ? JSON.parse(dataRaw) : [];
      setSavedVendors(Array.isArray(all) ? all : []);
    } catch {
      setSavedVendors([]);
    }
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || (e.key !== WISHLIST_KEY && e.key !== WISHLIST_DATA_KEY)) return;
      try {
        if (e.key === WISHLIST_KEY) {
          const raw = localStorage.getItem(WISHLIST_KEY);
          setSavedIds(raw ? new Set(JSON.parse(raw)) : new Set());
        }
        if (e.key === WISHLIST_DATA_KEY) {
          const raw = localStorage.getItem(WISHLIST_DATA_KEY);
          const all = raw ? JSON.parse(raw) : [];
          setSavedVendors(Array.isArray(all) ? all : []);
        }
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (activeTab !== 'saved') return;
    refreshSavedFromStorage();
  }, [activeTab]);

  useEffect(() => {
    const onFocus = () => {
      if (activeTab !== 'saved') return;
      refreshSavedFromStorage();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [activeTab]);

  const savedItems = useMemo(() => {
    const ids = savedIds;
    return (savedVendors || []).filter((v) => ids.has(v?.id));
  }, [savedIds, savedVendors]);

  // Budget state – persisted
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try { const r = localStorage.getItem(BUDGET_STORAGE_KEY); if (r) { const p = JSON.parse(r); if (Array.isArray(p) && p.length) return p; } } catch {}
    return INITIAL_BUDGET;
  });
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editBudget, setEditBudget] = useState({ category: '', estimated: 0, actual: 0 });
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetEstimated, setNewBudgetEstimated] = useState('');
  const [totalBudgetInput, setTotalBudgetInput] = useState<string>(() => {
    try { const v = localStorage.getItem(TOTAL_BUDGET_KEY); return v || ''; } catch { return ''; }
  });
  const [showBudgetSet, setShowBudgetSet] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'KSH'>(() => {
    try { const v = localStorage.getItem(CURRENCY_STORAGE_KEY); if (v === 'KSH' || v === 'USD') return v; } catch {}
    return 'USD';
  });

  // Chart colors – persisted per category id
  const [chartColors, setChartColors] = useState<Record<string, string>>(() => {
    try { const v = localStorage.getItem(CHART_COLORS_KEY); if (v) return JSON.parse(v); } catch {}
    return {};
  });
  const getColor = (index: number, id: string) => chartColors[id] || COLORS[index % COLORS.length];
  const updateChartColor = (id: string, color: string) => {
    setChartColors(prev => ({ ...prev, [id]: color }));
  };

  // Guest state – persisted
  const [guests, setGuests] = useState<Guest[]>(() => {
    try { const r = localStorage.getItem(GUESTS_STORAGE_KEY); if (r) { const p = JSON.parse(r); if (Array.isArray(p)) return p; } } catch {}
    return INITIAL_GUESTS;
  });
  const [newGuestName, setNewGuestName] = useState('');

  // Itinerary state – persisted
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [itineraryDay, setItineraryDay] = useState('');
  const [itineraryTime, setItineraryTime] = useState('');
  const [itineraryPlace, setItineraryPlace] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');

  // Persist budget
  useEffect(() => { try { localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgetItems)); } catch {} }, [budgetItems]);
  // Persist guests
  useEffect(() => { try { localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests)); } catch {} }, [guests]);
  // Load itinerary
  useEffect(() => {
    try { const raw = localStorage.getItem(ITINERARY_STORAGE_KEY); if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) setItineraryItems(p); } } catch {}
  }, []);
  // Save itinerary
  useEffect(() => { try { localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itineraryItems)); } catch {} }, [itineraryItems]);

  // Persist chart colors
  useEffect(() => { try { localStorage.setItem(CHART_COLORS_KEY, JSON.stringify(chartColors)); } catch {} }, [chartColors]);
  // Persist total budget
  useEffect(() => { try { localStorage.setItem(TOTAL_BUDGET_KEY, totalBudgetInput); } catch {} }, [totalBudgetInput]);
  // Persist currency
  useEffect(() => { try { localStorage.setItem(CURRENCY_STORAGE_KEY, currency); } catch {} }, [currency]);

  const fmt = (amount: number) => {
    if (currency === 'KSH') return `KSh ${Math.round(amount * USD_TO_KSH).toLocaleString()}`;
    return `$${amount.toLocaleString()}`;
  };
  const currSymbol = currency === 'KSH' ? 'KSh' : '$';

  // Budget logic
  const totalEstimated = budgetItems.reduce((a, i) => a + i.estimated, 0);
  const totalActual = budgetItems.reduce((a, i) => a + i.actual, 0);
  const remaining = totalEstimated - totalActual;

  // Default category weights for proportional distribution
  const CATEGORY_WEIGHTS: Record<string, number> = {
    'Venue': 0.38,
    'Catering': 0.23,
    'Photography': 0.11,
    'Attire': 0.10,
    'Decor': 0.10,
    'Transport': 0.04,
  };

  const distributeBudget = () => {
    const total = Number(totalBudgetInput) || 0;
    if (total <= 0) return;
    const totalWeight = budgetItems.reduce((sum, item) => {
      return sum + (CATEGORY_WEIGHTS[item.category] || (1 / budgetItems.length));
    }, 0);
    setBudgetItems(prev => prev.map(item => {
      const weight = CATEGORY_WEIGHTS[item.category] || (1 / prev.length);
      const estimated = Math.round((weight / totalWeight) * total);
      return { ...item, estimated };
    }));
    setShowBudgetSet(false);
  };

  const startEditBudget = (item: BudgetItem) => {
    setEditingBudgetId(item.id);
    setEditBudget({ category: item.category, estimated: item.estimated, actual: item.actual });
  };
  const saveEditBudget = () => {
    if (!editingBudgetId) return;
    setBudgetItems(prev => prev.map(i => i.id === editingBudgetId ? { ...i, ...editBudget } : i));
    setEditingBudgetId(null);
  };
  const addBudgetItem = () => {
    if (!newBudgetCategory.trim()) return;
    setBudgetItems(prev => [...prev, { id: Date.now().toString(), category: newBudgetCategory.trim(), estimated: Number(newBudgetEstimated) || 0, actual: 0 }]);
    setNewBudgetCategory('');
    setNewBudgetEstimated('');
    setShowAddBudget(false);
  };
  const removeBudgetItem = (id: string) => setBudgetItems(prev => prev.filter(i => i.id !== id));

  // Guest logic
  const addGuest = () => {
    if (!newGuestName.trim()) return;
    setGuests(prev => [...prev, { id: Date.now().toString(), name: newGuestName.trim(), rsvpStatus: 'Pending', table: null }]);
    setNewGuestName('');
  };
  const removeGuest = (id: string) => setGuests(prev => prev.filter(g => g.id !== id));
  const cycleRsvp = (id: string) => {
    setGuests(prev => prev.map(g => {
      if (g.id !== id) return g;
      const idx = RSVP_OPTIONS.indexOf(g.rsvpStatus);
      return { ...g, rsvpStatus: RSVP_OPTIONS[(idx + 1) % RSVP_OPTIONS.length] };
    }));
  };
  const confirmed = guests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const declined = guests.filter(g => g.rsvpStatus === 'Declined').length;
  const pending = guests.filter(g => g.rsvpStatus === 'Pending').length;

  // Itinerary logic
  const addItineraryItem = () => {
    const place = itineraryPlace.trim();
    if (!place) return;
    setItineraryItems(prev => [{ id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, day: itineraryDay.trim(), time: itineraryTime.trim(), place, notes: itineraryNotes.trim(), createdAt: Date.now() }, ...prev]);
    setItineraryDay(''); setItineraryTime(''); setItineraryPlace(''); setItineraryNotes('');
  };
  const removeItineraryItem = (id: string) => setItineraryItems(prev => prev.filter(i => i.id !== id));

  const tabs = [
    { id: 'saved', label: 'Saved Venues', icon: MapPin },
    { id: 'budget', label: 'Budget Planner', icon: PieIcon },
    { id: 'guests', label: 'Guest List', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'itinerary', label: 'Guest Itinerary', icon: MapPin },
  ];

  const TIMELINE = [
    { time: '14:00', title: 'Guest Arrival', desc: 'Welcome cocktails at the beachfront lounge — barefoot on the white Diani sand.', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format' },
    { time: '15:00', title: 'Ceremony', desc: 'Exchange vows under a floral arch with the Indian Ocean as your backdrop.', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&auto=format' },
    { time: '16:00', title: 'Cocktail Hour', desc: 'Sunset golden-hour photoshoot and canapés by the poolside.', img: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=400&auto=format' },
    { time: '17:30', title: 'Reception Entrance', desc: 'Grand entrance into the lantern-lit reception pavilion.', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format' },
    { time: '19:00', title: 'Dinner Service', desc: 'Swahili-fusion buffet with coastal delicacies and freshly caught seafood.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format' },
    { time: '21:00', title: 'Dancing', desc: 'Live band and DJ kick off the celebration under a canopy of stars.', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&auto=format' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-16 px-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-8 sm:mb-12">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&auto=format" alt="Diani Beach Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white/95" />
        </div>
        <div className="relative px-5 sm:px-12 py-12 sm:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-5 py-2 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
            Planning Hub
          </span>
          <h2 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight">
            Wedding Dashboard
          </h2>
          <p className="mt-4 sm:mt-6 text-white/80 max-w-2xl mx-auto text-sm sm:text-lg font-light leading-relaxed">
            Budget, guests, and timelines — everything you need for your perfect Diani Beach celebration.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 sm:mb-10">
        <div className="bg-white p-1 sm:p-1.5 rounded-2xl shadow-sm border border-amari-100 flex overflow-x-auto max-w-full no-scrollbar gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amari-500 text-white shadow-md'
                  : 'text-stone-500 hover:text-amari-600 hover:bg-amari-50'
              }`}
            >
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl min-h-[400px] p-4 sm:p-8 md:p-10 border border-amari-100">

        {/* ─── SAVED (BASKET) ───────────────────────────── */}
        {activeTab === 'saved' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amari-900 mb-1">Your Planning Basket</h3>
                <p className="text-stone-500 text-sm">Heart venues and vendors from the directory to collect them here.</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/vendors"
                  className="bg-amari-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amari-800 transition"
                >
                  Browse Vendors
                </Link>
                <Link
                  to="/wishlist"
                  className="bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-50 transition"
                >
                  Full Wishlist
                </Link>
              </div>
            </div>

            {savedItems.length === 0 ? (
              <div className="text-center py-14 sm:py-20">
                <div className="w-16 h-16 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-amari-300" size={28} />
                </div>
                <p className="text-stone-700 font-bold mb-2">No saved venues yet</p>
                <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
                  Go to the vendor directory and tap the heart icon to add venues/vendors to your basket.
                </p>
                <Link
                  to="/vendors"
                  className="inline-flex items-center justify-center bg-amari-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-amari-600 transition shadow-md"
                >
                  Explore Vendors
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-amari-500 text-sm font-bold mb-4">{savedItems.length} saved</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedItems.map((vendor) => (
                    <Link
                      key={vendor.id}
                      to={`/vendor/${vendor.id}`}
                      className="group bg-white rounded-2xl border border-stone-200/60 overflow-hidden hover:border-amari-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-44 overflow-hidden bg-stone-100">
                        <img
                          src={vendor.imageUrl}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="glass-dark text-white/90 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-3 py-1">
                            {vendor.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold text-stone-900 mb-1 line-clamp-1">{vendor.name}</p>
                        <p className="text-xs text-stone-400 line-clamp-1">{vendor.location}</p>
                        {vendor.description ? (
                          <p className="mt-2 text-sm text-stone-500 leading-relaxed line-clamp-2">{vendor.description}</p>
                        ) : (
                          <div className="mt-2 h-10" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── BUDGET ─────────────────────────────────── */}
        {activeTab === 'budget' && (
          <div>
            {/* Set Total Budget */}
            <div className="mb-6">
              {showBudgetSet ? (
                <div className="bg-gradient-to-r from-amari-50 to-white p-4 sm:p-5 rounded-2xl border border-amari-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-amari-500" />
                    <h3 className="text-sm font-bold text-amari-900">Set Your Total Wedding Budget</h3>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 leading-relaxed">Enter your total budget and we'll intelligently distribute it across categories based on typical wedding cost breakdowns.</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amari-400" />
                      <input
                        type="number"
                        value={totalBudgetInput}
                        onChange={(e) => setTotalBudgetInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') distributeBudget(); }}
                        placeholder="e.g. 15000"
                        className="w-full pl-9 pr-4 py-3 bg-white border border-amari-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amari-400 focus:border-amari-400"
                        min="0"
                      />
                    </div>
                    <button
                      onClick={distributeBudget}
                      disabled={!totalBudgetInput || Number(totalBudgetInput) <= 0}
                      className="bg-amari-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-amari-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                    >
                      <Target size={14} /> Distribute
                    </button>
                    <button
                      onClick={() => setShowBudgetSet(false)}
                      className="bg-stone-100 text-stone-500 px-4 py-3 rounded-xl text-sm font-bold hover:bg-stone-200 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowBudgetSet(true)}
                  className="w-full py-3 bg-gradient-to-r from-amari-50 to-white border border-amari-200 rounded-2xl text-amari-600 text-sm font-bold hover:shadow-md hover:border-amari-300 transition-all flex items-center justify-center gap-2"
                >
                  <Target size={15} /> Set Total Budget Estimate
                  {totalBudgetInput && Number(totalBudgetInput) > 0 && (
                    <span className="bg-amari-100 text-amari-700 px-2 py-0.5 rounded-full text-xs ml-1">
                      {fmt(Number(totalBudgetInput))}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Currency toggle */}
            <div className="flex justify-end mb-3">
              <div className="inline-flex bg-amari-50 rounded-xl border border-amari-100 p-0.5">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-amari-500 text-white shadow-sm' : 'text-stone-500 hover:text-amari-600'}`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency('KSH')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'KSH' ? 'bg-amari-500 text-white shadow-sm' : 'text-stone-500 hover:text-amari-600'}`}
                >
                  KSh
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Estimated</p>
                <p className="text-lg sm:text-2xl font-serif font-bold text-amari-600">{fmt(totalEstimated)}</p>
              </div>
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Spent</p>
                <p className={`text-lg sm:text-2xl font-serif font-bold ${totalActual > totalEstimated ? 'text-red-500' : 'text-amari-500'}`}>{fmt(totalActual)}</p>
              </div>
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Remaining</p>
                <p className={`text-lg sm:text-2xl font-serif font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>{fmt(remaining)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2 h-[280px] sm:h-[320px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetItems} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="estimated" cornerRadius={5} stroke="none">
                      {budgetItems.map((item, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(index, item.id)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmt(Number(value))} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
                  <DollarSign size={16} className="text-amari-300 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amari-900">{fmt(totalEstimated)}</p>
                </div>
              </div>

              {/* Editable table */}
              <div className="lg:col-span-3">
                <div className="overflow-hidden rounded-2xl border border-amari-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-amari-100/50 text-amari-900 uppercase text-[10px] sm:text-xs font-bold">
                      <tr>
                        <th className="px-3 sm:px-5 py-3">Category</th>
                        <th className="px-3 sm:px-5 py-3 text-right">Estimated</th>
                        <th className="px-3 sm:px-5 py-3 text-right">Actual</th>
                        <th className="px-2 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amari-50">
                      {budgetItems.map(item => (
                        <tr key={item.id} className="hover:bg-amari-50/50 transition-colors">
                          {editingBudgetId === item.id ? (
                            <>
                              <td className="px-3 sm:px-5 py-2">
                                <div className="flex items-center gap-2">
                                  <label className="relative flex-shrink-0 cursor-pointer">
                                    <span className="block w-5 h-5 rounded-full border border-stone-200" style={{ background: getColor(budgetItems.indexOf(item), item.id) }} />
                                    <input type="color" value={getColor(budgetItems.indexOf(item), item.id)} onChange={e => updateChartColor(item.id, e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                  </label>
                                  <input value={editBudget.category} onChange={e => setEditBudget(p => ({ ...p, category: e.target.value }))} className="w-full bg-amari-50 border border-amari-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amari-400" />
                                </div>
                              </td>
                              <td className="px-3 sm:px-5 py-2">
                                <input type="number" value={editBudget.estimated} onChange={e => setEditBudget(p => ({ ...p, estimated: Number(e.target.value) || 0 }))} className="w-full bg-amari-50 border border-amari-200 rounded-lg px-2 py-1.5 text-xs text-right outline-none focus:ring-1 focus:ring-amari-400" />
                              </td>
                              <td className="px-3 sm:px-5 py-2">
                                <input type="number" value={editBudget.actual} onChange={e => setEditBudget(p => ({ ...p, actual: Number(e.target.value) || 0 }))} className="w-full bg-amari-50 border border-amari-200 rounded-lg px-2 py-1.5 text-xs text-right outline-none focus:ring-1 focus:ring-amari-400" />
                              </td>
                              <td className="px-2 py-2">
                                <div className="flex gap-1">
                                  <button onClick={saveEditBudget} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                                  <button onClick={() => setEditingBudgetId(null)} className="p-1 text-stone-400 hover:bg-stone-50 rounded"><X size={14} /></button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 sm:px-5 py-3 font-medium text-stone-700 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                  <label className="relative flex-shrink-0 cursor-pointer group" title="Change chart color">
                                    <span className="block w-4 h-4 rounded-full border border-stone-200 group-hover:scale-110 transition" style={{ background: getColor(budgetItems.indexOf(item), item.id) }} />
                                    <input type="color" value={getColor(budgetItems.indexOf(item), item.id)} onChange={e => updateChartColor(item.id, e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                  </label>
                                  {item.category}
                                </div>
                              </td>
                              <td className="px-3 sm:px-5 py-3 text-right text-stone-500 text-xs sm:text-sm">{fmt(item.estimated)}</td>
                              <td className="px-3 sm:px-5 py-3 text-right font-medium text-amari-600 text-xs sm:text-sm">{fmt(item.actual)}</td>
                              <td className="px-2 py-3">
                                <div className="flex gap-1">
                                  <button onClick={() => startEditBudget(item)} className="p-1 text-stone-300 hover:text-amari-500 transition"><Edit3 size={13} /></button>
                                  <button onClick={() => removeBudgetItem(item.id)} className="p-1 text-stone-300 hover:text-red-500 transition"><Trash2 size={13} /></button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add new category */}
                {showAddBudget ? (
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 bg-amari-50 p-3 rounded-xl border border-amari-100">
                    <input value={newBudgetCategory} onChange={e => setNewBudgetCategory(e.target.value)} placeholder="Category name" className="flex-1 bg-white border border-amari-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
                    <input type="number" value={newBudgetEstimated} onChange={e => setNewBudgetEstimated(e.target.value)} placeholder={`Estimated ${currSymbol}`} className="w-28 bg-white border border-amari-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
                    <div className="flex gap-2">
                      <button onClick={addBudgetItem} className="bg-amari-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amari-600 transition"><Check size={14} /></button>
                      <button onClick={() => setShowAddBudget(false)} className="bg-stone-100 text-stone-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-stone-200 transition"><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddBudget(true)} className="mt-3 w-full py-2.5 border-2 border-dashed border-amari-200 rounded-xl text-amari-500 text-xs font-bold hover:bg-amari-50 transition flex items-center justify-center gap-1.5">
                    <Plus size={14} /> Add Category
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── GUESTS ─────────────────────────────────── */}
        {activeTab === 'guests' && (
          <div className="max-w-3xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
              <div className="bg-stone-50 p-3 rounded-xl text-center border border-stone-100">
                <p className="text-lg sm:text-2xl font-bold text-stone-800">{guests.length}</p>
                <p className="text-[9px] sm:text-xs text-stone-400 font-bold uppercase">Total</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-center border border-green-100">
                <p className="text-lg sm:text-2xl font-bold text-green-600">{confirmed}</p>
                <p className="text-[9px] sm:text-xs text-green-500 font-bold uppercase">Confirmed</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-100">
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">{pending}</p>
                <p className="text-[9px] sm:text-xs text-yellow-500 font-bold uppercase">Pending</p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl text-center border border-red-100">
                <p className="text-lg sm:text-2xl font-bold text-red-500">{declined}</p>
                <p className="text-[9px] sm:text-xs text-red-400 font-bold uppercase">Declined</p>
              </div>
            </div>

            {/* Add guest */}
            <div className="flex gap-2 sm:gap-3 mb-6">
              <input
                type="text"
                value={newGuestName}
                onChange={e => setNewGuestName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGuest()}
                placeholder="Enter guest name..."
                className="flex-1 bg-amari-50 border border-amari-100 px-4 py-3 rounded-xl outline-none text-sm text-amari-900 placeholder:text-stone-400 focus:ring-2 focus:ring-amari-400 focus:border-amari-400"
              />
              <button onClick={addGuest} className="bg-amari-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-amari-600 flex items-center gap-2 font-bold transition shadow-md text-sm flex-shrink-0">
                <Plus size={16} /> <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Guest cards */}
            <div className="space-y-2">
              {guests.map(guest => (
                <div key={guest.id} className="bg-white border border-stone-100 rounded-xl p-3 sm:p-4 flex items-center gap-3 hover:shadow-md hover:border-amari-200 transition-all">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amari-200 to-amari-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {guest.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 text-sm truncate">{guest.name}</p>
                  </div>
                  <button
                    onClick={() => cycleRsvp(guest.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 ${
                      guest.rsvpStatus === 'Confirmed' ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' :
                      guest.rsvpStatus === 'Declined' ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' :
                      'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                    }`}
                    title="Click to change RSVP status"
                  >
                    {guest.rsvpStatus === 'Confirmed' ? <UserCheck size={12} /> : guest.rsvpStatus === 'Declined' ? <UserX size={12} /> : <Clock size={12} />}
                    {guest.rsvpStatus}
                  </button>
                  <button onClick={() => removeGuest(guest.id)} className="text-stone-200 hover:text-red-400 transition p-1 flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {guests.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-amari-200" size={28} />
                </div>
                <p className="text-stone-400 text-sm">Your guest list is empty. Start adding guests above.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TIMELINE ───────────────────────────────── */}
        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amari-900 mb-2">Your Wedding Day</h3>
              <p className="text-stone-500 text-sm">A sample timeline for a perfect Diani Beach celebration.</p>
            </div>

            <div className="space-y-4">
              {TIMELINE.map((event, idx) => (
                <div key={idx} className="group bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amari-200 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 md:w-40 flex-shrink-0 h-32 sm:h-auto relative overflow-hidden">
                      <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 sm:bg-gradient-to-t sm:from-transparent sm:to-black/10" />
                    </div>
                    <div className="flex-1 p-4 sm:p-5 flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className="inline-block px-3 py-1.5 bg-amari-100 text-amari-800 text-xs font-bold rounded-full">{event.time}</span>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-amari-900 mb-1">{event.title}</h4>
                        <p className="text-stone-500 text-sm leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ITINERARY ──────────────────────────────── */}
        {activeTab === 'itinerary' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amari-900 mb-1">Guest Itinerary</h3>
              <p className="text-stone-500 text-sm">Plan activities for your guests during their Diani stay.</p>
            </div>

            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Day</label>
                  <input value={itineraryDay} onChange={e => setItineraryDay(e.target.value)} placeholder="e.g. Friday" className="w-full bg-white border border-amari-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Time</label>
                  <input value={itineraryTime} onChange={e => setItineraryTime(e.target.value)} placeholder="e.g. 10:00 AM" className="w-full bg-white border border-amari-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Place / Activity</label>
                  <input value={itineraryPlace} onChange={e => setItineraryPlace(e.target.value)} placeholder="e.g. Wasini Island Snorkelling Trip" className="w-full bg-white border border-amari-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Notes <span className="normal-case text-stone-400">(optional)</span></label>
                  <textarea value={itineraryNotes} onChange={e => setItineraryNotes(e.target.value)} placeholder="Helpful details for guests..." rows={2} className="w-full bg-white border border-amari-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amari-400 resize-none" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={addItineraryItem} disabled={!itineraryPlace.trim()} className="bg-amari-500 text-white px-5 py-2.5 rounded-xl hover:bg-amari-600 flex items-center gap-2 font-bold transition shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <Plus size={15} /> Add
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {itineraryItems.map(item => (
                <div key={item.id} className="bg-white border border-amari-100 rounded-xl p-4 flex gap-3 items-start hover:shadow-md transition">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amari-100 flex items-center justify-center">
                    <MapPin size={16} className="text-amari-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {(item.day || item.time) && (
                        <span className="px-2 py-0.5 bg-amari-50 text-amari-700 text-[10px] font-bold rounded-full border border-amari-100">
                          {item.day}{item.day && item.time ? ' • ' : ''}{item.time}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-800 text-sm">{item.place}</h4>
                    {item.notes && <p className="mt-1 text-xs text-stone-500 leading-relaxed">{item.notes}</p>}
                  </div>
                  <button onClick={() => removeItineraryItem(item.id)} className="text-stone-200 hover:text-red-400 transition p-1 flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              {itineraryItems.length === 0 && (
                <div className="text-center py-14">
                  <div className="w-14 h-14 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-amari-100">
                    <MapPin className="text-amari-200" size={24} />
                  </div>
                  <p className="text-stone-400 text-sm">No itinerary items yet. Suggest places like Wasini Island, Colobus Conservation, or Ali Barbour's Cave.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningTools;