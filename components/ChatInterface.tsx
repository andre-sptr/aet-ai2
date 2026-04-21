'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Message, ChatMode } from '@/types';
import MessageBubble from './MessageBubble';
import { SkeletonMessage } from '@/components/ui/SkeletonCard';
import {
  Camera, Paperclip, X, Send, Loader2, Trash2, ArrowLeft,
  FileText, Code, MessageCircle, Sparkles, Zap, ChevronDown,
  Check, Feather, Bot, Palette, AlertTriangle, Calculator,
  Clock, CloudSun, Coins, CheckSquare, Settings, Square,
  BarChart3, Globe, Ruler, KeyRound, MailCheck, Network,
  Search, Workflow, ChevronUp
} from 'lucide-react';

interface ChatInterfaceProps {
  mode: ChatMode;
  modeTitle: string;
  onBack: () => void;
}

export default function ChatInterface({ mode, modeTitle, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{
    content: string; mimeType: string; type: 'image' | 'file'; fileName: string;
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null);
  const modelsBtnRef = useRef<HTMLButtonElement>(null);

  const STORAGE_KEY = `aet_ai_chat_history_${mode}`;

  // === Mode Config ===
  const MODE_CONFIG = {
    coding: { icon: Code, gradient: 'from-blue-600 to-indigo-600', bg: 'bg-blue-100', text: 'text-blue-600', shadow: 'shadow-blue-200' },
    report: { icon: FileText, gradient: 'from-emerald-600 to-teal-600', bg: 'bg-emerald-100', text: 'text-emerald-600', shadow: 'shadow-emerald-200' },
    daily: { icon: MessageCircle, gradient: 'from-violet-600 to-purple-600', bg: 'bg-violet-100', text: 'text-violet-600', shadow: 'shadow-violet-200' },
  };
  const currentMode = MODE_CONFIG[mode];
  const ModeIcon = currentMode.icon;

  // === Available Tools ===
  const AVAILABLE_TOOLS = [
    { id: 'calculator', name: 'Kalkulator', desc: 'Operasi matematika', icon: Calculator, color: 'text-orange-500 bg-orange-50', group: 'Utilitas' },
    { id: 'time', name: 'Waktu Dunia', desc: 'Cek zona waktu', icon: Clock, color: 'text-violet-500 bg-violet-50', group: 'Utilitas' },
    { id: 'weather', name: 'Cuaca', desc: 'Info cuaca live', icon: CloudSun, color: 'text-sky-500 bg-sky-50', group: 'Data' },
    { id: 'currency', name: 'Kurs Mata Uang', desc: 'Konversi valas', icon: Coins, color: 'text-emerald-500 bg-emerald-50', group: 'Data' },
    { id: 'scraper', name: 'Web Reader', desc: 'Baca konten link', icon: Globe, color: 'text-indigo-500 bg-indigo-50', group: 'Web' },
    { id: 'web_search', name: 'Web Search', desc: 'Link pencarian', icon: Search, color: 'text-blue-600 bg-blue-50', group: 'Web' },
    { id: 'email_validator', name: 'Cek Email', desc: 'Validasi format', icon: MailCheck, color: 'text-red-500 bg-red-50', group: 'Utilitas' },
    { id: 'password_gen', name: 'Password Gen', desc: 'Buat sandi kuat', icon: KeyRound, color: 'text-slate-600 bg-slate-100', group: 'Utilitas' },
    { id: 'flowchart', name: 'Flowchart', desc: 'Alur proses', icon: Workflow, color: 'text-purple-600 bg-purple-50', group: 'AI' },
    { id: 'units', name: 'Konversi Unit', desc: 'Jarak, Berat, Suhu', icon: Ruler, color: 'text-pink-500 bg-pink-50', group: 'Utilitas' },
    { id: 'data_analysis', name: 'Analisis Data', desc: 'Statistik angka', icon: BarChart3, color: 'text-cyan-500 bg-cyan-50', group: 'Data' },
    { id: 'colors', name: 'Cek Warna', desc: 'Hex ↔ RGB', icon: Palette, color: 'text-fuchsia-500 bg-fuchsia-50', group: 'Utilitas' },
  ];

  const toolGroups = ['Data', 'Web', 'AI', 'Utilitas'];

  const toggleTool = (toolId: string) => {
    setActiveTools(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  // === Available Models ===
  const models = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'Standar kecepatan & stabil', icon: Zap, tier: 'Flash' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', desc: 'Tercepat & paling hemat di keluarga 2.5', icon: Feather, tier: 'Lite' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Seimbang antara kecepatan & kemampuan', icon: Zap, tier: 'Flash' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Terbaik untuk tugas kompleks & reasoning mendalam', icon: Sparkles, tier: 'Pro' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash-Lite', desc: 'Cepat & efisien untuk skala besar', icon: Feather, tier: 'Lite' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3.1 Flash', desc: 'Performa frontier, hemat biaya', icon: Zap, tier: 'Flash' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Paling canggih untuk reasoning & agentic kompleks', icon: Sparkles, tier: 'Pro' }
  ];

  const activeModel = models.find(m => m.id === selectedModel) || models[1];
  const ActiveIcon = activeModel.icon;

  const tierColors: Record<string, string> = {
    'Pro': 'bg-violet-100 text-violet-700',
    'Flash': 'bg-blue-100 text-blue-700',
    'Lite': 'bg-slate-100 text-slate-600',
  };

  // === Click Outside Close Dropdowns ===
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isSettingsOpen && toolsRef.current && !toolsRef.current.contains(target) && !toolsBtnRef.current?.contains(target)) {
        setIsSettingsOpen(false);
      }
      if (isModelOpen && modelsRef.current && !modelsRef.current.contains(target) && !modelsBtnRef.current?.contains(target)) {
        setIsModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen, isModelOpen]);

  // === Scroll to bottom ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // === Show/hide scroll to bottom button ===
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // === Load chat history ===
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const hydrated = parsed.map((msg: Message & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(hydrated);
      } catch {
        initializeGreeting();
      }
    } else {
      initializeGreeting();
    }
  }, [mode]);

  // === Save chat history ===
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const initializeGreeting = () => {
    const greetingMap: Record<ChatMode, string> = {
      daily: 'Halo! Saya siap menemani aktivitas harianmu. Ada yang bisa saya bantu?',
      report: 'Halo! Saya siap membantu penulisan akademik dan analisis laporan Anda.',
      coding: 'Halo! Saya siap membantu coding, debugging, dan penjelasan konsep teknis.',
    };
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: greetingMap[mode],
      timestamp: new Date()
    }]);
  };

  // === Auto-resize textarea ===
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // === Core: Send to AI ===
  const processMessageToAI = async (currentHistory: Message[]) => {
    setIsLoading(true);
    try {
      const apiMessages = currentHistory.slice(
        currentHistory.findIndex(msg => msg.role === 'user')
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          mode,
          model: selectedModel,
          tools: activeTools,
          clientInfo: {
            time: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' }),
            utcTime: new Date().toUTCString(),
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error: unknown) {
      const err = error as Error;
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Maaf, terjadi kesalahan: **${err.message}**. Silakan coba lagi.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // === Image Compression ===
  const compressImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1280;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

  // === File Handler ===
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let mimeType = file.type;
      let base64Content = '';

      if (file.type.startsWith('image/')) {
        base64Content = await compressImage(file);
        mimeType = 'image/jpeg';
      } else {
        if (file.size > 5 * 1024 * 1024) { alert('Ukuran file dokumen terlalu besar (Max 5MB)'); return; }
        base64Content = await fileToBase64(file);
      }

      // Try upload to Vercel Blob
      try {
        let fileToUpload: Blob | File = file;
        if (file.type.startsWith('image/')) {
          const res = await fetch(base64Content);
          fileToUpload = await res.blob();
        }
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST', body: fileToUpload,
        });
        if (!response.ok) console.warn('Gagal upload ke Vercel Blob, menggunakan mode lokal.');
      } catch (uploadError) {
        console.warn('Upload error:', uploadError);
      }

      setAttachment({
        content: base64Content,
        mimeType,
        type: mimeType.startsWith('image/') ? 'image' : 'file',
        fileName: file.name
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Gagal memproses file. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  // === Send Message ===
  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      attachment: attachment ? { ...attachment } : undefined
    };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setAttachment(null);
    if (inputRef.current) inputRef.current.style.height = 'auto';
    await processMessageToAI(newHistory);
  };

  const handleReload = async () => {
    if (isLoading || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    const history = lastMsg.role === 'assistant' ? messages.slice(0, -1) : [...messages];
    setMessages(history);
    await processMessageToAI(history);
  };

  const handleEditStart = (message: Message) => setEditingMessageId(message.id);
  const handleEditCancel = () => setEditingMessageId(null);

  const handleEditSave = async (id: string, newContent: string) => {
    setEditingMessageId(null);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return;
    const newHistory = messages.slice(0, index + 1);
    newHistory[index] = { ...newHistory[index], content: newContent };
    setMessages(newHistory);
    await processMessageToAI(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const confirmClearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    initializeGreeting();
    setIsDeleteModalOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canSend = (input.trim() || !!attachment) && !isLoading;

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* === HEADER === */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-slate-100/80">
        <div className="max-w-5xl mx-auto px-4 h-[60px] flex items-center justify-between gap-3">

          {/* Left: Back + Mode Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentMode.gradient} shadow-sm`}>
                <ModeIcon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-slate-900 truncate">{modeTitle}</h1>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isLoading ? 'Memproses...' : 'Aktif'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Model badge + Clear */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <ActiveIcon className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-[90px]">{activeModel.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${tierColors[activeModel.tier]}`}>{activeModel.tier}</span>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
              title="Hapus Percakapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* === MESSAGES AREA === */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar pt-[76px] pb-2"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-5">

          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br ${currentMode.gradient} shadow-xl mb-4`}>
                <ModeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Mulai percakapan</h3>
              <p className="text-sm text-slate-400 max-w-xs">Ketik pesan pertama Anda di bawah untuk memulai sesi {modeTitle}.</p>
            </div>
          )}

          {/* Messages */}
          {(() => {
            const lastUserMessageId = messages.slice().reverse().find(m => m.role === 'user')?.id;
            return messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-slide-down"
                style={{ animationDelay: `${Math.min(index * 15, 150)}ms` }}
              >
                <MessageBubble
                  message={message}
                  mode={mode}
                  onRetry={handleReload}
                  onEdit={handleEditStart}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                  isEditable={message.id === lastUserMessageId}
                  isEditing={message.id === editingMessageId}
                  isLast={index === messages.length - 1}
                />
              </div>
            ));
          })()}

          {/* Loading Skeleton */}
          {isLoading && <SkeletonMessage />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* === SCROLL TO BOTTOM FAB === */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-[120px] right-5 z-40 w-9 h-9 bg-white border border-slate-200 text-slate-600 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-200 flex items-center justify-center animate-bounce-in"
          aria-label="Scroll ke bawah"
        >
          <ChevronUp className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* === INPUT AREA === */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-safe-bottom pb-4 pt-3 px-4">
        <div className="max-w-4xl mx-auto relative">

          {/* Attachment Preview */}
          {attachment && (
            <div className="mb-3 animate-slide-up">
              <div className="inline-flex items-center gap-3 p-2 pr-4 bg-white rounded-2xl border border-slate-200 shadow-lg">
                <div className="w-11 h-11 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                  {attachment.type === 'image' ? (
                    <img src={attachment.content} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex flex-col min-w-[100px] max-w-[180px]">
                  <p className="text-xs font-semibold text-slate-700 truncate">{attachment.fileName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">
                    {attachment.type === 'image' ? 'Image' : attachment.fileName.split('.').pop() || 'File'}
                  </p>
                </div>
                <button
                  onClick={() => setAttachment(null)}
                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors ml-auto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Hidden file inputs */}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*, application/pdf" />
          <input type="file" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" capture="environment" />

          {/* Main Input Container */}
          <div className={`relative bg-white rounded-2xl border border-slate-200 input-glow transition-all duration-200 flex flex-col`}>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Kirim pesan ke ${modeTitle}...`}
              className="flex-1 bg-transparent px-4 pt-3.5 pb-1 focus:outline-none text-slate-800 placeholder:text-slate-400 custom-scrollbar resize-none text-sm leading-relaxed w-full"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '160px' }}
              disabled={isLoading}
            />

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
              <div className="flex items-center gap-0.5">
                {/* File Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-150 active:scale-95"
                  title="Upload File/Gambar"
                  disabled={isLoading}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Camera */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-150 active:scale-95"
                  title="Kamera"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Tools Settings */}
                <div className="relative">
                  <button
                    ref={toolsBtnRef}
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`relative p-2 rounded-xl transition-all duration-150 active:scale-95
                      ${isSettingsOpen ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                    title="Tools AI"
                    disabled={isLoading}
                  >
                    <Settings className={`w-4 h-4 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : ''}`} />
                    {activeTools.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                    )}
                  </button>

                  {isSettingsOpen && (
                    <div
                      ref={toolsRef}
                      className="absolute bottom-full left-0 mb-2 w-72 p-2 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 z-[9999] animate-scale-in origin-bottom-left"
                    >
                      <div className="px-3 py-2 border-b border-slate-50 mb-1 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktifkan Tools AI</h3>
                        {activeTools.length > 0 && (
                          <button
                            onClick={() => setActiveTools([])}
                            className="text-[10px] text-red-400 hover:text-red-600 font-medium transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar p-1">
                        {toolGroups.map(group => {
                          const groupTools = AVAILABLE_TOOLS.filter(t => t.group === group);
                          return (
                            <div key={group}>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1 mb-1">{group}</p>
                              <div className="space-y-0.5">
                                {groupTools.map((tool) => {
                                  const Icon = tool.icon;
                                  const isActive = activeTools.includes(tool.id);
                                  return (
                                    <button
                                      key={tool.id}
                                      onClick={() => toggleTool(tool.id)}
                                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-150 group
                                        ${isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}
                                    >
                                      <div className={`transition-colors flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                                        {isActive ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                      </div>
                                      <div className={`p-1.5 rounded-lg ${tool.color} flex-shrink-0`}>
                                        <Icon className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="flex-1 text-left min-w-0">
                                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{tool.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{tool.desc}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Model selector + Send */}
              <div className="flex items-center gap-2">
                {/* Model Selector */}
                <div className="relative">
                  <button
                    ref={modelsBtnRef}
                    onClick={() => setIsModelOpen(!isModelOpen)}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border active:scale-95
                      ${isModelOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'}`}
                    title="Ganti Model AI"
                  >
                    <span className="hidden sm:inline truncate max-w-[80px]">{activeModel.name.replace('Gemini ', '')}</span>
                    <span className="sm:hidden">Model</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isModelOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isModelOpen && (
                    <div
                      ref={modelsRef}
                      className="absolute bottom-full right-0 mb-2 w-68 p-1.5 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 z-[9999] animate-scale-in origin-bottom-right"
                      style={{ minWidth: '260px' }}
                    >
                      <div className="px-3 py-2 mb-1 border-b border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Model AI</span>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg font-semibold">{modeTitle}</span>
                      </div>

                      <div className="space-y-0.5 max-h-60 overflow-y-auto custom-scrollbar">
                        {models.map((m) => {
                          const Icon = m.icon;
                          const isSelected = selectedModel === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => { setSelectedModel(m.id); setIsModelOpen(false); }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150
                                ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}`}
                            >
                              <div className={`p-2 rounded-lg flex-shrink-0 transition-colors
                                ${isSelected ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{m.name}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${tierColors[m.tier]}`}>{m.tier}</span>
                                  {isSelected && <Check className="w-3 h-3 text-blue-500 flex-shrink-0 ml-auto" />}
                                </div>
                                <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>{m.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-1.5 px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 text-center">
                          Gunakan <strong>2.5 Pro</strong> untuk tugas kompleks & analisis mendalam.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-95
                    ${canSend
                      ? `bg-gradient-to-br ${currentMode.gradient} text-white shadow-lg ${currentMode.shadow} hover:opacity-90 hover:scale-105`
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  aria-label="Kirim Pesan"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 text-center">AI dapat melakukan kesalahan. Mohon verifikasi informasi penting.</p>
        </div>
      </div>

      {/* === DELETE MODAL === */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-bounce-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Percakapan?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Semua riwayat chat di sesi ini akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmClearChat}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}