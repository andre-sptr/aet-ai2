import { useState, useRef, useEffect } from 'react';
import { Message, ChatMode } from '@/types';
import { X, User, Volume2, Copy, RotateCw, Check, Pencil, Save, Code, Eye, FileText, MessageCircle, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');
  
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline || !match) {
    return (
      <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="rounded-md overflow-hidden my-4 border border-slate-200 shadow-sm bg-slate-900">
       <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-300 lowercase font-mono">{language}</span>
             
             {language === 'html' && (
                <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-slate-700">
                   <button onClick={() => setViewMode('code')} className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      <Code className="w-3 h-3" /> Code
                   </button>
                   <button onClick={() => setViewMode('preview')} className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      <Eye className="w-3 h-3" /> Preview
                   </button>
                </div>
             )}
          </div>

          <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors">
             {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
             <span>{isCopied ? 'Disalin!' : 'Salin Code'}</span>
          </button>
       </div>

       {viewMode === 'preview' && language === 'html' ? (
          <div className="bg-white h-auto min-h-[200px] border-b border-slate-100 relative">
             <div className="absolute top-0 left-0 right-0 h-6 bg-slate-100 flex items-center px-2 gap-1 border-b border-slate-200">
                <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
                <span className="ml-2 text-[10px] text-slate-400">Browser Preview</span>
             </div>
             <iframe 
               srcDoc={codeContent} 
               className="w-full h-full min-h-[300px] pt-6" 
               title="Preview"
               sandbox="allow-scripts"
             />
          </div>
       ) : (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <SyntaxHighlighter
               style={oneDark}
               language={language}
               PreTag="div"
               customStyle={{ margin: 0, borderRadius: 0, fontSize: '13px', backgroundColor: '#0f172a' }}
               {...props}
            >
               {codeContent}
            </SyntaxHighlighter>
          </div>
       )}
    </div>
  );
};

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      try {
        setError(false);
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'neutral', 
          securityLevel: 'loose',
          fontFamily: 'inherit'
        });
        
        const { svg } = await mermaid.render(idRef.current, chart);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(true);
      }
    };
    const timeout = setTimeout(renderChart, 100);
    return () => clearTimeout(timeout);
  }, [chart]);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 

    if (!svg) return;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `aet_ai-${Date.now()}.svg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="my-4 flex flex-col gap-2">
        <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md font-medium">
          ⚠️ Gagal merender diagram. Kode sumber:
        </div>
        <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="p-4 text-xs text-slate-400 italic animate-pulse">Memproses diagram...</div>;
  }

  return (
    <>
      <div 
        className="my-4 border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer group relative"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
           <span className="font-medium flex items-center gap-1.5">
              Flowchart
           </span>
           <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Zoom
           </span>
        </div>

        <div className="relative max-h-[250px] overflow-hidden bg-slate-50/30">
           <div 
             className="p-6 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity scale-90 origin-top"
             dangerouslySetInnerHTML={{ __html: svg }}
           />
           
           <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
           
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg border border-blue-100 text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" /> Fullscreen
              </button>
           </div>
        </div>
      </div>

      {isOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
        >
           <div 
             className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 text-white z-20"
             onClick={(e) => e.stopPropagation()} 
            >
              <h3 className="font-medium text-sm flex items-center gap-2">
                 <FileText className="w-4 h-4 text-blue-400" /> Viewer Diagram
              </h3>
              
              <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg backdrop-blur-md border border-white/10">
                 <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                 <span className="text-xs font-mono min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                 <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                 <div className="w-px h-4 bg-white/20 mx-1" />
                 <button onClick={() => { setScale(1); setPosition({x:0,y:0}); }} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Reset"><RotateCcw className="w-4 h-4" /></button>
              </div>

              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-200 rounded-lg transition-colors">
                 <X className="w-5 h-5" />
              </button>
           </div>

           <div 
             className="flex-1 overflow-hidden relative cursor-move flex items-center justify-center select-none"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onWheel={handleWheel}
             onClick={(e) => e.stopPropagation()}
           >
              <div 
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  transformOrigin: 'center center'
                }}
                className="bg-white p-10 rounded shadow-2xl min-w-[400px]"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
           </div>

           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
             <div className="px-4 py-2 bg-black/50 text-white/70 text-xs rounded-full backdrop-blur border border-white/5">
                Scroll Zoom • Tahan Geser
             </div>
             <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold rounded-full backdrop-blur shadow-lg pointer-events-auto flex items-center gap-2 transition-colors border border-white/10"
             >
              <Save className="w-3.5 h-3.5" /> Download
             </button>
          </div>
        </div>
      )}
    </>
  );
};

const ImageViewer = ({ src, alt }: { src: string; alt?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.1, Math.min(5, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!src) return null;

  return (
    <>
      <span 
        onClick={() => setIsOpen(true)}
        className="my-4 relative group/gen-image rounded-xl overflow-hidden border border-slate-200 bg-slate-50 inline-block max-w-full cursor-zoom-in hover:shadow-md transition-shadow"
      >
        <img
          src={src}
          alt={alt || 'Generated Image'}
          className="max-w-full h-auto object-cover max-h-[400px]"
          loading="lazy"
        />
        <span className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/gen-image:opacity-100 transition-opacity flex justify-end gap-2">
          <a
            href={src}
            download={`aet_ai-${Date.now()}.png`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 bg-white/20 text-white hover:bg-white/40 rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center"
            title="Download Gambar"
          >
            <Save className="w-4 h-4" />
          </a>
        </span>
      </span>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" /> Image Viewer
            </h3>

            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg backdrop-blur-md border border-white/10">
              <button
                onClick={() => setScale((s) => Math.max(0.1, s - 0.2))}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(5, s + 0.2))}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="flex-1 overflow-hidden relative cursor-move flex items-center justify-center select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                transformOrigin: 'center center',
              }}
              className="relative shadow-2xl"
            >
              <img
                src={src}
                alt={alt}
                className="max-w-none pointer-events-none rounded-sm bg-slate-800"
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
             <div className="px-4 py-2 bg-black/50 text-white/70 text-xs rounded-full backdrop-blur border border-white/5">
                Scroll Zoom • Tahan Geser
             </div>
             <a 
                href={src}
                download={`aet_ai-${Date.now()}.png`}
                className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold rounded-full backdrop-blur shadow-lg pointer-events-auto flex items-center gap-2 transition-colors border border-white/10"
                onClick={(e) => e.stopPropagation()}
             >
                <Save className="w-3.5 h-3.5" /> Download
             </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const VideoViewer = ({ src }: { src: string }) => {
  return (
    <div className="my-4 max-w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm relative group/video">
      <video 
        controls 
        className="w-full h-auto max-h-[400px]"
        src={src}
      >
        Browser tidak mendukung video tag.
      </video>
      <div className="absolute top-2 right-2 opacity-0 group-hover/video:opacity-100 transition-opacity">
         <a 
            href={src}
            download={`aet_ai-${Date.now()}.mp4`}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-full backdrop-blur-md transition-colors border border-white/10"
         >
            <Save className="w-3.5 h-3.5" /> Simpan
         </a>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  mode?: ChatMode;
  onRetry?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onSave?: (id: string, newContent: string) => void;
  onCancel?: () => void;
  isEditable?: boolean;
  isEditing?: boolean; 
  isLast?: boolean;
}

export default function MessageBubble({ 
  message,
  mode = 'daily',
  onRetry, 
  onEdit, 
  onSave, 
  onCancel,
  isEditable, 
  isEditing,
  isLast
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditedText(message.content);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isEditing, message.content]);

  const handleRead = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (isReading) {
        setIsReading(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      
      utterance.onend = () => setIsReading(false);
      
      setIsReading(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const handleSaveClick = () => {
    if (onSave && editedText.trim() !== '') {
      onSave(message.id, editedText);
    }
  };

  const modeGradients: Record<string, string> = {
    coding: 'from-blue-600 to-indigo-600',
    report: 'from-emerald-600 to-teal-600',
    daily: 'from-violet-600 to-purple-600',
  };
  const modeGradient = modeGradients[mode] || 'from-blue-600 to-indigo-600';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group items-end`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm
        ${isUser ? 'bg-slate-200' : `bg-gradient-to-br ${modeGradient}`}`}>
        {isUser ? (
          <User className="w-4 h-4 text-slate-500" />
        ) : (
          mode === 'coding' ? <Code className="w-4 h-4 text-white" /> :
          mode === 'report' ? <FileText className="w-4 h-4 text-white" /> :
          <MessageCircle className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-[85%] ${isEditing ? 'w-full' : 'w-fit'}`}>
        <div className={`px-5 py-4 relative transition-all duration-200
          ${isUser
            ? `bg-gradient-to-br ${modeGradient} text-white rounded-[22px] rounded-br-none shadow-lg`
            : `bg-white text-slate-800 border rounded-[22px] rounded-bl-none hover:shadow-md
               ${isLast ? 'border-blue-100 shadow-sm shadow-blue-50' : 'border-slate-100 shadow-sm'}`
          }`}>
          {message.attachment && (
            <div className="mb-3">
              {message.attachment.type === 'image' ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group/image max-w-sm"
                  onClick={() => setIsImageOpen(true)}
                >
                  <img 
                    src={message.attachment.content} 
                    alt="Attachment" 
                    className="max-w-full h-auto max-h-[300px] object-cover bg-slate-100" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex justify-between items-end">
                    <span className="text-[10px] text-white/90 truncate max-w-[150px] px-1">
                      {message.attachment.fileName}
                    </span>
                    <a href={message.attachment.content} download={message.attachment.fileName} className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm">
                      <Save className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-sm hover:bg-slate-100 transition-colors group/file">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center shadow-sm text-blue-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate" title={message.attachment.fileName}>
                      {message.attachment.fileName}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">
                      {message.attachment.fileName.split('.').pop()} File
                    </p>
                  </div>
                  <a 
                    href={message.attachment.content} 
                    download={message.attachment.fileName}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Save className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="flex flex-col gap-3 w-full min-w-[250px]">
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className={`w-full p-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50
                  ${isUser 
                    ? 'bg-blue-700 text-white placeholder-blue-300 focus:ring-white border border-blue-500' 
                    : 'bg-slate-50 text-slate-800 focus:ring-blue-500 border border-slate-200'}`}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={onCancel}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                    ${isUser 
                      ? 'border-blue-400 hover:bg-blue-500 text-blue-100' 
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveClick}
                  disabled={!editedText.trim()}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95
                    ${isUser 
                      ? 'bg-white text-blue-600 hover:bg-blue-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <Save className="w-3 h-3" />
                  Simpan & Kirim
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[15px] leading-7">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={(value) => value}
                components={{
                  img: ({ src, alt }) => {
                    return <ImageViewer src={src as string} alt={alt} />;
                  },
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1].trim() : ''; 
                    const content = String(children).replace(/\n$/, '');

                    if (!inline && language === 'mermaid') {
                      return <Mermaid chart={content} />;
                    }

                    return (
                      <CodeBlock 
                        inline={inline} 
                        className={className} 
                        {...props}
                      >
                        {children}
                      </CodeBlock>
                    );
                  },
                  ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="pl-1">{children}</li>,
                  p: ({children}) => <p className="mb-3 last:mb-0 whitespace-pre-line">{children}</p>,
                  strong: ({children}) => <span className="font-bold opacity-90">{children}</span>,
                  a: ({ href, children }) => {
                    if (!href) return null;
                    const isVideo = href.startsWith('data:video') || href.endsWith('.mp4');

                    if (isVideo) {
                      return <VideoViewer src={href} />;
                    }
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                        {children}
                      </a>
                    );
                  },
                  h1: ({children}) => <h1 className="text-lg font-bold mb-2 mt-4 pb-2 border-b border-white/20">{children}</h1>,
                  h2: ({children}) => <h2 className="text-base font-bold mb-2 mt-4">{children}</h2>,
                  blockquote: ({children}) => (
                    <blockquote className={`border-l-4 pl-4 py-1 my-3 italic ${isUser ? 'border-white/30 bg-blue-700/30' : 'border-blue-500 bg-blue-50 text-slate-600'}`}>
                      {children}
                    </blockquote>
                  ),
                  table: ({children}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">{children}</table></div>,
                  th: ({children}) => <th className="px-3 py-2 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">{children}</th>,
                  td: ({children}) => <td className="px-3 py-2 whitespace-nowrap text-sm border-b border-slate-100">{children}</td>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {!isEditing && (
            <>
              <div className={`h-px w-full my-3 ${isUser ? 'bg-white/15' : 'bg-slate-100'}`} />
              <div className={`flex items-center gap-3 text-xs font-semibold
                ${isUser ? 'text-white/70 justify-end' : 'text-slate-400'}`}>
                {isUser ? (
                  <>
                    {isEditable && (
                      <button
                        onClick={() => onEdit?.(message)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-150 active:scale-95"
                        title="Edit Pesan"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-150 active:scale-95"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRead}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-all duration-150 active:scale-95
                        ${isReading ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:bg-slate-100 hover:text-blue-600'}`}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isReading ? 'Stop' : 'Baca'}</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 active:scale-95"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                    {isLast && (
                      <button
                        onClick={() => onRetry?.(message)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 active:scale-95"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Ulangi</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {isImageOpen && message.attachment && message.attachment.type === 'image' && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsImageOpen(false);
              }}
            >
              <button 
                onClick={() => setIsImageOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
                <img 
                  src={message.attachment.content} 
                  alt="Full Preview" 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                
                <a 
                  href={message.attachment.content} 
                  download={message.attachment.fileName}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-6 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span className="text-sm font-medium">Download</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1.5 px-1 mt-0.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}