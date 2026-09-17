import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Target,
    Activity,
    Zap,
    Download,
    AlertTriangle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, ComposedChart
} from 'recharts';
import { analyticsApi } from '../services/api';

export const AnalyticsPage: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'month' | 'season' | 'year'>('season');

    const [currentYieldData, setCurrentYieldData] = useState<any[]>([]);
    const [currentDiseaseData, setCurrentDiseaseData] = useState<any[]>([]);
    const [aiAccuracyData, setAiAccuracyData] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any>(null);

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                const data = await analyticsApi.getMetrics(timeframe);
                setCurrentYieldData(data.yield_data);
                setCurrentDiseaseData(data.disease_incidence);
                setAiAccuracyData(data.ai_accuracy);
                if (data.kpis) setKpis(data.kpis);
            } catch (err) {
                console.error("Failed to load analytics metrics", err);
            }
        };
        loadMetrics();
    }, [timeframe]);

    const handleExportPDF = () => {
        window.print(); // Triggers the browser's native PDF export dialog
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                        Enterprise Analytics
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        High-level agronomic telemetry, epidemiological tracking & yield performance.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex text-sm">
                        <button
                            onClick={() => setTimeframe('month')}
                            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${timeframe === 'month' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setTimeframe('season')}
                            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${timeframe === 'season' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            Season
                        </button>
                        <button
                            onClick={() => setTimeframe('year')}
                            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${timeframe === 'year' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            Year
                        </button>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Gross Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpis?.gross_revenue || '₹0'}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
                        {kpis?.revenue_growth || '+0%'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-16 h-16 text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Target className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Precision Index</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpis?.ai_precision || '0%'}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 flex items-center gap-1">
                        {kpis?.precision_growth || '+0% model confidence'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-rose-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <Activity className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pest Interventions</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpis?.pest_interventions || '0'}</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-2 flex items-center gap-1">
                        {kpis?.pest_reduction || '-0 chemical sprays reduced'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-16 h-16 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Zap className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Fertilizer Efficiency</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpis?.fertilizer_efficiency || '-'}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center gap-1">
                        {kpis?.fertilizer_tier || 'N/A'} <span className="text-slate-400 dark:text-slate-500 font-normal">NPK utilization tier</span>
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Multi-season Yield Comparison */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Historical Yield Trajectory</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Expected vs Actual Harvest (Quintals)</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="Expected" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorExpected)" />
                                <Area type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regional Disease Threat Monitor */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Regional Epidemic Threats</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total detected incidents vs severity</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart layout="vertical" data={currentDiseaseData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#64748b" />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} stroke="transparent" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Bar dataKey="cases" name="Incidents" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={12} />
                                <Line type="monotone" dataKey="severity" name="Severity Score" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4, fill: '#f43f5e' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
