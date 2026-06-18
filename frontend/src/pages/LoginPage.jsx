import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, AlertCircle, GraduationCap, Building2, Briefcase, ShieldCheck } from 'lucide-react';

const roleHints = {
  student: { color: 'indigo', icon: GraduationCap, label: 'Student Portal' },
  institution: { color: 'violet', icon: Building2, label: 'Institution Portal' },
  employer: { color: 'emerald', icon: Briefcase, label: 'Verifier Portal' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'institution') navigate('/institution/dashboard');
      else if (user.role === 'employer') navigate('/verifier/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white" style={{fontFamily:'Space Grotesk,sans-serif'}}>EduChain</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>Welcome back</h1>
          <p className="text-gray-400 text-sm mb-7">Sign in to your EduChain portal</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Role info */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium">Your dashboard is tailored to your role</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleHints).map(([role, { icon: Icon, label, color }]) => (
                <div key={role} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-${color}-50 border border-${color}-100`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                  <span className={`text-[10px] font-semibold text-${color}-700 text-center`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link to="/verify" className="hover:text-white/60 transition-colors">Verify a certificate without login →</Link>
        </p>
      </div>
    </div>
  );
}
