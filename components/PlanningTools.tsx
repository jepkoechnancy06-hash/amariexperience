import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { INITIAL_BUDGET, INITIAL_GUESTS } from '../constants';
import { BudgetItem, Guest, ItineraryItem } from '../types';
import { Plus, Trash2, PieChart as PieIcon, Users, Calendar, MapPin, Edit3, Check, X, DollarSign, UserCheck, UserX, Clock } from 'lucide-react';

const ITINERARY_STORAGE_KEY = 'amari_guest_itinerary_v1';
const BUDGET_STORAGE_KEY = 'amari_budget_v1';
const GUESTS_STORAGE_KEY = 'amari_guests_v1';

const COLORS = [
  '#8b6f47', '#b8956a', '#6b5436', '#d4b896', '#a3845c', '#e8d5bc',
];

const RSVP_OPTIONS: Array<Guest['rsvpStatus']> = ['Pending', 'Confirmed', 'Declined'];

const PlanningTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budget' | 'guests' | 'timeline' | 'itinerary'>('budget');

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

  // Budget logic
  const totalEstimated = budgetItems.reduce((a, i) => a + i.estimated, 0);
  const totalActual = budgetItems.reduce((a, i) => a + i.actual, 0);
  const remaining = totalEstimated - totalActual;

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

        {/* ─── BUDGET ─────────────────────────────────── */}
        {activeTab === 'budget' && (
          <div>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Estimated</p>
                <p className="text-lg sm:text-2xl font-serif font-bold text-amari-600">${totalEstimated.toLocaleString()}</p>
              </div>
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Spent</p>
                <p className={`text-lg sm:text-2xl font-serif font-bold ${totalActual > totalEstimated ? 'text-red-500' : 'text-amari-500'}`}>${totalActual.toLocaleString()}</p>
              </div>
              <div className="bg-amari-50 p-3 sm:p-5 rounded-2xl border border-amari-100 text-center">
                <p className="text-[9px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Remaining</p>
                <p className={`text-lg sm:text-2xl font-serif font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>${remaining.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2 h-[280px] sm:h-[320px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetItems} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="estimated" cornerRadius={5} stroke="none">
                      {budgetItems.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
                  <DollarSign size={16} className="text-amari-300 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amari-900">${totalEstimated.toLocaleString()}</p>
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
                                <input value={editBudget.category} onChange={e => setEditBudget(p => ({ ...p, category: e.target.value }))} className="w-full bg-amari-50 border border-amari-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amari-400" />
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
                              <td className="px-3 sm:px-5 py-3 font-medium text-stone-700 text-xs sm:text-sm">{item.category}</td>
                              <td className="px-3 sm:px-5 py-3 text-right text-stone-500 text-xs sm:text-sm">${item.estimated.toLocaleString()}</td>
                              <td className="px-3 sm:px-5 py-3 text-right font-medium text-amari-600 text-xs sm:text-sm">${item.actual.toLocaleString()}</td>
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
                    <input type="number" value={newBudgetEstimated} onChange={e => setNewBudgetEstimated(e.target.value)} placeholder="Estimated $" className="w-28 bg-white border border-amari-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amari-400" />
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