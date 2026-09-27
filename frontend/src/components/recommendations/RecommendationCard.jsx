import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react';
import StarRating from '../common/StarRating';
import { api } from '../../services/api';

export default function RecommendationCard({
  item,
  rank,
  onRateSuccess,
  onRateError
}) {
  const resource = item.resource || {};
  const [currentRating, setCurrentRating] = useState(item.rating || 0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [justRated, setJustRated] = useState(false);

  // Compute match percentage (capped nicely)
  const matchPercentage = Math.min(Math.round(item.score * 100), 100);

  // Difficulty badge styling
  const difficultyStyles = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    Intermediate: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
    Advanced: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  };

  // Rank badge styling
  const rankColors = {
    1: 'from-amber-400 to-violet-500 text-zinc-950 font-black shadow-amber-500/20',
    2: 'from-violet-400 to-indigo-500 text-white font-bold shadow-violet-500/20',
    3: 'from-emerald-400 to-teal-500 text-zinc-950 font-bold shadow-emerald-500/20',
    4: 'from-zinc-300 to-zinc-500 text-zinc-950 font-bold',
    5: 'from-zinc-400 to-zinc-600 text-zinc-950 font-bold',
  };

  const handleRatingChange = async (newRating) => {
    try {
      setIsSubmittingRating(true);
      setCurrentRating(newRating);
      
      const res = await api.recommendations.submitRating(
        item.id,
        resource.id,
        newRating
      );

      if (res.success) {
        setJustRated(true);
        setTimeout(() => setJustRated(false), 2500);
        if (onRateSuccess) {
          onRateSuccess(resource.title, newRating);
        }
      }
    } catch (err) {
      if (onRateError) {
        onRateError(err.message || 'Failed to submit rating');
      }
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const hasPrereqs = resource.prerequisites && resource.prerequisites.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.08 }}
      className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/8 relative flex flex-col justify-between overflow-hidden group"
    >
      {/* Glow highlight on card top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Rank Badge */}
            <span
              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                rankColors[rank] || 'from-zinc-500 to-zinc-700 text-white'
              } flex items-center justify-center text-xs shadow-md shrink-0`}
            >
              #{rank}
            </span>

            {/* Category */}
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {resource.category || 'General'}
            </span>
          </div>

          {/* Difficulty & Match Score */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                difficultyStyles[resource.difficulty] || difficultyStyles.Beginner
              }`}
            >
              {resource.difficulty}
            </span>

            <div className="px-2.5 py-1 rounded-md text-xs font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 shadow-sm">
              <Sparkles size={11} className="text-violet-400" />
              <span>{matchPercentage}% Match</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-violet-200 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-900/80 text-zinc-300 border border-white/5"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 5 && (
              <span className="text-[11px] text-zinc-500 self-center">
                +{resource.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Prerequisites Badge if any */}
        {hasPrereqs && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-zinc-900/60 border border-white/5 flex items-start gap-2 text-xs">
            <Layers size={13} className="text-violet-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-zinc-400 font-medium">Prerequisites: </span>
              <span className="text-zinc-300">{resource.prerequisites.join(', ')}</span>
            </div>
          </div>
        )}

        {/* "Why this was recommended" Explanation Box */}
        <div className="mb-5 p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-violet-300 font-semibold mb-1">
            <Sparkles size={13} className="text-violet-400" />
            <span>Why this was recommended:</span>
          </div>
          <p className="text-zinc-300 italic pl-4 border-l-2 border-violet-500/40 leading-relaxed">
            "{item.match_reason || 'Strong algorithmic alignment with your current learning objectives and skill profile.'}"
          </p>
        </div>
      </div>

      {/* Bottom Action & Rating Footer */}
      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Rating Feedback Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Rate fit:</span>
          <StarRating
            value={currentRating}
            onChange={handleRatingChange}
            size={17}
          />
          {justRated && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold animate-pulse">
              <Check size={12} /> Saved!
            </span>
          )}
          {currentRating > 0 && !justRated && (
            <span className="text-[11px] text-zinc-500">
              ({currentRating}/5)
            </span>
          )}
        </div>

        {/* Community Rating & External Link */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 text-xs text-amber-400" title={`Average Rating: ${resource.average_rating || 0}`}>
            <Award size={13} />
            <span className="font-semibold">{Number(resource.average_rating || 0).toFixed(1)}</span>
            <span className="text-zinc-500 text-[10px]">({resource.rating_count || 0})</span>
          </div>

          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-violet-600 hover:text-white text-zinc-300 transition-all border border-white/10"
            >
              <span>Explore Course</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
