import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  resourceTitle,
  resourceId
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm(resourceId);
      onClose();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-rose-500/30 p-6 shadow-2xl relative">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1">
              Delete Course Resource?
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mb-2">
              Are you sure you want to permanently delete:
            </p>
            <p className="text-xs font-semibold text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/20 mb-3">
              "{resourceTitle}"
            </p>
            <p className="text-[11px] text-zinc-400 leading-normal">
              <strong className="text-amber-300">Warning:</strong> If this course has existing recommendations or user ratings, cascading deletion constraints will safely remove linked records. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            <Trash2 size={13} />
            <span>{loading ? 'Deleting...' : 'Delete Resource'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
