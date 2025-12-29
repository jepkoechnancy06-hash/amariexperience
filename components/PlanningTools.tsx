import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { INITIAL_BUDGET, INITIAL_GUESTS } from '../constants';
import { BudgetItem, Guest, ItineraryItem } from '../types';
import { Plus, Trash2, PieChart as PieIcon, Users, Calendar, MapPin } from 'lucide-react';

const ITINERARY_STORAGE_KEY = 'amari_guest_itinerary_v1';

// Use the existing Amari theme palette (defined in index.html)
const COLORS = [
  'var(--amari-500)',
  'var(--amari-300)',
  'var(--amari-600)',
  'var(--amari-200)',
  'var(--amari-100)',
  'var(--amari-50)',
];

const PlanningTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budget' | 'guests' | 'timeline' | 'itinerary'>('budget');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [newGuestName, setNewGuestName] = useState('');

  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [itineraryDay, setItineraryDay] = useState('');
  const [itineraryTime, setItineraryTime] = useState('');
  const [itineraryPlace, setItineraryPlace] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ITINERARY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ItineraryItem[];
      if (Array.isArray(parsed)) setItineraryItems(parsed);
    } catch {
      // Ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itineraryItems));
    } catch {
      // Ignore storage write issues
    }
  }, [itineraryItems]);

  // Budget Logic
  const totalEstimated = budgetItems.reduce((acc, item) => acc + item.estimated, 0);
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);

  // Guest Logic
  const addGuest = () => {
    if (newGuestName.trim()) {
      setGuests([...guests, { id: Date.now().toString(), name: newGuestName, rsvpStatus: 'Pending', table: null }]);
      setNewGuestName('');
    }
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const addItineraryItem = () => {
    const day = itineraryDay.trim();
    const time = itineraryTime.trim();
    const place = itineraryPlace.trim();
    const notes = itineraryNotes.trim();

    if (!day && !time && !place && !notes) return;
    if (!place) return;

    const newItem: ItineraryItem = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      day,
      time,
      place,
      notes,
      createdAt: Date.now(),
    };

    setItineraryItems((prev) => [newItem, ...prev]);
    setItineraryDay('');
    setItineraryTime('');
    setItineraryPlace('');
    setItineraryNotes('');
  };

  const removeItineraryItem = (id: string) => {
    setItineraryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const tabs = [
      { id: 'budget', label: 'Budget Planner', icon: PieIcon },
      { id: 'guests', label: 'Guest List', icon: Users },
      { id: 'timeline', label: 'Timeline', icon: Calendar },
      { id: 'itinerary', label: 'Guest Itinerary', icon: MapPin },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2400&auto=format&fit=crop"
            alt="Ocean horizon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            Planning Hub
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Wedding Dashboard
          </h2>
          <p className="mt-6 text-amari-50 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Keep budget, guests, and timelines aligned — so you can focus on the sea, the sunset, and the moment you say “I do.”
          </p>
        </div>
      </div>
      
      {/* Custom Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-amari-100 inline-flex">
            {tabs.map((tab) => (
                <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'bg-amari-500 text-white shadow-md' 
                    : 'text-stone-500 hover:text-amari-600 hover:bg-amari-50'
                }`}
                >
                <tab.icon size={16} />
                {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl min-h-[500px] p-8 md:p-12 border border-amari-100">
        
        {/* BUDGET TOOL */}
        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[400px] w-full relative">
              <h3 className="text-xl font-bold mb-4 text-amari-900 font-serif text-center absolute top-0 w-full">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetItems as any[]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="estimated"
                    cornerRadius={6}
                    stroke="none"
                  >
                    {budgetItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Total */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Total</p>
                  <p className="text-2xl font-bold text-amari-900">${totalEstimated.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amari-50 p-6 rounded-2xl border border-amari-100">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Estimated</p>
                    <p className="text-3xl font-serif font-bold text-amari-600">${totalEstimated.toLocaleString()}</p>
                  </div>
                  <div className="bg-amari-50 p-6 rounded-2xl border border-amari-100">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Actual</p>
                    <p className={`text-3xl font-serif font-bold ${totalActual > totalEstimated ? 'text-amari-terracotta' : 'text-amari-500'}`}>${totalActual.toLocaleString()}</p>
                  </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-amari-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-amari-100/50 text-amari-900 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Est ($)</th>
                      <th className="px-6 py-4 text-right">Act ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amari-100">
                    {budgetItems.map(item => (
                      <tr key={item.id} className="hover:bg-amari-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-stone-700">{item.category}</td>
                        <td className="px-6 py-4 text-right text-stone-500">{item.estimated}</td>
                        <td className="px-6 py-4 text-right font-medium text-amari-600">{item.actual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GUEST LIST TOOL */}
        {activeTab === 'guests' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 mb-8 p-2 bg-amari-50 rounded-2xl border border-amari-100">
              <input 
                type="text" 
                value={newGuestName} 
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Enter guest name..."
                className="flex-1 bg-transparent px-4 py-2 outline-none text-amari-900 placeholder:text-stone-400"
              />
              <button 
                onClick={addGuest}
                className="bg-amari-500 text-white px-6 py-3 rounded-xl hover:bg-amari-600 flex items-center gap-2 font-bold transition shadow-md"
              >
                <Plus size={18} /> Add Guest
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guests.map(guest => (
                <div key={guest.id} className="group bg-white border border-amari-100 rounded-2xl p-5 flex justify-between items-center hover:shadow-lg hover:border-amari-200 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amari-100 flex items-center justify-center text-amari-600 font-serif font-bold text-lg">
                        {guest.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-amari-900">{guest.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className={`w-2 h-2 rounded-full ${
                            guest.rsvpStatus === 'Confirmed' ? 'bg-green-400' :
                            guest.rsvpStatus === 'Declined' ? 'bg-red-400' :
                            'bg-yellow-400'
                            }`}></span>
                            <span className="text-xs text-stone-500">{guest.rsvpStatus}</span>
                        </div>
                    </div>
                  </div>
                  <button onClick={() => removeGuest(guest.id)} className="text-stone-300 hover:text-amari-terracotta transition p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            {guests.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-amari-200" size={32} />
                    </div>
                    <p className="text-stone-400">Your guest list is currently empty.</p>
                </div>
            )}
          </div>
        )}

        {/* TIMELINE TOOL */}
        {activeTab === 'timeline' && (
          <div className="relative pl-8 md:pl-0 max-w-2xl mx-auto py-8">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-amari-200 transform -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-[39px] top-0 bottom-0 w-px bg-amari-200 block md:hidden"></div>

            {[
              { time: '14:00', title: 'Guest Arrival', desc: 'Welcome drinks at the Nomad Beach Bar.' },
              { time: '15:00', title: 'Ceremony', desc: 'Beachfront vows exchange under the floral arch.' },
              { time: '16:00', title: 'Cocktail Hour', desc: 'Photoshoot and hors d\'oeuvres.' },
              { time: '17:30', title: 'Reception Entrance', desc: 'Grand entrance at the reception hall.' },
              { time: '19:00', title: 'Dinner Service', desc: 'Swahili buffet and speeches.' },
              { time: '21:00', title: 'Dancing', desc: 'DJ starts the party under the stars.' },
            ].map((event, idx) => (
              <div key={idx} className={`relative mb-12 flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                 {/* Dot */}
                <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-amari-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 z-10 hidden md:block"></div>
                
                {/* Mobile Dot */}
                <div className="absolute left-8 w-6 h-6 bg-amari-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 z-10 block md:hidden"></div>

                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right">
                   {idx % 2 !== 0 && (
                       <div className="md:pr-12">
                           <span className="inline-block px-3 py-1 bg-amari-100 text-amari-800 text-xs font-bold rounded-full mb-2">{event.time}</span>
                           <h5 className="text-xl font-serif font-bold text-amari-900 mb-2">{event.title}</h5>
                           <p className="text-stone-500 text-sm leading-relaxed">{event.desc}</p>
                       </div>
                   )}
                   {idx % 2 === 0 && <div className="hidden md:block"></div>}
                </div>
                
                <div className="w-full md:w-1/2 pl-16 md:pl-12 text-left">
                   {idx % 2 === 0 && (
                        <div>
                           <span className="inline-block px-3 py-1 bg-amari-100 text-amari-800 text-xs font-bold rounded-full mb-2">{event.time}</span>
                           <h5 className="text-xl font-serif font-bold text-amari-900 mb-2">{event.title}</h5>
                           <p className="text-stone-500 text-sm leading-relaxed">{event.desc}</p>
                       </div>
                   )}
                   {idx % 2 !== 0 && <div className="hidden md:block"></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GUEST ITINERARY TOOL */}
        {activeTab === 'itinerary' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-amari-900 mb-2">Places to Visit</h3>
              <p className="text-stone-500">Create a simple itinerary for guests: day, time, and what to do.</p>
            </div>

            <div className="bg-amari-50 rounded-3xl border border-amari-100 p-6 md:p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Day</label>
                  <input
                    value={itineraryDay}
                    onChange={(e) => setItineraryDay(e.target.value)}
                    placeholder="e.g. Friday"
                    className="w-full bg-white border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Time</label>
                  <input
                    value={itineraryTime}
                    onChange={(e) => setItineraryTime(e.target.value)}
                    placeholder="e.g. 10:00"
                    className="w-full bg-white border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Place / Activity</label>
                  <input
                    value={itineraryPlace}
                    onChange={(e) => setItineraryPlace(e.target.value)}
                    placeholder="e.g. Snorkelling / Spa / Tour"
                    className="w-full bg-white border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Notes (optional)</label>
                  <textarea
                    value={itineraryNotes}
                    onChange={(e) => setItineraryNotes(e.target.value)}
                    placeholder="Add helpful details for guests..."
                    rows={3}
                    className="w-full bg-white border border-amari-100 rounded-2xl px-4 py-3 outline-none text-amari-900 placeholder:text-stone-400 resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={addItineraryItem}
                  className="bg-amari-500 text-white px-6 py-3 rounded-xl hover:bg-amari-600 flex items-center gap-2 font-bold transition shadow-md"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {itineraryItems.map((item) => (
                <div key={item.id} className="bg-white border border-amari-100 rounded-2xl p-6 flex gap-4 justify-between items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-amari-100 text-amari-800 text-xs font-bold rounded-full">
                        {item.day || 'Day'}{item.time ? ` • ${item.time}` : ''}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-amari-500">Guest Itinerary</span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-amari-900 leading-snug break-words">{item.place}</h4>
                    {item.notes && (
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed whitespace-pre-line break-words">{item.notes}</p>
                    )}
                  </div>
                  <button onClick={() => removeItineraryItem(item.id)} className="text-stone-300 hover:text-amari-terracotta transition p-2 flex-shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {itineraryItems.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amari-100">
                    <MapPin className="text-amari-200" size={32} />
                  </div>
                  <p className="text-stone-400">No itinerary items yet. Add your first place to visit.</p>
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