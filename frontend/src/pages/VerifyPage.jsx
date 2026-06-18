import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ShieldCheck, XCircle, Search, Link2, AlertTriangle, CheckCircle, Hash, ExternalLink, Cpu, Globe } from 'lucide-react';

function Badge({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {label}
    </span>
  );
}

export default function VerifyPage({ embedded = false }) {
  const { certId } = useParams();
  const [id, setId] = useState(certId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (certId) verify(certId); }, [certId]);

  const verify = async (idToVerify = id) => {
    if (!idToVerify.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.get(`/verify/${idToVerify.trim()}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found');
    } finally { setLoading(false); }
  };

  const c = result?.certificate;

  const content = (
    <div className="w-full max-w-xl mx-auto">
      {!embedded && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{fontFamily:'Space Grotesk,sans-serif'}}>Certificate Verification</h1>
          <p className="text-white/50 text-sm">Verified against Polygon blockchain + IPFS — no central authority</p>
        </div>
      )}
      {embedded && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>Verify Certificate</h1>
          <p className="text-gray-400 text-sm">Check any certificate's authenticity on the blockchain</p>
        </div>
      )}

      <div className={`flex gap-3 mb-6 ${embedded ? 'bg-gray-50 border border-gray-200 rounded-2xl p-3' : 'bg-white rounded-2xl p-4 shadow-2xl'}`}>
        <input
          className={`flex-1 bg-transparent border-0 outline-none text-sm font-medium placeholder-gray-400 ${embedded ? 'text-gray-800' : 'text-gray-800'}`}
          placeholder="Enter Certificate ID (e.g. A1B2C3D4E5F6)"
          value={id}
          onChange={e => setId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && verify()}
        />
        <button onClick={() => verify()} disabled={loading}
          className="btn-accent flex items-center gap-2 disabled:opacity-60 text-sm py-2">
          <Search className="w-4 h-4" />
          {loading ? 'Checking…' : 'Verify'}
        </button>
      </div>

      {error && (
        <div className={`border rounded-2xl p-6 text-center mb-6 ${embedded ? 'bg-red-50 border-red-100' : 'bg-white/10 border-white/20'}`}>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <div className={`font-semibold mb-1 ${embedded ? 'text-red-800' : 'text-white'}`}>Certificate Not Found</div>
          <div className={`text-sm ${embedded ? 'text-red-600' : 'text-white/50'}`}>{error}</div>
        </div>
      )}

      {result && c && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`px-6 py-5 flex items-center gap-4 ${result.verified ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-red-50 border-b border-red-100'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${result.verified ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {result.verified
                ? <ShieldCheck className="w-7 h-7 text-emerald-600" />
                : <AlertTriangle className="w-7 h-7 text-red-600" />}
            </div>
            <div>
              <div className={`text-xl font-bold ${result.verified ? 'text-emerald-800' : 'text-red-800'}`}>
                {result.verified ? 'Certificate Verified ✓' : 'Verification Failed ✗'}
              </div>
              <div className={`text-sm mt-0.5 ${result.verified ? 'text-emerald-600' : 'text-red-600'}`}>
                {result.verified
                  ? 'Authentic — hash found on Polygon blockchain'
                  : c.status === 'revoked'
                    ? `Revoked: ${c.revokedReason}`
                    : 'Certificate not found on-chain'}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Student Name', c.studentName],
                ['Student ID', c.studentId],
                ['Course', c.courseName],
                ['Degree', c.degree || '—'],
                ['CGPA', c.cgpa || '—'],
                ['Institution', c.institutionName],
                ['Issue Date', c.issueDate ? new Date(c.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                ['Status', c.status],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">{k}</div>
                  <div className="text-gray-800 font-semibold capitalize">{v}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 space-y-2 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <Globe className="w-3.5 h-3.5" /> IPFS STORAGE
                </div>
                <Badge ok={!c.ipfsSimulated} label={c.ipfsSimulated ? 'Simulated' : 'Live on IPFS'} />
              </div>
              <div className="text-xs font-mono text-blue-800 break-all bg-white rounded-lg p-2 border border-blue-100">{c.ipfsCid}</div>
              {c.ipfsGatewayUrl && !c.ipfsSimulated && (
                <a href={c.ipfsGatewayUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> View on IPFS Gateway
                </a>
              )}
            </div>

            <div className="bg-violet-50 rounded-xl p-4 space-y-2 border border-violet-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                  <Cpu className="w-3.5 h-3.5" /> BLOCKCHAIN RECORD
                </div>
                <Badge ok={!c.blockchainSimulated} label={c.blockchainSimulated ? 'Simulated' : 'On Polygon'} />
              </div>
              {[['Network', c.blockchainNetwork], ['TX Hash', c.blockchainTxHash], ['Block', c.blockNumber || '—']].map(([k, v]) => (
                <div key={k} className="flex gap-2 text-xs">
                  <span className="text-violet-400 w-16 flex-shrink-0">{k}</span>
                  <span className="font-mono text-violet-800 break-all">{v}</span>
                </div>
              ))}
              {c.blockchainTxHash && !c.blockchainSimulated && (
                <a href={`https://amoy.polygonscan.com/tx/${c.blockchainTxHash}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-600 hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> View on PolygonScan
                </a>
              )}
            </div>

            {c.fileUrl && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500">📄 CERTIFICATE FILE</span>
                  <a href={c.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Open full screen
                  </a>
                </div>
                {c.fileUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                  <img src={c.fileUrl} alt="Certificate" className="w-full object-contain max-h-96" />
                ) : (
                  <iframe src={c.fileUrl} className="w-full" style={{ height: '420px', border: 'none' }} title="Certificate" />
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-2">
                <Hash className="w-3.5 h-3.5" /> SHA-256 HASH
              </div>
              <div className="font-mono text-xs text-gray-600 break-all">{c.sha256Hash}</div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Verified {c.verificationCount} time{c.verificationCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center px-4 py-16">
      <Link to="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white" style={{fontFamily:'Space Grotesk,sans-serif'}}>EduChain</span>
      </Link>
      {content}
      <div className="text-center mt-8">
        <Link to="/login" className="text-white/30 hover:text-white/60 text-sm transition-colors">
          Sign in to issue certificates →
        </Link>
      </div>
    </div>
  );
}
