import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, XCircle, Search, Copy, CheckCircle, FileText, Award } from 'lucide-react';

export default function MyCertificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    api.get('/certificates')
      .then(r => setCerts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const revoke = async (certId) => {
    if (!window.confirm('Revoke this certificate? This cannot be undone.')) return;
    setRevoking(certId);
    try {
      await api.put(`/certificates/${certId}/revoke`, { reason: 'Revoked by institution' });
      setCerts(c => c.map(x => x.certificateId === certId ? { ...x, status: 'revoked' } : x));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke');
    } finally {
      setRevoking(null);
    }
  };

  const filtered = certs.filter(c =>
    c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  const isInstitution = user?.role === 'institution';
  const accentColor = isInstitution ? 'violet' : 'indigo';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:'Space Grotesk,sans-serif'}}>
            {isInstitution ? 'Issued Certificates' : 'My Certificates'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{certs.length} total records on the blockchain</p>
        </div>
        <div className="sm:ml-auto relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9 w-full sm:w-64" placeholder="Search by name, course, or ID…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          Loading certificates…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-300" />
          </div>
          <div className="text-gray-500 font-medium mb-1">No certificates found</div>
          <div className="text-gray-400 text-sm">{search ? 'Try adjusting your search' : 'No records yet'}</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(cert => (
            <div key={cert._id} className="card hover:shadow-md transition-shadow border-gray-100 hover:border-indigo-100">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900">{cert.studentName}</span>
                    <span className={cert.status === 'active' ? 'badge-green' : 'badge-red'}>{cert.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {cert.courseName}{cert.degree && ` · ${cert.degree}`}{cert.cgpa && ` · CGPA: ${cert.cgpa}`}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">ID:</span>
                      <span className="font-mono text-gray-700">{cert.certificateId}</span>
                      <button onClick={() => copyId(cert.certificateId)} className="text-gray-300 hover:text-indigo-500 transition-colors">
                        {copied === cert.certificateId ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-gray-400">
                      Issued: {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="col-span-2 font-mono text-gray-300 truncate text-[10px]">
                      SHA-256: {cert.sha256Hash?.slice(0, 48)}…
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
                  <a href={`/verify/${cert.certificateId}`} target="_blank" rel="noreferrer"
                    className="btn-secondary text-xs text-center flex items-center gap-1.5 justify-center py-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verify
                  </a>
                  {isInstitution && cert.status === 'active' && (
                    <button onClick={() => revoke(cert.certificateId)} disabled={revoking === cert.certificateId}
                      className="text-xs border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 justify-center disabled:opacity-50">
                      <XCircle className="w-3.5 h-3.5" />
                      {revoking === cert.certificateId ? 'Revoking…' : 'Revoke'}
                    </button>
                  )}
                  {cert.qrCodeUrl && (
                    <img src={cert.qrCodeUrl} alt="QR" className="w-12 h-12 rounded-xl border border-gray-100 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
