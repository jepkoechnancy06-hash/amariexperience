import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-amari-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amari-900 mb-4">Please log in to view your profile</h1>
          <a 
            href="/login" 
            className="bg-amari-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amari-700 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amari-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-serif font-bold text-amari-900">Profile Settings</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors px-4 py-2 rounded-lg hover:bg-stone-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-amari-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                  <div className="text-stone-900 font-medium break-words">{user.firstName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                  <div className="text-stone-900 font-medium break-words">{user.lastName}</div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <div className="text-stone-900 font-medium break-words">{user.email}</div>
                </div>
                {user.phone && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
                    <div className="text-stone-900 font-medium break-words">{user.phone}</div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Account Type</label>
                  <div className="text-stone-900 font-medium capitalize">{user.userType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Member Since</label>
                  <div className="text-stone-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions - Takes 1 column on large screens */}
            <div>
              <h2 className="text-xl font-bold text-amari-900 mb-6">Account Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 p-4 bg-amari-50 rounded-xl hover:bg-amari-100 transition-colors"
                >
                  <Settings size={20} className="text-amari-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-amari-900">Dashboard</div>
                    <div className="text-sm text-stone-600">Manage your wedding planning tools</div>
                  </div>
                </Link>
                <Link
                  to="/gallery"
                  className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <User size={20} className="text-stone-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-stone-900">My Inspiration</div>
                    <div className="text-sm text-stone-600">View and manage your inspiration posts</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Vendor Specific Section */}
          {user.userType === 'vendor' && (
            <div className="mt-8 pt-8 border-t border-amari-100">
              <h2 className="text-xl font-bold text-amari-900 mb-6">Vendor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-amari-50 rounded-xl p-6">
                  <h3 className="font-semibold text-amari-900 mb-2">Business Details</h3>
                  <p className="text-sm text-stone-600">Manage your business profile and services</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="font-semibold text-stone-900 mb-2">Client Reviews</h3>
                  <p className="text-sm text-stone-600">View and respond to client feedback</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Analytics</h3>
                  <p className="text-sm text-blue-600">Track your business performance</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
