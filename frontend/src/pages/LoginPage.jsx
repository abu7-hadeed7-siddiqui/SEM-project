import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, Shield, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-600/30 mb-2">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to LEARNOVA
          </h1>
          <p className="text-xs text-zinc-400">
            Continue becoming a better developer with personalized recommendations
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-7 rounded-2xl border border-white/10 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@learnova.local"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Demo Credentials Fill Buttons */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">
              Quick Demo Logins (Evaluator Test)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('student@learnova.local', 'Student@1234')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-medium border border-white/5 transition-colors"
              >
                <User size={12} className="text-emerald-400" />
                <span>Learner Persona</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@learnova.local', 'Admin@1234')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-medium border border-white/5 transition-colors"
              >
                <Shield size={12} className="text-violet-400" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>
        </div>

        {/* Link to register */}
        <p className="text-center text-xs text-zinc-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-violet-400 font-semibold hover:underline">
            Register as a Learner
          </Link>
        </p>
      </div>
    </div>
  );
}
