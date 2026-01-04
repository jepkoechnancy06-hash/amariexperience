import { Vendor, VendorCategory, BudgetItem, Guest } from './types';

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
