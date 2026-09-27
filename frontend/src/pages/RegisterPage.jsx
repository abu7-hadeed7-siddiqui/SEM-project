import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation feedback
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setError('Password must be at least 8 characters and include 1 uppercase letter and 1 number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      // Direct newly registered user to profile setup to pick skills/goals
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-600/30 mb-2">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create Your Learner Profile
          </h1>
          <p className="text-xs text-zinc-400">
            Discover personalized courses engineered for your specific skillset
          </p>
        </div>

        {/* Register Card */}
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
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

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
                placeholder="alex@learnova.local"
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters (1 uppercase, 1 digit)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
              
              {/* Password strength checklist */}
              <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}`}>
                  <CheckCircle2 size={11} /> 8+ chars
                </span>
                <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}`}>
                  <CheckCircle2 size={11} /> 1 Uppercase
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}`}>
                  <CheckCircle2 size={11} /> 1 Number
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors ${
                  confirmPassword && !passwordsMatch
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-violet-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Continue to Skill Setup'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Link to login */}
        <p className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
