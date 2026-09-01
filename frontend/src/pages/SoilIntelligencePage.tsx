import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soilApi } from '../services/api';
import { SoilScanResponse, SoilHistoryResponse } from '../types';
import {
    Upload, FileText, FlaskConical, Target, CheckCircle, ShieldAlert,
    Beaker, Leaf, Factory, Activity
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

export const SoilIntelligencePage: React.FC = () => {
    const [scanResult, setScanResult] = useState<SoilScanResponse | null>(null);
    const [history, setHistory] = useState<SoilHistoryResponse | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        // Load historical baseline data
        const loadHistory = async () => {
            try {
                const res = await soilApi.getHistory();
                setHistory(res);
            } catch (err) {
                console.error("Could not fetch soil history", err);
            }
        };
        loadHistory();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsScanning(true);
            const res = await soilApi.scanReport(file);
            setScanResult(res);
        } catch (err) {
            console.error("Error scanning upload", err);
        } finally {
            setIsScanning(false);
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'Optimal') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30';
        if (status === 'Requires Amendment') return 'text-amber-500 bg-amber-50 dark:bg-amber-900/30';
        return 'text-red-500 bg-red-50 dark:bg-red-900/30';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Soil & NPK Intelligence
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Upload your soil test certificate. Our OCR AI will extract NPK values, EC, and pH to calculate custom fertilizer dosages.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Upload Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Certificate</h2>
                        <div className="relative group cursor-pointer h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileUpload}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {isScanning ? (
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                                    <p className="text-sm font-medium text-emerald-600">Extracting NPK via OCR...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={24} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop PDF/JPG here</p>
                                    <p className="text-xs text-gray-400 mt-1">Maximum 5MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Historical Tracking Chart */}
                    {history && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <Activity className="text-blue-500" />
                                Soil Health (5 Yr Trend)
                            </h2>
                            <div className="h-48 text-sm">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={history.history}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="year" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <RechartsTooltip />
                                        <Line type="monotone" dataKey="Nitrogen" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="N" />
                                        <Line type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="pH Level" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scan Results Section */}
                <div className="lg:col-span-2">
                    {scanResult ? (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                    <FlaskConical size={120} />
                                </div>

                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scan Detected</h2>
                                        <p className="text-sm text-gray-500">File: {scanResult.filename} • ID: {scanResult.scan_id.split('-')[0]}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(scanResult.health_status)}`}>
                                        {scanResult.health_status}
                                    </span>
                                </div>

                                {/* Macro & Micro Nutrients Display */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                        <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-semibold">
                                            <div className="w-6 h-6 rounded bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs">N</div>
                                            Nitrogen
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {scanResult.metrics.Nitrogen_kg_ha} <span className="text-sm font-normal text-gray-500">kg/ha</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                                        <div className="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-400 font-semibold">
                                            <div className="w-6 h-6 rounded bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-xs">P</div>
                                            Phosphorus
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {scanResult.metrics.Phosphorus_kg_ha} <span className="text-sm font-normal text-gray-500">kg/ha</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800">
                                        <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-semibold">
                                            <div className="w-6 h-6 rounded bg-rose-200 dark:bg-rose-800 flex items-center justify-center text-xs">K</div>
                                            Potassium
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {scanResult.metrics.Potassium_kg_ha} <span className="text-sm font-normal text-gray-500">kg/ha</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-sm text-gray-500 font-semibold mb-1">pH Level</div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{scanResult.metrics.pH}</div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-sm text-gray-500 font-semibold mb-1">Electrical Cond.</div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{scanResult.metrics.EC_ds_m} <span className="text-sm font-normal">ds/m</span></div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-sm text-gray-500 font-semibold mb-1">Organic Carbon</div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{scanResult.metrics.OC_percentage}%</div>
                                    </div>
                                </div>

                                {/* Custom Recommendations Engine */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                        <CheckCircle className="text-emerald-500" />
                                        Formula Customization Plan
                                    </h3>
                                    <div className="space-y-3">
                                        {scanResult.recommendations.map((rec, i) => (
                                            <div key={i} className="flex gap-3 items-start p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl">
                                                <Target size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-gray-800 dark:text-gray-200">{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-900/30">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                                <FileText size={32} className="text-emerald-600 border" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Report Found</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Please upload a valid laboratory certified soil test report to auto-process and unlock AI-driven fertilizer optimization.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
