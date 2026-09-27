import React from 'react';
import { GraduationCap, Sparkles, Database, Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0B0B0F] py-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">LEARNOVA</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Intelligent Course & Resource Recommendation System. Engineered with Strategy Pattern ranking algorithms, prerequisite-aware filtering, and continuous learner feedback loop.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1"><Cpu size={12} className="text-violet-400" /> Strategy Pattern</span>
              <span className="flex items-center gap-1"><Database size={12} className="text-emerald-400" /> MySQL 8+ Engine</span>
              <span className="flex items-center gap-1"><Shield size={12} className="text-indigo-400" /> JWT RBAC</span>
            </div>
          </div>

          {/* Architecture Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Architecture</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-zinc-200 transition-colors">Presentation Layer (React + Vite)</li>
              <li className="hover:text-zinc-200 transition-colors">Service & Application Layer</li>
              <li className="hover:text-zinc-200 transition-colors">Domain Layer (Recommendation Engine)</li>
              <li className="hover:text-zinc-200 transition-colors">Persistence (PyMySQL Repositories)</li>
            </ul>
          </div>

          {/* Quick Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">System Specs</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>Algorithm: <span className="text-violet-400 font-mono">TagOverlapStrategy-v1</span></li>
              <li>Cold-Start: <span className="text-emerald-400 font-mono">PopularityStrategy-v1</span></li>
              <li>Catalog: <span className="text-zinc-300">70+ Curated Resources</span></li>
              <li>Faculty Demo Ready: <span className="text-emerald-400">Verified</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 LEARNOVA Project. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>REST JSON API: Online (Port 5000)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
