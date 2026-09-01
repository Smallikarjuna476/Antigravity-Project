import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { plannerApi } from '../services/api';
import { CropPlannerResponse, CropRecommendation, BenchmarkResponse } from '../types';
import {
    Calendar, MapPin, Search, ChevronRight, Droplets, Banknote, ShieldAlert,
    CheckCircle, Sprout, TrendingUp, FlaskConical, Target
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

export const CropPlannerPage: React.FC = () => {
    const [plannerData, setPlannerData] = useState<CropPlannerResponse | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);
    const [benchmarkData, setBenchmarkData] = useState<BenchmarkResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [stateName, setStateName] = useState("Karnataka");
    const [season, setSeason] = useState("Kharif (Monsoon)");
    const seasonsList = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal"
    ];

    useEffect(() => {
        // Attempt auto location detect for better UX (similar to Module 3/4)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await res.json();
                        if (data && data.address && data.address.state) {
                            setStateName(data.address.state);
                        }
                    } catch (e) {
                        console.log("Could not reverse geocode state.");
                    }
                },
                () => console.log("Geolocation blocked.")
            );
        }
    }, []);

    const fetchPlanner = async () => {
        try {
            setIsLoading(true);
            const data = await plannerApi.getRecommendations(stateName, season);
            setPlannerData(data);
            if (data.recommendations && data.recommendations.length > 0) {
                setSelectedCrop(data.recommendations[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanner();
    }, [stateName, season]);

    useEffect(() => {
        if (selectedCrop) {
            const fetchBenchmarks = async () => {
                try {
                    const res = await plannerApi.getBenchmarks(selectedCrop.name);
                    setBenchmarkData(res);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchBenchmarks();
        }
    }, [selectedCrop]);

    if (isLoading && !plannerData) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Top Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Smart Crop Planner
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        AI-driven seed recommendations, agronomy timelines, and yield benchmarking.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg">
                        <MapPin size={16} className="text-emerald-500" />
                        <select
                            className="bg-transparent border-none outline-none text-sm font-medium text-white cursor-pointer w-32"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                        >
                            {indianStates.map(state => (
                                <option key={state} value={state} className="bg-black text-white">{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg">
                        <Calendar size={16} className="text-amber-500" />
                        <select
                            className="bg-transparent border-none outline-none text-sm font-medium text-white cursor-pointer"
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                        >
                            {seasonsList.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {plannerData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Recommendations List */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Top Recommendations
                        </h2>
                        <div className="space-y-4">
                            {plannerData.recommendations.map((crop, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={crop.id}
                                    onClick={() => setSelectedCrop(crop)}
                                    className={`p-5 rounded-2xl cursor-pointer border transition-all ${selectedCrop?.id === crop.id
                                        ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20'
                                        : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{crop.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${crop.suitability_score > 85 ? 'bg-green-100 text-green-700 dark:bg-green-900/40' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40'
                                            }`}>
                                            {crop.suitability_score}% Match
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <ShieldAlert size={14} className={crop.risk_level === 'Low' ? 'text-green-500' : crop.risk_level === 'Medium' ? 'text-amber-500' : 'text-red-500'} />
                                            Risk: {crop.risk_level}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Droplets size={14} className="text-blue-500" />
                                            Water: {crop.water_requirement}
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            <Banknote size={14} className="text-emerald-500" />
                                            Est. Profit: ₹{crop.estimated_profit_per_acre.toLocaleString()}/acre
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Deep Dive per Crop */}
                    {selectedCrop && (
                        <div className="lg:col-span-8 space-y-6">

                            {/* Seed Varieties */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Sprout className="text-emerald-500" />
                                    Recommended Hybrid/Local Varieties for {stateName}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCrop.seed_varieties.map((v, i) => (
                                        <span key={i} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium rounded-full text-sm border border-emerald-100 dark:border-emerald-800">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Agronomy Timeline */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Calendar className="text-indigo-500" />
                                    Agronomic Care Timeline
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                                    {selectedCrop.timeline.map((phase, i) => (
                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 bg-emerald-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                                                {phase.month}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shadow-sm transition-all hover:shadow-md">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-gray-900 dark:text-white">{phase.phase}</div>
                                                    <time className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Month {phase.month}</time>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{phase.activity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Yield Benchmark & Fertilizer Demand */}
                            {benchmarkData && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Benchmark Chart */}
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                            <TrendingUp className="text-blue-500" />
                                            Yield Benchmarking (Tons/Acre)
                                        </h3>
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={benchmarkData.benchmarks} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                                    <Bar dataKey="regional_avg_tons" name="Regional Avg" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={20} />
                                                    <Bar dataKey="top_performer_tons" name="Top Performer" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Fertilizer Estimator */}
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-sm text-white">
                                        <h3 className="text-base font-bold flex items-center gap-2 mb-6 text-indigo-50">
                                            <FlaskConical />
                                            Estimated Baseline NPK
                                        </h3>
                                        <div className="space-y-4">
                                            {Object.entries(benchmarkData.fertilizer_demand_kg_per_acre).map(([nutrient, amount]) => (
                                                <div key={nutrient} className="bg-white/10 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
                                                            {nutrient.match(/\((.*?)\)/)?.[1] || nutrient[0]}
                                                        </div>
                                                        <span className="font-medium text-sm">{nutrient}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-bold">{amount as number}</span>
                                                        <span className="text-xs opacity-70 ml-1">kg/acre</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-indigo-200 mt-4 text-center">
                                            *Subject to dynamic soil testing results in Module 6.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
