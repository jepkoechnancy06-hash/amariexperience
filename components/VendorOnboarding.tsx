import React, { useState, useEffect, useRef } from 'react';
import { submitApplication, getLatestApplicationByUserId } from '../services/vendorService';
import { initializeDatabase } from '../lib/db';
import { CheckCircle, Store, MapPin, Phone, Mail, ArrowRight, Upload, Info, Globe, Target, Eye, Waves } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WEDDING_VENDOR_CATEGORIES } from '../constants';

// Declare Leaflet on window object
declare global {
  interface Window {
    L: any;
  }
}

const VendorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [mapCenter] = useState({ lat: -4.2767, lng: 39.5935 }); // Diani Beach coordinates
  const [leafletReady, setLeafletReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    vendorCategory: '' as any,
    vendorSubcategories: '' as string,
    businessDescription: '',
    vendorStory: '',
    otherServices: '',
    primaryLocation: '',
    areasServed: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    socialLinks: '',
    socialInstagram: '',
    socialFacebook: '',
    socialTiktok: '',
    socialTwitter: '',
    socialYoutube: '',
    realWorkImages: [] as File[],

    startingPrice: '',
    pricingModel: '' as any,
    startingPriceIncludes: '',
    minimumBookingRequirement: '',

    advanceBookingNotice: '',
    setupTimeRequired: '',
    breakdownTimeRequired: '',
    outdoorExperience: '' as any,
    destinationWeddingExperience: '' as any,
    specialRequirements: '',

    categorySpecific: {} as Record<string, any>,

    verificationDocumentType: '' as any,
    verificationDocument: null as File | null,

    termsAccepted: false
  });

  useEffect(() => {
    // Initialize database on component mount
    initializeDatabase().then(success => {
      if (success) {
        console.log('Database initialized successfully');
      } else {
        console.error('Failed to initialize database');
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactEmail: user.email || prev.contactEmail,
        contactPhone: user.phone || prev.contactPhone
      }));

      getLatestApplicationByUserId(user.id)
        .then((app) => {
          if (!app) return;
          setExistingStatus(app.status);
          setSubmitted(true);
        })
        .catch(() => {
          // ignore
        });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Load OpenStreetMap script
    if (window.L) { setLeafletReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && window.L) {
      const map = window.L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

      let marker: any = null;

      const onMapClick = (e: any) => {
        const { lat, lng } = e.latlng;

        if (marker) {
          marker.remove();
        }

        marker = window.L.marker([lat, lng]).addTo(map);

        // Reverse geocoding to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedLocation({ lat, lng, address });
            setFormData(prev => ({ ...prev, primaryLocation: address }));
          })
          .catch(() => {
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedLocation({ lat, lng, address });
            setFormData(prev => ({ ...prev, primaryLocation: address }));
          });
      };

      map.on('click', onMapClick);

      return () => {
        map.remove();
      };
    }
  }, [mapCenter, leafletReady]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'vendorCategory') {
        return { ...prev, [name]: value, categorySpecific: {} };
      }
      return { ...prev, [name]: value };
    });
  };

  const setCategorySpecific = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      categorySpecific: {
        ...(prev.categorySpecific || {}),
        [key]: value
      }
    }));
  };

  type CategoryField = {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select';
    required?: boolean;
    options?: string[];
    placeholder?: string;
  };

  const CATEGORY_FIELDS: Record<string, { title: string; fields: CategoryField[] }> = {
    'Venues': {
      title: 'Venue details',
      fields: [
        { key: 'venueCapacity', label: 'Capacity (guests)', type: 'number', required: true, placeholder: 'e.g. 120' },
        {
          key: 'venueType',
          label: 'Venue type',
          type: 'select',
          required: true,
          options: ['Hotel', 'Resort', 'Villa', 'Private beach', 'Garden', 'Restaurant', 'Other']
        },
        {
          key: 'hireType',
          label: 'Hire type',
          type: 'select',
          required: true,
          options: ['Venue-only', 'Inclusive package', 'Minimum spend', 'Custom']
        },
        {
          key: 'cateringPolicy',
          label: 'Catering policy',
          type: 'select',
          required: true,
          options: ['In-house only', 'Approved vendor list', 'External allowed (fee)', 'External allowed (no fee)']
        },
        { key: 'noiseCutoff', label: 'Noise cutoff / end time', type: 'text', placeholder: 'e.g. 10:00 PM' },
        { key: 'backupPlan', label: 'Weather backup plan', type: 'textarea', placeholder: 'Tents, indoor hall, etc.' }
      ]
    },
    'Planning & Coordination': {
      title: 'Planner details',
      fields: [
        {
          key: 'plannerServices',
          label: 'Services offered',
          type: 'textarea',
          required: true,
          placeholder: 'Full planning, partial planning, day-of coordination, etc.'
        },
        { key: 'teamSize', label: 'Team size (approx.)', type: 'number', placeholder: 'e.g. 4' },
        { key: 'planningTimelineSupport', label: 'Timeline & vendor management approach', type: 'textarea' },
        {
          key: 'preferredWeddingTypes',
          label: 'Preferred wedding styles/types',
          type: 'text',
          placeholder: 'Beach, luxury, intimate, multicultural, etc.'
        }
      ]
    },
    'Tents, Structures & Event Infrastructure': {
      title: 'Tents & infrastructure',
      fields: [
        { key: 'inventory', label: 'Inventory summary', type: 'textarea', required: true, placeholder: 'Tents, stages, flooring, toilets, etc.' },
        { key: 'maxCoverage', label: 'Max coverage (sqm or guests)', type: 'text', placeholder: 'e.g. 300 sqm' },
        { key: 'setupCrew', label: 'Setup crew / operations details', type: 'textarea' },
        { key: 'safetyCompliance', label: 'Safety compliance / certifications', type: 'textarea' }
      ]
    },
    'Décor, Styling & Rentals': {
      title: 'Décor & rentals',
      fields: [
        { key: 'decorStyles', label: 'Décor styles offered', type: 'text', required: true, placeholder: 'Modern, tropical, boho, classic, etc.' },
        { key: 'rentalInventory', label: 'Rental inventory highlights', type: 'textarea', required: true, placeholder: 'Tables, chairs, arches, linens, etc.' },
        { key: 'customBuilds', label: 'Custom builds / fabrication available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'setupBreakdownIncluded', label: 'Does pricing include setup & breakdown?', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    'Catering & Bar Services': {
      title: 'Catering & bar',
      fields: [
        { key: 'serviceStyles', label: 'Service styles', type: 'text', required: true, placeholder: 'Buffet, plated, family-style, stations, etc.' },
        { key: 'menuOptions', label: 'Menu options (summary)', type: 'textarea', required: true },
        { key: 'dietaryOptions', label: 'Dietary options supported', type: 'text', placeholder: 'Vegan, halal, gluten-free, etc.' },
        { key: 'barServices', label: 'Bar services', type: 'textarea', placeholder: 'Open bar, cash bar, cocktails, bartenders, etc.' },
        { key: 'tastingsAvailable', label: 'Tastings available?', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    'Cakes & Desserts': {
      title: 'Cakes & desserts',
      fields: [
        { key: 'cakeStyles', label: 'Cake styles', type: 'text', required: true, placeholder: 'Buttercream, fondant, semi-naked, etc.' },
        { key: 'flavorOptions', label: 'Flavor options', type: 'textarea', required: true },
        { key: 'dessertTable', label: 'Dessert table / extras', type: 'textarea', placeholder: 'Cupcakes, macarons, donuts, etc.' },
        { key: 'deliverySetup', label: 'Delivery & setup details', type: 'textarea' }
      ]
    },
    'Photography, Videography & Content': {
      title: 'Photo / video',
      fields: [
        { key: 'coverageTypes', label: 'Coverage types', type: 'text', required: true, placeholder: 'Photo, video, drone, content creation, etc.' },
        { key: 'shootingStyle', label: 'Shooting style', type: 'text', required: true, placeholder: 'Documentary, editorial, cinematic, etc.' },
        { key: 'deliverables', label: 'Deliverables', type: 'textarea', required: true, placeholder: 'Edited photos count, highlight film length, albums, etc.' },
        { key: 'turnaroundTime', label: 'Turnaround time', type: 'text', required: true, placeholder: 'e.g. 4-6 weeks' },
        { key: 'secondShooter', label: 'Second shooter available?', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    'Beauty & Grooming': {
      title: 'Beauty & grooming',
      fields: [
        { key: 'services', label: 'Services offered', type: 'textarea', required: true, placeholder: 'Bridal makeup, hair, nails, barbering, etc.' },
        { key: 'onLocation', label: 'On-location service?', type: 'select', required: true, options: ['Yes', 'No'] },
        { key: 'trialsAvailable', label: 'Trials available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'productsBrands', label: 'Products / brands used', type: 'text', placeholder: 'Optional' }
      ]
    },
    'Fashion & Attire': {
      title: 'Fashion & attire',
      fields: [
        { key: 'attireTypes', label: 'Attire types', type: 'text', required: true, placeholder: 'Bridal gowns, suits, bridesmaids, cultural wear, etc.' },
        { key: 'rentOrBuy', label: 'Rental or purchase', type: 'select', required: true, options: ['Rental', 'Purchase', 'Both'] },
        { key: 'alterations', label: 'Alterations available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'leadTime', label: 'Typical lead time', type: 'text', placeholder: 'e.g. 6-12 weeks' }
      ]
    },
    'Entertainment & Sound': {
      title: 'Entertainment & sound',
      fields: [
        { key: 'entertainmentTypes', label: 'Entertainment types', type: 'textarea', required: true, placeholder: 'DJ, live band, MC, dancers, etc.' },
        { key: 'equipmentProvided', label: 'Sound equipment provided?', type: 'select', options: ['Yes', 'No'] },
        { key: 'setLength', label: 'Typical set length', type: 'text', placeholder: 'e.g. 3 hours' },
        { key: 'powerRequirements', label: 'Power requirements', type: 'textarea' }
      ]
    },
    'Transport & Travel': {
      title: 'Transport & travel',
      fields: [
        { key: 'fleet', label: 'Fleet / vehicle types', type: 'textarea', required: true, placeholder: 'Vans, SUVs, buses, classic cars, etc.' },
        { key: 'serviceArea', label: 'Service area / routes', type: 'text', required: true, placeholder: 'Diani ↔ Mombasa, airport transfers, etc.' },
        { key: 'driversIncluded', label: 'Drivers included?', type: 'select', options: ['Yes', 'No'] },
        { key: 'capacityNotes', label: 'Capacity notes', type: 'textarea', placeholder: 'Seats per vehicle, luggage limits, etc.' }
      ]
    },
    'Accommodation & Guest Services': {
      title: 'Accommodation & guest services',
      fields: [
        { key: 'accommodationType', label: 'Accommodation type', type: 'select', required: true, options: ['Hotel', 'Resort', 'Villa', 'Apartment', 'Other'] },
        { key: 'roomCount', label: 'Room / unit count', type: 'number', placeholder: 'Optional' },
        { key: 'groupRates', label: 'Group rates / blocks available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'guestServices', label: 'Guest services', type: 'textarea', placeholder: 'Airport transfers, concierge, excursions, etc.' }
      ]
    },
    'Experiences & Activities': {
      title: 'Experiences & activities',
      fields: [
        { key: 'activityTypes', label: 'Activity types', type: 'textarea', required: true, placeholder: 'Boat trips, snorkeling, cultural tours, etc.' },
        { key: 'duration', label: 'Typical duration', type: 'text', placeholder: 'e.g. 3 hours' },
        { key: 'groupSizeLimits', label: 'Group size limits', type: 'text', placeholder: 'e.g. up to 20' },
        { key: 'safetyInsurance', label: 'Safety / insurance notes', type: 'textarea' }
      ]
    },
    'Stationery, Signage & Personalisation': {
      title: 'Stationery & signage',
      fields: [
        { key: 'products', label: 'Products offered', type: 'textarea', required: true, placeholder: 'Invites, menus, seating charts, welcome signs, etc.' },
        { key: 'printingMethods', label: 'Printing methods', type: 'text', placeholder: 'Digital, foil, letterpress, etc.' },
        { key: 'leadTime', label: 'Lead time', type: 'text', required: true, placeholder: 'e.g. 2-4 weeks' },
        { key: 'customisation', label: 'Customisation options', type: 'textarea' }
      ]
    },
    'Lighting, AV & Special Effects': {
      title: 'Lighting / AV / special effects',
      fields: [
        { key: 'equipment', label: 'Equipment list (summary)', type: 'textarea', required: true, placeholder: 'Uplights, fairy lights, moving heads, screens, etc.' },
        { key: 'specialEffects', label: 'Special effects', type: 'text', placeholder: 'Cold spark, fog, confetti, etc.' },
        { key: 'onsiteTechnician', label: 'On-site technician included?', type: 'select', options: ['Yes', 'No'] },
        { key: 'powerNeeds', label: 'Power needs', type: 'textarea' }
      ]
    },
    'Gifts, Favors & Extras': {
      title: 'Gifts & favors',
      fields: [
        { key: 'products', label: 'Products offered', type: 'textarea', required: true, placeholder: 'Gift boxes, favors, welcome kits, etc.' },
        { key: 'personalisation', label: 'Personalisation', type: 'textarea', placeholder: 'Names, dates, logos, etc.' },
        { key: 'minimumOrder', label: 'Minimum order', type: 'text', placeholder: 'Optional' },
        { key: 'leadTime', label: 'Lead time', type: 'text', placeholder: 'Optional' }
      ]
    },
    'Legal & Ceremonial Services': {
      title: 'Legal & ceremonial',
      fields: [
        { key: 'services', label: 'Services provided', type: 'textarea', required: true, placeholder: 'Officiant, documentation support, venue permits, etc.' },
        { key: 'jurisdictions', label: 'Jurisdictions / areas covered', type: 'text', placeholder: 'e.g. Kenya coast' },
        { key: 'leadTime', label: 'Typical lead time', type: 'text', placeholder: 'Optional' },
        { key: 'requirements', label: 'Requirements from couple', type: 'textarea', placeholder: 'IDs, witnesses, etc.' }
      ]
    },
    'Security, Safety & Operations': {
      title: 'Security & operations',
      fields: [
        { key: 'services', label: 'Security services', type: 'textarea', required: true, placeholder: 'Guards, crowd control, access checks, etc.' },
        { key: 'staffing', label: 'Staffing & shift details', type: 'textarea' },
        { key: 'equipment', label: 'Equipment', type: 'textarea', placeholder: 'Radios, barriers, signage, etc.' },
        { key: 'compliance', label: 'Compliance / licensing', type: 'textarea' }
      ]
    },
    'Cleanup & Post-Event Services': {
      title: 'Cleanup & post-event',
      fields: [
        { key: 'services', label: 'Services offered', type: 'textarea', required: true, placeholder: 'Venue cleanup, waste management, teardown support, etc.' },
        { key: 'wasteDisposal', label: 'Waste disposal approach', type: 'textarea', placeholder: 'Sorting, recycling, haul-away, etc.' },
        { key: 'timing', label: 'When cleanup is performed', type: 'text', placeholder: 'Same-night / next-day' },
        { key: 'suppliesProvided', label: 'Supplies provided?', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    'Tech & Digital Services': {
      title: 'Tech & digital',
      fields: [
        { key: 'services', label: 'Services offered', type: 'textarea', required: true, placeholder: 'Livestreaming, wedding website, QR RSVPs, etc.' },
        { key: 'equipmentPlatforms', label: 'Platforms / equipment', type: 'textarea', placeholder: 'Zoom, YouTube, cameras, encoders, etc.' },
        { key: 'internetRequirements', label: 'Internet requirements', type: 'textarea' },
        { key: 'dataPrivacy', label: 'Data privacy notes', type: 'textarea' }
      ]
    },
    'Miscellaneous Services': {
      title: 'Miscellaneous',
      fields: [
        { key: 'services', label: 'Describe your service', type: 'textarea', required: true, placeholder: 'What you offer and how it supports weddings' },
        { key: 'requirements', label: 'Operational requirements', type: 'textarea', placeholder: 'Power, access, permits, etc.' },
        { key: 'leadTime', label: 'Lead time', type: 'text', placeholder: 'Optional' },
        { key: 'notes', label: 'Additional notes', type: 'textarea', placeholder: 'Optional' }
      ]
    }
  };

  const renderCategorySpecific = () => {
    const config = CATEGORY_FIELDS[String(formData.vendorCategory || '')];
    if (!config) return null;

    return (
      <div className="space-y-8 pt-6">
        <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Category-specific details</h3>
        <div className="bg-amari-50 border border-amari-100 rounded-2xl p-5">
          <p className="text-sm text-stone-700 leading-relaxed">
            Please complete the fields below for your selected category: <span className="font-bold">{config.title}</span>.
          </p>
        </div>

        <div className="space-y-6">
          {config.fields.map((f) => {
            const currentValue = (formData.categorySpecific || {})[f.key] ?? '';

            if (f.type === 'textarea') {
              return (
                <div key={f.key} className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">
                    {f.label}{f.required ? ' (required)' : ''}
                  </label>
                  <textarea
                    required={!!f.required}
                    value={String(currentValue)}
                    onChange={(e) => setCategorySpecific(f.key, e.target.value)}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                    placeholder={f.placeholder || ''}
                  />
                </div>
              );
            }

            if (f.type === 'select') {
              return (
                <div key={f.key} className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">
                    {f.label}{f.required ? ' (required)' : ''}
                  </label>
                  <div className="relative">
                    <select
                      required={!!f.required}
                      value={String(currentValue)}
                      onChange={(e) => setCategorySpecific(f.key, e.target.value)}
                      className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                    >
                      <option value="">Select</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={f.key} className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">
                  {f.label}{f.required ? ' (required)' : ''}
                </label>
                <input
                  required={!!f.required}
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={String(currentValue)}
                  onChange={(e) => setCategorySpecific(f.key, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder={f.placeholder || ''}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'verificationDocument') {
        setFormData(prev => ({ ...prev, verificationDocument: files[0] }));
      } else if (name === 'realWorkImages') {
        setFormData(prev => ({ ...prev, realWorkImages: Array.from(files).slice(0, 6) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setUploadStatus('Uploading files...');
    try {
      const payload = {
        businessName: formData.businessName,
        vendorCategory: formData.vendorCategory,
        vendorSubcategories: formData.vendorSubcategories
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        businessDescription: formData.businessDescription,
        vendorStory: formData.vendorStory,
        otherServices: formData.otherServices,
        primaryLocation: formData.primaryLocation,
        areasServed: formData.areasServed,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        website: formData.website,
        socialLinks: JSON.stringify({
          instagram: formData.socialInstagram,
          facebook: formData.socialFacebook,
          tiktok: formData.socialTiktok,
          twitter: formData.socialTwitter,
          youtube: formData.socialYoutube,
          other: formData.socialLinks,
        }),
        realWorkImages: formData.realWorkImages,

        startingPrice: formData.startingPrice,
        pricingModel: formData.pricingModel,
        startingPriceIncludes: formData.startingPriceIncludes,
        minimumBookingRequirement: formData.minimumBookingRequirement,

        advanceBookingNotice: formData.advanceBookingNotice,
        setupTimeRequired: formData.setupTimeRequired,
        breakdownTimeRequired: formData.breakdownTimeRequired,
        outdoorExperience: formData.outdoorExperience,
        destinationWeddingExperience: formData.destinationWeddingExperience,
        specialRequirements: formData.specialRequirements,

        categorySpecific: formData.categorySpecific,

        verificationDocumentType: formData.verificationDocumentType,
        verificationDocument: formData.verificationDocument,

        termsAccepted: !!formData.termsAccepted
      };

      setUploadStatus('Submitting application...');
      await submitApplication(payload as any, user?.id);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadStatus('');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-amari-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-amari-100 animate-in fade-in zoom-in duration-500 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amari-500 to-amari-gold"></div>
          <div className="w-24 h-24 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in delay-200 duration-500">
            <CheckCircle className="text-amari-500" size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-amari-900 mb-4">Application Received</h2>
          <p className="text-stone-600 mb-10 leading-relaxed">
            Our concierge team will review your application and reach out to {formData.contactEmail} within 24-48 hours.
          </p>
          <div className="text-left bg-amari-50 border border-amari-100 rounded-2xl p-5 mb-8">
            <p className="text-sm text-stone-700 leading-relaxed">
              When uploading your information to Amari, each vendor will create a detailed profile that highlights the services you provide, your pricing, availability, and logistics. The platform collects both general information—like your business name, location, and contact details—and category-specific details tailored to your type of service, such as venue capacity for venues, menu options for caterers, or styles offered for photographers. All profiles follow a consistent structure to ensure clarity for couples while allowing each category to showcase its unique offerings. Certain information, like verification documents, is admin-only and used to approve your profile before it goes live. By completing these fields, you ensure that your profile is accurate, discoverable, and ready for couples to trust and book your services.
            </p>
          </div>
          {existingStatus && (
            <p className="text-sm text-stone-500 mb-8">Current status: {existingStatus}</p>
          )}

          <div className="space-y-4">
            <Link to="/couples" className="block w-full bg-white text-stone-600 border border-amari-200 px-6 py-4 rounded-xl font-bold hover:bg-amari-50 transition">
              Visit Couple's Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-amari-50">

      {/* Left Panel - Hero/Info (Desktop) */}
      <div className="lg:w-5/12 bg-amari-900 relative hidden lg:flex flex-col justify-between p-16 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1996&auto=format&fit=crop" 
            alt="Luxury Wedding Setup" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-in fade-in duration-1000 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amari-900/80 via-amari-900/60 to-amari-900/95"></div>
        </div>

        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-amari-500 rounded-xl flex items-center justify-center shadow-lg">
                <Waves size={20} className="text-white" />
             </div>
             <div>
                <span className="font-serif text-xl tracking-wide font-bold block leading-none">AMARI</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-amari-300">Partners</span>
             </div>
          </div>
          <h1 className="text-5xl font-serif font-bold leading-[1.1] mb-8 drop-shadow-lg text-amari-50">
            Help couples plan their ideal coastal wedding.
          </h1>

          <div className="space-y-8 border-l-2 border-amari-500/30 pl-8">
             <div className="animate-in slide-in-from-left-2 duration-500 delay-100">
                <div className="flex items-center gap-2 mb-2 text-amari-300">
                  <Target size={18} />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Our Mission</h4>
                </div>
                <p className="leading-relaxed text-amari-100/80 font-light">To simplify destination wedding planning in Kenya using digital tools, curated vendors, and local insight.</p>
             </div>
             <div className="animate-in slide-in-from-left-2 duration-500 delay-200">
                <div className="flex items-center gap-2 mb-2 text-amari-300">
                  <Eye size={18} />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Our Vision</h4>
                </div>
                <p className="leading-relaxed text-amari-100/80 font-light">To become East Africa’s leading online resource for beach and destination weddings.</p>
             </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 pt-10 border-t border-white/10 animate-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="flex items-start gap-4 group">
             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amari-500 transition-colors">
                <CheckCircle size={20} className="text-amari-300 group-hover:text-white" />
             </div>
             <div>
               <h3 className="font-bold text-base text-amari-50">Verified Listing</h3>
               <p className="text-amari-200/60 text-sm">Premium profile with photos, pricing & reviews.</p>
             </div>
           </div>
           <div className="flex items-start gap-4 group">
             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amari-500 transition-colors">
                <Globe size={20} className="text-amari-300 group-hover:text-white" />
             </div>
             <div>
               <h3 className="font-bold text-base text-amari-50">East Africa's Leading Resource</h3>
               <p className="text-amari-200/60 text-sm">Connect with international clients planning Diani weddings.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="lg:w-7/12 w-full bg-amari-50 overflow-y-auto">
        {/* Mobile Hero */}
        <div className="lg:hidden relative h-72">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1996&auto=format&fit=crop" 
              alt="Luxury Wedding" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amari-900 via-transparent to-black/30"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
               <span className="bg-amari-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">Partner Program</span>
               <h1 className="text-3xl font-serif font-bold text-white leading-none">Join the Coastal Leader</h1>
            </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10 lg:py-24 animate-in slide-in-from-bottom-4 duration-700">
          
          <div className="mb-8 lg:hidden bg-white p-6 rounded-2xl border border-amari-100 shadow-sm">
             <h4 className="font-bold text-amari-600 text-xs uppercase mb-2">Our Mission</h4>
             <p className="text-stone-600 text-sm leading-relaxed">
               To simplify destination wedding planning in Kenya using digital tools, curated vendors, and local insight.
             </p>
          </div>

          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl font-serif font-bold text-amari-900">Vendor Application</h2>
            <p className="text-stone-500 mt-2 text-lg">Join us in simplifying destination weddings in Kenya.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-amari-100">
            
            {/* Base Information Section */}
            <div className="space-y-8">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Base Information</h3>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Business Name (required)</label>
                <input 
                  required
                  type="text" 
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="e.g. The Coastal Lens"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Vendor Category (required)</label>
                <div className="relative">
                  <select 
                    required
                    name="vendorCategory"
                    value={formData.vendorCategory}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                  >
                    <option value="">Select vendor category</option>
                    {WEDDING_VENDOR_CATEGORIES.map((c) => (
                      <option key={c.category} value={c.category}>{c.category}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                    <ArrowRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Vendor subcategories (comma-separated)</label>
                <input
                  type="text"
                  name="vendorSubcategories"
                  value={formData.vendorSubcategories}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="e.g. Hotels, Resorts"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Business description (required)</label>
                <textarea
                  required
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                  placeholder="Short, factual, non-promotional summary of what you do."
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Your story</label>
                <textarea
                  name="vendorStory"
                  value={formData.vendorStory}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                  placeholder="Share your journey, what makes your work special, and why couples love working with you."
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Other services</label>
                <textarea
                  name="otherServices"
                  value={formData.otherServices}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                  placeholder="List any additional services you offer (e.g. rentals, add-ons, packages, travel, coordination)."
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Primary location (required)</label>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="text" 
                      name="primaryLocation"
                      value={formData.primaryLocation}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="Click on map to select location"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-amari-500 font-medium">Click on map to drop a pin and select your business location</p>
                    <div 
                      ref={mapRef}
                      className="w-full h-64 rounded-xl border-2 border-amari-200 overflow-hidden"
                      style={{ minHeight: '256px' }}
                    />
                  </div>

                  {selectedLocation && (
                    <div className="bg-amari-50 rounded-xl p-3 border border-amari-100">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-amari-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amari-900">Selected Location:</p>
                          <p className="text-xs text-amari-600 mt-1">{selectedLocation.address}</p>
                          <p className="text-xs text-amari-400 mt-1">
                            Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Areas served</label>
                <input
                  type="text"
                  name="areasServed"
                  value={formData.areasServed}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="e.g. Diani, Mombasa, Nairobi"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Contact details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Email (required)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="email" 
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="name@business.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Phone / WhatsApp (required)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="tel" 
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="https://"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-amari-900">Social media links</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">IG</span>
                    <input type="url" name="socialInstagram" value={formData.socialInstagram} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="https://instagram.com/..." />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">FB</span>
                    <input type="url" name="socialFacebook" value={formData.socialFacebook} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="https://facebook.com/..." />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">TT</span>
                    <input type="url" name="socialTiktok" value={formData.socialTiktok} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="https://tiktok.com/@..." />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">X</span>
                    <input type="url" name="socialTwitter" value={formData.socialTwitter} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="https://x.com/..." />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">YT</span>
                    <input type="url" name="socialYoutube" value={formData.socialYoutube} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amari-400 text-xs font-bold">+</span>
                    <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleChange} className="w-full bg-amari-50 border-0 rounded-xl pl-10 pr-4 py-3.5 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white text-sm" placeholder="Other links..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Real images of work */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Real images of work</h3>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Upload real images (required)</label>
                <div className="relative">
                  <input 
                    required
                    type="file" 
                    name="realWorkImages"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all file:mr-4 file:rounded-xl file:border-0 file:bg-amari-300 file:px-4 file:py-2 file:font-bold file:text-amari-900 hover:file:bg-amari-200 focus:bg-white"
                  />
                </div>
                {formData.realWorkImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-amari-600 font-medium">Selected photos:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.realWorkImages.map((file, index) => (
                        <div key={index} className="text-xs text-amari-600 bg-amari-50 rounded-lg p-2 text-center">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 text-xs text-amari-400 items-center mt-1">
                  <Info size={14} />
                  <span>No stock images. Upload up to 6 real images. Accepted formats: JPG, PNG. Max file size: 5MB each</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Pricing Information</h3>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Starting price (required)</label>
                <input
                  required
                  type="text"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="e.g. KES 50,000"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Pricing model (required)</label>
                <div className="relative">
                  <select
                    required
                    name="pricingModel"
                    value={formData.pricingModel}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                  >
                    <option value="">Select pricing model</option>
                    <option value="flat_rate">Flat rate</option>
                    <option value="per_person">Per person</option>
                    <option value="per_hour">Per hour</option>
                    <option value="package_based">Package-based</option>
                    <option value="custom">Custom</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                    <ArrowRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">What the starting price includes</label>
                <textarea
                  name="startingPriceIncludes"
                  value={formData.startingPriceIncludes}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                  placeholder="Short breakdown."
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Minimum booking requirement</label>
                <input
                  type="text"
                  name="minimumBookingRequirement"
                  value={formData.minimumBookingRequirement}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="If any"
                />
              </div>
            </div>

            {/* Availability & logistics */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Availability & Logistics</h3>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Advance booking notice required</label>
                <input
                  type="text"
                  name="advanceBookingNotice"
                  value={formData.advanceBookingNotice}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                  placeholder="e.g. 2 weeks"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Setup time required</label>
                  <input
                    type="text"
                    name="setupTimeRequired"
                    value={formData.setupTimeRequired}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                    placeholder="If applicable"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Breakdown time required</label>
                  <input
                    type="text"
                    name="breakdownTimeRequired"
                    value={formData.breakdownTimeRequired}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                    placeholder="If applicable"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Outdoor experience</label>
                  <div className="relative">
                    <select
                      name="outdoorExperience"
                      value={formData.outdoorExperience}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Destination wedding experience</label>
                  <div className="relative">
                    <select
                      name="destinationWeddingExperience"
                      value={formData.destinationWeddingExperience}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Special requirements</label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white min-h-[110px]"
                  placeholder="Power, water, access, permits, terrain, etc."
                />
              </div>
            </div>

            {renderCategorySpecific()}

            {/* Verification (not public) */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Vendor Verification (not public)</h3>

              <div className="bg-amari-50 border border-amari-100 rounded-2xl p-5">
                <p className="text-sm text-stone-700 leading-relaxed">
                  This information below is never shown publicly. Vendors cannot go live on the platform without at least one verification document approved. Admin can reject and request additional verification if needed.
                </p>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Verification document type (choose one)</label>
                <div className="relative">
                  <select
                    required
                    name="verificationDocumentType"
                    value={formData.verificationDocumentType}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                  >
                    <option value="">Select document type</option>
                    <option value="Business registration / certificate of incorporation">Business registration / certificate of incorporation</option>
                    <option value="Valid trade license or permit">Valid trade license or permit</option>
                    <option value="Professional license">Professional license (if applicable)</option>
                    <option value="VAT or tax registration document">VAT or tax registration document</option>
                    <option value="Proof of previous wedding service">Proof of previous wedding service (invoice/contract/portfolio evidence)</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                    <ArrowRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Upload verification document (required)</label>
                <div className="relative">
                  <input
                    required
                    type="file"
                    name="verificationDocument"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all file:mr-4 file:rounded-xl file:border-0 file:bg-amari-300 file:px-4 file:py-2 file:font-bold file:text-amari-900 hover:file:bg-amari-200 focus:bg-white"
                  />
                </div>
                {formData.verificationDocument && (
                  <div className="mt-2 text-sm text-amari-600">
                    ✓ {formData.verificationDocument.name}
                  </div>
                )}
                <div className="flex gap-2 text-xs text-amari-400 items-center mt-1">
                  <Info size={14} />
                  <span>Accepted format: PDF only. Max file size: 5MB</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-6 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Terms & Conditions</h3>
              <div className="bg-white border border-amari-100 rounded-2xl p-6">
                <p className="text-sm text-stone-700 leading-relaxed">
                  By creating a vendor profile on Amari, you confirm that you have read, understood, and agreed to the Amari Vendor Terms and Conditions. Profiles are for advertising purposes only and Amari does not facilitate bookings, payments, or contracts. Vendors must provide accurate information and at least one verification document for admin approval before going live.
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    required
                    className="mt-1 h-4 w-4"
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-stone-700">
                    I agree to the <Link to="/vendor-terms" className="font-bold text-amari-600 hover:text-amari-900 underline">Amari Vendor Terms and Conditions</Link>.
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-10">
              {uploadStatus && (
                <div className="mb-4 flex items-center gap-3 bg-amari-50 border border-amari-200 rounded-xl px-4 py-3">
                  <div className="w-5 h-5 border-2 border-amari-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <p className="text-sm font-medium text-amari-700">{uploadStatus}</p>
                </div>
              )}
              <button 
                type="submit"
                disabled={submitting}
                className={`group relative w-full text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-xl duration-300 ${submitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-amari-600 hover:bg-amari-900 hover:shadow-2xl hover:-translate-y-1 active:scale-95'}`}
              >
                {submitting ? 'Uploading & Submitting...' : 'Submit Application'}
                {!submitting && <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" size={20} />}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;