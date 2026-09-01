import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { schemesApi } from '../services/api';
import { SchemeListResponse, GovernmentScheme } from '../types';
import {
    Building2, MapPin, Search, ChevronRight, Calculator, FileText, CheckCircle2,
    ExternalLink, Coins, AlertCircle, Info, FileCheck
} from 'lucide-react';

export const SchemesPage: React.FC = () => {
    const [stateName, setStateName] = useState("Karnataka");
    const [schemesData, setSchemesData] = useState<SchemeListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal"
    ];

    useEffect(() => {
        // Auto-location fallback
        if (!navigator.geolocation) {
            fetchSchemes(stateName);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            () => {
                // Mocking location resolving to Karnataka.
                // In production, use reverse geocoding to find State.
                fetchSchemes("Karnataka");
            },
            () => fetchSchemes(stateName)
        );
    }, []);

    const fetchSchemes = async (state: string) => {
        setIsLoading(true);
        try {
            const data = await schemesApi.getSchemes(state);
            setSchemesData(data);
        } catch (error) {
            console.error("Failed to fetch schemes data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStateName(val);
        setSelectedScheme(null); // Reset selection
        fetchSchemes(val);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header & Filter section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Building2 className="text-emerald-500" size={32} />
                        Government Schemes Locator
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Discover and check eligibility for active National and State agricultural subsidies.
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-black rounded-xl">
                    <MapPin size={18} className="text-emerald-500" />
                    <select
                        className="bg-transparent border-none outline-none text-sm font-semibold text-white cursor-pointer w-40"
                        value={stateName}
                        onChange={handleStateChange}
                    >
                        {indianStates.map(state => (
                            <option key={state} value={state} className="bg-gray-900 text-white p-2">
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left List of Schemes */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Schemes near you ({schemesData?.total_schemes_found})
                            </h2>
                        </div>

                        <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {schemesData?.schemes.map((scheme, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={scheme.id}
                                    onClick={() => setSelectedScheme(scheme)}
                                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedScheme?.id === scheme.id
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                                            : 'border-transparent bg-white dark:bg-gray-800 hover:border-emerald-200 dark:hover:border-gray-600 shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${scheme.scope === 'National'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                            }`}>
                                            {scheme.scope}
                                        </span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                                        {scheme.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{scheme.category}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Details Panel */}
                    <div className="lg:col-span-2">
                        {selectedScheme ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {selectedScheme.name}
                                        </h2>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Info size={14} />
                                            {selectedScheme.category}
                                        </span>
                                    </div>
                                    <a
                                        href={selectedScheme.portal_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        Apply on Portal <ExternalLink size={16} />
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                        <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2">
                                            <Coins size={18} />
                                            Benefit Amount
                                        </h3>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {selectedScheme.subsidy_amount}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2">
                                            <AlertCircle size={18} />
                                            Deadline
                                        </h3>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {selectedScheme.deadline}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <CheckCircle2 size={20} className="text-emerald-500" />
                                            Eligibility Criteria
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                            {selectedScheme.eligibility}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <FileCheck size={20} className="text-emerald-500" />
                                            Documents Required
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedScheme.documents_required.map((doc, i) => (
                                                <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <FileText size={16} className="text-emerald-500 shrink-0" />
                                                    <span className="text-sm font-medium">{doc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Mobile apply button */}
                                <div className="mt-8 md:hidden">
                                    <a
                                        href={selectedScheme.portal_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-center items-center gap-2 w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold active:scale-95 transition-transform"
                                    >
                                        Apply on Portal <ExternalLink size={18} />
                                    </a>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-900/30">
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                                    <Building2 size={32} className="text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Select a Scheme
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    Click on any scheme in the side list to view its subsidy amount, eligibility criteria, and required documents.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
