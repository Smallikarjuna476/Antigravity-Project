import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { timelineApi } from '../services/api';
import { TimelineResponse, TimelineEvent } from '../types';
import {
    CalendarClock, CheckCircle, CircleDashed, LocateFixed, Clock,
    Sprout, Tractor, Scissors, Droplet, Stethoscope, Wheat
} from 'lucide-react';

export const HealthTimelinePage: React.FC = () => {
    const [crop, setCrop] = useState("Paddy (Rice)");

    // Default to Today for fresh start
    const defaultDate = new Date();
    const [startDate, setStartDate] = useState(defaultDate.toISOString().split('T')[0]);

    const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const cropList = ["Paddy (Rice)", "Wheat", "Sugarcane", "Cotton"];

    useEffect(() => {
        const fetchTimeline = async () => {
            setIsLoading(true);
            try {
                // Pass start_date to the backend
                const data = await timelineApi.getEvents(crop, startDate);
                setTimelineData(data);
            } catch (err) {
                console.error("Failed to load timeline", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimeline();
    }, [crop, startDate]);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'planting': return <Sprout size={20} />;
            case 'operation': return <Tractor size={20} />;
            case 'maintenance': return <Scissors size={20} />;
            case 'fertilizer': return <Droplet size={20} />;
            case 'health': return <Stethoscope size={20} />;
            case 'harvest': return <Wheat size={20} />;
            default: return <LocateFixed size={20} />;
        }
    };

    const getStatusStyle = (status: string) => {
        if (status === 'completed') return 'bg-emerald-500 text-white border-emerald-500';
        if (status === 'active') return 'bg-amber-500 text-white border-amber-500 animate-pulse-slow';
        return 'bg-white dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600';
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <CalendarClock className="text-black dark:text-white" size={32} />
                        Crop Health Timeline
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Track agronomic milestones, fertilization schedules, and health alerts based on your exact sowing date.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <Sprout size={18} className="text-emerald-600 dark:text-emerald-500" />
                        <select
                            className="bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white cursor-pointer w-40"
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                        >
                            {cropList.map(c => <option key={c} value={c} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm transition-colors">
                        <CalendarClock size={18} className="text-black dark:text-white" />
                        <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300 mr-2">Sown On:</span>
                        <input
                            type="date"
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 dark:text-white cursor-pointer"
                            style={{ colorScheme: 'light dark' }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                </div>
            ) : timelineData ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                        <Clock className="text-emerald-500" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Recorded Sowing Date</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{timelineData.sowing_date}</p>
                        </div>
                    </div>

                    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-6 space-y-12">
                        {timelineData.events.map((evt, idx) => (
                            <motion.div
                                key={evt.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pr-4"
                            >
                                {/* Timeline Node / Icon */}
                                <div className={`absolute -left-[45px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 shadow-sm ${getStatusStyle(evt.status)}`}>
                                    {evt.status === 'completed' ? <CheckCircle size={20} /> : evt.status === 'active' ? getIconForType(evt.type) : <CircleDashed size={20} />}
                                </div>

                                <div className={`pl-6 ${evt.status === 'upcoming' ? 'opacity-60' : 'opacity-100'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {evt.title}
                                            {evt.status === 'active' && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Current Phase</span>
                                            )}
                                        </h3>
                                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
                                            Day {evt.day_offset} ({evt.date})
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        {evt.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
