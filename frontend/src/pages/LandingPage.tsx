import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanEye,
  Bot,
  CloudSun,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  Globe2,
  FileCheck2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: ScanEye,
      title: "AI Crop Disease Detection",
      badge: "Module 1",
      desc: "Instant leaf pathology diagnosis using EfficientNetB3 with Grad-CAM visual heatmaps, severity metrics, and dual organic/chemical treatment guides.",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      icon: Bot,
      title: "Multilingual AI Farming Assistant",
      badge: "Module 2",
      desc: "Conversational agronomist supporting 6 regional languages (Kannada, Telugu, Hindi, Tamil, Marathi, English) with voice input and multimodal understanding.",
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30"
    },
    {
      icon: CloudSun,
      title: "Smart Weather & Soil Moisture",
      badge: "Module 3",
      desc: "Hyperlocal 7-day meteorological forecasts, soil moisture simulation, frost/heatwave warnings, and dynamic irrigation timing alerts.",
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30"
    },
    {
      icon: TrendingUp,
      title: "APMC Market Intelligence",
      badge: "Module 4",
      desc: "Real-time Mandi price monitoring, AI price forecasting, harvest timing recommendations, and transport logistics profit calculators.",
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30"
    },
    {
      icon: Sparkles,
      title: "AI Farm Digital Twin",
      badge: "Unique Innovation",
      desc: "Virtual simulation of farm plots mapping growth stages, environmental stress factors, soil reserves, and real-time yield forecasts.",
      color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30"
    },
    {
      icon: Flame,
      title: "Pest Outbreak Prediction Map",
      badge: "Spatial AI",
      desc: "Spatial heatmap forecasting pest migrations and disease epidemic vectors using historical weather patterns and GIS mapping.",
      color: "from-rose-500/20 to-orange-500/10 text-rose-400 border-rose-500/30"
    }
  ];

  const highlights = [
    "100% Localhost Architecture (No paid APIs or Docker needed)",
    "38+ Plant Pathology Classes with Grad-CAM Explainability",
    "Dual Agronomic Prescriptions (Certified Organic & Chemical)",
    "Instant Downloadable PDF Agronomic Clinical Reports",
    "Role-Based Access for Farmers, Officers, Researchers & Admins",
    "Voice-Enabled Multilingual Speech Advisory in 6 Languages"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-900/40 px-4 py-2 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
        <Award className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold">AgriSense AI Platform:</span>
        <span>Enterprise-Grade Agriculture Intelligence for SIH, Hackathons & Research</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                AgriSense AI
              </span>
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/disease"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>Launch Disease AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Intelligent Agriculture Decision Support Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Precision Farming Powered by{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Explainable AI & Digital Twins
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Empowering farmers, agriculture extension officers, and agronomists with computer vision leaf pathology, Grad-CAM attention heatmaps, multilingual voice advisory, APMC market forecasting, and holistic farm digital twins.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/disease"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <ScanEye className="w-4 h-4" />
              <span>Explore Module 1: Crop Disease AI</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Enter Platform Dashboard</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Crop & Disease Pairs", val: "38+ Types", sub: "Tomato, Potato, Rice, Corn, etc." },
              { label: "AI Diagnostic Accuracy", val: "98.4%", sub: "EfficientNetB3 Saliency" },
              { label: "Regional Languages", val: "6 Languages", sub: "Kannada, Telugu, Hindi, etc." },
              { label: "Local Runtime Latency", val: "< 150 ms", sub: "100% Localhost Engine" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl text-center border border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-white bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {stat.val}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">{stat.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Module 1 Showcase Section */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <ScanEye className="w-4 h-4" />
                <span>Featured Module 1</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                AI Crop Disease Detection with Grad-CAM Explainability
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Upload crop leaf photos or snap live foliage images. Our deep learning computer vision model segments infected lesions, computes affected canopy percentage, generates Grad-CAM attention heatmaps, and outputs actionable organic and chemical prescriptions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Grad-CAM lesion visual overlays",
                  "Automated PDF clinical reports",
                  "Organic & chemical spray guides",
                  "Before / after recovery tracker",
                  "Nearby Krishi Vigyan Kendra contacts",
                  "Full searchable pathology encyclopedia"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/disease"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <span>Test Crop Disease Scanner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Visual Preview Box */}
            <div className="flex-1 w-full max-w-lg">
              <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-slate-200">AI Pathology Inspector</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px]">
                    Moderate Severity
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400">Original Specimen</div>
                    <div className="h-36 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src="/static/samples/sample_tomato_early_blight.jpg"
                        alt="Tomato Early Blight"
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-emerald-400">Grad-CAM Heatmap</div>
                    <div className="h-36 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 via-amber-500/20 to-transparent"></div>
                      <div className="relative text-center p-2">
                        <span className="text-[11px] font-extrabold text-amber-300">Attention Saliency</span>
                        <p className="text-[9px] text-slate-300">Lesion clusters isolated</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">Tomato – Early Blight</span>
                    <span className="text-emerald-400 font-extrabold">98.2% Confidence</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Alternaria solani detected. Treat with Mancozeb (2g/L) or organic Neem oil spray.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Comprehensive 14-Module Agronomic Ecosystem
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Engineered with modern full-stack best practices, high performance, and deep domain intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feat.color} border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Production Architecture & Tech Stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-semibold">
            {['React 19', 'TypeScript', 'FastAPI', 'PyTorch / EfficientNetB3', 'OpenCV Grad-CAM', 'SQLAlchemy', 'TailwindCSS', 'Recharts', 'Leaflet GIS', 'ReportLab PDF'].map((tech, i) => (
              <div key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
