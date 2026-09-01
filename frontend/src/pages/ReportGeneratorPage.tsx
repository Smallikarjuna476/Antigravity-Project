import React, { useState } from 'react';
import {
    FileText,
    FileSpreadsheet,
    FileImage,
    Download,
    CheckCircle2,
    Calendar,
    Filter,
    FileSignature,
    RefreshCw,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react';

interface ReportTemplate {
    id: string;
    title: string;
    description: string;
    type: 'PDF' | 'Excel' | 'Certificate';
    icon: React.ElementType;
    color: string;
    bgColor: string;
    dataPoints: string[];
}

interface PastReport {
    id: string;
    title: string;
    date: string;
    size: string;
    type: string;
}

export const ReportGeneratorPage: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeReport, setActiveReport] = useState<ReportTemplate | null>(null);

    const templates: ReportTemplate[] = [
        {
            id: 'r1',
            title: 'Seasonal Yield & Performance Ledger',
            description: 'Comprehensive end-of-season breakdown of harvest volumes, market execution prices, and comparative profit margins.',
            type: 'PDF',
            icon: FileText,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
            dataPoints: ['Harvest Trajectory Charts', 'Net Profit Margins', 'Market Price Analysis']
        },
        {
            id: 'r2',
            title: 'Farm Quality & Soil Health Certificate',
            description: 'Official digital certificate summarizing continuous NPK telemetry and organic carbon balance for loan and subsidy applications.',
            type: 'Certificate',
            icon: FileSignature,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
            dataPoints: ['NPK Status', 'Organic Carbon %', 'Digital Signature']
        },
        {
            id: 'r3',
            title: 'Input Cost & Subsidies Audit',
            description: 'Granular spreadsheet of all chemical, seed, and labor expenditures contrasted against DBT subsidy disbursements.',
            type: 'Excel',
            icon: FileSpreadsheet,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
            dataPoints: ['Detailed Rows of Expenses', 'PM-KISAN DBT Check', 'ROI Calculator']
        },
        {
            id: 'r4',
            title: 'Pest Outbreak & Biological Threat Log',
            description: 'Visual map-based export documenting detected lesions, treatment schedules, and AI-predicted epidemiological spread.',
            type: 'PDF',
            icon: FileImage,
            color: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-50 dark:bg-rose-500/10',
            dataPoints: ['Grad-CAM Hotspots', 'Chemical Application Log', 'Threat Velocity']
        }
    ];

    const pastReports: PastReport[] = [
        { id: '1', title: 'Q2 2026 Yield Analysis', date: 'Jul 15, 2026', size: '2.4 MB', type: 'PDF' },
        { id: '2', title: 'Soil NPK Certification (Pre-Sowing)', date: 'Jun 1, 2026', size: '0.8 MB', type: 'CER' },
        { id: '3', title: 'Kharif 2025 Financial Ledger', date: 'Dec 10, 2025', size: '1.1 MB', type: 'XLSX' },
        { id: '4', title: 'Tomato Late Blight Advisory', date: 'Aug 22, 2025', size: '4.2 MB', type: 'PDF' },
    ];

    const handleGenerate = (template: ReportTemplate) => {
        setActiveReport(template);
        setIsGenerating(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsGenerating(false);
                        if (template.type === 'PDF' || template.type === 'Certificate') {
                            window.print();
                        } else {
                            // Dummy excel download trigger
                            alert(`Mock Download: Generating and exporting ${template.title}.xlsx`);
                        }
                    }, 500);
                    return 100;
                }
                return p + Math.floor(Math.random() * 20 + 10);
            });
        }, 600);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileSignature className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                        Smart Report Generator
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Automated AI creation of performance ledgers, certificates, and epidemiological exports.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <select className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none">
                        <option>Current Season (Kharif 2026)</option>
                        <option>Rabi 2025</option>
                        <option>Kharif 2025</option>
                        <option>Full Year 2025</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Templates Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Templates</h2>
                        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                            <Filter className="w-4 h-4" /> Filter by Category
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map(template => {
                            const Icon = template.icon;
                            return (
                                <div key={template.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col h-full group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${template.bgColor} ${template.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {template.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {template.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow line-clamp-3">
                                        {template.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        {template.dataPoints.map((point, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                {point}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleGenerate(template)}
                                        disabled={isGenerating}
                                        className="w-full mt-auto bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border border-indigo-200 dark:border-indigo-800/50 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Generate & Export
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Status Box */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-800/60 rounded-2xl p-6 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 p-4 opacity-10">
                            <RefreshCw className="w-24 h-24 text-indigo-400 -rotate-45" />
                        </div>
                        <h3 className="font-bold text-white mb-1 relative z-10">Data Synchronization</h3>
                        <p className="text-sm text-indigo-200 mb-4 relative z-10">All agrarian telemetry is up to date.</p>
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider relative z-10 backdrop-blur-sm">
                            <CheckCircle2 className="w-4 h-4" /> Ready to Export
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Past Reports</h3>
                            <button className="text-slate-400 hover:text-indigo-500">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {pastReports.map(report => (
                                <div key={report.id} className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {report.type === 'PDF' && <FileText className="w-5 h-5" />}
                                        {report.type === 'XLSX' && <FileSpreadsheet className="w-5 h-5" />}
                                        {report.type === 'CER' && <FileSignature className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{report.title}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            <span>{report.date}</span>
                                            <span>•</span>
                                            <span>{report.size}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                            View All History
                        </button>
                    </div>
                </div>
            </div>

            {/* Generation Overlay Progress */}
            {isGenerating && activeReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 relative">
                            {/* Inner Spin ring */}
                            <svg className="animate-spin w-16 h-16 text-indigo-500 absolute top-0 left-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <activeReport.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 relative z-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generating Report</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Synthesizing telemetry data for {activeReport.title}...
                        </p>

                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                            <div
                                className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="w-full flex justify-between text-xs text-slate-500 font-medium font-mono">
                            <span>0%</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
