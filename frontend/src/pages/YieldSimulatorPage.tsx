import React, { useState, useEffect } from 'react';
import {
    SlidersHorizontal,
    Sprout,
    Droplets,
    ThermometerSun,
    Bug,
    TrendingUp,
    RefreshCcw,
    Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { yieldSimApi } from '../services/api';

export const YieldSimulatorPage: React.FC = () => {
    // Sliders state
    const [nitrogen, setNitrogen] = useState(120); // kg/ha
    const [water, setWater] = useState(600); // mm
    const [temp, setTemp] = useState(25); // °C
    const [pestStress, setPestStress] = useState(15); // %

    // Output state
    const [projectedYield, setProjectedYield] = useState(5.2); // tonnes/acre
    const [yieldStatus, setYieldStatus] = useState<'Optimal' | 'Sub-optimal' | 'Critical'>('Optimal');
    const [history, setHistory] = useState([...Array(10)].map((_, i) => ({
        iteration: i,
        yield: 4.5 + Math.random() * 1.5
    })));

    // Simulation Engine Formula (API Integration)
    useEffect(() => {
        const fetchSimulation = async () => {
            try {
                const data = await yieldSimApi.getSimulation(nitrogen, water, temp, pestStress);

                const finalYield = data.projected_yield_tons_per_acre;
                setProjectedYield(finalYield);
                setYieldStatus(data.status);

                // Update history chart dynamically
                setHistory(prev => {
                    const newHist = [...prev.slice(1), { iteration: prev[prev.length - 1].iteration + 1, yield: finalYield }];
                    return newHist;
                });
            } catch (err) {
                console.error("Failed to fetch yield simulation:", err);
            }
        };
        fetchSimulation();
    }, [nitrogen, water, temp, pestStress]);

    const resetDefaults = () => {
        setNitrogen(120);
        setWater(600);
        setTemp(25);
        setPestStress(15);
    };

    // Component comparison data for Bar Chart
    const breakdownData = [
        { name: 'Nitrogen (N) Impact', score: 100 - Math.round(Math.abs(nitrogen - 150) / 150 * 100) },
        { name: 'Moisture Impact', score: 100 - Math.round(Math.abs(water - 750) / 750 * 100) },
        { name: 'Temp Index', score: 100 - Math.round(Math.abs(temp - 26) / 26 * 100) },
        { name: 'Biosecurity', score: 100 - pestStress }
    ].map(item => ({ ...item, score: Math.max(0, Number(item.score)) })); // Prevent negative scores

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                        AI Yield Simulator
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Dynamically tweak environmental and agronomic variables to project canopy yield.
                    </p>
                </div>
                <button
                    onClick={resetDefaults}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium border border-slate-200 dark:border-slate-700 text-sm w-fit"
                >
                    <RefreshCcw className="w-4 h-4" /> Reset Variables
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Control Panel (Sliders) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-emerald-500 text-slate-900 dark:text-white" />
                            Simulation Parameters
                        </h3>

                        {/* Slider 1: Nitrogen */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Sprout className="w-4 h-4 text-emerald-500" /> Nitrogen (NPK) Input
                                </label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{nitrogen} kg/ha</span>
                            </div>
                            <input
                                type="range" min="0" max="300"
                                value={nitrogen} onChange={(e) => setNitrogen(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:h-2.5"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Deficient</span> <span>Optimal: 150</span> <span>Toxic</span>
                            </div>
                        </div>

                        {/* Slider 2: Water */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-blue-500" /> Irrigation & Rainfall
                                </label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{water} mm</span>
                            </div>
                            <input
                                type="range" min="200" max="1500"
                                value={water} onChange={(e) => setWater(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all hover:h-2.5"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Drought</span><span>Optimal: 750</span><span>Waterlogged</span>
                            </div>
                        </div>

                        {/* Slider 3: Temp */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <ThermometerSun className="w-4 h-4 text-amber-500" /> Avg Temperature
                                </label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{temp}°C</span>
                            </div>
                            <input
                                type="range" min="10" max="45" step="0.5"
                                value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all hover:h-2.5"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Cold Stress</span><span>Optimal: 26°C</span><span>Heat Stress</span>
                            </div>
                        </div>

                        {/* Slider 4: Pest */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Bug className="w-4 h-4 text-rose-500" /> Pest & Disease Stress
                                </label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{pestStress}%</span>
                            </div>
                            <input
                                type="range" min="0" max="100"
                                value={pestStress} onChange={(e) => setPestStress(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all hover:h-2.5"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Zero</span><span>Severe Outbreak</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Live Output Analytics */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Hero Metric Output */}
                    <div className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden transition-colors duration-500 ${yieldStatus === 'Optimal' ? 'bg-gradient-to-br from-emerald-500 to-teal-700 border-emerald-400 text-white' :
                        yieldStatus === 'Sub-optimal' ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-amber-300 text-white' :
                            'bg-gradient-to-br from-rose-500 to-red-700 border-rose-400 text-white'
                        }`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-90 mb-1">AI Simulated Crop Yield</h3>
                        <p className="text-[10px] opacity-75 font-medium mb-4">Predicted via dynamic regression model based on current sliders</p>

                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black">{projectedYield.toFixed(2)}</span>
                            <span className="text-xl font-bold opacity-80">tonnes/acre</span>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-inner">
                                Status: {yieldStatus}
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Graphs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Area Chart: Live Sensitivity Analysis */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Real-time Sensitivity Output</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4">Yield fluctuations across past inputs</p>
                            <div className="h-[160px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorYieldHistory" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={yieldStatus === 'Optimal' ? '#10b981' : yieldStatus === 'Sub-optimal' ? '#f59e0b' : '#ef4444'} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={yieldStatus === 'Optimal' ? '#10b981' : yieldStatus === 'Sub-optimal' ? '#f59e0b' : '#ef4444'} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                        <XAxis dataKey="iteration" hide />
                                        <YAxis domain={[0, 7]} tick={{ fontSize: 10 }} stroke="#64748b" />
                                        <Area
                                            isAnimationActive={false}
                                            type="monotone"
                                            dataKey="yield"
                                            stroke={yieldStatus === 'Optimal' ? '#10b981' : yieldStatus === 'Sub-optimal' ? '#f59e0b' : '#ef4444'}
                                            fill="url(#colorYieldHistory)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart: Multi-factor Index */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Environmental Efficiency</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4">Impact score (100 is best)</p>
                            <div className="h-[160px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={breakdownData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }}
                                        />
                                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                                            {breakdownData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
