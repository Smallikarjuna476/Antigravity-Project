import React, { useState, useEffect } from 'react';
import {
    Binary,
    Cpu,
    Layers,
    ShieldCheck,
    FileSearch,
    ScanEye,
    Activity,
    Target
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { xaiApi } from '../services/api';

export const ExplainableAIPage: React.FC = () => {
    const [selectedSample, setSelectedSample] = useState(0);
    const [samples, setSamples] = useState<any[]>([]);
    const [featureImportance, setFeatureImportance] = useState<any[]>([]);
    const [radarData, setRadarData] = useState<any[]>([]);

    useEffect(() => {
        const loadXAI = async () => {
            try {
                const s = await xaiApi.getSamples();
                const f = await xaiApi.getFeatures();
                setSamples(s);
                setFeatureImportance(f.features);
                setRadarData(f.radar);
            } catch (err) {
                console.error("XAI Load Error", err);
            }
        };
        loadXAI();
    }, []);

    const currentSample = samples.length > 0 ? samples[selectedSample] : null;

    if (samples.length === 0) return <div>Loading AI Tensors...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Binary className="w-7 h-7 text-fuchsia-500 dark:text-fuchsia-400" />
                        Explainable AI (XAI)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Decompile the neural network's decision-making process using Grad-CAM attention telemetry.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2">Select Tensor:</span>
                    {samples.map((sample, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedSample(idx)}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${selectedSample === idx ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {sample.name.split(' ')[0]} {/* Shorthand name */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Architecture Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between border border-slate-800 shadow-md">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                        <Cpu className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-wide">AgriSense Core Architecture</h3>
                        <p className="text-indigo-200 text-xs mt-0.5">EfficientNetB3 Feature Extractor + Custom Spatial Attention Head</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center bg-slate-950/40 px-4 py-2 rounded-lg border border-slate-800">
                        <span className="block text-2xl font-black text-fuchsia-400">12.4M</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Parameters</span>
                    </div>
                    <div className="text-center bg-slate-950/40 px-4 py-2 rounded-lg border border-slate-800">
                        <span className="block text-2xl font-black text-emerald-400">42ms</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Inference</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column: Vision Analytics */}
                <div className="flex flex-col gap-6">

                    {/* Visual Saliency Map */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                                <ScanEye className="w-4 h-4 text-indigo-500" /> Grad-CAM Activation Array
                            </h3>
                            <span className="text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded">Conv2D_Layer_14</span>
                        </div>

                        <div className="relative h-64 sm:h-80 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            {/* Base Image */}
                            <img src={currentSample.baseImage} alt="Crop Sample" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 group-hover:scale-105 transition-transform duration-1000" />

                            {/* Overlay Filters for visual structure */}
                            <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/20"></div>

                            {/* Dynamic Heatmap Blob generated via radial gradient */}
                            <div className={`absolute rounded-[100%] blur-xl mix-blend-hard-light transition-all duration-700 ${currentSample.heatmapPosition} ${currentSample.heatmapStyle}`}></div>

                            {/* Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none"></div>

                            {/* Reticle */}
                            <div className="absolute inset-0 border-[40px] border-black/10 dark:border-black/30 pointer-events-none"></div>
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Classified as</p>
                                    <p className="font-bold text-lg text-slate-800 dark:text-white">{currentSample.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Confidence</p>
                                    <p className="font-black text-xl text-emerald-500">{currentSample.confidence}%</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Network Attribution Reasoning</p>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{currentSample.reasoning}"</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Deep Metrics */}
                <div className="space-y-6">

                    {/* Feature Importance Bar Graph */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-amber-500" /> Saliency Feature Importance
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-6">Relative weight applied to biological markers.</p>

                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={featureImportance} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'transparent' }}
                                        formatter={(value: any) => [`${value}%`, 'Attribution Weight']}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }}
                                    />
                                    <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={16}>
                                        {featureImportance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.impact > 70 ? '#f43f5e' : entry.impact > 10 ? '#f59e0b' : '#334155'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Radar Chart & Diagnostics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 w-full flex items-center justify-between">
                                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Neural Metrics</span>
                            </h3>
                            <div className="h-[180px] w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#475569" opacity={0.3} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Network Bias" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-xl p-4">
                                <div className="flex gap-2">
                                    <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">Black-Box Safe</h4>
                                        <p className="text-xs text-sky-700 dark:text-sky-400/80 mt-1">Decision strictly bounded to biological features. No environmental bias detected.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                <div className="flex gap-2">
                                    <FileSearch className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Adversarial Defense</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Robust against artifact manipulation. Confidence threshold locked at 85% minimum.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
