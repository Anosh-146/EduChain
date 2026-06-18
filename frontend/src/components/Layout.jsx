import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FilePlus, FileText, ShieldCheck,
  LogOut, Menu, X, ChevronRight, Link2, GraduationCap,
  Building2, Search, Bell, ChevronDown
} from 'lucide-react';

const roleConfig = {
  student: {
    color: 'indigo',
    gradient: 'from-indigo-600 to-blue-600',
    bg: 'bg-indigo-600',
    light: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-200',
    label: 'Student Portal',
    icon: GraduationCap,
    nav: [
      { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/student/certificates', label: 'My Certificates', icon: FileText },
      { to: '/student/verify', label: 'Verify Certificate', icon: ShieldCheck },
    ]
  },
  institution: {
    color: 'violet',
    gradient: 'from-violet-600 to-purple-600',
    bg: 'bg-violet-600',
    light: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200',
    label: 'Institution Portal',
    icon: Building2,
    nav: [
      { to: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/institution/issue', label: 'Issue Certificate', icon: FilePlus },
      { to: '/institution/certificates', label: 'All Certificates', icon: FileText },
    ]
  },
  employer: {
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    bg: 'bg-emerald-600',
    light: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    label: 'Verifier Portal',
    icon: ShieldCheck,
    nav: [
      { to: '/verifier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/verifier/verify', label: 'Verify Certificate', icon: Search },
    ]
  }
};

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role || 'student';
  const cfg = roleConfig[role] || roleConfig.student;
  const RoleIcon = cfg.icon;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-300 
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className={`w-9 h-9 bg-gradient-to-br ${cfg.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base leading-none" style={{fontFamily: 'Space Grotesk, sans-serif'}}>EduChain</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{cfg.label}</div>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* User pill */}
        <div className={`mx-4 mt-4 p-3.5 ${cfg.light} rounded-2xl border border-${cfg.color}-100`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 bg-gradient-to-br ${cfg.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <RoleIcon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className={`font-semibold ${cfg.text} text-sm truncate`}>{user?.name}</div>
              <div className={`text-xs ${cfg.text} opacity-60 capitalize`}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Navigation</div>
          {cfg.nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-sm`
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Role badge */}
        <div className="px-4 pb-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100`}>
            <div className={`w-2 h-2 rounded-full ${cfg.bg}`}></div>
            <span className="text-xs text-gray-500 font-medium capitalize">{role} account</span>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-3.5 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="text-gray-600 lg:hidden"><Menu className="w-5 h-5" /></button>
          <div className="font-bold text-indigo-700 lg:hidden" style={{fontFamily: 'Space Grotesk, sans-serif'}}>EduChain</div>
          
          {/* Breadcrumb for desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{cfg.label}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{cfg.nav.find(n => n.to === location.pathname)?.label || 'Page'}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.light} ${cfg.text}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              {user?.name?.split(' ')[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
