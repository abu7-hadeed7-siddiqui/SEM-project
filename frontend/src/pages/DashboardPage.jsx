import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import SkeletonCard from '../components/recommendations/SkeletonCard';
import Toast from '../components/common/Toast';
import {
  Sparkles,
  RefreshCw,
  Filter,
  User,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();

  const [recommendation, setRecommendation] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch recommendations
  const fetchRecommendations = async (refresh = false) => {
    try {
      if (refresh) {
        setGenerating(true);
      } else {
        setLoading(true);
      }
      setError('');

      const res = await api.recommendations.get(refresh);
      if (res.success && res.recommendation) {
        setRecommendation(res.recommendation);
        setItems(res.recommendation.items || []);
        if (refresh) {
          setToast({
            type: 'success',
            message: 'Generated fresh personalized recommendations!'
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(false);
  }, []);

  // Filter items by difficulty:
  // "The filter must never display a higher difficulty than selected."
  // All -> show all returned top 5
  // Beginner -> only show Beginner
  // Intermediate -> only show Beginner and Intermediate
  // Advanced -> show all
  const filteredItems = items.filter((item) => {
    const resDifficulty = item.resource?.difficulty || 'Beginner';
    if (selectedDifficulty === 'All') return true;
    if (selectedDifficulty === 'Beginner') return resDifficulty === 'Beginner';
    if (selectedDifficulty === 'Intermediate') {
      return resDifficulty === 'Beginner' || resDifficulty === 'Intermediate';
    }
    if (selectedDifficulty === 'Advanced') return true;
    return true;
  });

  const handleRateSuccess = (courseTitle, ratingValue) => {
    setToast({
      type: 'success',
      message: `Feedback recorded: ${ratingValue} stars for "${courseTitle}". Future recommendations updated!`
    });
  };

  const isColdStart = recommendation && !recommendation.is_personalized;
  const completion = profile?.completion_percentage ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ================= HERO GREETING BANNER ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/20">
              <Sparkles size={12} className="text-violet-400" />
              <span>Personalized Learning Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user?.name || 'Learner'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Ready to continue your learning journey? Your recommendations are calibrated against your verified skills and target milestones.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => fetchRecommendations(true)}
              disabled={generating || loading}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
              <span>{generating ? 'Re-scoring Catalog...' : 'Get My Recommendations'}</span>
            </button>

            <Link
              to="/profile"
              className="px-4 py-3 rounded-xl glass-panel text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <User size={14} className="text-violet-400" />
              <span>Edit Skills ({completion}%)</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Reminder if low */}
        {completion < 60 && (
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertCircle size={14} className="shrink-0" />
              <span>Your profile is {completion}% complete. Add more skills to refine your algorithmic precision.</span>
            </div>
            <Link to="/profile" className="text-violet-400 font-semibold hover:underline shrink-0">
              Complete Profile →
            </Link>
          </div>
        )}
      </div>

      {/* ================= COLD START NOTICE BANNER ================= */}
      {isColdStart && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              COLD START
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">
                Popularity-Based Cold Start Active
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your profile currently lacks specific skills or goals. We are serving community-ranked top courses using our 
                <span className="font-mono text-xs bg-black/30 px-1 py-0.5 rounded mx-1">PopularityStrategy-v1</span> 
                algorithm (average rating × log volume).
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Personalize Now
          </Link>
        </div>
      )}

      {/* ================= CONTROLS ROW: DIFFICULTY FILTER & STATS ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Recommended For You</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
              TOP 5
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Algorithm: <span className="font-mono text-zinc-300">{recommendation?.algorithm_version || 'TagOverlapStrategy-v1'}</span>
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs">
          <span className="px-2 text-zinc-400 font-medium flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN RECOMMENDATIONS GRID ================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Error Generating Recommendations</h3>
          <p className="text-xs text-zinc-400">{error}</p>
          <button
            onClick={() => fetchRecommendations(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Retry Request
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-4 max-w-md mx-auto">
          <Layers size={36} className="text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Courses Match Filter</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No recommended resources match the selected "{selectedDifficulty}" restriction. Try setting the filter to "All" or updating your difficulty preference in Profile.
          </p>
          <button
            onClick={() => setSelectedDifficulty('All')}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            Reset Filter to All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <RecommendationCard
              key={item.id || index}
              item={item}
              rank={item.rank || index + 1}
              onRateSuccess={handleRateSuccess}
              onRateError={(err) => setToast({ type: 'error', message: err })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
