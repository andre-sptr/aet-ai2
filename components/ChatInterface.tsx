'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Message, ChatMode } from '@/types';
import MessageBubble from './MessageBubble';
import { Camera, Paperclip, X, Send, Loader2, Trash2, ArrowLeft, FileText, Code, MessageCircle, Sparkles, Zap, ChevronDown, Check, Feather, Image as ImageIcon, Bot, Palette, Video, AlertTriangle, Calculator, Clock, CloudSun, Coins, CheckSquare, Settings, Square, BarChart3, Globe, Ruler, KeyRound, MailCheck, Network, Search, Workflow } from 'lucide-react';

interface ChatInterfaceProps {
  mode: ChatMode;
  modeTitle: string;
  onBack: () => void;
}

export default function ChatInterface({ mode, modeTitle, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ content: string; mimeType: string; type: 'image' | 'file'; fileName: string; } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini/gemini-2.5-flash');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const STORAGE_KEY = `aet_ai_chat_history_${mode}`;
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null);
  const modelsBtnRef = useRef<HTMLButtonElement>(null);

  const AVAILABLE_TOOLS = [
    {
      id: 'calculator',
      name: 'Kalkulator',
      desc: 'Operasi matematika',
      icon: Calculator,
      color: 'text-orange-500 bg-orange-50'
    },
    {
      id: 'time',
      name: 'Waktu Dunia',
      desc: 'Cek zona waktu',
      icon: Clock,
      color: 'text-violet-500 bg-violet-50'
    },
    {
      id: 'weather',
      name: 'Cuaca',
      desc: 'Info cuaca live',
      icon: CloudSun,
      color: 'text-sky-500 bg-sky-50'
    },
    {
      id: 'currency',
      name: 'Kurs Mata Uang',
      desc: 'Konversi valas',
      icon: Coins,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 'scraper',
      name: 'Web Reader',
      desc: 'Baca konten link',
      icon: Globe,
      color: 'text-indigo-500 bg-indigo-50'
    },
    {
      id: 'web_search',
      name: 'Web Search',
      desc: 'Link pencarian',
      icon: Search,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'email_validator',
      name: 'Cek Email',
      desc: 'Validasi format',
      icon: MailCheck,
      color: 'text-red-500 bg-red-50'
    },
    {
      id: 'password_gen',
      name: 'Password Gen',
      desc: 'Buat sandi kuat',
      icon: KeyRound,
      color: 'text-slate-600 bg-slate-100'
    },
    {
      id: 'flowchart',
      name: 'Flowchart',
      desc: 'Alur proses',
      icon: Workflow,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'units',
      name: 'Konversi Unit',
      desc: 'Jarak, Berat, Suhu',
      icon: Ruler,
      color: 'text-pink-500 bg-pink-50'
    },
    {
      id: 'data_analysis',
      name: 'Analisis Data',
      desc: 'Statistik angka',
      icon: BarChart3,
      color: 'text-cyan-500 bg-cyan-50'
    },
    {
      id: 'colors',
      name: 'Cek Warna',
      desc: 'Hex <-> RGB',
      icon: Palette,
      color: 'text-fuchsia-500 bg-fuchsia-50'
    }
  ];

  const toggleTool = (toolId: string) => {
    setActiveTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const models = [
    {
      id: 'gemini/gemini-3-pro-preview',
      name: 'Gemini 3 Pro',
      desc: 'Penalaran logika tercanggih',
      icon: Sparkles
    },
    {
      id: 'gemini/gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      desc: 'Terbaik untuk tugas kompleks',
      icon: Sparkles
    },
    {
      id: 'gemini/gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      desc: 'Cepat, ringan & serbaguna',
      icon: Zap
    },
    {
      id: 'gemini/gemini-2.5-flash-lite',
      name: 'Gemini 2.5 Flash Lite',
      desc: 'Sangat hemat & responsif',
      icon: Feather
    },
    {
      id: 'gemini/gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      desc: 'Standar kecepatan & stabil',
      icon: Zap
    },
    {
      id: 'gemini/gemini-2.0-flash-lite',
      name: 'Gemini 2.0 Flash Lite',
      desc: 'Opsi paling efisien',
      icon: Feather
    },
  ];

  const activeModel = models.find(m => m.id === selectedModel);
  const ActiveIcon = activeModel?.icon || Zap;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (isSettingsOpen &&
        toolsRef.current && !toolsRef.current.contains(target) &&
        !toolsBtnRef.current?.contains(target)) {
        setIsSettingsOpen(false);
      }

      if (isModelOpen &&
        modelsRef.current && !modelsRef.current.contains(target) &&
        !modelsBtnRef.current?.contains(target)) {
        setIsModelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, isModelOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const hydratedHistory = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(hydratedHistory);
      } catch (error) {
        console.error("Gagal memuat riwayat chat:", error);
        initializeGreeting();
      }
    } else {
      initializeGreeting();
    }
  }, [mode]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, mode]);

  const initializeGreeting = () => {
    const greetingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Halo! Saya asisten AI Himpunan Mahasiswa AET PCR. Ada yang bisa saya bantu?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

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
            time: new Date().toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'medium'
            }),
            utcTime: new Date().toUTCString(),
          }
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_DIMENSION = 1280;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

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
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file dokumen terlalu besar (Max 5MB)');
          setIsLoading(false);
          return;
        }
        base64Content = await fileToBase64(file);
      }

      let publicUrl = '';
      try {
        let fileToUpload: Blob | File = file;
        if (file.type.startsWith('image/')) {
          const res = await fetch(base64Content);
          fileToUpload = await res.blob();
        }

        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: fileToUpload,
        });

        if (response.ok) {
          const newBlob = await response.json();
          publicUrl = newBlob.url;
        } else {
          console.warn("Gagal upload ke Vercel Blob, menggunakan mode lokal.");
        }
      } catch (uploadError) {
        console.warn("Upload error:", uploadError);
      }

      setAttachment({
        content: base64Content,
        mimeType: mimeType,
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
    const lastMessage = messages[messages.length - 1];
    let historyToRetry = [...messages];
    if (lastMessage.role === 'assistant') {
      historyToRetry.pop();
    }
    setMessages(historyToRetry);
    await processMessageToAI(historyToRetry);
  };

  const handleEditStart = (message: Message) => {
    setEditingMessageId(message.id);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
  };

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

  const handleClearChat = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmClearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    const greetingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Halo! Saya asisten AI Himpunan Mahasiswa AET PCR. Ada yang bisa saya bantu?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${mode === 'coding' ? 'bg-blue-100 text-blue-600' :
                  mode === 'report' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-violet-100 text-violet-600'}`}
              >
                {mode === 'coding' ? (
                  <Code className="w-4 h-4" />
                ) : mode === 'report' ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">{modeTitle}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs text-slate-500">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-full">
              <ActiveIcon className="w-3.5 h-3.5 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-700 leading-none">
                  {activeModel?.name}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
              title="Hapus Percakapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-4 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
          {(() => {
            const lastUserMessageId = messages.slice().reverse().find(m => m.role === 'user')?.id;

            return messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-slide-down"
                style={{ animationDelay: `${index * 20}ms` }}
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

          {isLoading && (
            <div className="flex gap-4 animate-slide-down">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
                {mode === 'coding' ? (
                  <Code className="w-4 h-4" />
                ) : mode === 'report' ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-sm border border-slate-100">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border-t border-slate-100 pb-6 pt-4 px-4">
        <div className="max-w-4xl mx-auto relative">
          {attachment && (
            <div className="absolute -top-20 left-0 right-0 px-1 animate-slide-up">
              <div className="inline-flex items-center gap-3 p-2 pr-4 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                  {attachment.type === 'image' ? (
                    <img src={attachment.content} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                <div className="flex flex-col min-w-[120px] max-w-[200px]">
                  <p className="text-sm font-semibold text-slate-700 truncate" title={attachment.fileName}>
                    {attachment.fileName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">
                    {attachment.type === 'image' ? 'Image' : attachment.fileName.split('.').pop() || 'File'}
                  </p>
                </div>

                <button
                  onClick={() => setAttachment(null)}
                  className="p-1.5 ml-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*, application/pdf"
          />

          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
            capture="environment"
          />

          <div className="relative bg-white rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)] border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-shadow flex items-end">
            <div className="flex items-center gap-1 pl-3 pb-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Upload File"
                disabled={isLoading}
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Kamera"
                disabled={isLoading}
              >
                <Camera className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  ref={toolsBtnRef}
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-xl transition-colors transition-transform active:scale-95
                    ${isSettingsOpen
                      ? 'bg-slate-100 text-slate-700'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}
                  `}
                  title="Tools Settings"
                  disabled={isLoading}
                >
                  <Settings className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : ''}`} />
                  {activeTools.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
                  )}
                </button>

                {isSettingsOpen && (
                  <>
                    <div ref={toolsRef} className="absolute bottom-full left-0 mb-3 w-64 p-2 bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-100 z-[9999] animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                      <div className="px-3 py-2 border-b border-slate-50 mb-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Aktifkan Tools AI
                        </h3>
                      </div>

                      <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {AVAILABLE_TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const isActive = activeTools.includes(tool.id);

                          return (
                            <button
                              key={tool.id}
                              onClick={() => toggleTool(tool.id)}
                              className={`
                                w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group
                                ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50'}
                              `}
                            >
                              <div className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                                {isActive ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                              </div>

                              <div className="flex items-center gap-3 flex-1 text-left">
                                <div className={`p-1.5 rounded-lg ${tool.color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                                    {tool.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {tool.desc}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {activeTools.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-50">
                          <button
                            onClick={() => { setActiveTools([]); setIsSettingsOpen(false); }}
                            className="w-full py-1.5 text-[10px] font-medium text-slate-400 hover:text-red-500 transition-colors"
                          >
                            Reset Semua Tools
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1 bg-transparent px-4 py-4 focus:outline-none text-slate-800 placeholder:text-slate-400 custom-scrollbar resize-none overflow-y-auto max-h-[200px]"
              rows={1}
              style={{ minHeight: '60px' }}
              disabled={isLoading}
            />

            <div className="pr-3 pb-3 flex items-center gap-2">
              <div className="relative">
                <button
                  ref={modelsBtnRef}
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  disabled={isLoading}
                  className={`
                    group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border
                    ${isModelOpen
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}
                  `}
                  title="Ganti Model AI"
                >
                  <span className="opacity-90">Model</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 group-hover:text-slate-600
                      ${isModelOpen ? 'rotate-180' : ''}
                    `}
                  />
                </button>

                {isModelOpen && (
                  <>
                    <div ref={modelsRef} className="absolute bottom-full right-0 mb-3 w-64 p-1.5 bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-100 z-[9999] animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
                      <div className="px-3 py-2 mb-1 border-b border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Pilih Kecerdasan AI
                        </span>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-medium">
                          {modeTitle}
                        </span>
                      </div>

                      <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                        {models.map((m) => {
                          const Icon = m.icon;
                          const isSelected = selectedModel === m.id;

                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModel(m.id);
                                setIsModelOpen(false);
                              }}
                              className={`
                                w-full flex items-start gap-3 p-2 rounded-xl text-left transition-all duration-200 group
                                ${isSelected
                                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                  : 'hover:bg-slate-50 text-slate-700'}
                              `}
                            >
                              <div className={`
                                mt-0.5 p-2 rounded-lg transition-colors shadow-sm flex-shrink-0
                                ${isSelected ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100'}
                              `}>
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {m.name}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                                </div>
                                <p className={`text-[10px] mt-0.5 leading-relaxed line-clamp-2 ${isSelected ? 'text-blue-600/80' : 'text-slate-400'}`}>
                                  {m.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[9px] text-slate-400 text-center leading-tight">
                          Gunakan <strong>2.5 Pro</strong> untuk tugas kompleks dan analisis mendalam.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleSend}
                disabled={(!input.trim() && !attachment) || isLoading}
                className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center ${(!input.trim() && !attachment) || isLoading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">AI dapat melakukan kesalahan. Mohon verifikasi informasi penting.</p>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Hapus Percakapan?
              </h3>

              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Anda akan menghapus semua riwayat chat di sesi ini. Tindakan ini tidak dapat dibatalkan.
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
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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