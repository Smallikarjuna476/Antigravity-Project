import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ScanEye,
  UploadCloud,
  Camera,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Download,
  Phone,
  Mail,
  BookOpen,
  History,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Sliders,
  HelpCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Scale
} from 'lucide-react';
import {
  diseaseApi,
  getFullUrl
} from '../services/api';
import {
  DiseaseDiagnosisResult,
  DiseaseHistoryItem,
  DiseaseEncyclopediaRecord,
  ExpertContact,
  SampleTestImage,
  DiseaseCompareResult
} from '../types';
import { useAuth } from '../context/AuthContext';

export const DiseaseDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'diagnose';
  const [activeTab, setActiveTab] = useState<'diagnose' | 'history' | 'compare' | 'encyclopedia' | 'experts'>(
    initialTab as any
  );

  // Diagnosis State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseaseDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Treatment view toggle
  const [treatmentTab, setTreatmentTab] = useState<'organic' | 'chemical' | 'preventive'>('organic');

  // Heatmap View Mode
  const [heatmapViewMode, setHeatmapViewMode] = useState<'side-by-side' | 'heatmap-only' | 'original-only'>('side-by-side');

  // Sample Presets
  const [sampleImages, setSampleImages] = useState<SampleTestImage[]>([]);
  const [loadingSamples, setLoadingSamples] = useState<boolean>(false);

  // History State
  const [historyLogs, setHistoryLogs] = useState<DiseaseHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Compare State
  const [compareBeforeId, setCompareBeforeId] = useState<string>('');
  const [compareAfterId, setCompareAfterId] = useState<string>('');
  const [compareResult, setCompareResult] = useState<DiseaseCompareResult | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Encyclopedia State
  const [encyclopedia, setEncyclopedia] = useState<DiseaseEncyclopediaRecord[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingEncyclopedia, setLoadingEncyclopedia] = useState<boolean>(false);

  // Experts State
  const [experts, setExperts] = useState<ExpertContact[]>([]);
  const [loadingExperts, setLoadingExperts] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync tab with URL search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['diagnose', 'history', 'compare', 'encyclopedia', 'experts'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'diagnose' | 'history' | 'compare' | 'encyclopedia' | 'experts') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Load sample test images on mount
  useEffect(() => {
    const fetchSamples = async () => {
      setLoadingSamples(true);
      try {
        const samples = await diseaseApi.getSampleImages();
        setSampleImages(samples);
      } catch (err) {
        console.error("Error fetching sample presets:", err);
      } finally {
        setLoadingSamples(false);
      }
    };
    fetchSamples();
  }, []);

  // Load History
  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const logs = await diseaseApi.getHistory(30);
      setHistoryLogs(logs);
      if (logs.length >= 2) {
        setCompareBeforeId(logs[logs.length - 1].id);
        setCompareAfterId(logs[0].id);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load Encyclopedia
  const loadEncyclopedia = async () => {
    setLoadingEncyclopedia(true);
    try {
      const crop = selectedCropFilter === 'All' ? undefined : selectedCropFilter;
      const records = await diseaseApi.getEncyclopedia(crop, searchQuery || undefined);
      setEncyclopedia(records);
    } catch (err) {
      console.error("Error loading encyclopedia:", err);
    } finally {
      setLoadingEncyclopedia(false);
    }
  };

  // Load Experts
  const loadExperts = async () => {
    setLoadingExperts(true);
    try {
      const expertList = await diseaseApi.getExperts();
      setExperts(expertList);
    } catch (err) {
      console.error("Error loading experts:", err);
    } finally {
      setLoadingExperts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'encyclopedia') loadEncyclopedia();
    if (activeTab === 'experts') loadExperts();
    if (activeTab === 'compare' && historyLogs.length === 0) loadHistory();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'encyclopedia') {
      loadEncyclopedia();
    }
  }, [selectedCropFilter, searchQuery]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle Diagnosis Submit
  const handleDiagnose = async () => {
    if (!selectedFile) {
      setError('Please select or upload a crop leaf image first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await diseaseApi.diagnoseImage(selectedFile, cropHint, notes);
      setDiagnosisResult(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to complete AI disease diagnosis. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle 1-Click Sample Preset Test
  const handleSelectSample = async (sample: SampleTestImage) => {
    setIsAnalyzing(true);
    setError(null);
    setPreviewUrl(getFullUrl(sample.url));
    setCropHint(sample.crop);
    setNotes(`Tested using preset sample: ${sample.name}`);
    try {
      const result = await diseaseApi.diagnoseFromSampleUrl(sample.filename);
      setDiagnosisResult(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to analyze sample image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Scan Comparison
  const handleCompare = async () => {
    if (!compareBeforeId || !compareAfterId) {
      setError('Please select both a Baseline Scan and a Follow-up Scan to compare.');
      return;
    }
    setIsComparing(true);
    try {
      const result = await diseaseApi.compareScans(compareBeforeId, compareAfterId);
      setCompareResult(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Comparison analysis failed.');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module 1 Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
              <ScanEye className="w-4 h-4" />
              <span>Module 1 · Core Deep Learning Diagnostic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Crop Disease Detection & Visual Saliency
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              High-accuracy foliar pathology classifier powered by deep custom-trained MobileNetV2 CNN and Grad-CAM attention heatmaps. Detects 38+ plant-disease pairs with instant clinical PDF reports.
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
            {[
              { id: 'diagnose', label: 'AI Scanner', icon: ScanEye },
              { id: 'history', label: 'Diagnosis Logs', icon: History },
              { id: 'compare', label: 'Recovery Compare', icon: Scale },
              { id: 'encyclopedia', label: 'Encyclopedia', icon: BookOpen },
              { id: 'experts', label: 'KVK Experts', icon: Phone }
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AI SCANNER & DIAGNOSIS WORKSPACE */}
      {/* ========================================================================= */}
      {activeTab === 'diagnose' && (
        <div className="space-y-6">
          
          {/* Quick 1-Click Sample Dataset Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Instant 1-Click Evaluation Samples</span>
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Click any sample to evaluate without uploading)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Ready to Test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleImages.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  disabled={isAnalyzing}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex items-center gap-2.5 disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                    <img
                      src={getFullUrl(sample.url)}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                      {sample.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{sample.severity} Severity</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Upload & Results Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Upload Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>Upload Leaf Specimen</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WEBP</span>
                </div>

                {/* Dropzone / Preview Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    previewUrl
                      ? 'border-emerald-500/50 bg-slate-900/60'
                      : 'border-slate-700 hover:border-emerald-500/40 bg-slate-900/40 hover:bg-slate-900/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="space-y-3 w-full">
                      <div className="max-h-48 max-w-[240px] mx-auto rounded-xl overflow-hidden border border-slate-700 shadow-md">
                        <img
                          src={previewUrl}
                          alt="Leaf Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold">
                        Specimen ready for diagnosis (Click to change)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">
                        Click or Drag & Drop Crop Leaf Photo
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        Ensure clear focus on affected leaf spots with adequate daylight
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Crop Variety (Optional)
                    </label>
                    <select
                      value={cropHint}
                      onChange={(e) => setCropHint(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Auto-Detect via AI</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Rice">Rice / Paddy</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Corn">Corn / Maize</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Apple">Apple</option>
                      <option value="Grape">Grape</option>
                      <option value="Pepper">Bell Pepper / Chilli</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Field Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Lower leaf yellowing"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Primary Analyze Action Button */}
                <button
                  onClick={handleDiagnose}
                  disabled={isAnalyzing || !selectedFile}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Neural Pathology Diagnostic...</span>
                    </>
                  ) : (
                    <>
                      <ScanEye className="w-4 h-4" />
                      <span>Run AI Pathology Diagnosis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Right 7 Cols: Diagnosis Results, Grad-CAM & Prescriptions */}
            <div className="lg:col-span-7">
              {!diagnosisResult ? (
                <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[440px] space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center">
                    <ScanEye className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-slate-300">
                      Awaiting Leaf Specimen Analysis
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Upload a plant leaf photo on the left or select one of the instant sample presets above to generate full Grad-CAM visual heatmaps, severity ratings, and treatment regimens.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  
                  {/* Top Diagnosis Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 shadow-2xl relative">
                    
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                            {diagnosisResult.crop}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            diagnosisResult.severity === 'Severe'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : diagnosisResult.severity === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {diagnosisResult.severity} Severity
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Pathogen: {diagnosisResult.category}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl font-extrabold text-white">
                          {diagnosisResult.disease}
                        </h2>
                        {diagnosisResult.scientific_name && (
                          <p className="text-xs text-slate-400 italic">
                            Etiology: {diagnosisResult.scientific_name}
                          </p>
                        )}
                      </div>

                      {/* PDF Report Download Button */}
                      {diagnosisResult.report_download_url && (
                        <a
                          href={getFullUrl(diagnosisResult.report_download_url)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Download Clinical PDF</span>
                        </a>
                      )}
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 my-4">
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                        <div className="text-lg font-extrabold text-emerald-400">
                          {diagnosisResult.confidence_percentage}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">AI Confidence</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                        <div className="text-lg font-extrabold text-amber-400">
                          {diagnosisResult.affected_area_pct}%
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">Canopy Lesion Area</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                        <div className="text-lg font-extrabold text-blue-400">
                          {diagnosisResult.nearby_experts_count}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">KVK Officers Nearby</div>
                      </div>
                    </div>

                    {/* Side-by-Side Grad-CAM Inspection Viewer */}
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-slate-200">
                            Explainable Grad-CAM Visual Attention
                          </span>
                        </div>

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px]">
                          <button
                            onClick={() => setHeatmapViewMode('side-by-side')}
                            className={`px-2 py-0.5 rounded-lg font-semibold ${
                              heatmapViewMode === 'side-by-side' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            Side-by-Side
                          </button>
                          <button
                            onClick={() => setHeatmapViewMode('heatmap-only')}
                            className={`px-2 py-0.5 rounded-lg font-semibold ${
                              heatmapViewMode === 'heatmap-only' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            Heatmap Only
                          </button>
                          <button
                            onClick={() => setHeatmapViewMode('original-only')}
                            className={`px-2 py-0.5 rounded-lg font-semibold ${
                              heatmapViewMode === 'original-only' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            Original Only
                          </button>
                        </div>
                      </div>

                      {/* Image Panels */}
                      {heatmapViewMode === 'side-by-side' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-slate-400">Raw Leaf Specimen</span>
                            <div className="h-44 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800">
                              <img
                                src={getFullUrl(diagnosisResult.original_image_url)}
                                alt="Raw Specimen"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-emerald-400">Grad-CAM Thermal Lesion Overlay</span>
                            <div className="h-44 rounded-2xl bg-slate-950 overflow-hidden border border-emerald-500/40 relative shadow-inner">
                              <img
                                src={getFullUrl(diagnosisResult.heatmap_image_url)}
                                alt="Grad-CAM Heatmap"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {heatmapViewMode === 'heatmap-only' && (
                        <div className="h-64 rounded-2xl bg-slate-950 overflow-hidden border border-emerald-500/40">
                          <img
                            src={getFullUrl(diagnosisResult.heatmap_image_url)}
                            alt="Grad-CAM Heatmap"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {heatmapViewMode === 'original-only' && (
                        <div className="h-64 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800">
                          <img
                            src={getFullUrl(diagnosisResult.original_image_url)}
                            alt="Original"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* Heatmap Legend */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <span>Thermal Saliency:</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Active Lesion Hotspot
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Chlorotic Halo
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy Foliage
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Dual Treatment Prescription Panel */}
                  <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-400" />
                        <span>Agronomic Prescription & Remediation</span>
                      </h3>

                      {/* Prescription Mode Tabs */}
                      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => setTreatmentTab('organic')}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            treatmentTab === 'organic'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🌿 Organic / Bio-Control
                        </button>
                        <button
                          onClick={() => setTreatmentTab('chemical')}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            treatmentTab === 'chemical'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🧪 Chemical / Fungicide
                        </button>
                        <button
                          onClick={() => setTreatmentTab('preventive')}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            treatmentTab === 'preventive'
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🛡️ Prevention
                        </button>
                      </div>
                    </div>

                    {/* Prescription Content */}
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 text-xs space-y-2.5">
                      {treatmentTab === 'organic' && (
                        <div className="space-y-2">
                          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Recommended Biological & Organic Measures</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {diagnosisResult.treatments.organic}
                          </p>
                        </div>
                      )}

                      {treatmentTab === 'chemical' && (
                        <div className="space-y-2">
                          <div className="font-bold text-blue-400 flex items-center gap-1.5">
                            <Zap className="w-4 h-4" />
                            <span>Recommended Fungicide Spray Protocol</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {diagnosisResult.treatments.chemical}
                          </p>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                            <div>
                              <span className="text-slate-500 font-bold">Standard Dosage: </span>
                              <span className="text-slate-200 font-medium">
                                {diagnosisResult.treatments.dosage_guide || '2g per liter water'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-bold">Spray Interval: </span>
                              <span className="text-slate-200 font-medium">
                                {diagnosisResult.treatments.application_interval || 'Every 7-10 days'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {treatmentTab === 'preventive' && (
                        <div className="space-y-2">
                          <div className="font-bold text-purple-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Long-Term Agronomic Prevention Tips</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {diagnosisResult.prevention_tips}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIAGNOSIS HISTORY LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <span>Diagnostic Scan History</span>
              </h3>
              <p className="text-xs text-slate-400">
                Track chronological foliar pathology scans and download past agronomic reports
              </p>
            </div>
            <button
              onClick={loadHistory}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading diagnostic history...</div>
          ) : historyLogs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-xs text-slate-400">No diagnosis records found in your farm log.</p>
              <button
                onClick={() => handleTabChange('diagnose')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Scan a leaf now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {log.crop_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.severity_level === 'Severe'
                          ? 'bg-rose-500/20 text-rose-300'
                          : log.severity_level === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {log.severity_level}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="h-28 rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
                        <img
                          src={getFullUrl(log.original_image_url)}
                          alt="Original"
                          className="w-full h-full object-cover"
                          onError={(e: any) => { e.target.src = '/static/samples/sample_tomato_early_blight.jpg'; }}
                        />
                      </div>
                      <div className="h-28 rounded-xl bg-slate-950 overflow-hidden border border-emerald-500/30">
                        <img
                          src={getFullUrl(log.heatmap_image_url)}
                          alt="Heatmap"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white">{log.disease_name}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Match: {(log.confidence * 100).toFixed(1)}%</span>
                      <span>Lesions: {log.affected_area_pct}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={getFullUrl(log.report_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF Report</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECOVERY PROGRESSION COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === 'compare' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Foliar Disease Progression & Treatment Recovery Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select two temporal diagnostic scans (e.g. Day 0 Baseline vs Day 14 Post-Fungicide) to compute lesion reduction and recovery index.
            </p>
          </div>

          {/* Selector Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Scan 1 (Baseline / Day 0)
              </label>
              <select
                value={compareBeforeId}
                onChange={(e) => setCompareBeforeId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="">Select baseline scan...</option>
                {historyLogs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.crop_name} - {l.disease_name} ({l.affected_area_pct}% Lesion) - {new Date(l.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Scan 2 (Follow-up / Post-Treatment)
              </label>
              <select
                value={compareAfterId}
                onChange={(e) => setCompareAfterId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="">Select follow-up scan...</option>
                {historyLogs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.crop_name} - {l.disease_name} ({l.affected_area_pct}% Lesion) - {new Date(l.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={isComparing || !compareBeforeId || !compareAfterId}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {isComparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>Calculate Healing & Lesion Reduction</span>
          </button>

          {/* Comparison Result Display */}
          {compareResult && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-5 animate-in fade-in">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/30">
                    Clinical Evaluation
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-1">
                    {compareResult.recovery_status}
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-emerald-400">
                      {compareResult.lesion_reduction_pct > 0 ? `+${compareResult.lesion_reduction_pct}%` : `${compareResult.lesion_reduction_pct}%`}
                    </div>
                    <div className="text-[10px] text-slate-400">Lesion Reduction Rate</div>
                  </div>

                  <div className="text-right pl-4 border-l border-slate-800">
                    <div className="text-xl font-extrabold text-amber-400">
                      {compareResult.healing_progress_score} / 100
                    </div>
                    <div className="text-[10px] text-slate-400">Healing Score</div>
                  </div>
                </div>
              </div>

              {/* Side-by-side Visual Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Baseline (Day 0)</span>
                    <span className="text-rose-400">{compareResult.before_log.affected_area_pct}% Lesion Area</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={getFullUrl(compareResult.before_log.heatmap_image_url)}
                      alt="Baseline Heatmap"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Follow-up (Day {compareResult.days_between})</span>
                    <span className="text-emerald-400">{compareResult.after_log.affected_area_pct}% Lesion Area</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-emerald-500/30">
                    <img
                      src={getFullUrl(compareResult.after_log.heatmap_image_url)}
                      alt="Follow-up Heatmap"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Agronomist Notes */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-emerald-400 block mb-1">Agronomic Clinical Observation:</span>
                {compareResult.clinical_notes}
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PATHOLOGY ENCYCLOPEDIA (38+ CROPS) */}
      {/* ========================================================================= */}
      {activeTab === 'encyclopedia' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Crop Pathology Encyclopedia</span>
              </h3>
              <p className="text-xs text-slate-400">
                Scientific library of 38+ plant diseases, biological symptoms, and treatment protocols
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              >
                {['All', 'Tomato', 'Potato', 'Rice', 'Wheat', 'Corn', 'Grape', 'Apple', 'Cotton', 'Bell Pepper'].map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Crops' : c}</option>
                ))}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disease, symptoms..."
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500 w-full sm:w-48"
              />
            </div>
          </div>

          {loadingEncyclopedia ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading pathology records...</div>
          ) : encyclopedia.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No matching diseases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {encyclopedia.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {rec.crop_name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {rec.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{rec.disease_name}</h4>
                      {rec.scientific_name && (
                        <p className="text-xs text-slate-400 italic">Etiology: {rec.scientific_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-300">Symptoms: </span>
                      <span className="text-slate-400">{rec.symptoms}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-bold text-emerald-400">Organic Remedy: </span>
                      <span className="text-slate-300">{rec.organic_treatment}</span>
                    </div>
                    <div>
                      <span className="font-bold text-blue-400">Chemical Fungicide: </span>
                      <span className="text-slate-300">{rec.chemical_treatment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KRISHI VIGYAN KENDRA (KVK) EXPERTS */}
      {/* ========================================================================= */}
      {activeTab === 'experts' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Regional Krishi Vigyan Kendras (KVK) & Extension Specialists</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified agricultural scientists and state extension officers available for field consultation
            </p>
          </div>

          {loadingExperts ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading KVK specialists...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experts.map((exp) => (
                <div
                  key={exp.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{exp.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{exp.designation}</p>
                      <p className="text-[11px] text-slate-400">{exp.organization}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {exp.district}, {exp.state}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div>
                      <span className="text-slate-500 font-bold">Specialization: </span>
                      <span className="text-slate-300">{exp.specialization}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold">Available: </span>
                      <span className="text-slate-300">{exp.availability}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`tel:${exp.phone}`}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{exp.phone}</span>
                    </a>
                    <a
                      href={`mailto:${exp.email}`}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
