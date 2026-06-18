import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FileText, ShieldCheck, FilePlus, AlertCircle, ArrowRight, TrendingUp,
  Building2, Users, Globe, Award, CheckCircle, MapPin, ExternalLink
} from 'lucide-react';

const PARTNER_COLLEGES = [
  { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'IIT', certs: 1240 },
  { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', type: 'IIT', certs: 1185 },
  { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', type: 'IIT', certs: 1098 },
  { name: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', type: 'IIT', certs: 1321 },
  { name: 'NIT Warangal', city: 'Warangal', state: 'Telangana', type: 'NIT', certs: 832 },
  { name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'NIT', certs: 765 },
  { name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', type: 'Deemed', certs: 943 },
  { name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', type: 'Deemed', certs: 2103 },
  { name: 'Amrita University', city: 'Coimbatore', state: 'Tamil Nadu', type: 'Deemed', certs: 1567 },
  { name: 'Manipal University', city: 'Manipal', state: 'Karnataka', type: 'Deemed', certs: 1892 },
  { name: 'SRM University', city: 'Chennai', state: 'Tamil Nadu', type: 'Deemed', certs: 2450 },
  { name: 'Anna University', city: 'Chennai', state: 'Tamil Nadu', type: 'State', certs: 3102 },
  { name: 'Osmania University', city: 'Hyderabad', state: 'Telangana', type: 'State', certs: 1876 },
  { name: 'Andhra University', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'State', certs: 1654 },
  { name: 'JNTU Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'State', certs: 2231 },
  { name: 'Pune University', city: 'Pune', state: 'Maharashtra', type: 'State', certs: 2876 },
  { name: 'Delhi University', city: 'New Delhi', state: 'Delhi', type: 'Central', certs: 4102 },
  { name: 'Calcutta University', city: 'Kolkata', state: 'West Bengal', type: 'State', certs: 1943 },
  { name: 'Bangalore University', city: 'Bengaluru', state: 'Karnataka', type: 'State', certs: 2210 },
  { name: 'Madras University', city: 'Chennai', state: 'Tamil Nadu', type: 'State', certs: 3456 },
];

const typeColor = {
  IIT: 'bg-indigo-100 text-indigo-700',
  NIT: 'bg-violet-100 text-violet-700',
  Deemed: 'bg-emerald-100 text-emerald-700',
  State: 'bg-amber-100 text-amber-700',
  Central: 'bg-blue-100 text-blue-700',
};

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    api.get('/certificates/stats/dashboard')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = PARTNER_COLLEGES.filter(c =>
    (typeFilter === 'All' || c.type === typeFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.city.toLowerCase().includes(search.toLowerCase()) ||
     c.state.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCerts = PARTNER_COLLEGES.reduce((a, c) => a + c.certs, 0);

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-3xl p-7 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-white blur-2xl"></div>
          <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-purple-300 blur-3xl"></div>
        </div>
        <div className="relative flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white/70 text-sm font-medium mb-1">Institution Portal</div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Space Grotesk,sans-serif'}}>
              {user?.institutionName || user?.name}
            </h1>
            <p className="text-purple-100 text-sm">Issue & manage blockchain-verified academic credentials</p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Issued', value: stats?.total ?? 0, icon: FileText },
            { label: 'Active', value: stats?.active ?? 0, icon: CheckCircle },
            { label: 'Revoked', value: stats?.revoked ?? 0, icon: AlertCircle },
            { label: 'Network', value: '20', icon: Building2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Icon className="w-5 h-5 text-white/70 mb-2" />
              <div className="text-2xl font-bold text-white">{loading && label !== 'Network' ? '—' : value}</div>
              <div className="text-white/60 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/institution/issue"
            className="group card-hover flex items-center gap-4 border-violet-50">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 transition-colors">
              <FilePlus className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Issue Certificate</div>
              <div className="text-sm text-gray-400">Create blockchain credential</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors" />
          </Link>

          <Link to="/institution/certificates"
            className="group card-hover flex items-center gap-4 border-blue-50">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">All Certificates</div>
              <div className="text-sm text-gray-400">Manage issued records</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </Link>

          <Link to="/verify"
            className="group card-hover flex items-center gap-4 border-emerald-50">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Verify Certificate</div>
              <div className="text-sm text-gray-400">Check any certificate</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent */}
      {stats?.recent?.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <h2 className="font-semibold text-gray-900">Recently Issued</h2>
          </div>
          <div className="space-y-3">
            {stats.recent.map(c => (
              <div key={c._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{c.studentName}</div>
                  <div className="text-xs text-gray-400">{c.courseName} · <span className="font-mono">{c.certificateId}</span></div>
                </div>
                <span className={c.status === 'active' ? 'badge-green' : 'badge-red'}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EduChain Partner Colleges */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-gray-900">EduChain Partner Network</h2>
            <span className="badge-violet">{PARTNER_COLLEGES.length} Colleges</span>
          </div>
          <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
            <input
              className="input text-xs py-2 px-3 w-full sm:w-48"
              placeholder="Search colleges…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="input text-xs py-2 px-3"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="IIT">IIT</option>
              <option value="NIT">NIT</option>
              <option value="Deemed">Deemed</option>
              <option value="State">State</option>
              <option value="Central">Central</option>
            </select>
          </div>
        </div>

        {/* Network stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Partner Institutions', value: '20', icon: Building2, color: 'text-violet-600 bg-violet-50' },
            { label: 'Total Certificates', value: totalCerts.toLocaleString(), icon: Award, color: 'text-blue-600 bg-blue-50' },
            { label: 'States Covered', value: '10', icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Network Verified', value: '100%', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`flex items-center gap-3 rounded-xl p-3 ${color.split(' ')[1]}`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[0]} flex-shrink-0`} />
              <div>
                <div className="font-bold text-gray-900 text-lg leading-none">{value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Colleges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((college, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {college.name.split(' ').slice(-1)[0][0]}{college.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{college.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400 truncate">{college.city}, {college.state}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[college.type]}`}>
                  {college.type}
                </span>
                <span className="text-xs text-gray-400">{college.certs.toLocaleString()} certs</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No colleges match your search.</div>
        )}
      </div>
    </div>
  );
}
