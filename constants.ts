import { Vendor, VendorCategory, BudgetItem, Guest, WeddingVendorCategory } from './types';

export const WEDDING_VENDOR_CATEGORIES: Array<{ category: WeddingVendorCategory; examples: string[] }> = [
  {
    category: 'Venues',
    examples: ['Hotels', 'Resorts', 'Villas', 'Private Properties', 'Gardens', 'Beaches', 'Rooftops', 'Safari Lodges', 'Historic Venues']
  },
  {
    category: 'Planning & Coordination',
    examples: ['Wedding Planners', 'Destination Planners', 'Day-of Coordinators', 'Guest Logistics Coordinators']
  },
  {
    category: 'Tents, Structures & Event Infrastructure',
    examples: ['Tents', 'Marquees', 'Clear Span', 'Flooring', 'Staging', 'Rigging']
  },
  {
    category: 'Décor, Styling & Rentals',
    examples: ['Stylists', 'Floral Designers', 'Furniture Rentals', 'Linen/Tableware', 'Lighting', 'Arches & Backdrops']
  },
  {
    category: 'Catering & Bar Services',
    examples: ['Caterers', 'Private Chefs', 'Mobile Caterers', 'Bar Services', 'Mixologists']
  },
  {
    category: 'Cakes & Desserts',
    examples: ['Wedding Cakes', 'Custom Cakes', 'Dessert Tables', 'Pastry Chefs']
  },
  {
    category: 'Photography, Videography & Content',
    examples: ['Photographers', 'Videographers', 'Cinematographers', 'Drone Operators', 'Content Creators', 'Reels Creators']
  },
  {
    category: 'Beauty & Grooming',
    examples: ['Hair', 'Makeup', 'Grooming', 'Skincare', 'Nail Services']
  },
  {
    category: 'Fashion & Attire',
    examples: ['Bridal Gowns', 'Bridal Boutiques', 'Suits', 'Tailors', 'Bridesmaid Dresses', 'Traditional Attire']
  },
  {
    category: 'Entertainment & Sound',
    examples: ['DJs', 'Live Bands', 'Musicians', 'Saxophonists', 'Violinists', 'Cultural Performers', 'MCs', 'Sound System Providers']
  },
  {
    category: 'Transport & Travel',
    examples: ['Bridal Cars', 'Luxury Vehicles', 'Guest Shuttles', 'Boats/Yachts', 'Helicopters', 'Airport Transfers']
  },
  {
    category: 'Accommodation & Guest Services',
    examples: ['Hotels', 'Resorts', 'Villas', 'Guesthouses', 'Airbnb Hosts', 'Concierge Services']
  },
  {
    category: 'Experiences & Activities',
    examples: ['Tour Operators', 'Safari Operators', 'Boat Tours', 'Snorkelling/Diving', 'Spa & Wellness', 'Cultural Experiences', 'Adventure Activities']
  },
  {
    category: 'Stationery, Signage & Personalisation',
    examples: ['Invitations', 'Calligraphy', 'Signage', 'Seating Charts', 'Custom Stationery']
  },
  {
    category: 'Lighting, AV & Special Effects',
    examples: ['Event Lighting', 'Audio-Visual', 'Projection Mapping', 'Fireworks', 'Smoke/Fog Effects']
  },
  {
    category: 'Gifts, Favors & Extras',
    examples: ['Wedding Favors', 'Custom Gifts', 'Welcome Boxes', 'Hampers']
  },
  {
    category: 'Legal & Ceremonial Services',
    examples: ['Officiants', 'Civil Registrars', 'Religious Leaders', 'Marriage Legal Support', 'Vow Renewal Officiants']
  },
  {
    category: 'Security, Safety & Operations',
    examples: ['Event Security', 'Medical Standby', 'Crowd Control']
  },
  {
    category: 'Cleanup & Post-Event Services',
    examples: ['Cleanup Companies', 'Waste Management', 'Equipment Breakdown Crews']
  },
  {
    category: 'Tech & Digital Services',
    examples: ['Wedding Website Designers', 'RSVP Management', 'Live Streaming', 'Wedding App Developers']
  },
  {
    category: 'Miscellaneous Services',
    examples: ['Childcare', 'Pet Handlers', 'Accessibility Services', 'Weather Contingency Planning']
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Diani Beach Palace',
    category: VendorCategory.Venue,
    rating: 4.9,
    priceRange: '$$$$',
    description: 'Luxurious beachfront venue with pristine white sands and ocean views for unforgettable ceremonies.',
    imageUrl: '/beach.jpeg',
    location: 'Diani Beach Road'
  },
  {
    id: '2',
    name: 'Coastal Dreams Weddings',
    category: VendorCategory.Planner,
    rating: 4.8,
    priceRange: '$$$',
    description: 'Expert destination wedding planning team specializing in Diani Coast celebrations.',
    imageUrl: '/coastalweddingdreams.jpeg',
    location: 'Diani Beach'
  },
  {
    id: '3',
    name: 'Swahili Coastal Cuisine',
    category: VendorCategory.Caterer,
    rating: 4.7,
    priceRange: '$$',
    description: 'Authentic coastal cuisine blending traditional Swahili flavors with modern culinary excellence.',
    imageUrl: '/swahili-cuisine.jpg',
    location: 'Diani Coast'
  },
  {
    id: '4',
    name: 'Ocean Lens Photography',
    category: VendorCategory.Photographer,
    rating: 5.0,
    priceRange: '$$$',
    description: 'Professional photography and film services capturing the magic of destination weddings.',
    imageUrl: 'https://picsum.photos/id/250/400/300',
    location: 'Diani Beach'
  },
  {
    id: '5',
    name: 'Diani Guest Transfers',
    category: VendorCategory.Transport,
    rating: 4.6,
    priceRange: '$$',
    description: 'Reliable transport services and guest experiences throughout the Diani Coast.',
    imageUrl: '/DianiGuestTravels.jpeg',
    location: 'Ukunda Airstrip'
  },
  {
    id: '6',
    name: 'Paradise Beach Resort',
    category: VendorCategory.Venue,
    rating: 4.8,
    priceRange: '$$$$',
    description: 'Exclusive beachfront resort with tropical gardens and private beach access.',
    imageUrl: '/beachdianiresort.jpeg',
    location: 'Diani Beach'
  }
];

export const INITIAL_BUDGET: BudgetItem[] = [
  { id: '1', category: 'Venue', estimated: 5000, actual: 4800 },
  { id: '2', category: 'Catering', estimated: 3000, actual: 3200 },
  { id: '3', category: 'Photography', estimated: 1500, actual: 0 },
  { id: '4', category: 'Attire', estimated: 2000, actual: 0 },
  { id: '5', category: 'Decor', estimated: 1200, actual: 0 },
  { id: '6', category: 'Transport', estimated: 500, actual: 0 },
];

export const INITIAL_GUESTS: Guest[] = [
  { id: '1', name: 'John Doe', rsvpStatus: 'Confirmed', table: 1 },
  { id: '2', name: 'Jane Smith', rsvpStatus: 'Pending', table: 1 },
  { id: '3', name: 'Michael Johnson', rsvpStatus: 'Declined', table: null },
];
