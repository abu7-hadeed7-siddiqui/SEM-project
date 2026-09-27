import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

const COMMON_CATEGORIES = [
  'Programming',
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Database',
  'Data Structures',
  'Algorithms',
  'AI/ML',
  'Data Science',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Networking',
  'Operating Systems',
  'Software Engineering',
  'System Design',
  'Interview Preparation',
];

export default function ResourceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    customCategory: '',
    difficulty: 'Beginner',
    tags: '',
    prerequisites: '',
    url: '',
    is_active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const isKnownCategory = COMMON_CATEGORIES.includes(initialData.category);
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: isKnownCategory ? initialData.category : 'Other',
        customCategory: isKnownCategory ? '' : initialData.category,
        difficulty: initialData.difficulty || 'Beginner',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        prerequisites: Array.isArray(initialData.prerequisites) ? initialData.prerequisites.join(', ') : '',
        url: initialData.url || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Programming',
        customCategory: '',
        difficulty: 'Beginner',
        tags: '',
        prerequisites: '',
        url: '',
        is_active: true,
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }

    const finalCategory = formData.category === 'Other'
      ? formData.customCategory.trim()
      : formData.category;

    if (!finalCategory) {
      setError('Category is required.');
      return;
    }

    // Split tags & prerequisites by comma
    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedPrereqs = formData.prerequisites
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: finalCategory,
      difficulty: formData.difficulty,
      tags: parsedTags,
      prerequisites: parsedPrereqs,
      url: formData.url.trim() || null,
      is_active: formData.is_active ? 1 : 0,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/30 text-violet-300 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Learning Resource' : 'Add New Learning Resource'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEditing ? 'Update catalog item metadata and prerequisites' : 'Add a new course or tutorial to the recommendation engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Resource Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Full-Stack Web Development with React & Node.js"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A comprehensive breakdown of curriculum, learning objectives, and practical hands-on projects..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Category & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500 text-xs"
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Other">Custom Category...</option>
              </select>

              {formData.category === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-zinc-900/80 border border-white/10 text-white text-xs"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Difficulty Level <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500 text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Skills & Topic Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. React, JavaScript, Frontend, Web Development"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Required Prerequisites (Comma separated)
            </label>
            <input
              type="text"
              value={formData.prerequisites}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              placeholder="e.g. Programming Fundamentals, HTML & CSS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Course URL (Optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/courses/fullstack"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_toggle"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-zinc-900 border-zinc-700"
            />
            <label htmlFor="is_active_toggle" className="text-zinc-300 cursor-pointer">
              Active in recommendation catalogue
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
