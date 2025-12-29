import React, { useState } from 'react';
import { Plane, Calendar, MapPin, Search } from 'lucide-react';

const AirlineBooking: React.FC = () => {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // Simulate API delay
    setTimeout(() => {
      setResults([
        { id: 1, airline: 'Kenya Airways', time: '06:00 - 07:00', price: '$85', stops: 'Direct' },
        { id: 2, airline: 'Jambojet', time: '10:30 - 11:30', price: '$72', stops: 'Direct' },
        { id: 3, airline: 'Safarilink', time: '14:00 - 15:15', price: '$95', stops: 'Direct' },
        { id: 4, airline: 'Skyward Express', time: '16:45 - 17:45', price: '$68', stops: 'Direct' },
      ]);
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-amari-500">Flight Booking</h2>
        <p className="text-stone-600 mt-2">Find the best flights to Ukunda (Diani) for you and your guests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase">From</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-stone-50 focus-within:ring-2 ring-amari-500">
              <Plane size={18} className="text-stone-400 mr-2" />
              <input type="text" placeholder="Nairobi (WIL)" className="bg-transparent w-full outline-none text-sm" defaultValue="Nairobi (WIL)" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase">To</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-stone-50 focus-within:ring-2 ring-amari-500">
              <MapPin size={18} className="text-stone-400 mr-2" />
              <input type="text" value="Ukunda (UKA)" readOnly className="bg-transparent w-full outline-none text-sm font-semibold text-amari-900" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase">Depart</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-stone-50 focus-within:ring-2 ring-amari-500">
              <Calendar size={18} className="text-stone-400 mr-2" />
              <input type="date" className="bg-transparent w-full outline-none text-sm" />
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-stone-900 text-white py-2.5 rounded-lg hover:bg-stone-700 transition flex items-center justify-center gap-2">
              {searching ? 'Searching...' : <><Search size={18} /> Find Flights</>}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="mt-8 space-y-4">
        {results.map(flight => (
          <div key={flight.id} className="bg-white border border-stone-100 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                <Plane size={20} className="text-amari-600 transform -rotate-45" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">{flight.airline}</h4>
                <p className="text-sm text-stone-500">{flight.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                    <p className="text-xs text-stone-400 font-medium uppercase">{flight.stops}</p>
                    <p className="text-xl font-bold text-amari-600">{flight.price}</p>
                </div>
                <button className="px-6 py-2 border border-amari-500 text-amari-600 rounded-full hover:bg-amari-50 transition text-sm font-medium">
                    Select
                </button>
            </div>
          </div>
        ))}
        {results.length > 0 && (
            <div className="text-center mt-8">
                <p className="text-sm text-stone-400">Prices are per person, one way. Baggage fees may apply.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AirlineBooking;
