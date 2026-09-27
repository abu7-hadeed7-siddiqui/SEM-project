import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ResourceModal from '../components/admin/ResourceModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import Toast from '../components/common/Toast';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Users,
  BookOpen,
  Sparkles,
  Star,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [categories, setCategories] = useState([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    resource: null,
  });

  // Load stats & categories once
  const loadStatsAndCategories = async () => {
    try {
      const [statsRes, catRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getCategories(),
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (catRes.success) setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  // Load resources on filter/page change
  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getResources({
        search,
        category: categoryFilter,
        difficulty: difficultyFilter,
        page,
        perPage,
      });
      if (res.success) {
        setResources(res.items || []);
        setTotalResources(res.total || 0);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load resources' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatsAndCategories();
  }, []);

  useEffect(() => {
    loadResources();
  }, [search, categoryFilter, difficultyFilter, page]);

  // Handle Save (Create or Update)
  const handleSaveResource = async (payload) => {
    if (editingResource) {
      const res = await api.admin.updateResource(editingResource.id, payload);
      if (res.success) {
        setToast({ type: 'success', message: `Updated "${payload.title}" successfully.` });
        loadResources();
        loadStatsAndCategories();
      }
    } else {
      const res = await api.admin.createResource(payload);
      if (res.success) {
        setToast({ type: 'success', message: `Created "${payload.title}" in catalog.` });
        loadResources();
        loadStatsAndCategories();
      }
    }
  };

  // Handle Delete
  const handleConfirmDelete = async (id) => {
    const res = await api.admin.deleteResource(id);
    if (res.success) {
      setToast({ type: 'success', message: 'Resource permanently deleted.' });
      loadResources();
      loadStatsAndCategories();
    }
  };

  const totalPages = Math.ceil(totalResources / perPage) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold mb-1 border border-violet-500/20">
            <ShieldCheck size={13} />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curriculum Catalog & Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage course entities, review recommendation telemetry, and monitor learner rating distributions.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingResource(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          <span>Add New Course Resource</span>
        </button>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Learners</span>
            <Users size={14} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total_users ?? 0}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Catalog Courses</span>
            <BookOpen size={14} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total_resources ?? 0}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Recommendations</span>
            <Sparkles size={14} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total_recommendations ?? 0}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Ratings Submitted</span>
            <Star size={14} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total_ratings ?? 0}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>System Rating Avg</span>
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300">
            {stats?.average_rating ? Number(stats.average_rating).toFixed(2) : '0.00'} ★
          </p>
        </div>
      </div>

      {/* Popular Categories Banner if any */}
      {stats?.popular_categories && stats.popular_categories.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <BarChart size={14} className="text-violet-400" />
            <span>Highest Demand Categories (by user ratings)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.popular_categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs bg-zinc-900 border border-white/5 text-zinc-300 flex items-center gap-1.5"
              >
                <span className="font-semibold text-white">{cat.category}:</span>
                <span className="text-amber-400 font-mono text-[11px]">{cat.avg_rating}★</span>
                <span className="text-zinc-500 text-[10px]">({cat.rating_count} ratings)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= RESOURCE TABLE & CONTROLS ================= */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4 p-5">
        {/* Search & Filters Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, description or category..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-violet-500 text-xs"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-violet-500 text-xs"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-zinc-500">
                    Loading catalog resources...
                  </td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-zinc-500">
                    No resources found matching the criteria.
                  </td>
                </tr>
              ) : (
                resources.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white line-clamp-1">{res.title}</div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1">{res.description}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-400">
                      {res.category}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          res.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : res.difficulty === 'Intermediate'
                            ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}
                      >
                        {res.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(res.tags || []).slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400">
                            {t}
                          </span>
                        ))}
                        {(res.tags || []).length > 3 && (
                          <span className="text-[10px] text-zinc-500">+{res.tags.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-amber-300">
                        {Number(res.average_rating || 0).toFixed(1)} ★
                      </span>
                      <span className="text-[10px] text-zinc-500 ml-1">
                        ({res.rating_count || 0})
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                      {res.url && (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 inline-block"
                          title="Open URL"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingResource(res);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors inline-block"
                        title="Edit Resource"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModalState({
                            isOpen: true,
                            resource: res,
                          })
                        }
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-block"
                        title="Delete Resource"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
          <div>
            Showing Page <span className="font-semibold text-white">{page}</span> of{' '}
            <span className="font-semibold text-white">{totalPages}</span> ({totalResources} total resources)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-zinc-900 border border-white/5 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-zinc-900 border border-white/5 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Resource Create / Edit Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveResource}
        initialData={editingResource}
        isEditing={!!editingResource}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, resource: null })}
        onConfirm={handleConfirmDelete}
        resourceTitle={deleteModalState.resource?.title || ''}
        resourceId={deleteModalState.resource?.id}
      />
    </div>
  );
}
