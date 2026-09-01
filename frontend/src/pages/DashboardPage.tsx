import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  Bot,
  CloudSun,
  TrendingUp,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Droplets,
  Layers,
  Thermometer,
  Wind
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { diseaseApi, getFullUrl } from '../services/api';
import { DiseaseHistoryItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState<DiseaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const logs = await diseaseApi.getHistory(4);
        setRecentLogs(logs);
      } catch (err) {
        console.error("Error loading dashboard history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                Active Farm Operations
              </span>
              <span className="text-xs text-slate-400">
                {user?.district || 'Mysuru'}, {user?.state || 'Karnataka'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name || 'Farmer'} 🌾
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              AgriSense AI Decision Engine has completed real-time canopy diagnostics and weather cross-referencing for your farm.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/disease"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <ScanEye className="w-4 h-4" />
              <span>Scan Crop Leaf</span>
            </Link>
            <Link
              to="/assistant"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Real-time Farm Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Farm Health Index</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">88 / 100</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span>Optimal Vitality</span>
            <span className="text-slate-500 font-normal">| Minimal stress</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Disease Outbreak Risk</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">Low to Moderate</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Early Blight alert in Solanaceae
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Weather Forecast</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">28°C / 64% RH</div>
          <div className="text-[11px] text-blue-400 mt-1">
            Partly Cloudy · 12 km/h Breeze
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Top Mandi Market Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">₹3,450 <span className="text-xs font-normal text-slate-400">/ Qtl</span></div>
          <div className="text-[11px] text-purple-400 mt-1">
            Tomato Hybrid · APMC Mysuru
          </div>
        </div>

      </div>

      {/* Main Grid: Module 1 Live Actions & Recent Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Module 1 Disease Scanner Banner & Recent Scans */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ScanEye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Module 1: AI Crop Disease Detection</h3>
                  <p className="text-xs text-slate-400">Deep Learning pathology classifier with Grad-CAM heatmaps</p>
                </div>
              </div>
              <Link
                to="/disease"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Open Scanner</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Identify fungal, bacterial, and viral infections in seconds. Get dual organic & chemical spray schedules, affected canopy percentage, and download certified agronomic clinical reports.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/disease"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Upload Leaf Image</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/disease?tab=encyclopedia"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
              >
                Pathology Encyclopedia (38+ Crops)
              </Link>
            </div>
          </div>

          {/* Recent Diagnosis History List */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Recent Diagnosis Records</span>
              </h3>
              <Link to="/disease?tab=history" className="text-xs text-emerald-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading recent diagnostic logs...</div>
            ) : recentLogs.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400">No disease logs recorded yet.</p>
                <Link
                  to="/disease"
                  className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30"
                >
                  Run your first diagnosis now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                        <img
                          src={getFullUrl(log.original_image_url)}
                          alt={log.disease_name}
                          className="w-full h-full object-cover"
                          onError={(e: any) => { e.target.src = '/static/samples/sample_tomato_early_blight.jpg'; }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{log.crop_name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            log.severity_level === 'Severe' ? 'bg-rose-500/20 text-rose-300' :
                            log.severity_level === 'Moderate' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {log.severity_level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{log.disease_name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">
                        {(log.confidence * 100).toFixed(1)}% Match
                      </div>
                      <a
                        href={getFullUrl(log.report_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-slate-400 hover:text-white underline mt-0.5 inline-block"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Quick Modules Navigator & Agronomic Tips */}
        <div className="space-y-6">
          
          <div className="glass-card p-5 rounded-3xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Intelligence Modules
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Crop Disease AI', path: '/disease', icon: ScanEye, desc: 'Grad-CAM lesion scan' },
                { name: 'AI Voice Assistant', path: '/assistant', icon: Bot, desc: '6 Regional languages' },
                { name: 'Weather Intelligence', path: '/weather', icon: CloudSun, desc: '7-Day hyperlocal forecast' },
                { name: 'Mandi Market Trends', path: '/market', icon: TrendingUp, desc: 'Live APMC rates' },
                { name: 'Farm Digital Twin', path: '/digital-twin', icon: Sparkles, desc: 'Plot simulation' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={idx}
                    to={m.path}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                          {m.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{m.desc}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Today's Agronomic Advisory */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-950/20 to-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Today's Agronomic Advice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Relative humidity is elevated at 64%. Spray preventive biological Trichoderma viride on tomato rows to guard against early blight sporulation. Avoid overhead sprinkler irrigation past 4 PM.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
