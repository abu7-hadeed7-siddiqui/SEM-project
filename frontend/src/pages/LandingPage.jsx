import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  Star,
  Award,
  ShieldCheck,
  Zap,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const sampleSkills = [
    'Python', 'React', 'Data Structures', 'Docker', 'Machine Learning', 'SQL', 'FastAPI', 'System Design'
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] radial-glow pointer-events-none -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Intelligent Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
              <Sparkles size={13} className="text-violet-400" />
              <span>Strategy Pattern Recommendation Engine v1.0</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Learn Smarter.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
                Discover What to Learn Next.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Built around what you already know. LEARNOVA matches your current skills, career goals, difficulty preferences, and verified prerequisites to deliver a precision-ranked <strong>Top 5</strong> learning path.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 text-sm group"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel text-zinc-200 hover:text-white hover:bg-white/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Compass size={16} className="text-violet-400" />
                <span>Explore Features</span>
              </a>
            </div>

            {/* Skill Chips Banner */}
            <div className="pt-6 border-t border-white/5">
              <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-3">
                Supported Learning Domains & Skills:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {sampleSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-900 border border-white/5 text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Background glow behind card */}
            <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-full -z-10" />

            <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl relative space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-violet-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                    #1
                  </span>
                  <span className="text-xs font-semibold uppercase text-zinc-400">
                    Full Stack Development
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  96% Match
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  React.js: Building Modern UIs
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Master components, hooks, React Query, state management, and performance optimization for enterprise production applications.
                </p>
              </div>

              {/* Why recommended callout */}
              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs">
                <div className="flex items-center gap-1.5 text-violet-300 font-semibold mb-1">
                  <Sparkles size={12} className="text-violet-400" />
                  <span>Recommendation Rationale:</span>
                </div>
                <p className="text-zinc-300 text-[11px] italic pl-3 border-l-2 border-violet-500/50">
                  "Matches your skills: JavaScript, HTML, CSS. Perfectly aligns with your target goal: Full Stack Developer."
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 border border-white/5">
                  React
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 border border-white/5">
                  JavaScript
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Prerequisites Met
                </span>
              </div>

              {/* Interactive Footer Preview */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-zinc-400 text-[11px] ml-1">(4.8/5)</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Rating Loop
                </span>
              </div>
            </div>

            {/* Small floating badge 1 */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-5 -left-4 glass-panel px-3.5 py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-2 text-xs"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-200 font-medium">Prerequisite Strict Filtering</span>
            </motion.div>

            {/* Small floating badge 2 */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 glass-panel px-3.5 py-2 rounded-xl border border-violet-500/30 shadow-xl flex items-center gap-2 text-xs"
            >
              <Zap size={14} className="text-violet-400" />
              <span className="text-violet-200 font-semibold">&lt; 2s Engine Latency</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="py-20 border-t border-white/5 bg-[#0B0B10] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
              The Recommendation Engine
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Data-Driven Matching Powered by the Strategy Pattern
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We do not use rigid hardcoded "if-this-then-that" rules. Our engine calculates a multi-dimensional relevance score combining skills, goals, difficulty restrictions, prerequisite verification, and community feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="text-base font-bold text-white">Profile Synthesis</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Extracts your selected programming languages, computer science foundations, target roles, and preferred difficulty constraints.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="text-base font-bold text-white">Prerequisite & Difficulty Filtering</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ensures Beginner learners are never overwhelmed with Advanced topics. Validates that foundational prerequisites are satisfied.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="text-base font-bold text-white">Multi-Weight Ranking & TOP 5</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Calculates composite scores: Skill Match (30%), Goal Match (25%), Difficulty (20%), Prereq Fit (15%), and Rating Signals (10%).
              </p>
            </div>
          </div>

          {/* Mathematical Formula Showcase */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 max-w-3xl mx-auto text-center space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-violet-300">
              Formal Recommendation Scoring Formula
            </h4>
            <div className="p-3 rounded-xl bg-zinc-950 font-mono text-xs text-emerald-300 border border-emerald-500/20 overflow-x-auto">
              Score = 0.30·SkillOverlap + 0.25·GoalOverlap + 0.20·DifficultyFit + 0.15·PrereqFit + 0.10·RatingSignal
            </div>
            <p className="text-[11px] text-zinc-400">
              Cold-start fallback uses: <span className="font-mono text-zinc-300">Popularity = AverageRating × ln(RatingCount + 1)</span>
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Engine Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Academic Excellence & Production Utility
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <Cpu className="w-6 h-6 text-violet-400" />
            <h4 className="text-sm font-bold text-white">Strategy Pattern</h4>
            <p className="text-xs text-zinc-400">
              Clean separation of ranking algorithms. Swap between TagOverlap and Popularity strategies seamlessly.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Prerequisite Engine</h4>
            <p className="text-xs text-zinc-400">
              Prevents curriculum mismatches by verifying foundational knowledge before recommending advanced modules.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <Star className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Continuous Feedback</h4>
            <p className="text-xs text-zinc-400">
              Interactive 1-5 star ratings directly re-weight future recommendations and update catalog rating stats.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <Database className="w-6 h-6 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">MySQL 8+ Relational Core</h4>
            <p className="text-xs text-zinc-400">
              Strict foreign keys, unique constraint indexing, parameterized queries, and referential integrity.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="glass-panel rounded-2xl border border-violet-500/20 p-8 text-center space-y-4 max-w-4xl mx-auto bg-gradient-to-b from-violet-950/20 to-zinc-900/40">
          <h3 className="text-2xl font-bold text-white">
            Ready to find your optimal learning path?
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl mx-auto">
            Configure your existing skillset, choose your target engineering specialization, and get personalized recommendations in seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-600/25 transition-all text-sm"
            >
              <Sparkles size={16} />
              <span>Create Learner Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
