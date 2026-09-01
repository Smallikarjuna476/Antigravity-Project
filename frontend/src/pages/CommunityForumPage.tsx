import React, { useState } from 'react';
import {
    Users,
    MessageSquare,
    ThumbsUp,
    Bookmark,
    Share2,
    TrendingUp,
    ShieldCheck,
    Search,
    MessageCircle,
    Award
} from 'lucide-react';

interface Author {
    name: string;
    avatar: string;
    role: 'Farmer' | 'Agronomist' | 'Admin';
    verified: boolean;
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    tags: string[];
    upvotes: number;
    replyCount: number;
    timestamp: string;
    hasImage?: boolean;
    imageSrc?: string;
    isResolved?: boolean;
}

export const CommunityForumPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<'All' | 'Pest Control' | 'Fertilizers' | 'Govt Schemes'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = ['All', 'Pest Control', 'Fertilizers', 'Govt Schemes', 'Organic Farming', 'Market Rates'];

    const MOCK_POSTS: Post[] = [
        {
            id: 'p1',
            title: 'White patches appearing on my Kharif Tomato crop leaves, is this powdery mildew?',
            content: 'Started noticing these patches spreading rapidly across the lower canopy. Humidity has been hovering around 85% this week in Maharashtra. What is the immediate chemical control recommended?',
            author: { name: 'Vishal Reddy', avatar: 'VR', role: 'Farmer', verified: false },
            tags: ['Pest Control', 'Tomato'],
            upvotes: 24,
            replyCount: 5,
            timestamp: '2 hours ago',
            hasImage: true,
            imageSrc: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800',
            isResolved: true
        },
        {
            id: 'p2',
            title: 'PM-KISAN 15th installment delayed for my Aadhaar linkage, steps to resolve?',
            content: 'My status shows e-KYC pending but I have already completed it at the local CSC center last week. Does anyone know how long the portal takes to reflect the updated status?',
            author: { name: 'Sanjeev Kumar', avatar: 'SK', role: 'Farmer', verified: false },
            tags: ['Govt Schemes', 'PM-KISAN'],
            upvotes: 12,
            replyCount: 3,
            timestamp: '5 hours ago'
        },
        {
            id: 'p3',
            title: '[Expert Advisory] Switch to Nano Urea to reduce input costs by 15%',
            content: 'IFFCO Nano Urea liquid has proven to provide 80% utilization efficiency compared to 30% for conventional granular Urea. Foliar application bypasses soil fixation. Feel free to ask deployment questions below.',
            author: { name: 'Dr. Anita Desai', avatar: 'AD', role: 'Agronomist', verified: true },
            tags: ['Fertilizers', 'Yield Optimization'],
            upvotes: 156,
            replyCount: 42,
            timestamp: '1 day ago'
        }
    ];

    const filteredPosts = MOCK_POSTS.filter(post =>
        (activeCategory === 'All' || post.tags.includes(activeCategory)) &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                        Community Forum
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Connect with expert agronomists and peer cultivators.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 rounded-lg pl-9 pr-4 py-2 text-sm w-full sm:w-64 outline-none text-slate-700 dark:text-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex flex-shrink-0 items-center gap-2 shadow-sm">
                        <MessageSquare className="w-4 h-4" /> New Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Sidebar: Categories */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Topics</h3>
                        <div className="flex flex-col gap-1">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category as any)}
                                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-800/60 rounded-2xl p-5 shadow-sm flex flex-col items-start relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block mb-3 border border-indigo-500/30 backdrop-blur-sm z-10">
                            Expert Panel
                        </span>
                        <h3 className="font-bold text-white mb-2 z-10">Ask an Agronomist</h3>
                        <p className="text-xs text-indigo-200 mb-4 z-10 leading-relaxed">
                            Verified ICAR scientists drop in daily to resolve complex crop diseases and soil issues.
                        </p>
                        <button className="bg-white/10 hover:bg-white/20 text-white w-full rounded-lg py-2 text-sm font-semibold transition-colors backdrop-blur-md z-10 border border-white/10">
                            Request Expert Help
                        </button>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer">

                            {/* Author Row */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${post.author.role === 'Agronomist' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 flex-shrink-0' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex-shrink-0'}`}>
                                        {post.author.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-sm text-slate-900 dark:text-white leading-none">
                                                {post.author.name}
                                            </span>
                                            {post.author.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 leading-none">
                                                {post.author.role}
                                            </span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">• {post.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                                {post.isResolved && (
                                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Resolved
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                {post.title}
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                                {post.content}
                            </p>

                            {/* Image Attachment */}
                            {post.hasImage && post.imageSrc && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64 relative">
                                    <img src={post.imageSrc} alt="Post attachment" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                <div className="flex items-center gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                                            #{tag.replace(/\s+/g, '')}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                                    <button className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="text-xs font-medium">{post.upvotes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="text-xs font-medium">{post.replyCount}</span>
                                    </button>
                                    <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <Bookmark className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900 dark:text-white">No discussions found</h3>
                            <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Trending Discussions */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-rose-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Trending</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0 cursor-pointer group">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors line-clamp-2">New drone spraying regulations in Maharashtra</h4>
                                <span className="text-xs text-slate-400 mt-1 block">42 replies</span>
                            </div>
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0 cursor-pointer group">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors line-clamp-2">Best moisture sensors under ₹5,000?</h4>
                                <span className="text-xs text-slate-400 mt-1 block">18 replies</span>
                            </div>
                            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0 cursor-pointer group">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors line-clamp-2">Early monsoon forecast accuracy concerns</h4>
                                <span className="text-xs text-slate-400 mt-1 block">89 replies</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-4 h-4 text-amber-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Top Helpers</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                                        AD
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">Dr. Anita Desai <ShieldCheck className="w-3 h-3 text-emerald-500" /></p>
                                        <p className="text-[10px] text-slate-500">Agronomist</p>
                                    </div>
                                </div>
                                <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">#1</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                                        KP
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Kiran Patil</p>
                                        <p className="text-[10px] text-slate-500">Veteran Farmer</p>
                                    </div>
                                </div>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">#2</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};
