import React, { useEffect, useMemo, useState } from 'react';
import { getApplications, updateApplicationStatus, updateApplicationVerification } from '../services/vendorService';
import { VendorApplication } from '../types';
import { Check, Clock, Eye, FileText, Save, Sliders, X, Camera } from 'lucide-react';

const getImageSrc = (photo: unknown): string => {
  if (!photo) return '';
  if (typeof photo === 'string') return photo;
  if (photo instanceof File) return URL.createObjectURL(photo);
  return '';
};

const AdminVendorVerification: React.FC = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const apps = await getApplications();
      setApplications(apps);
      if (selectedApp) {
        const updated = apps.find((a) => a.id === selectedApp.id) || null;
        setSelectedApp(updated);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    return {
      pending: applications.filter((a) => a.status === 'Pending').length,
      approved: applications.filter((a) => a.status === 'Approved').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length
    };
  }, [applications]);

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

  const handleVerificationFieldChange = (key: keyof VendorApplication, value: any) => {
    setSelectedApp((prev) => (prev ? ({ ...prev, [key]: value } as any) : prev));
  };

  const saveVerification = async () => {
    if (!selectedApp) return;
    setSaving(true);
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
      setSaving(false);
    }
  };

  const handleFinalDecision = async (status: 'Approved' | 'Rejected') => {
    if (!selectedApp) return;
    try {
      await updateApplicationStatus(selectedApp.id, status);
      await refreshData();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert((error as any)?.message || 'Failed to update application status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-amari-500">Vendor Verification</h2>
          <p className="text-stone-600">Verify documents and approve/reject vendor applications.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            {stats.pending} Pending
          </div>
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {stats.approved} Approved
          </div>
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {stats.rejected} Rejected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
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
              applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedApp?.id === app.id
                      ? 'bg-amari-50 border-amari-200 shadow-sm'
                      : 'bg-white border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold ${selectedApp?.id === app.id ? 'text-amari-900' : 'text-stone-800'}`}>
                      {app.businessName}
                    </h4>
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

        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-stone-200 p-8 overflow-y-auto">
          {selectedApp ? (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-8 border-b border-stone-100 gap-4">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900">{selectedApp.businessName}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">
                      {selectedApp.vendorCategory}
                    </span>
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
                        onClick={() => handleFinalDecision('Approved')}
                        className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-700 transition shadow-md"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleFinalDecision('Rejected')}
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
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Documents</h4>
                    <div className="space-y-3">
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center gap-3">
                        <FileText size={16} className="text-stone-400" />
                        <div>
                          <p className="text-sm font-medium text-stone-900">Verification document</p>
                          <p className="text-xs text-stone-500">{selectedApp.verificationDocumentType || '-'}</p>
                          {selectedApp.verificationDocument ? (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowDocPreview(true)}
                                className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-100 transition"
                              >
                                <Eye size={14} /> View
                              </button>
                              <a
                                href={String(selectedApp.verificationDocument)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-100 transition"
                              >
                                <FileText size={14} /> Open in new tab
                              </a>
                            </div>
                          ) : (
                            <p className="text-xs text-stone-500 mt-1">No document stored</p>
                          )}
                        </div>
                      </div>
                    </div>

                      {selectedApp.realWorkImages && selectedApp.realWorkImages.length > 0 && (
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                          <div className="flex items-center gap-3 mb-3">
                            <Camera size={16} className="text-stone-400" />
                            <p className="text-sm font-medium text-stone-900">Real work images ({selectedApp.realWorkImages.length})</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {selectedApp.realWorkImages.slice(0, 6).map((photo, index) => (
                              <a
                                key={index}
                                href={getImageSrc(photo)}
                                target="_blank"
                                rel="noreferrer"
                                className="aspect-square bg-stone-200 rounded-lg overflow-hidden border border-stone-200 hover:shadow-sm transition"
                              >
                                {getImageSrc(photo) ? (
                                  <img
                                    src={getImageSrc(photo)}
                                    alt={`Real work ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Camera size={12} className="text-stone-400" />
                                  </div>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Verification</h4>
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
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-700 transition disabled:opacity-60"
                      >
                        <Save size={16} /> {saving ? 'Saving...' : 'Save verification'}
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
                      <div>
                        <p className="text-xs text-stone-400 mb-1">Contact email</p>
                        <p className="text-sm font-medium text-stone-900 break-all">{selectedApp.contactEmail || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-1">Contact phone</p>
                        <p className="text-sm font-medium text-stone-900">{selectedApp.contactPhone || '-'}</p>
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
              <p className="font-medium">Select an application to verify</p>
            </div>
          )}

          {selectedApp?.verificationDocument && showDocPreview && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                  <div>
                    <p className="text-sm font-bold text-stone-900">Verification document</p>
                    <p className="text-xs text-stone-500">{selectedApp.verificationDocumentType || '-'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDocPreview(false)}
                    className="p-2 rounded-lg hover:bg-stone-100 transition text-stone-600"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 bg-stone-50">
                  {(() => {
                    const src = String(selectedApp.verificationDocument);
                    const mime = src.startsWith('data:') ? src.slice(5, src.indexOf(';')) : '';
                    const isApiFile = src.startsWith('/api/files');
                    const docType = (selectedApp.verificationDocumentType || '').toLowerCase();
                    const isPdf = mime === 'application/pdf' || src.toLowerCase().endsWith('.pdf') || isApiFile || docType.includes('pdf');
                    const isImage = mime.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(src);

                    if (isImage && !isPdf) {
                      return (
                        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                          <img src={src} alt="Verification document" className="w-full max-h-[70vh] object-contain bg-white" />
                        </div>
                      );
                    }

                    if (isPdf || isApiFile) {
                      return (
                        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                          <iframe title="Verification PDF" src={src} className="w-full h-[70vh]" />
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white rounded-xl border border-stone-200 p-4">
                        <p className="text-sm text-stone-700 mb-3">Preview is unavailable for this document type.</p>
                        <a
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-700 transition"
                        >
                          <FileText size={16} /> Open document
                        </a>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorVerification;
