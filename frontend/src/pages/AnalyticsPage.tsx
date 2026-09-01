import React, { useState } from 'react';
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

export const AnalyticsPage: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'month' | 'season' | 'year'>('season');

    // Simulated Dynamic Data for Analytics
    const allYieldData = {
        month: [
            { name: 'Week 1', Expected: 120, Actual: 110 },
            { name: 'Week 2', Expected: 125, Actual: 115 },
            { name: 'Week 3', Expected: 130, Actual: 105 },
            { name: 'Week 4', Expected: 140, Actual: 135 },
        ],
        season: [
            { name: 'Kharif 21', Expected: 120, Actual: 110 },
            { name: 'Rabi 21-22', Expected: 140, Actual: 145 },
            { name: 'Kharif 22', Expected: 130, Actual: 105 },
            { name: 'Rabi 22-23', Expected: 150, Actual: 155 },
            { name: 'Kharif 23', Expected: 135, Actual: 140 },
            { name: 'Rabi 23-24', Expected: 160, Actual: 165 },
        ],
        year: [
            { name: '2019', Expected: 250, Actual: 240 },
            { name: '2020', Expected: 260, Actual: 255 },
            { name: '2021', Expected: 270, Actual: 245 },
            { name: '2022', Expected: 280, Actual: 290 },
            { name: '2023', Expected: 295, Actual: 285 },
        ]
    };

    const allDiseaseIncidence = {
        month: [
            { name: 'Early Blight', cases: 12, severity: 8 },
            { name: 'Leaf Curl', cases: 5, severity: 3 },
            { name: 'Rust', cases: 8, severity: 4 },
            { name: 'Aphids', cases: 20, severity: 5 },
        ],
        season: [
            { name: 'Early Blight', cases: 45, severity: 8 },
            { name: 'Leaf Curl', cases: 30, severity: 5 },
            { name: 'Rust', cases: 80, severity: 3 },
            { name: 'Powdery Mildew', cases: 55, severity: 6 },
            { name: 'Aphids', cases: 110, severity: 4 },
        ],
        year: [
            { name: 'Early Blight', cases: 145, severity: 9 },
            { name: 'Leaf Curl', cases: 90, severity: 5 },
            { name: 'Rust', cases: 280, severity: 4 },
            { name: 'Mildew', cases: 155, severity: 6 },
            { name: 'Aphids', cases: 410, severity: 7 },
        ]
    };

    const aiAccuracyData = [
        { name: 'T-4', Confidence: 88, Validated: 85 },
        { name: 'T-3', Confidence: 91, Validated: 89 },
        { name: 'T-2', Confidence: 94, Validated: 92 },
        { name: 'T-1', Confidence: 96, Validated: 95 },
        { name: 'Current', Confidence: 98, Validated: 97 },
    ];

    const handleExportPDF = () => {
        window.print(); // Triggers the browser's native PDF export dialog
    };

    const currentYieldData = allYieldData[timeframe];
    const currentDiseaseData = allDiseaseIncidence[timeframe];

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
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">₹3.4L</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
                        +14.2% <span className="text-slate-400 dark:text-slate-500 font-normal">vs last season</span>
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
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">97.4%</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 flex items-center gap-1">
                        +2.1% <span className="text-slate-400 dark:text-slate-500 font-normal">model confidence</span>
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
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-2 flex items-center gap-1">
                        -4 <span className="text-slate-400 dark:text-slate-500 font-normal">chemical sprays reduced</span>
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
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">A+</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center gap-1">
                        Optimal <span className="text-slate-400 dark:text-slate-500 font-normal">NPK utilization tier</span>
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

                {/* AI Model Validation Trajectory */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">AI Diagnostic Reliability Core</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">System confidence vs Expert validated diagnoses over recent weeks</p>
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={aiAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                                <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} stroke="#64748b" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={(value: any) => [`${value}%`, '']}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="Confidence" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="Validated" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};
