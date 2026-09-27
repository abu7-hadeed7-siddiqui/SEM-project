import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Sparkles,
  History,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const completion = profile?.completion_percentage ?? 0;

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: Compass },
        { name: 'History', path: '/history', icon: History },
        { name: 'Profile', path: '/profile', icon: User },
        ...(isAdmin ? [{ name: 'Admin Console', path: '/admin', icon: ShieldCheck }] : []),
      ]
    : [
        { name: 'Features', path: '/#features' },
        { name: 'Recommendation Engine', path: '/#how-it-works' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 bg-[#0F0F14]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              LEARNOVA
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                AI MVP
              </span>
            </span>
            <span className="text-[11px] text-zinc-400 -mt-1 hidden sm:block">Intelligent Course Discovery</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated &&
            navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : 'text-zinc-400'}`} />}
                  {link.name}
                </Link>
              );
            })}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Profile Completion Indicator */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors text-xs"
                title="Profile Completion Status"
              >
                <div className="w-4 h-4 rounded-full border border-violet-500/30 flex items-center justify-center">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.max(completion, 15)}%` }}
                  />
                </div>
                <span className="text-zinc-300 font-medium">Profile:</span>
                <span className={`font-semibold ${completion === 100 ? 'text-emerald-400' : 'text-violet-300'}`}>
                  {completion}%
                </span>
              </Link>

              {/* User Identity Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-zinc-200 font-semibold truncate max-w-[120px]">{user?.name}</span>
                  <span className="text-[10px] text-zinc-400 capitalize">{user?.role}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <span className="text-xs px-2 py-1 rounded bg-violet-500/10 text-violet-300 font-semibold border border-violet-500/20">
              {completion}%
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-white/10 mb-2">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-zinc-400">{user?.email}</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">
                  Profile Status: {completion}% Complete
                </p>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    {Icon && <Icon className="w-4 h-4 text-violet-400" />}
                    {link.name}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-lg text-sm font-medium bg-white/5 text-zinc-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
