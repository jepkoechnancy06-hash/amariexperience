export enum VendorCategory {
  Venue = 'Venue',
  Planner = 'Planner',
  Photographer = 'Photographer',
  Caterer = 'Caterer',
  Stylist = 'Stylist',
  Transport = 'Transport'
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  rating: number;
  priceRange: '$$' | '$$$' | '$$$$';
  description: string;
  imageUrl: string;
  location: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
}

export interface Guest {
  id: string;
  name: string;
  rsvpStatus: 'Pending' | 'Confirmed' | 'Declined';
  table: number | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type WeddingVendorCategory =
  | 'Venues'
  | 'Planning & Coordination'
  | 'Tents, Structures & Event Infrastructure'
  | 'Décor, Styling & Rentals'
  | 'Catering & Bar Services'
  | 'Cakes & Desserts'
  | 'Photography, Videography & Content'
  | 'Beauty & Grooming'
  | 'Fashion & Attire'
  | 'Entertainment & Sound'
  | 'Transport & Travel'
  | 'Accommodation & Guest Services'
  | 'Experiences & Activities'
  | 'Stationery, Signage & Personalisation'
  | 'Lighting, AV & Special Effects'
  | 'Gifts, Favors & Extras'
  | 'Legal & Ceremonial Services'
  | 'Security, Safety & Operations'
  | 'Cleanup & Post-Event Services'
  | 'Tech & Digital Services'
  | 'Miscellaneous Services';

export type PricingModel = 'flat_rate' | 'per_person' | 'per_hour' | 'package_based' | 'custom';

export type YesNo = 'Yes' | 'No';

export type VendorVerificationDocumentType =
  | 'Business registration / certificate of incorporation'
  | 'Valid trade license or permit'
  | 'Professional license'
  | 'VAT or tax registration document'
  | 'Proof of previous wedding service';

export interface VendorApplication {
  id: string;
  businessName: string;
  vendorCategory: WeddingVendorCategory | '';
  vendorSubcategories: string[];
  businessDescription: string;
  primaryLocation: string;
  areasServed: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  socialLinks: string;
  realWorkImages: Array<File | string>;

  startingPrice: string;
  pricingModel: PricingModel | '';
  startingPriceIncludes: string;
  minimumBookingRequirement: string;

  advanceBookingNotice: string;
  setupTimeRequired: string;
  breakdownTimeRequired: string;
  outdoorExperience: YesNo | '';
  destinationWeddingExperience: YesNo | '';
  specialRequirements: string;

  categorySpecific: Record<string, any>;

  verificationDocumentType: VendorVerificationDocumentType | '';
  verificationDocument: File | string | null;

  termsAccepted: boolean;

  verificationDocumentUploaded?: boolean;
  verifiedBy?: string;
  dateVerified?: number | null;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  submittedAt: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface InspirationPost {
  id: string;
  authorType: 'Guest' | 'Vendor';
  authorName: string;
  title: string;
  imageUrl?: string;
  imageDataUrl?: string;
  story: string;
  createdAt: number;
}

export interface ItineraryItem {
  id: string;
  day: string;
  time: string;
  place: string;
  notes: string;
  createdAt: number;
}
