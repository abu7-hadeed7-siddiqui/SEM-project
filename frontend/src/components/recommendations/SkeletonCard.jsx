import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4 animate-pulse relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-800" />
          <div className="w-20 h-5 rounded-md bg-zinc-800" />
        </div>
        <div className="w-16 h-6 rounded-full bg-zinc-800" />
      </div>

      <div className="space-y-2">
        <div className="w-3/4 h-6 rounded bg-zinc-800" />
        <div className="w-full h-4 rounded bg-zinc-800/60" />
        <div className="w-5/6 h-4 rounded bg-zinc-800/60" />
      </div>

      <div className="flex gap-2">
        <div className="w-14 h-5 rounded-md bg-zinc-800/80" />
        <div className="w-16 h-5 rounded-md bg-zinc-800/80" />
        <div className="w-12 h-5 rounded-md bg-zinc-800/80" />
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="w-28 h-6 rounded bg-zinc-800" />
        <div className="w-24 h-6 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
