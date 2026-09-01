import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, FileText, Image as ImageIcon, Globe, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assistantApi } from '../services/api';
import { ChatMessageItem, ChatSession } from '../types';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'as', name: 'অসমীয়া (Assamese)' }
];

export const AssistantPage: React.FC = () => {
    const { user } = useAuth();

    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);

    const [inputMsg, setInputMsg] = useState('');
    const [language, setLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([
        "What is the fertilizer dosage for Tomato?",
        "How to make Jeevamrutha?",
        "PM Kisan scheme details"
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const fetchSessions = async () => {
        try {
            const data = await assistantApi.getSessions();
            setSessions(data);
        } catch (error) {
            console.error("Failed to load sessions:", error);
        }
    };

    const fetchHistory = async (sessionId: string) => {
        try {
            setIsLoading(true);
            const data = await assistantApi.getHistory(sessionId);
            setMessages(data.messages || []);
            setCurrentSessionId(sessionId);
            setLanguage(data.language || 'en');
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (msgText: string = inputMsg) => {
        if (!msgText.trim()) return;

        const tempId = `temp-${Date.now()}`;
        const newMsg: ChatMessageItem = {
            id: tempId,
            sender: 'user',
            text: msgText,
            language,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMsg]);
        setInputMsg('');
        setIsLoading(true);

        try {
            const res = await assistantApi.chat(msgText, language, currentSessionId || undefined);

            const assistantMsg: ChatMessageItem = {
                id: `assist-${Date.now()}`,
                sender: 'assistant',
                text: res.reply,
                language: res.language,
                created_at: res.created_at || new Date().toISOString(),
            };

            setMessages(prev => [...prev, assistantMsg]);

            if (!currentSessionId) {
                setCurrentSessionId(res.session_id);
                fetchSessions(); // refresh sidebar
            }

            if (res.suggestions && res.suggestions.length > 0) {
                setSuggestions(res.suggestions);
            }

            // Voice Output - Web Speech API (Auto Play conditionally or just keep it manual)
            // if ('speechSynthesis' in window) {
            //     const utterance = new SpeechSynthesisUtterance(res.reply);
            //     utterance.lang = res.voice_locale || 'en-IN';
            //     window.speechSynthesis.speak(utterance);
            // }

        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden">

            {/* Sidebar - Chat History */}
            <div className="w-1/4 min-w-[280px] border-r border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-900 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-[#E2E8F0] dark:border-gray-800">
                    <button
                        onClick={() => {
                            setCurrentSessionId(null);
                            setMessages([]);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-[#059669] text-white py-2.5 rounded-lg hover:bg-[#047857] transition-colors shadow-sm font-medium"
                    >
                        <Bot size={18} />
                        Starts New Consultation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {sessions.map(session => (
                        <button
                            key={session.session_id}
                            onClick={() => fetchHistory(session.session_id)}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${currentSessionId === session.session_id
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300'
                                : 'bg-white border-transparent hover:bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:text-gray-300'
                                }`}
                        >
                            <div className="font-medium truncate">{session.title}</div>
                            <div className="text-xs mt-1 opacity-70">
                                {new Date(session.created_at).toLocaleDateString()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1120] relative">

                {/* Header */}
                <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900 dark:text-white">AI Farming Assistant</h1>
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Online & Ready
                            </p>
                        </div>
                    </div>

                    <div className="flexItems-center">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                            <Globe size={16} className="text-gray-500 ml-2" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold focus:ring-0 text-black dark:text-gray-300 py-1.5 pr-8 pl-1 cursor-pointer"
                            >
                                {LANGUAGES.map(l => (
                                    <option key={l.code} value={l.code} className="text-black">{l.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-80 max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-500">
                                <Bot size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Hello, {user?.full_name?.split(' ')[0] || 'Farmer'}!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                                I am your multilingual agricultural expert. Ask me about crop planning, fertilizers, diseases, subsidies, and more.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {suggestions.map((sug, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(sug)}
                                        className="px-4 py-2 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-sm"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                        }`}>
                                        {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                                    </div>

                                    <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-[#059669] text-white rounded-tr-sm shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-tl-sm shadow-sm'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                                        {msg.sender === 'assistant' && (
                                            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-2 opacity-70">
                                                <button
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                    title="Play Voice"
                                                    onClick={() => {
                                                        if (!('speechSynthesis' in window)) {
                                                            alert("Your browser does not support text-to-speech. Please use Chrome/Edge.");
                                                            return;
                                                        }
                                                        window.speechSynthesis.cancel();
                                                        const utterance = new SpeechSynthesisUtterance(msg.text);

                                                        // Ensure broad compatibility by setting the lang explicitly and skipping getVoices strict matching
                                                        if (msg.language === 'en') {
                                                            utterance.lang = 'en-US';
                                                        } else {
                                                            utterance.lang = `${msg.language}-IN`;
                                                        }

                                                        utterance.rate = 0.9; // Slightly slower for better comprehension

                                                        utterance.onerror = (e) => console.log("Speech synthesis failed in this browser context:", e);
                                                        window.speechSynthesis.speak(utterance);
                                                    }}
                                                >
                                                    <Mic size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Suggestions block for mid-chat */}
                            {messages.length > 0 && !isLoading && suggestions.length > 0 && messages[messages.length - 1].sender === 'assistant' && (
                                <div className="pl-12 flex flex-wrap gap-2 mt-2">
                                    {suggestions.map((sug, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(sug)}
                                            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-[#0B1120] border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-colors shadow-inner">

                        <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            className="hidden"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setInputMsg(prev => prev + ` [Attached Image: ${file.name}]`);
                                }
                            }}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setInputMsg(prev => prev + ` [Attached Document: ${file.name}]`);
                                }
                            }}
                        />

                        <button
                            className="p-3 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-full shrink-0"
                            onClick={() => imageInputRef.current?.click()}
                            title="Upload Crop Image"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <button
                            className="p-3 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-full shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload Document"
                        >
                            <FileText size={20} />
                        </button>

                        <textarea
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder={`Ask about crop planning in ${LANGUAGES.find(l => l.code === language)?.name}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 scrollbar-hide"
                            rows={1}
                            style={{ minHeight: '48px' }}
                        />

                        <button
                            className={`p-3 transition-colors rounded-full shrink-0 ${isRecording ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900/30' : 'text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                            onClick={() => {
                                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                if (!SpeechRecognition) {
                                    alert("Voice recording is not supported in this browser. Please use Chrome.");
                                    return;
                                }
                                if (isRecording) return; // Prevent overlapping recordings

                                const recognition = new SpeechRecognition();
                                recognition.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
                                recognition.interimResults = false;
                                recognition.maxAlternatives = 1;

                                recognition.onstart = () => setIsRecording(true);
                                recognition.onresult = (event: any) => {
                                    const transcript = event.results[0][0].transcript;
                                    setInputMsg(prev => prev ? prev + " " + transcript : transcript);
                                    setIsRecording(false);
                                };
                                recognition.onerror = (event: any) => {
                                    console.error("Speech recognition error", event.error);
                                    if (event.error !== 'no-speech') {
                                        alert(`Microphone error: ${event.error}`);
                                    }
                                    setIsRecording(false);
                                };
                                recognition.onend = () => setIsRecording(false);
                                recognition.start();
                            }}
                            title="Tap to speak"
                        >
                            <Mic size={20} />
                        </button>

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputMsg.trim() || isLoading}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 ${inputMsg.trim()
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                                : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                }`}
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            AI Farming Assistant can make mistakes. Consider verifying critical agronomic dosages.
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};
