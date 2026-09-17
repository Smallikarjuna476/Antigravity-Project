import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Search,
    FileText,
    Video,
    Bookmark,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    Leaf,
    Landmark,
    Download
} from 'lucide-react';
import { hubApi } from '../services/api';

interface Article {
    id: string;
    title: string;
    category: 'Paper' | 'Manual' | 'Video' | 'Policy';
    source: string;
    readTime: string;
    description: string;
    bookmarked: boolean;
    featured?: boolean;
    link?: string;
}

export const KnowledgeHubPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'All' | 'Paper' | 'Manual' | 'Video'>('All');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [libraryData, setLibraryData] = useState<Article[]>([]);

    useEffect(() => {
        const loadHub = async () => {
            try {
                const data = await hubApi.getArticles(activeTab, searchQuery);
                setLibraryData(data as Article[]);
            } catch (err) {
                console.error("Hub Error", err);
            }
        };
        loadHub();
    }, [activeTab, searchQuery]);

    const handleDownload = () => {
        if (selectedArticle?.link) {
            window.open(selectedArticle.link, '_blank');
        } else {
            setIsDownloading(true);
            setTimeout(() => {
                setIsDownloading(false);
                window.print();
            }, 1500);
        }
    };

    const filteredData = libraryData;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
                        Agricultural Knowledge Hub
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Curated scientific telemetry, ICAR publications, and organic agronomy masterclasses.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-80">
                    <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search manual, video, or paper..."
                        className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:font-normal"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Featured Hero Banner */}
            {searchQuery === '' && activeTab === 'All' && (
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-800/60 shadow-lg group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c5b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

                    <div className="relative p-6 sm:p-10 flex flex-col items-start max-w-3xl">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4" /> Recommended Read
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                            Precision Farming: Maximizing Yield with Soil Sensor Telemetry
                        </h2>
                        <p className="text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
                            Discover how integrating continuous soil moisture tracking with AI evapotranspiration models reduces water usage by 40% while accelerating vegetative canopy growth.
                        </p>
                        <button 
                            onClick={() => window.open('https://arxiv.org/pdf/1905.11946.pdf', '_blank')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:gap-3"
                        >
                            Read the Framework <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Content Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Manual', 'Video', 'Paper', 'Policy'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-all border ${activeTab === tab ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        {tab === 'All' ? 'Latest Curriculum' : (tab === 'Policy' ? 'Policies' : tab + 's')}
                    </button>
                ))}
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredData.map(item => {
                    let Icon = FileText;
                    let colorClass = "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
                    if (item.category === 'Video') {
                        Icon = Video;
                        colorClass = "text-rose-500 bg-rose-50 dark:bg-rose-500/10";
                    } else if (item.category === 'Manual') {
                        Icon = Leaf;
                        colorClass = "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                    } else if (item.category === 'Policy') {
                        Icon = Landmark;
                        colorClass = "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
                    }

                    return (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col group cursor-pointer"
                            onClick={() => setSelectedArticle(item)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${colorClass}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <button
                                    className="text-slate-400 hover:text-indigo-500 transition-colors z-10"
                                    onClick={(e) => { e.stopPropagation(); /* Prevents opening modal if just toggling bookmark */ }}
                                >
                                    <Bookmark className={`w-5 h-5 ${item.bookmarked ? 'fill-indigo-500 text-indigo-500' : ''}`} />
                                </button>
                            </div>

                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Source</span>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.source}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {item.readTime}
                                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-50" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredData.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No documents found</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">We couldn't find any resources matching "{searchQuery}"</p>
                </div>
            )}

            {/* Document Viewer Modal Overlay */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">

                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <span className="uppercase text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                                    {selectedArticle.category} • {selectedArticle.source}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                    {selectedArticle.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="w-8 h-8 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto align-middle flex flex-col gap-6" style={{ minHeight: '300px' }}>
                            {selectedArticle.category === 'Video' ? (
                                <div className="w-full bg-slate-900 rounded-xl aspect-video flex-shrink-0 flex items-center justify-center relative overflow-hidden group shadow-inner">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                        <span className="font-medium text-white shadow-sm">{selectedArticle.title} - Official Visual Guide</span>
                                    </div>
                                    <button 
                                        onClick={() => selectedArticle.link && window.open(selectedArticle.link, '_blank')}
                                        className="w-16 h-16 bg-white/20 group-hover:bg-emerald-500/90 backdrop-blur-md rounded-full flex items-center justify-center transition-all scale-95 group-hover:scale-105 z-10 shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                                        <FileText className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">Document Preview Render Area</p>
                                        <p className="text-xs">Page 1 of {Math.floor(Math.random() * 20 + 5)}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm uppercase">Abstract / Summary</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {selectedArticle.description} In a production setting, this modal would expand into a full document reader via an integration like react-pdf, rendering the actual literature.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="px-5 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={selectedArticle.category === 'Video' ? undefined : handleDownload}
                                className="px-5 py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 text-sm transition-all w-48 justify-center"
                            >
                                {selectedArticle.category === 'Video' ? (
                                    <>
                                        <Video className="w-4 h-4" /> Cast to TV
                                    </>
                                ) : isDownloading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Downloading...
                                    </span>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" /> Download Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
