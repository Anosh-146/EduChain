import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FileText, ShieldCheck, AlertCircle, ArrowRight, TrendingUp,
  GraduationCap, Star, Clock, CheckCircle, Award, BookOpen, Zap
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/stats/dashboard')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-7 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-white blur-2xl"></div>
          <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white/70 text-sm font-medium mb-1">Student Portal</div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>
              Hello, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-sm">Your blockchain-verified academic credentials — secure, instant, forever.</p>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Certificates', value: stats?.total ?? 0, icon: FileText },
            { label: 'Active', value: stats?.active ?? 0, icon: CheckCircle },
            { label: 'Revoked', value: stats?.revoked ?? 0, icon: AlertCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Icon className="w-5 h-5 text-white/70 mb-2" />
              <div className="text-2xl font-bold text-white">{loading ? '—' : value}</div>
              <div className="text-white/60 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/student/certificates"
            className="group card-hover flex items-center gap-4 border-indigo-50">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">My Certificates</div>
              <div className="text-sm text-gray-400">View & download your credentials</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </Link>

          <Link to="/student/verify"
            className="group card-hover flex items-center gap-4 border-emerald-50">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Verify Certificate</div>
              <div className="text-sm text-gray-400">Check any certificate's authenticity</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Zap, title: 'Instant Verification', desc: 'Share your certificate ID for instant blockchain verification', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { icon: Award, title: 'Tamper-Proof', desc: 'Your credentials are permanently anchored on Polygon blockchain', color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { icon: BookOpen, title: 'Always Accessible', desc: 'Access your certificates anytime, from anywhere in the world', color: 'bg-violet-50 text-violet-600 border-violet-100' },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className={`card border ${color.split(' ')[2]}`}>
            <div className={`w-10 h-10 ${color.split(' ').slice(0,2).join(' ')} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
            <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      {stats?.recent?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Recent Certificates</h2>
          </div>
          <div className="space-y-3">
            {stats.recent.map(c => (
              <div key={c._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{c.courseName}</div>
                  <div className="text-xs text-gray-400 font-mono">{c.certificateId}</div>
                </div>
                <span className={c.status === 'active' ? 'badge-green' : 'badge-red'}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
