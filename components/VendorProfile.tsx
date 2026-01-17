import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_VENDORS } from '../constants';
import { MapPin, Star, MessageSquare, ArrowLeft, Heart, Mail, Phone, Globe, Calendar, Users, Award, Check, Clock, DollarSign, Camera, Music, Utensils, Flower, Car, FileText, Sparkles } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews' | 'contact'>('about');
  
  const vendor = MOCK_VENDORS.find(v => v.id === id);
  
  // Enhanced vendor data with detailed content
  const vendorDetails = vendor ? {
    ...vendor,
    fullDescription: `${vendor.description} With over 8 years of experience in the Diani wedding scene, we specialize in creating unforgettable coastal celebrations that blend traditional Kenyan elegance with modern sophistication. Our team of dedicated professionals understands the unique challenges and opportunities of destination weddings in East Africa.`,
    founded: '2016',
    teamSize: Math.floor(Math.random() * 15) + 5,
    completedWeddings: Math.floor(Math.random() * 200) + 50,
    languages: ['English', 'Swahili', 'Italian'],
    awards: ['Best Wedding Planner 2023', 'Excellence in Service 2022', 'Customer Choice Award 2021'],
    services: getServicesByCategory(vendor.category),
    packages: getPackagesByCategory(vendor.category),
    availability: ['2025: Limited Dates', '2026: Available', '2027: Available'],
    responseTime: 'Within 2 hours',
    startingPrice: getStartingPriceByCategory(vendor.category),
    socialMedia: {
      instagram: `@${vendor.name.toLowerCase().replace(/\s+/g, '')}`,
      facebook: vendor.name,
      website: `https://${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`
    },
    contact: {
      email: `hello@${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+254 712 345 678',
      whatsapp: '+254 712 345 678',
      address: vendor.location
    }
  } : null;

  function getServicesByCategory(category: string): string[] {
    const services: Record<string, string[]> = {
      'Venues and Locations': ['Beachfront Ceremonies', 'Garden Receptions', 'Indoor Ballrooms', 'Rooftop Events', 'Poolside Gatherings'],
      'Planning and Coordination': ['Full Wedding Planning', 'Day Coordination', 'Vendor Management', 'Timeline Creation', 'Budget Management'],
      'Photography and Videography': ['Pre-Wedding Shoots', 'Ceremony Coverage', 'Reception Documentation', 'Drone Photography', 'Video Highlights'],
      'Catering and Cake': ['Multi-Course Menus', 'Cocktail Reception', 'Wedding Cakes', 'Dietary Accommodations', 'Bar Service'],
      'Decor and Styling': ['Floral Design', 'Table Settings', 'Lighting Design', 'Theme Development', 'Installation Art'],
      'Beauty and Fashion': ['Bridal Makeup', 'Hair Styling', 'Groom Grooming', 'Bridal Party Services', 'Touch-up Services'],
      'Entertainment and Music': ['Live Bands', 'DJ Services', 'Traditional Dancers', 'Photo Booths', 'Light Shows'],
      'Transport and Logistics': ['Guest Transportation', 'Bridal Car Service', 'Airport Transfers', 'Shuttle Services', 'Helicopter Transfers']
    };
    return services[category] || ['Consultation', 'Planning', 'Coordination', 'Support'];
  }

  function getPackagesByCategory(category: string): Array<{name: string, price: string, features: string[]}> {
    return [
      {
        name: 'Basic Package',
        price: '$$$',
        features: ['Essential Services', '4 Hours Coverage', 'Basic Coordination', 'Email Support']
      },
      {
        name: 'Premium Package',
        price: '$$$$',
        features: ['Full Service', '8 Hours Coverage', 'Dedicated Coordinator', 'Phone & Email Support', 'Extra Amenities']
      },
      {
        name: 'Luxury Package',
        price: '$$$$$',
        features: ['All-Inclusive Service', 'Full Day Coverage', 'Premium Coordinator', '24/7 Support', 'Custom Additions', 'Priority Service']
      }
    ];
  }

  function getStartingPriceByCategory(category: string): string {
    const prices: Record<string, string> = {
      'Venues and Locations': 'KES 150,000',
      'Planning and Coordination': 'KES 75,000',
      'Photography and Videography': 'KES 50,000',
      'Catering and Cake': 'KES 2,000 per person',
      'Decor and Styling': 'KES 100,000',
      'Beauty and Fashion': 'KES 15,000',
      'Entertainment and Music': 'KES 40,000',
      'Transport and Logistics': 'KES 25,000'
    };
    return prices[category] || 'KES 50,000';
  }

  function getCategoryIcon(category: string) {
    const icons: Record<string, React.ReactNode> = {
      'Venues and Locations': <MapPin size={20} />,
      'Planning and Coordination': <Calendar size={20} />,
      'Photography and Videography': <Camera size={20} />,
      'Catering and Cake': <Utensils size={20} />,
      'Decor and Styling': <Flower size={20} />,
      'Beauty and Fashion': <Sparkles size={20} />,
      'Entertainment and Music': <Music size={20} />,
      'Transport and Logistics': <Car size={20} />,
      'Stationery and Print': <FileText size={20} />,
      'Legal and Admin': <FileText size={20} />
    };
    return icons[category] || <Star size={20} />;
  }
  
  if (!vendor || !vendorDetails) {
    return (
      <div className="min-h-screen bg-amari-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amari-900 mb-4">Vendor Not Found</h1>
          <Link to="/vendors" className="text-amari-600 hover:text-amari-500 font-bold">
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Generate sample reviews
  const sampleReviews = [
    {
      id: 1,
      name: 'Sarah & Michael',
      date: '2024-03-15',
      rating: 5.0,
      review: 'Absolutely incredible service! They made our destination wedding seamless and stress-free. Highly recommend!',
      weddingDate: '2024-02-14'
    },
    {
      id: 2,
      name: 'Emily & James',
      date: '2024-01-20',
      rating: 4.8,
      review: 'Professional, creative, and attentive to detail. Our beach wedding was perfect thanks to their expertise.',
      weddingDate: '2023-12-28'
    },
    {
      id: 3,
      name: 'Aisha & David',
      date: '2023-11-10',
      rating: 5.0,
      review: 'The best decision we made for our wedding. They understood our vision perfectly and executed it flawlessly.',
      weddingDate: '2023-10-20'
    }
  ];

  return (
    <div className="min-h-screen bg-amari-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amari-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to="/vendors" 
            className="inline-flex items-center text-amari-600 hover:text-amari-500 font-bold transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Directory
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={vendor.imageUrl} 
          alt={vendor.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-amari-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {getCategoryIcon(vendor.category)}
                {vendor.category}
              </span>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star size={14} className="text-yellow-300 fill-yellow-300 mr-1" />
                <span className="text-sm font-bold">{vendor.rating}</span>
                <span className="text-xs ml-1">({sampleReviews.length} reviews)</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Award size={14} className="text-green-300 mr-1" />
                <span className="text-sm font-bold">Verified</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{vendor.name}</h1>
            <div className="flex items-center text-white/90 mb-4">
              <MapPin size={18} className="mr-2" />
              <span className="text-lg">{vendor.location}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{vendorDetails.teamSize} team members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{vendorDetails.completedWeddings} weddings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Response: {vendorDetails.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-amari-100 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'about', label: 'About', icon: <Star size={16} /> },
              { id: 'portfolio', label: 'Portfolio', icon: <Camera size={16} /> },
              { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={16} /> },
              { id: 'contact', label: 'Contact', icon: <Mail size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amari-600 text-amari-600 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-amari-900 mb-4">About {vendor.name}</h2>
              <p className="text-stone-600 leading-relaxed text-lg mb-6">{vendorDetails.fullDescription}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-amari-900 mb-3">Business Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Founded</span>
                      <span className="font-medium text-amari-900">{vendorDetails.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Team Size</span>
                      <span className="font-medium text-amari-900">{vendorDetails.teamSize} professionals</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Weddings Completed</span>
                      <span className="font-medium text-amari-900">{vendorDetails.completedWeddings}+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Languages</span>
                      <span className="font-medium text-amari-900">{vendorDetails.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-amari-900 mb-3">Awards & Recognition</h3>
                  <div className="space-y-2">
                    {vendorDetails.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award size={16} className="text-amari-500" />
                        <span className="text-stone-700">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-amari-900 mb-6">Services Offered</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {vendorDetails.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amari-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-bold text-amari-900">{service}</h4>
                      <p className="text-stone-600 text-sm mt-1">Professional {service.toLowerCase()} services tailored to your needs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-amari-900 mb-6">Wedding Packages</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {vendorDetails.packages.map((pkg, index) => (
                  <div key={index} className={`border rounded-xl p-6 ${
                    index === 1 ? 'border-amari-500 bg-amari-50' : 'border-amari-200'
                  }`}>
                    <h3 className="font-bold text-amari-900 text-lg mb-2">{pkg.name}</h3>
                    <div className="text-2xl font-bold text-amari-600 mb-4">{pkg.price}</div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check size={14} className="text-green-500 flex-shrink-0" />
                          <span className="text-stone-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-amari-900 mb-6">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-amari-50 group">
                    <img 
                      src={vendor.imageUrl} 
                      alt={`${vendor.name} portfolio ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-amari-900">Client Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-bold text-amari-900">{vendor.rating}</span>
                  <span className="text-stone-500">({sampleReviews.length} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {sampleReviews.map((review) => (
                  <div key={review.id} className="border-b border-amari-100 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-amari-900">{review.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <span>Wedding: {new Date(review.weddingDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < Math.floor(review.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-stone-300'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-amari-900 mb-6">Get in Touch</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-amari-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-amari-400" />
                        <div>
                          <p className="text-sm text-stone-500">Email</p>
                          <p className="font-medium text-amari-900">{vendorDetails.contact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-amari-400" />
                        <div>
                          <p className="text-sm text-stone-500">Phone</p>
                          <p className="font-medium text-amari-900">{vendorDetails.contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-amari-400" />
                        <div>
                          <p className="text-sm text-stone-500">Address</p>
                          <p className="font-medium text-amari-900">{vendorDetails.contact.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-amari-400" />
                        <div>
                          <p className="text-sm text-stone-500">Website</p>
                          <p className="font-medium text-amari-900">{vendorDetails.socialMedia.website}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-amari-900 mb-4">Social Media</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-600">Instagram:</span>
                        <span className="font-medium text-amari-900">{vendorDetails.socialMedia.instagram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-600">Facebook:</span>
                        <span className="font-medium text-amari-900">{vendorDetails.socialMedia.facebook}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-amari-900 mb-4">Send a Message</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-amari-200 rounded-lg focus:ring-2 focus:ring-amari-500 focus:border-amari-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 border border-amari-200 rounded-lg focus:ring-2 focus:ring-amari-500 focus:border-amari-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Wedding Date</label>
                        <input type="date" className="w-full px-4 py-2 border border-amari-200 rounded-lg focus:ring-2 focus:ring-amari-500 focus:border-amari-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                        <textarea rows={4} className="w-full px-4 py-2 border border-amari-200 rounded-lg focus:ring-2 focus:ring-amari-500 focus:border-amari-500" />
                      </div>
                      <button type="submit" className="w-full bg-amari-600 text-white py-3 rounded-xl font-bold hover:bg-amari-700 transition">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amari-100 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-amari-900">Starting from {vendorDetails.startingPrice}</p>
            <p className="text-sm text-stone-500">Response time: {vendorDetails.responseTime}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-amari-50 text-amari-900 px-6 py-3 rounded-xl font-bold hover:bg-amari-100 transition">
              <Heart size={18} />
              Save
            </button>
            <button className="flex items-center gap-2 bg-amari-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amari-700 transition">
              <MessageSquare size={18} />
              Contact Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
