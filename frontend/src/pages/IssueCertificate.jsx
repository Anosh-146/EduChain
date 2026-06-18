import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FilePlus, CheckCircle, AlertCircle, Upload } from 'lucide-react';

export default function IssueCertificate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: '', studentEmail: '', studentId: '',
    courseName: '', degree: '', cgpa: '',
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append('file', file);
      const { data } = await api.post('/certificates/issue', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  if (result) return (
    <div className="max-w-xl mx-auto">
      <div className="card border border-green-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Certificate Issued!</h2>
        <p className="text-gray-500 text-sm mb-6">Successfully anchored on Polygon blockchain</p>

        <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4 mb-6">
          {[
            ['Certificate ID', result.certificateId],
            ['Student', result.studentName],
            ['Course', result.courseName],
            ['SHA-256 Hash', result.sha256Hash?.slice(0, 32) + '…'],
            ['IPFS CID', result.ipfsCid?.slice(0, 24) + '…'],
            ['Blockchain TX', result.blockchainTxHash?.slice(0, 20) + '…'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 font-medium">{k}</span>
              <span className="text-gray-800 font-mono text-xs text-right break-all">{v}</span>
            </div>
          ))}
        </div>

        {result.qrCodeUrl && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">QR Code for verification</p>
            <img src={result.qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto rounded-xl border border-gray-100" />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setResult(null)} className="btn-secondary flex-1">Issue Another</button>
          <button onClick={() => navigate('/certificates')} className="btn-primary flex-1">View All</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:'Space Grotesk,sans-serif'}}>Issue Certificate</h1>
        <p className="text-gray-500 text-sm mt-1">All fields are hashed with SHA-256 and stored on blockchain</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Full Name *</label>
            <input className="input" placeholder="John Doe" value={form.studentName} onChange={set('studentName')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Email *</label>
            <input className="input" type="email" placeholder="student@email.com" value={form.studentEmail} onChange={set('studentEmail')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student ID *</label>
            <input className="input" placeholder="CS2021001" value={form.studentId} onChange={set('studentId')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course / Program *</label>
            <input className="input" placeholder="B.Tech Computer Science" value={form.courseName} onChange={set('courseName')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree</label>
            <input className="input" placeholder="Bachelor of Technology" value={form.degree} onChange={set('degree')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CGPA / Grade</label>
            <input className="input" placeholder="9.2 / 10" value={form.cgpa} onChange={set('cgpa')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Date *</label>
            <input className="input" type="date" value={form.issueDate} onChange={set('issueDate')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
            <input className="input" type="date" value={form.expiryDate} onChange={set('expiryDate')} />
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificate PDF (optional)</label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-8 px-4 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
            <Upload className="w-8 h-8 text-gray-300 mb-2" />
            <span className="text-sm text-gray-500">{file ? file.name : 'Click to upload PDF (max 10MB)'}</span>
            <input type="file" accept=".pdf,.png,.jpg" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 border border-blue-100">
          🔐 This certificate will be hashed with SHA-256, stored on IPFS, and anchored on the Polygon blockchain. The record will be immutable.
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <FilePlus className="w-4 h-4" />
          {loading ? 'Issuing Certificate…' : 'Issue Certificate on Blockchain'}
        </button>
      </form>
    </div>
  );
}
