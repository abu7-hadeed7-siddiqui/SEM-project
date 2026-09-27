import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/common/Toast';
import {
  User,
  Sparkles,
  Layers,
  Target,
  BarChart2,
  CheckCircle2,
  Plus,
  X,
  ArrowRight,
  Save,
  Check
} from 'lucide-react';

const PRESET_SKILLS = [
  'Programming', 'Python', 'C++', 'Java', 'JavaScript', 'TypeScript',
  'HTML', 'CSS', 'SQL', 'Data Structures', 'Algorithms', 'Databases',
  'Networking', 'Operating Systems', 'Docker', 'Kubernetes', 'AWS',
  'Linux', 'Git', 'Machine Learning', 'Deep Learning', 'React', 'Node.js',
  'Flask', 'Django', 'MongoDB', 'PostgreSQL', 'Redis', 'System Design'
];

const PRESET_GOALS = [
  'Become a Backend Developer',
  'Become a Full Stack Developer',
  'Prepare for Technical Interviews',
  'Learn Web Development',
  'Learn Data Science',
  'Learn AI/ML',
  'Learn Cloud Computing',
  'Improve Programming Fundamentals',
  'Master System Design',
  'Master DevOps & CI/CD'
];

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [customSkill, setCustomSkill] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Initialize from current profile
  useEffect(() => {
    if (profile) {
      setSkills(Array.isArray(profile.skills) ? profile.skills : []);
      setGoals(Array.isArray(profile.goals) ? profile.goals : []);
      setDifficulty(profile.difficulty || 'Beginner');
    }
  }, [profile]);

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  // Toggle goal selection
  const toggleGoal = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const addCustomGoal = (e) => {
    e.preventDefault();
    if (customGoal.trim() && !goals.includes(customGoal.trim())) {
      setGoals((prev) => [...prev, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  // Compute live completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (skills.length > 0) score += 40;
    if (goals.length > 0) score += 40;
    if (difficulty) score += 20;
    return score;
  };

  const completion = calculateCompletion();

  const handleSave = async () => {
    setError('');

    if (skills.length === 0 && goals.length === 0) {
      setError('Please select at least one skill or one goal to configure your recommendation engine.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.profile.update({
        skills,
        goals,
        difficulty,
      });

      if (res.success) {
        await refreshProfile();
        setToast({
          type: 'success',
          message: 'Profile updated successfully! Recommendation engine calibrated.'
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold mb-2 border border-violet-500/20">
              <User size={13} />
              <span>Learner Profile Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalize Your Recommendation Profile
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Configure your existing skills, target domains, and difficulty preference for precision algorithmic matching.
            </p>
          </div>

          {/* Completion Progress Gauge */}
          <div className="shrink-0 glass-panel p-4 rounded-xl border border-white/10 flex flex-col items-center min-w-[150px]">
            <span className="text-xs font-medium text-zinc-400 mb-1">Engine Profile</span>
            <span className="text-2xl font-black text-white flex items-baseline gap-1">
              {completion}%
              <span className="text-xs font-normal text-zinc-500">done</span>
            </span>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  completion === 100
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-500'
                }`}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* ================= SECTION 1: DIFFICULTY SEGMENTED CONTROL ================= */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white">Preferred Difficulty Horizon</h2>
          </div>
          <span className="text-xs text-zinc-400">Filter Ceiling</span>
        </div>
        <p className="text-xs text-zinc-400">
          The recommendation engine enforces that resources will never exceed this ceiling. (e.g. A Beginner profile is guaranteed never to receive Advanced modules).
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
            const isSelected = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/20'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>{level}</span>
                <span className="text-[10px] font-normal text-zinc-500">
                  {level === 'Beginner' && 'Foundational'}
                  {level === 'Intermediate' && 'Core & Applied'}
                  {level === 'Advanced' && 'Deep & Distributed'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 2: SKILLS SELECTION ================= */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Your Current Technical Skills</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {skills.length} Selected
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Click to toggle skills you currently know. Used by TagOverlapStrategy to calculate prerequisite compatibility and topic overlap.
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {PRESET_SKILLS.map((skill) => {
            const isSelected = skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-zinc-900/80 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                }`}
              >
                {isSelected && <Check size={12} className="text-emerald-400" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Skill Input */}
        <form onSubmit={addCustomSkill} className="flex gap-2 pt-3 border-t border-white/5">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add custom skill (e.g. Rust, GraphQL)..."
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 flex-1"
          />
          <button
            type="submit"
            disabled={!customSkill.trim()}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </div>

      {/* ================= SECTION 3: LEARNING GOALS ================= */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white">Target Career & Learning Goals</h2>
          </div>
          <span className="text-xs font-semibold text-violet-300 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
            {goals.length} Selected
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Select what you want to achieve or become. These goals are tokenized and scored at 25% weight in recommendation ranking.
        </p>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {PRESET_GOALS.map((goal) => {
            const isSelected = goals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-sm'
                    : 'bg-zinc-900/80 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                }`}
              >
                <span>{goal}</span>
                {isSelected ? (
                  <CheckCircle2 size={16} className="text-violet-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Goal Input */}
        <form onSubmit={addCustomGoal} className="flex gap-2 pt-3 border-t border-white/5">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Add custom career goal (e.g. Quantitative Developer)..."
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500 flex-1"
          />
          <button
            type="submit"
            disabled={!customGoal.trim()}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </div>

      {/* ================= BOTTOM ACTION BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-xs text-zinc-400">
          {skills.length === 0 && goals.length === 0 ? (
            <span className="text-amber-400 font-medium">
              * Please pick at least 1 skill or 1 goal to activate personalized recommendations.
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 size={13} /> Minimum criteria satisfied ({skills.length} skills, {goals.length} goals)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-3 rounded-xl glass-panel text-zinc-200 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
