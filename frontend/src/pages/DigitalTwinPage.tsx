import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Droplets,
    ThermometerSun,
    Leaf,
    Wind,
    Layers,
    Activity,
    AlertTriangle,
    Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { twinApi } from '../services/api';

export const DigitalTwinPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [twinStatus, setTwinStatus] = useState<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const data = await twinApi.getStatus();
                setTwinStatus(data);
            } catch (err) {
                console.error("Twin Load Error", err);
            }
        };
        loadStatus();
    }, []);

    if (!twinStatus) {
        return <div>Simulating Twin Environment...</div>;
    }

    const { farmPolygon, centerPoint, moistureData, biomassData, metrics } = twinStatus;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                        AI Farm Digital Twin
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Real-time virtual simulation of Plot A01 (Tomato cv. Arka Rakshak).
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">{currentTime}</span>
                    </div>
                </div>
            </div>

            {/* Main Twin Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Spatial Map */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Map Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[400px] relative z-0">
                        <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg shadow border border-slate-200 dark:border-slate-800 pointer-events-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                                <MapIcon className="w-4 h-4 text-emerald-500" />
                                Plot A01
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Canopy Cover: 68%</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Satellite Sync: 2m ago</p>
                        </div>

                        <MapContainer center={centerPoint} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                            <Polygon positions={farmPolygon} pathOptions={{ color: '#10b981', weight: 3, fillColor: '#34d399', fillOpacity: 0.3 }} />
                            <Marker position={centerPoint}>
                                <Popup>
                                    <div className="text-center font-bold">Node 1<br />Soil Moisture: 55%</div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Sensor Telemetry Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">55%</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Avg Moisture</p>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <ThermometerSun className="w-6 h-6 text-amber-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">28°C</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Canopy Temp</p>
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-medium">+2°C vs ambient</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <Leaf className="w-6 h-6 text-emerald-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">Day 42</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Growth Stage</p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Mid-Vegetative</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <Layers className="w-6 h-6 text-indigo-500 mb-2" />
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">4.8<span className="text-sm font-medium"> t/ac</span></p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Proj. Yield</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-2 font-medium">Optimal trajectory</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Diagnostics */}
                <div className="space-y-6">

                    {/* Live Diagnostics Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Digital Twin Diagnostics
                        </h3>

                        <div className="space-y-4">
                            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">Moisture Stress Detected</h4>
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 leading-relaxed">
                                            Surface moisture has dropped below 30% threshold. Evapotranspiration rate is high due to dry winds.
                                        </p>
                                        <button className="mt-3 text-[10px] font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                                            Trigger Irrigation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                                <div className="flex gap-3">
                                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Nitrogen Uptake Optimal</h4>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 leading-relaxed">
                                            Biomass accumulation is exceeding expected models by 4% due to recent NPK top-dress integration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart: Moisture */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Soil Moisture Depletion</h3>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moistureData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                                    <Line type="monotone" name="Surface (0cm)" dataKey="surface" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                    <Line type="monotone" name="Root Zone (15cm)" dataKey="rootZone" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart: Biomass */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Biomass Accumulation</h3>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={biomassData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBiomass" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="expected" stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                                    <Area type="monotone" dataKey="biomass" stroke="#10b981" fillOpacity={1} fill="url(#colorBiomass)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
