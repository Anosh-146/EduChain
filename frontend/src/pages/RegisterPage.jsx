import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, AlertCircle, GraduationCap, Building2, Briefcase } from 'lucide-react';

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Access & share your certificates', gradient: 'from-indigo-500 to-blue-500' },
  { value: 'institution', label: 'Institution', icon: Building2, desc: 'Issue & manage credentials', gradient: 'from-violet-500 to-purple-500' },
  { value: 'employer', label: 'Verifier', icon: Briefcase, desc: 'Verify candidate credentials', gradient: 'from-emerald-500 to-teal-500' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', institutionName: '', studentId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'institution') navigate('/institution/dashboard');
      else if (user.role === 'employer') navigate('/verifier/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === form.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white" style={{fontFamily:'Space Grotesk,sans-serif'}}>EduChain</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>Create account</h1>
          <p className="text-gray-400 text-sm mb-6">Join the blockchain certificate network</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, icon: Icon, desc, gradient }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border-2 text-sm font-semibold transition-all
                      ${form.role === value
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
                    <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
              {selectedRole && (
                <p className="text-xs text-gray-400 mt-2 text-center">{selectedRole.desc}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>

            {form.role === 'institution' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Institution Name</label>
                <input className="input" placeholder="e.g. IIT Bombay, VIT Vellore" value={form.institutionName} onChange={set('institutionName')} required />
              </div>
            )}
            {form.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student ID</label>
                <input className="input" placeholder="Your roll number" value={form.studentId} onChange={set('studentId')} />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
