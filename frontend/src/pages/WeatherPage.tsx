import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CloudSun, CloudRain, Wind, Droplets, Thermometer,
    MapPin, AlertTriangle, Layers, Sprout, Sun
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { weatherApi } from '../services/api';
import { WeatherDataResponse, WeatherAlert } from '../types';

export const WeatherPage: React.FC = () => {
    const [weather, setWeather] = useState<WeatherDataResponse | null>(null);
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isLocating, setIsLocating] = useState<boolean>(true);
    const [locationName, setLocationName] = useState<string>("Hospet"); // Default to Hospet if location blocked
    const [coords, setCoords] = useState<{ lat: number, lon: number }>({ lat: 15.2689, lon: 76.3909 });

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        setCoords({ lat: latitude, lon: longitude });

                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await res.json();

                        let detectedName = "Unknown Location";
                        if (data && data.address) {
                            detectedName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Your Location";
                        }
                        setLocationName(detectedName);
                        setIsLocating(false);
                    } catch (e) {
                        setIsLocating(false);
                    }
                },
                (error) => {
                    console.warn("Geolocation failed:", error.message);
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
        }
    }, []);

    useEffect(() => {
        if (isLocating) return;

        const fetchWeather = async () => {
            try {
                setIsLoading(true);
                const [weatherData, alertsData] = await Promise.all([
                    weatherApi.getForecast(coords.lat, coords.lon),
                    weatherApi.getAlerts(locationName)
                ]);
                setWeather(weatherData);
                setAlerts(alertsData.alerts || []);
            } catch (error) {
                console.error("Failed to load weather data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, [coords, locationName, isLocating]);

    if (isLocating) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
                <MapPin className="w-16 h-16 text-emerald-500 animate-bounce mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Targeting Meteorological Satellites...</h2>
                <p className="text-gray-500 mt-2 text-sm">Please allow location access for hyper-local weather intelligence.</p>
            </div>
        );
    }

    if (isLoading || !weather) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
                <div className="flex flex-col items-center">
                    <CloudSun className="w-16 h-16 text-emerald-500 animate-pulse mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Syncing Meteorological Satellites...</h2>
                </div>
            </div>
        );
    }

    const { current, daily, hourly, location } = weather;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Header & Current Conditions */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Smart Weather Intelligence
                    </h1>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin size={16} />
                        {locationName} (Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)})
                    </p>
                </div>
            </div>

            {/* Emergency Alerts Strip */}
            {alerts.length > 0 && (
                <div className="flex flex-col gap-3 mb-6">
                    {alerts.map(alert => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            key={alert.id}
                            className={`p-4 rounded-xl shadow-sm border-l-4 flex gap-4 ${alert.severity === 'EXTREME'
                                ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                                : 'bg-amber-50 border-amber-500 dark:bg-amber-900/20'
                                }`}
                        >
                            <AlertTriangle className={`w-8 h-8 ${alert.severity === 'EXTREME' ? 'text-red-500' : 'text-amber-500'}`} />
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{alert.type} WARNING: {alert.title}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.description}</p>
                                <p className="text-xs font-semibold mt-2 opacity-80">Valid until: {new Date(alert.valid_until).toLocaleString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Primary Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <CloudRain className="absolute -right-6 -top-6 w-32 h-32 opacity-10" />
                    <p className="text-blue-100 font-medium">Current Temperature</p>
                    <h2 className="text-5xl font-bold mt-2">{current.temp}°C</h2>
                    <p className="mt-4 flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{current.condition}</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                        <Droplets size={24} />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Relative Humidity</h3>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{current.humidity}%</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${current.humidity}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-orange-500 mb-2">
                        <Sun size={24} />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">UV Index</h3>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{current.uv_index}</p>
                    <p className="text-sm font-medium mt-2 text-gray-500">
                        {current.uv_index > 7 ? 'High Risk - Apply Shade' : 'Moderate'}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 mb-2">
                        <Sprout size={24} />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Disease Favorable Index</h3>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{current.disease_favorable_index}%</p>
                    <p className="text-sm font-medium mt-2 text-gray-500">
                        Based on Temp + Humidity
                    </p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 gap-6">

                {/* 7-Day Temp Forecast */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">7-Day Temperature Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => val.slice(5)} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="temp_max" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                                <Area type="monotone" dataKey="temp_min" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>





            </div>
        </div>
    );
};
