import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Sun,
  Moon,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Activity,
  Bell,
  Sparkles,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, loginAsRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Translation Cookie Logic
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
      if (cookie) return cookie.split('=')[1].split('/')[2] || 'en';
    } catch (e) { }
    return 'en';
  });

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'mr', label: 'Marathi (मराठी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
    { code: 'bn', label: 'Bengali (বাংলা)' },
    { code: 'ml', label: 'Malayalam (മലയാളം)' },
    { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ur', label: 'Urdu (اردو)' },
    { code: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
    { code: 'as', label: 'Assamese (অসমীয়া)' }
  ];

  const handleLangChange = (code: string) => {
    setSelectedLang(code);
    document.cookie = `googtrans=/en/${code}; path=/;`;
    window.location.reload();
  };

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    farmer: { label: 'Farmer / Cultivator', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    officer: { label: 'Agriculture Officer', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    researcher: { label: 'Agri Researcher', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    admin: { label: 'System Admin', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
  };

  const currentRoleInfo = user ? roleLabels[user.role] : roleLabels.farmer;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700/60 dark:hover:bg-slate-800/50 transition-all"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
                  AgriSense
                </span>
                <span className="text-xs px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-emerald-100/50 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide font-medium hidden sm:block">
                Intelligent Agri Decision Support
              </p>
            </div>
          </Link>
        </div>

        {/* Center: System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-600 dark:text-slate-300">Local AI Engine:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Operational (0 Latency)</span>
        </div>

        {/* Right: Translate, Theme, Profile, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Language / Translation Native UI */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowRoleMenu(false); setShowUserMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900/60 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 transition-all text-slate-700 dark:text-slate-300"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline uppercase">{selectedLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 max-h-[300px] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 custom-scrollbar animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 mb-1">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors my-0.5 flex justify-between items-center ${selectedLang === lang.code ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                  >
                    <span>{lang.label}</span>
                    {selectedLang === lang.code && <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold">{lang.code}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div id="google_translate_element" className="hidden"></div>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => { setShowRoleMenu(!showRoleMenu); setShowUserMenu(false); }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${currentRoleInfo.color}`}
              title="Switch demo persona for evaluation"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Demo Persona
                </div>
                {(['farmer', 'officer', 'researcher', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={async () => {
                      await loginAsRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors my-0.5 ${user?.role === r
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                      }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    {user?.role === r && <span className="text-[10px] text-emerald-400">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:border-slate-700/60 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500 dark:text-blue-400" />}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowRoleMenu(false); setShowLangMenu(false); }}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {user.full_name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden md:block max-w-[100px] truncate">
                  {user.full_name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      {user.district}, {user.state} ({user.farm_size_acres} Acres)
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      Dashboard Overview
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};
