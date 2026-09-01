import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { journalApi } from '../services/api';
import { JournalEntry } from '../types';
import {
    BookOpen, PlusCircle, Search, Calendar,
    DollarSign, Tag, X, Check, Droplet, Sprout, Tractor, Package, Eye, Trash2
} from 'lucide-react';

export const FarmJournalPage: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState("Expense");
    const [newCost, setNewCost] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await journalApi.getEntries();
            setEntries(data);
        } catch (err) {
            console.error("Failed to fetch journal entries", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: newTitle,
                category: newCategory,
                cost: parseFloat(newCost) || 0,
                description: newDesc,
                date: newDate
            };
            const created = await journalApi.createEntry(payload);
            setEntries([created, ...entries]);
            setShowModal(false);

            // Reset form
            setNewTitle("");
            setNewCost("");
            setNewDesc("");
            setNewCategory("Expense");
            setNewDate(new Date().toISOString().split('T')[0]);
        } catch (err) {
            console.error("Failed to create entry", err);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm("Are you sure you want to delete this log?")) return;
        try {
            await journalApi.deleteEntry(id);
            setEntries(entries.filter((e) => e.id !== id));
        } catch (err) {
            console.error("Failed to delete entry", err);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Expense': return <DollarSign size={16} />;
            case 'Fertilizer': return <Droplet size={16} />;
            case 'Pesticide': return <Package size={16} />;
            case 'Harvest': return <Sprout size={16} />;
            case 'Observation': return <Eye size={16} />;
            default: return <Tag size={16} />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Expense': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            case 'Fertilizer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Pesticide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Harvest': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Observation': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const totalExpenses = entries.reduce((acc, curr) => acc + curr.cost, 0);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BookOpen className="text-emerald-500" size={32} />
                        Smart Farm Journal
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Log expenses, track harvest inputs, and maintain an exportable digital farm diary.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    <PlusCircle size={20} />
                    New Log Entry
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl col-span-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Logged Expense</h3>
                    <p className="text-4xl font-bold text-white flex items-center">
                        <span className="text-emerald-500 mr-2">₹</span>
                        {totalExpenses.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs by title, category, or description..."
                        className="w-full h-full min-h-[100px] pl-12 pr-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white text-lg transition-colors"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map((entry, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={entry.id}
                            className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-500/50 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 pr-16"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getCategoryColor(entry.category)}`}>
                                        {getCategoryIcon(entry.category)} {entry.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-2 py-0.5 rounded-md">
                                        <Calendar size={14} /> {entry.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{entry.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{entry.description}</p>
                            </div>

                            {entry.cost > 0 && (
                                <div className="md:text-right shrink-0 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Cost</p>
                                    <p className="text-2xl font-bold text-rose-500">₹{entry.cost.toLocaleString('en-IN')}</p>
                                </div>
                            )}

                            <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors p-2 bg-gray-50 hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-900/20 rounded-full"
                                title="Delete Log"
                            >
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}

                    {entries.length === 0 && (
                        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No entries yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Click "New Log Entry" to start recording your farm activities.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for creating a new entry */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <PlusCircle className="text-emerald-500" />
                                Add Log
                            </h2>

                            <form onSubmit={handleCreateEntry} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                                        Title / Activity Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="e.g. Purchased Urea"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                                        >
                                            <option>Expense</option>
                                            <option>Fertilizer</option>
                                            <option>Pesticide</option>
                                            <option>Harvest</option>
                                            <option>Observation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                                        Total Cost (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCost}
                                        onChange={(e) => setNewCost(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                                        Description / Notes
                                    </label>
                                    <textarea
                                        required
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        placeholder="Add details about this activity..."
                                        rows={3}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors custom-scrollbar"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Save to Journal
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
