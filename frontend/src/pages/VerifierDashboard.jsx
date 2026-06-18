import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  ShieldCheck, Search, XCircle, CheckCircle, AlertTriangle,
  Hash, Cpu, Globe, ExternalLink, Clock, TrendingUp, Briefcase,
  Building2, FileText, Zap, Eye, ArrowRight
} from 'lucide-react';

function Badge({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {label}
    </span>
  );
}

const RECENT_VERIFICATIONS = [
  { id: 'EDU-2024-001', student: 'Rahul Sharma', course: 'B.Tech CSE', institution: 'IIT Bombay', status: 'verified', time: '2m ago' },
  { id: 'EDU-2024-002', student: 'Priya Patel', course: 'MBA Finance', institution: 'IIM Ahmedabad', status: 'verified', time: '15m ago' },
  { id: 'EDU-2024-003', student: 'Amit Kumar', course: 'M.Tech AI', institution: 'IIT Delhi', status: 'revoked', time: '1h ago' },
  { id: 'EDU-2024-004', student: 'Sneha Reddy', course: 'B.Sc Data Science', institution: 'VIT Vellore', status: 'verified', time: '3h ago' },
];

export default function VerifierDashboard() {
  const { user } = useAuth();
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyCount, setVerifyCount] = useState(0);

  const verify = async () => {
    if (!id.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.get(`/verify/${id.trim()}`);
      setResult(data);
      setVerifyCount(c => c + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found');
    } finally { setLoading(false); }
  };

  const c = result?.certificate;

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-7 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-white blur-2xl"></div>
          <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-teal-300 blur-3xl"></div>
        </div>
        <div className="relative flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white/70 text-sm font-medium mb-1">Verifier Portal</div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>
              Welcome, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-emerald-100 text-sm">Instantly verify educational certificates on the Polygon blockchain.</p>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            { label: 'Verified Today', value: verifyCount, icon: ShieldCheck },
            { label: 'Network', value: '20 Colleges', icon: Building2 },
            { label: 'Blockchain', value: 'Polygon', icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Icon className="w-5 h-5 text-white/70 mb-2" />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-white/60 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verify Tool */}
      <div className="card mb-8 border-emerald-100">
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-gray-900">Verify a Certificate</h2>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            className="input flex-1"
            placeholder="Enter Certificate ID (e.g. A1B2C3D4E5F6)"
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
          />
          <button onClick={verify} disabled={loading || !id.trim()}
            className="btn-accent flex items-center gap-2 whitespace-nowrap disabled:opacity-60">
            <Search className="w-4 h-4" />
            {loading ? 'Checking…' : 'Verify'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4">
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-red-800 text-sm">Not Found</div>
              <div className="text-red-600 text-xs mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {result && c && (
          <div className={`rounded-2xl overflow-hidden border ${result.verified ? 'border-emerald-200' : 'border-red-200'}`}>
            {/* Status banner */}
            <div className={`px-5 py-4 flex items-center gap-4 ${result.verified ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${result.verified ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {result.verified ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
              </div>
              <div>
                <div className={`text-lg font-bold ${result.verified ? 'text-emerald-800' : 'text-red-800'}`}>
                  {result.verified ? '✓ Certificate Verified' : '✗ Verification Failed'}
                </div>
                <div className={`text-sm mt-0.5 ${result.verified ? 'text-emerald-600' : 'text-red-600'}`}>
                  {result.verified ? 'Authentic — anchored on Polygon blockchain' : c.status === 'revoked' ? `Revoked: ${c.revokedReason}` : 'Not found on-chain'}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Student Name', c.studentName],
                  ['Student ID', c.studentId],
                  ['Course', c.courseName],
                  ['Degree', c.degree || '—'],
                  ['CGPA', c.cgpa || '—'],
                  ['Institution', c.institutionName],
                  ['Issue Date', c.issueDate ? new Date(c.issueDate).toLocaleDateString() : '—'],
                  ['Status', c.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">{k}</div>
                    <div className="text-gray-800 font-semibold capitalize text-sm">{v}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge ok={!c.ipfsSimulated} label={c.ipfsSimulated ? 'IPFS Simulated' : 'Live on IPFS'} />
                <Badge ok={!c.blockchainSimulated} label={c.blockchainSimulated ? 'Blockchain Simulated' : 'On Polygon'} />
                {result.verified && <span className="badge-green"><CheckCircle className="w-3 h-3" />Authentic</span>}
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-1.5"><Hash className="w-3.5 h-3.5" />SHA-256 Hash</div>
                <div className="font-mono text-gray-600 break-all">{c.sha256Hash}</div>
              </div>

              {c.blockchainTxHash && !c.blockchainSimulated && (
                <a href={`https://amoy.polygonscan.com/tx/${c.blockchainTxHash}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-emerald-600 hover:underline">
                  <ExternalLink className="w-3 h-3" /> View on PolygonScan
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-gray-900">How Verification Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Enter Certificate ID', desc: 'Paste the unique certificate ID from the student\'s credential document.', icon: Search },
            { step: '02', title: 'Blockchain Check', desc: 'We query the Polygon blockchain and IPFS for the SHA-256 hash of this certificate.', icon: Cpu },
            { step: '03', title: 'Instant Result', desc: 'Get a verified or failed status within seconds — no trust in central authority needed.', icon: ShieldCheck },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="flex gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold text-xs">{step}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Verifications (dummy) */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="font-bold text-gray-900">Recent Network Verifications</h2>
          <span className="badge-blue ml-auto">Sample Data</span>
        </div>
        <div className="space-y-3">
          {RECENT_VERIFICATIONS.map(v => (
            <div key={v.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${v.status === 'verified' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {v.status === 'verified' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm">{v.student}</div>
                <div className="text-xs text-gray-400 truncate">{v.course} · {v.institution}</div>
              </div>
              <div className="text-right">
                <span className={v.status === 'verified' ? 'badge-green' : 'badge-red'}>{v.status}</span>
                <div className="text-xs text-gray-400 mt-1">{v.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
