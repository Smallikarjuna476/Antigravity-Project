import React from 'react';
import { Sprout, ShieldCheck, Heart, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur text-slate-400 text-xs py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">AgriSense AI Platform</span>
          <span className="text-slate-600">|</span>
          <span>Next-Generation Intelligent Agriculture Decision Support</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            100% Localhost AI
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Zero External Paid API Dependency
          </span>
          <span className="flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            SIH & Major Project Edition
          </span>
        </div>

        <div className="text-slate-500 text-[11px]">
          © {new Date().getFullYear()} AgriSense AI. Enterprise Architecture.
        </div>

      </div>
    </footer>
  );
};
