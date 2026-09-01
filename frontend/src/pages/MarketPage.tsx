import React, { useState, useEffect } from 'react';
import { marketApi } from '../services/api';
import { MandiRate, MarketForecastResponse } from '../types';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
    TrendingUp, TrendingDown, AlignJustify, MapPin, Search,
    IndianRupee, Calculator, Store, Map
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MarketPage: React.FC = () => {
    const [rates, setRates] = useState<MandiRate[]>([]);
    const [forecast, setForecast] = useState<MarketForecastResponse | null>(null);

    const [userState, setUserState] = useState<string>("Karnataka"); // Default
    const [isLocating, setIsLocating] = useState<boolean>(true);
    const [locationError, setLocationError] = useState<string>('');

    const [selectedCommodity, setSelectedCommodity] = useState<string>("Tomato");
    const [isLoading, setIsLoading] = useState(true);

    // Profit Calculator State
    const [acres, setAcres] = useState<number>(1);
    const [yieldTons, setYieldTons] = useState<number>(15);
    const [distanceKm, setDistanceKm] = useState<number>(50);
    const [profitData, setProfitData] = useState<any>(null);

    useEffect(() => {
        // Attempt to get user's live location automatically
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Reverse Geocode using Nominatim
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await res.json();

                        let detectedState = "Karnataka"; // fallback
                        if (data && data.address && data.address.state) {
                            detectedState = data.address.state;
                        }
                        setUserState(detectedState);
                        setIsLocating(false);
                    } catch (e) {
                        setLocationError("Could not resolve location address.");
                        setIsLocating(false);
                    }
                },
                (error) => {
                    console.warn("Geolocation blocked or failed:", error.message);
                    setLocationError("Location tracking rejected or failed. Using default.");
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
        }
    }, []);

    useEffect(() => {
        if (isLocating) return; // Wait until location finishes

        const loadMarketData = async () => {
            setIsLoading(true);
            try {
                const [liveRates, forecastData, profitCalc] = await Promise.all([
                    marketApi.getLiveRates(userState),
                    marketApi.getPriceForecast(selectedCommodity),
                    marketApi.getProfitCalculator(selectedCommodity, acres, yieldTons, distanceKm)
                ]);
                setRates(liveRates.rates);
                setForecast(forecastData);
                setProfitData(profitCalc);
            } catch (err) {
                console.error("Market API Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadMarketData();
    }, [selectedCommodity, userState, isLocating, acres, yieldTons, distanceKm]);


    // Format chart data joining historical and forecast continuously
    const chartData = forecast ? [
        ...forecast.trends.historical.map(h => ({ date: h.date, history_price: h.price, full_date: h.date })),
        ...forecast.trends.forecast.map(f => ({
            date: f.date,
            forecast_price: f.predicted_price,
            range: [f.lower_bound, f.upper_bound],
            full_date: f.date
        }))
    ] : [];

    if (isLocating) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
                <MapPin className="w-16 h-16 text-emerald-500 animate-bounce mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Fetching Live Location (GPS)...</h2>
                <p className="text-gray-500 mt-2 text-sm">Please allow location access to tune APMC Markets to your State.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Smart Market Intelligence
                    </h1>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-2">
                        <MapPin size={16} />
                        Live Markets for Region: {userState}
                        {locationError && <span className="text-red-400 ml-2 text-xs">({locationError})</span>}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Live Mandi Rates */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[650px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Store className="text-emerald-500" />
                                Live APMC Mandi Rates
                            </h2>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                placeholder="Search Commodity..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
                            ) : (
                                rates.map((rate, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={rate.id}
                                        className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all ${selectedCommodity === rate.commodity
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                                            }`}
                                        onClick={() => setSelectedCommodity(rate.commodity)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100">{rate.commodity}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1"><Map size={12} />{rate.market}</p>
                                            </div>
                                            <div className={`p-1.5 rounded-full ${rate.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' : rate.trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                {rate.trend === 'up' ? <TrendingUp size={16} /> : rate.trend === 'down' ? <TrendingDown size={16} /> : <AlignJustify size={16} />}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center">
                                                <IndianRupee size={18} className="mr-1 opacity-70" />{rate.modal_price}
                                            </p>
                                            <span className="text-xs font-medium text-gray-400">per Quintal</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span>Min: ₹{rate.min_price}</span>
                                            <span>Max: ₹{rate.max_price}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Forecaster & Calculator */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Price Forecast Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    30-Day AI Price Forecaster: {selectedCommodity}
                                </h2>
                                {forecast && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Optimal Harvest Window: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{forecast.optimal_harvest_window}</span>
                                    </p>
                                )}
                            </div>
                            {forecast && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">AI Confidence</p>
                                    <p className="text-xl font-black text-blue-600">{forecast.confidence_score}%</p>
                                </div>
                            )}
                        </div>

                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(val) => val.slice(5)} minTickGap={20} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px' }} labelFormatter={(l) => `Date: ${l}`} />

                                    {/* Historical Price */}
                                    <Area
                                        type="monotone"
                                        dataKey="history_price"
                                        name="Past Price (₹)"
                                        stroke="#9ca3af"
                                        strokeWidth={2}
                                        fill="transparent"
                                    />

                                    {/* Forecast Price */}
                                    <Area
                                        type="monotone"
                                        dataKey="forecast_price"
                                        name="AI Predicted (₹)"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={0.1}
                                        fill="#10b981"
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Profit Calculator Slider UI */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <Calculator className="text-emerald-500" />
                            Logistics & Net Profit Calculator
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div className="space-y-5">
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Land Area (Acres) <span>{acres} Acre(s)</span>
                                    </label>
                                    <input
                                        type="range" min="0.5" max="25" step="0.5"
                                        value={acres} onChange={(e) => setAcres(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expected Yield (Tons) <span>{yieldTons} Tons</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="100" step="1"
                                        value={yieldTons} onChange={(e) => setYieldTons(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Distance to APMC (Km) <span>{distanceKm} Km</span>
                                    </label>
                                    <input
                                        type="range" min="5" max="500" step="5"
                                        value={distanceKm} onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Outputs */}
                            {profitData && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Gross Revenue</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">₹{profitData.financials.total_revenue_inr.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Production Costs</span>
                                            <span className="font-semibold text-red-500">- ₹{profitData.financials.production_cost_inr.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Freight Transport</span>
                                            <span className="font-semibold text-red-500">- ₹{profitData.financials.freight_logistics_inr.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Estimated Net Profit</h4>
                                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                                            <IndianRupee size={24} className="mr-1" />
                                            {profitData.financials.net_profit_inr.toLocaleString()}
                                        </p>
                                        <p className="text-xs font-semibold mt-2 text-indigo-500">{profitData.recommendation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
