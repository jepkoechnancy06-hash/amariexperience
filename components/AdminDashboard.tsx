import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, updateApplicationStatus, updateApplicationVerification } from '../services/vendorService';
import { VendorApplication } from '../types';
import { Check, X, Clock, Eye, Sliders, FileText, Camera, Save } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSaving, setVerificationSaving] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await updateApplicationStatus(id, status);
      refreshData();
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? ({ ...prev, status }) : null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert((error as any)?.message || 'Failed to update application status');
    }
  };

  const handleVerificationFieldChange = (key: keyof VendorApplication, value: any) => {
    setSelectedApp((prev) => (prev ? ({ ...prev, [key]: value } as any) : prev));
  };

  const saveVerification = async () => {
    if (!selectedApp) return;
    setVerificationSaving(true);
    try {
      await updateApplicationVerification(selectedApp.id, {
        verificationDocumentUploaded: !!selectedApp.verificationDocumentUploaded,
        verifiedBy: selectedApp.verifiedBy || '',
        dateVerified: typeof selectedApp.dateVerified === 'number' ? selectedApp.dateVerified : null,
        approvalStatus: (selectedApp.approvalStatus || 'Pending') as any,
        adminNotes: selectedApp.adminNotes || ''
      });
      await refreshData();
    } catch (error) {
      console.error('Failed to save verification metadata:', error);
      alert((error as any)?.message || 'Failed to save verification metadata');
    } finally {
      setVerificationSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-amari-500">Vendor Applications</h2>
          <p className="text-stone-600">Review and manage incoming vendor applications.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/vendor-verification"
            className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-bold text-stone-700 hover:bg-stone-50 transition"
          >
            Vendor Verification
          </Link>
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            {applications.filter(a => a.status === 'Pending').length} Pending
          </div>
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {applications.filter(a => a.status === 'Approved').length} Approved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* List View */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
            <span className="font-bold text-stone-700 text-sm uppercase tracking-wide">Applications</span>
            <button 
              onClick={refreshData}
              disabled={loading}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <Sliders size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow p-2 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">No applications found.</div>
            ) : (
              applications.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedApp?.id === app.id ? 'bg-amari-50 border-amari-200 shadow-sm' : 'bg-white border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold ${selectedApp?.id === app.id ? 'text-amari-900' : 'text-stone-800'}`}>{app.businessName}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2 truncate">{app.vendorCategory} • {app.primaryLocation}</p>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(app.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-stone-200 p-8 overflow-y-auto">
          {selectedApp ? (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-8 border-b border-stone-100 gap-4">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900">{selectedApp.businessName}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">{selectedApp.vendorCategory}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(selectedApp.status)}`}>
                      {selectedApp.status === 'Approved' && <Check size={12} />}
                      {selectedApp.status === 'Rejected' && <X size={12} />}
                      {selectedApp.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedApp.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedApp.id, 'Approved')}
                        className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-700 transition shadow-md"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedApp.id, 'Rejected')}
                        className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition"
                      >
                        <X size={16} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  {/* Business Information */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Business Information</h4>
                    <div className="space-y-4">
                      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                        <h5 className="font-bold text-stone-900 mb-2">Vendor Category</h5>
                        <p className="text-stone-700">{selectedApp.vendorCategory}</p>
                      </div>
                      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                        <h5 className="font-bold text-stone-900 mb-2">Primary Location</h5>
                        <p className="text-stone-700">{selectedApp.primaryLocation}</p>
                      </div>
                      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                        <h5 className="font-bold text-stone-900 mb-2">Description</h5>
                        <p className="text-stone-700 whitespace-pre-line">{selectedApp.businessDescription || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Contact</h4>
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-stone-500 mb-1">Email</p>
                          <a href={`mailto:${selectedApp.contactEmail}`} className="text-stone-700 hover:text-amari-600">{selectedApp.contactEmail}</a>
                        </div>
                        <div>
                          <p className="text-xs text-stone-500 mb-1">Phone</p>
                          <a href={`tel:${selectedApp.contactPhone}`} className="text-stone-700 hover:text-amari-600">{selectedApp.contactPhone}</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Documents</h4>
                    <div className="space-y-3">
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center gap-3">
                        <FileText size={16} className="text-stone-400" />
                        <div>
                          <p className="text-sm font-medium text-stone-900">Verification document</p>
                          <p className="text-xs text-stone-500">{selectedApp.verificationDocumentType || '-'}</p>
                          {selectedApp.verificationDocument ? (
                            <p className="text-xs text-stone-500 mt-1 break-all">{String(selectedApp.verificationDocument)}</p>
                          ) : (
                            <p className="text-xs text-stone-500 mt-1">No file reference stored</p>
                          )}
                        </div>
                      </div>

                      {selectedApp.realWorkImages && selectedApp.realWorkImages.length > 0 && (
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                          <div className="flex items-center gap-3 mb-3">
                            <Camera size={16} className="text-stone-400" />
                            <p className="text-sm font-medium text-stone-900">Real work images ({selectedApp.realWorkImages.length})</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedApp.realWorkImages.slice(0, 6).map((photo, index) => (
                              <div key={index} className="aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
                                <Camera size={12} className="text-stone-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification (Admin-only) */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Vendor Verification (Admin-only)</h4>
                    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-stone-500 font-bold uppercase tracking-wide">Verification document uploaded</label>
                          <select
                            value={selectedApp.verificationDocumentUploaded ? 'Yes' : 'No'}
                            onChange={(e) => handleVerificationFieldChange('verificationDocumentUploaded', e.target.value === 'Yes')}
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-stone-500 font-bold uppercase tracking-wide">Approval status</label>
                          <select
                            value={selectedApp.approvalStatus || 'Pending'}
                            onChange={(e) => handleVerificationFieldChange('approvalStatus', e.target.value)}
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-stone-500 font-bold uppercase tracking-wide">Verified by</label>
                          <input
                            type="text"
                            value={selectedApp.verifiedBy || ''}
                            onChange={(e) => handleVerificationFieldChange('verifiedBy', e.target.value)}
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                            placeholder="Admin name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-stone-500 font-bold uppercase tracking-wide">Date verified</label>
                          <input
                            type="date"
                            value={selectedApp.dateVerified ? new Date(selectedApp.dateVerified).toISOString().slice(0, 10) : ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              handleVerificationFieldChange('dateVerified', v ? new Date(v).getTime() : null);
                            }}
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-stone-500 font-bold uppercase tracking-wide">Notes / Comments</label>
                        <textarea
                          value={selectedApp.adminNotes || ''}
                          onChange={(e) => handleVerificationFieldChange('adminNotes', e.target.value)}
                          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm min-h-[110px]"
                          placeholder="Internal notes (never shown publicly)"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={saveVerification}
                        disabled={verificationSaving}
                        className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-700 transition disabled:opacity-60"
                      >
                        <Save size={16} /> {verificationSaving ? 'Saving...' : 'Save verification'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Application Details</h4>
                    <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm space-y-4">
                      <div>
                        <p className="text-xs text-stone-400 mb-1">Submitted</p>
                        <p className="text-sm font-medium text-stone-900">{new Date(selectedApp.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-1">Terms accepted</p>
                        <p className="text-sm font-medium text-stone-900">
                          {selectedApp.termsAccepted
                            ? (selectedApp.termsAcceptedAt
                                ? `Yes — ${new Date(selectedApp.termsAcceptedAt).toLocaleString()}`
                                : 'Yes')
                            : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-1">Status</p>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(selectedApp.status)}`}>
                          {selectedApp.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-300">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                <Eye size={32} className="opacity-50" />
              </div>
              <p className="font-medium">Select an application to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
