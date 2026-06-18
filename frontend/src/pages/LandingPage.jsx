import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Link2, Zap, Globe, Lock, ArrowRight, CheckCircle, Building2, GraduationCap, Briefcase, Star } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: ShieldCheck, title: 'Tamper-Proof', desc: 'SHA-256 hashing detects any modification instantly.' },
    { icon: Link2, title: 'Blockchain Anchored', desc: 'Every certificate is stored on Polygon blockchain forever.' },
    { icon: Zap, title: 'Instant Verification', desc: 'Verify any certificate in seconds via QR code or ID.' },
    { icon: Globe, title: 'Globally Accessible', desc: 'Anyone, anywhere can verify credentials — no signup needed.' },
    { icon: Lock, title: 'IPFS Storage', desc: 'Distributed file storage ensures certificates never disappear.' },
    { icon: CheckCircle, title: 'Role-Based Portals', desc: 'Separate dashboards for institutions, students & verifiers.' },
  ];

  const portals = [
    {
      icon: Building2,
      title: 'Institutions',
      desc: 'Issue and manage blockchain-verified academic certificates for your students.',
      gradient: 'from-violet-500 to-purple-600',
      light: 'bg-violet-50',
      tag: 'violet',
      features: ['Issue certificates on-chain', 'Revoke if necessary', 'View partner network of 20 colleges'],
    },
    {
      icon: GraduationCap,
      title: 'Students',
      desc: 'Access your academic credentials anytime, share with employers, verify authenticity.',
      gradient: 'from-indigo-500 to-blue-600',
      light: 'bg-indigo-50',
      tag: 'indigo',
      features: ['View all your certificates', 'Share via QR or ID', 'Track verification history'],
    },
    {
      icon: Briefcase,
      title: 'Verifiers',
      desc: 'Instantly verify any certificate\'s authenticity against the Polygon blockchain.',
      gradient: 'from-emerald-500 to-teal-600',
      light: 'bg-emerald-50',
      tag: 'emerald',
      features: ['No signup required to verify', 'Real blockchain proof', 'Detect revoked certificates'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{fontFamily:'Space Grotesk,sans-serif'}}>EduChain</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/verify" className="text-white/60 hover:text-white font-medium transition-colors px-4 py-2 text-sm">Verify</Link>
          <Link to="/login" className="text-white/70 hover:text-white font-medium transition-colors px-4 py-2 text-sm">Login</Link>
          <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/40">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/70 mb-8">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live on Polygon · 20 Partner Institutions
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6" style={{fontFamily:'Space Grotesk,sans-serif'}}>
          Credentials That<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            Can't Be Faked
          </span>
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
          EduChain transforms academic certificates into tamper-proof, blockchain-verified digital credentials. Issue in seconds, verify forever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold px-8 py-4 rounded-2xl transition-all text-lg flex items-center gap-2 justify-center shadow-xl shadow-indigo-900/40">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/verify" className="bg-white/8 hover:bg-white/15 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all text-lg text-center">
            Verify a Certificate
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
          {['20 Partner Colleges', 'Polygon Blockchain', 'IPFS Storage', 'SHA-256 Hashing'].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{fontFamily:'Space Grotesk,sans-serif'}}>Three Portals, One Platform</h2>
          <p className="text-white/40 text-sm">Tailored dashboards for every user type</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portals.map(({ icon: Icon, title, desc, gradient, features }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all hover:border-white/20">
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{desc}</p>
              <ul className="space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{fontFamily:'Space Grotesk,sans-serif'}}>Why EduChain?</h2>
          <p className="text-white/40 text-sm">Built on open blockchain standards, owned by no one</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/8 transition-all">
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-10" style={{fontFamily:'Space Grotesk,sans-serif'}}>How It Works</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-xs">
          {['Institution issues', 'SHA-256 hash generated', 'Stored on Polygon', 'QR code created', 'Verifier checks'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 font-medium text-white/70">{step}</div>
              {i < 4 && <ArrowRight className="w-4 h-4 text-white/25 flex-shrink-0 rotate-90 sm:rotate-0" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-white/25 text-xs border-t border-white/8">
        © 2024 EduChain — Blockchain Certificate Platform · Built for India's Academic Future
      </footer>
    </div>
  );
}
