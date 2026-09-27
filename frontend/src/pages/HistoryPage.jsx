import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StarRating from '../components/common/StarRating';
import Toast from '../components/common/Toast';
import {
  History,
  Filter,
  Calendar,
  Sparkles,
  Layers,
  Award,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Filters
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.recommendations.getHistory();
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Update rating inside history
  const handleRatingUpdate = async (item, newRating) => {
    try {
      const res = await api.recommendations.submitRating(
        item.item_id,
        item.resource.id,
        newRating
      );
      if (res.success) {
        setToast({
          type: 'success',
          message: `Rating for "${item.resource.title}" updated to ${newRating} stars.`
        });
        // Optimistic local update
        setHistory((prev) =>
          prev.map((h) =>
            h.item_id === item.item_id ? { ...h, user_rating: newRating } : h
          )
        );
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to submit rating' });
    }
  };

  // Filter items
  const filteredHistory = history.filter((item) => {
    // Difficulty
    if (filterDifficulty !== 'All' && item.resource.difficulty !== filterDifficulty) {
      return false;
    }

    // Type
    if (filterType === 'Personalized' && !item.is_personalized) return false;
    if (filterType === 'Cold Start' && item.is_personalized) return false;

    // Rating
    if (filterRating === 'Rated' && !item.user_rating) return false;
    if (filterRating === 'Unrated' && item.user_rating) return false;
    if (filterRating === '5 Stars' && item.user_rating !== 5) return false;
    if (filterRating === '4+ Stars' && (!item.user_rating || item.user_rating < 4)) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold mb-1 border border-violet-500/20">
              <History size={13} />
              <span>Audit & Learning Path Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recommendation History & Audit Trail
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Review previous algorithmic recommendation instances, historical ranks, model versions, and your rating feedback.
            </p>
          </div>

          <div className="glass-panel px-4 py-3 rounded-xl border border-white/10 text-center shrink-0">
            <span className="text-xs text-zinc-400 block font-medium">Logged Items</span>
            <span className="text-xl font-bold text-white">{history.length}</span>
          </div>
        </div>
      </div>

      {/* Controls & Multi-Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Ratings</option>
              <option value="Rated">Rated Only</option>
              <option value="Unrated">Unrated Only</option>
              <option value="5 Stars">5 Stars</option>
              <option value="4+ Stars">4+ Stars</option>
            </select>
          </div>

          {/* Algorithm Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Types</option>
              <option value="Personalized">Personalized</option>
              <option value="Cold Start">Cold Start</option>
            </select>
          </div>
        </div>

        <div className="text-zinc-400">
          Showing <span className="font-semibold text-white">{filteredHistory.length}</span> of {history.length} items
        </div>
      </div>

      {/* Main Timeline / History List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 rounded-xl border border-white/5 animate-pulse h-28" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-3">
          <p className="text-rose-300 text-xs">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-4 max-w-md mx-auto">
          <History size={40} className="text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No History Records Found</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {history.length === 0
              ? 'You have not generated any recommendations yet. Go to your dashboard to generate your first Top 5 list!'
              : 'No items match your active filters. Try resetting the filters above.'}
          </p>
          {history.length === 0 && (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => {
            const formattedDate = item.generated_at
              ? new Date(item.generated_at).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently';

            return (
              <div
                key={item.item_id || index}
                className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left Block: Rank, Title, Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-violet-600/30 text-violet-300 text-xs font-bold flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <span className="text-xs font-medium text-zinc-400">
                      {item.resource.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        item.resource.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.resource.difficulty === 'Intermediate'
                          ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {item.resource.difficulty}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.is_personalized
                          ? 'bg-violet-600/20 text-violet-300'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {item.is_personalized ? 'Personalized' : 'Cold Start'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.resource.title}
                  </h3>

                  {item.match_reason && (
                    <p className="text-xs text-zinc-400 italic">
                      "{item.match_reason}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Sparkles size={11} className="text-violet-400" />
                      {item.algorithm_version}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar size={11} />
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Right Block: Rating Feedback in History */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-medium text-zinc-400 block mb-1">
                      {item.user_rating ? 'Your Rating:' : 'Rate Fit:'}
                    </span>
                    <StarRating
                      value={item.user_rating || 0}
                      onChange={(rating) => handleRatingUpdate(item, rating)}
                      size={18}
                      showLabel={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
