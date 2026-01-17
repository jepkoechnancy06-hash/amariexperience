import React from 'react';
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
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-amari-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-bold text-amari-900">Profile Settings</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-amari-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                  <div className="text-stone-900 font-medium">{user.firstName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                  <div className="text-stone-900 font-medium">{user.lastName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <div className="text-stone-900 font-medium">{user.email}</div>
                </div>
                {user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
                    <div className="text-stone-900 font-medium">{user.phone}</div>
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

            <div>
              <h2 className="text-xl font-bold text-amari-900 mb-4">Account Actions</h2>
              <div className="space-y-4">
                <a
                  href="/dashboard"
                  className="flex items-center gap-3 p-4 bg-amari-50 rounded-xl hover:bg-amari-100 transition-colors"
                >
                  <Settings size={20} className="text-amari-600" />
                  <div>
                    <div className="font-medium text-amari-900">Dashboard</div>
                    <div className="text-sm text-stone-600">Manage your wedding planning tools</div>
                  </div>
                </a>
                <a
                  href="/gallery"
                  className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <User size={20} className="text-stone-600" />
                  <div>
                    <div className="font-medium text-stone-900">My Inspiration</div>
                    <div className="text-sm text-stone-600">View and manage your inspiration posts</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;
