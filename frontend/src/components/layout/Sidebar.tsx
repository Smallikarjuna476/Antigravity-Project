import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanEye,
  Bot,
  CloudSun,
  TrendingUp,
  CalendarDays,
  FlaskConical,
  Landmark,
  History,
  BookOpen,
  BarChart3,
  AlertTriangle,
  FileText,
  Users,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Flame,
  Binary
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'Live' },
      ]
    },
    {
      title: 'Core AI Intelligence',
      items: [
        { name: 'Crop Disease AI', path: '/disease', icon: ScanEye, badge: 'Module 1', highlight: true },
        { name: 'Multilingual Assistant', path: '/assistant', icon: Bot, badge: 'Module 2' },
        { name: 'Weather Intelligence', path: '/weather', icon: CloudSun, badge: 'Module 3' },
        { name: 'Market Intelligence', path: '/market', icon: TrendingUp, badge: 'Module 4' },
      ]
    },
    {
      title: 'Agronomy & Planning',
      items: [
        { name: 'Smart Crop Planner', path: '/planner', icon: CalendarDays, badge: 'Module 5' },
        { name: 'Soil & NPK Intelligence', path: '/soil', icon: FlaskConical, badge: 'Module 6' },
        { name: 'Government Schemes', path: '/schemes', icon: Landmark, badge: 'Module 7' },
        { name: 'Crop Health Timeline', path: '/timeline', icon: Layers, badge: 'Module 8' },
        { name: 'Smart Farm Journal', path: '/journal', icon: BookOpen, badge: 'Module 9' },
      ]
    },
    {
      title: 'Next-Gen Unique Tech',
      items: [
        { name: 'AI Farm Digital Twin', path: '/digital-twin', icon: Sparkles, badge: 'Unique' },
        { name: 'AI Yield Simulator', path: '/yield-simulator', icon: SlidersHorizontal, badge: 'Unique' },
        { name: 'Explainable AI Grad-CAM', path: '/explainable-ai', icon: Binary, badge: 'Unique' },
      ]
    },
    {
      title: 'Analytics & Community',
      items: [
        { name: 'Analytics Dashboard', path: '/analytics', icon: BarChart3, badge: 'Module 10' },
        { name: 'Knowledge Center', path: '/knowledge', icon: FileText, badge: 'Module 11' },
        { name: 'Community Forum', path: '/forum', icon: Users, badge: 'Module 12' },
        { name: 'Smart Report Generator', path: '/reports', icon: FileText, badge: 'Module 13' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {section.title}
              </h3>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-600/30 dark:to-teal-600/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                        } ${item.highlight && !location.pathname.includes(item.path) ? 'text-emerald-600 dark:text-emerald-400/90' : ''}`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badge === 'Unique'
                          ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 border dark:border-amber-500/30'
                          : item.badge === 'Module 1'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 border dark:border-emerald-500/30 font-extrabold animate-pulse-slow'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hardware & Engine Status Widget */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3 shadow-sm dark:shadow-none">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 dark:text-slate-200 truncate">AgriSense Engine v2.0</p>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">EfficientNetB3 + Grad-CAM</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
