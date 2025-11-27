import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Folder, File, Image, Film, Music, Code, Archive, Box, ArrowRight, 
  Upload, X, Maximize2, Minimize2, Play, Pause, FileText, Layers, 
  Terminal, Shield, ShieldAlert 
} from 'lucide-react';

/**
 * UTILITIES
 */
const CATEGORIES = {
  Images: { icon: Image, exts: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'bmp', 'tiff', 'svg', 'raw', 'ico'] },
  Videos: { icon: Film, exts: ['mp4', 'mkv', 'mov', 'avi', 'flv', 'wmv', 'webm', 'm4v'] },
  GIFs: { icon: Layers, exts: ['gif'] },
  Documents: { icon: FileText, exts: ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls', 'pptx', 'ppt', 'csv', 'rtf', 'odt'] },
  Audio: { icon: Music, exts: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'] },
  Archives: { icon: Archive, exts: ['zip', 'rar', '7z', 'tar', 'gz', 'iso'] },
  Executables: { icon: Box, exts: ['exe', 'msi', 'bat', 'apk'] },
  Code: { icon: Code, exts: ['py', 'js', 'html', 'css', 'cpp', 'java', 'sql', 'json'] },
};

const THEME = {
  bg: 'bg-[#1a120b]', 
  text: 'text-[#eaddcf]', 
  accent: 'text-[#d44d38]', 
  accentBg: 'bg-[#d44d38]',
  border: 'border-[#3e3228]', 
  paper: 'bg-[#261f1a]', 
  overlay: 'bg-[#1a120b]/90',
};

// Hook for handling file URLs safely
const useObjectUrl = (file) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
};

// Helper for formatting time
const formatTime = (time) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * COMPONENTS
 */

const GrainOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
    <svg className='h-full w-full'>
      <filter id='noise'>
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch' />
      </filter>
      <rect width='100%' height='100%' filter='url(#noise)' />
    </svg>
  </div>
);

const MonteButton = ({ children, onClick, primary = false, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      relative overflow-hidden px-8 py-3 font-serif tracking-widest uppercase transition-all duration-300
      border border-[#eaddcf]/20 hover:border-[#d44d38] group
      ${primary ? 'bg-[#d44d38] text-[#1a120b] font-bold hover:bg-[#b03a28]' : 'hover:bg-[#eaddcf]/5'}
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </button>
);

// Custom Video Player Component
const CustomVideoPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    if (videoRef.current) {
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  return (
    <div 
      className="relative group w-full h-full flex items-center justify-center bg-black overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video 
        ref={videoRef}
        src={url}
        className="max-h-full max-w-full shadow-2xl cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      />

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
          <div className="p-6 rounded-full border border-[#d44d38] bg-[#1a120b]/80 text-[#d44d38] animate-[pulse_3s_infinite]">
            <Play size={48} fill="currentColor" />
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className={`
        absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-6 py-6 transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Timeline */}
        <div 
          className="w-full h-1.5 bg-[#3e3228] cursor-pointer mb-4 rounded-full overflow-hidden group/timeline relative"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-[#d44d38] relative" 
            style={{ width: `${progress}%` }}
          >
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#eaddcf] rounded-full shadow opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
          </div>
          <div className="absolute inset-0 opacity-0 group-hover/timeline:opacity-20 bg-white transition-opacity" />
        </div>

        <div className="flex items-center justify-between font-mono text-xs tracking-wider text-[#eaddcf]">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-[#d44d38] transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="text-[#8c7b70]">HD REPLAY</div>
        </div>
      </div>
    </div>
  );
};

// File Viewer Component (The "Engine")
const FileViewer = ({ file, onClose }) => {
  const url = useObjectUrl(file);
  const type = file?.type || '';
  const ext = file?.name.split('.').pop().toLowerCase();
  
  const isVideo = type.startsWith('video');
  const isAudio = type.startsWith('audio');
  const isImage = type.startsWith('image');
  const isPdf = type === 'application/pdf';
  const isHtml = ext === 'html' || ext === 'htm';
  const isCode = CATEGORIES.Code.exts.includes(ext) || type.startsWith('text');

  // HTML Execution State
  const [runHtml, setRunHtml] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(true);

  // Read content for Code view
  const [codeContent, setCodeContent] = useState(null);

  useEffect(() => {
    if (isCode || isHtml) {
      const reader = new FileReader();
      reader.onload = (e) => setCodeContent(e.target.result);
      reader.readAsText(file);
    }
  }, [file, isCode, isHtml]);

  if (!url) return <div className="text-center p-10 animate-pulse text-[#d44d38]">Deciphering...</div>;

  return (
    <div className="relative w-full h-full flex flex-col bg-black/50 backdrop-blur-md rounded-sm border border-[#3e3228] overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3e3228] bg-[#1a120b] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
           <h3 className="font-serif text-lg truncate text-[#eaddcf] uppercase tracking-wider">{file.name}</h3>
           {isHtml && (
             <div className="flex items-center gap-2 ml-4 px-2 py-1 bg-[#261f1a] rounded border border-[#3e3228]">
                <button 
                  onClick={() => setRunHtml(!runHtml)}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 transition-colors ${runHtml ? 'text-[#d44d38]' : 'text-[#8c7b70] hover:text-[#eaddcf]'}`}
                >
                  {runHtml ? <Code size={14}/> : <Play size={14}/>}
                  {runHtml ? 'View Source' : 'Run Code'}
                </button>
                {runHtml && (
                  <button 
                    onClick={() => setSandboxMode(!sandboxMode)}
                    className="border-l border-[#3e3228] pl-2 text-xs text-[#8c7b70] hover:text-[#d44d38]"
                    title={sandboxMode ? "Sandbox Active" : "Sandbox Disabled"}
                  >
                    {sandboxMode ? <Shield size={14}/> : <ShieldAlert size={14}/>}
                  </button>
                )}
             </div>
           )}
        </div>
        <button onClick={onClose} className="p-1 text-[#8c7b70] hover:text-[#d44d38] transition-colors"><X size={20} /></button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#0d0907] relative">
        {isVideo && (
          <CustomVideoPlayer url={url} />
        )}

        {isAudio && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d44d38] blur-3xl opacity-20 animate-pulse" />
              <Music size={64} className="text-[#eaddcf] relative z-10" />
            </div>
            <audio src={url} controls className="w-full max-w-lg contrast-[0.8] sepia-[0.5]" />
          </div>
        )}

        {isImage && (
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            <img src={url} alt="preview" className="max-h-full max-w-full object-contain shadow-2xl" />
          </div>
        )}

        {isPdf && (
          <iframe src={url} title="PDF" className="w-full h-full border-none" />
        )}

        {isHtml && runHtml && (
           <iframe 
             title="preview"
             src={url} 
             className="w-full h-full bg-white"
             sandbox={sandboxMode ? "allow-scripts" : "allow-scripts allow-same-origin allow-forms"}
           />
        )}

        {((isCode && !isHtml) || (isHtml && !runHtml)) && (
          <div className="w-full h-full text-left p-6 bg-[#1a120b] font-mono text-xs overflow-auto custom-scrollbar">
            <p className="mb-4 text-[#5c4d44] border-b border-[#3e3228] pb-2 flex justify-between">
              <span>// Source Code Preview</span>
              <span>{file.type}</span>
            </p>
            <pre className="text-[#eaddcf] whitespace-pre-wrap leading-relaxed opacity-90">
              {codeContent || "Loading binary sequence..."}
            </pre>
          </div>
        )}

        {!isVideo && !isAudio && !isImage && !isPdf && !isCode && !isHtml && (
          <div className="text-center space-y-6 animate-[fadeInUp_0.5s_ease-out]">
             <div className="w-24 h-24 mx-auto border border-[#3e3228] flex items-center justify-center rounded-full bg-[#1a120b]">
               <Box size={40} className="text-[#d44d38]" />
             </div>
             <div>
               <p className="font-serif text-2xl text-[#eaddcf] tracking-widest mb-2">ENCRYPTED DATA</p>
               <p className="text-sm text-[#8c7b70] font-mono">Format: {ext.toUpperCase()} // Binary Preview Unavailable</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Working Page (The Vault)
const VaultPage = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  // Keyboard Shortcut for Import (Ctrl+I)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sorting logic
  const filteredFiles = useMemo(() => {
    if (activeCategory === 'All') return files;
    const catData = CATEGORIES[activeCategory];
    return files.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return catData.exts.includes(ext);
    });
  }, [files, activeCategory]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...droppedFiles, ...prev]);
  };

  const handleUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...uploadedFiles, ...prev]);
  };

  // Helper to switch category AND close current viewer
  const switchCategory = (category) => {
    setActiveCategory(category);
    setViewingFile(null); // This closes the viewer automatically
  };

  return (
    <div className={`h-screen flex flex-col ${THEME.bg} ${THEME.text} overflow-hidden font-sans`}>
      {/* Top Bar */}
      <header className="h-16 border-b border-[#3e3228] flex items-center justify-between px-6 bg-[#1a120b] shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="hover:text-[#d44d38] transition-colors font-serif italic text-lg opacity-70 hover:opacity-100">
             ← Exit Vault
           </button>
           <h2 className="font-serif text-2xl tracking-widest border-l border-[#3e3228] pl-4 text-[#eaddcf]">ARCHIVES</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 hover:text-[#d44d38] transition-colors group">
            <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform"/>
            <span className="uppercase text-xs tracking-widest font-bold">Import Asset (Ctrl+I)</span>
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleUpload} 
            />
          </label>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 border-r border-[#3e3228] bg-[#150f0a] flex flex-col p-4 gap-2 overflow-y-auto shrink-0 z-30">
          <div className="pb-2 mb-2 border-b border-[#3e3228]/50">
            <h3 className="text-xs font-mono text-[#5c4d44] mb-2 pl-4 tracking-widest">FILTERS</h3>
            <button 
              onClick={() => switchCategory('All')}
              className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-300 flex items-center justify-between group ${activeCategory === 'All' ? 'bg-[#3e3228] text-[#eaddcf]' : 'text-[#8c7b70] hover:text-[#eaddcf]'}`}
            >
              <span className="font-serif tracking-wide">All Materials</span>
              <span className="text-xs opacity-50 font-mono">{files.length}</span>
            </button>
          </div>
          
          {Object.entries(CATEGORIES).map(([name, data]) => {
            const Icon = data.icon;
            const count = files.filter(f => data.exts.includes(f.name.split('.').pop().toLowerCase())).length;
            const isActive = activeCategory === name;
            
            return (
              <button
                key={name}
                onClick={() => switchCategory(name)}
                className={`
                  w-full text-left px-4 py-3 rounded-sm transition-all duration-200 flex items-center justify-between
                  ${isActive ? 'bg-[#261f1a] text-[#d44d38] border-l-2 border-[#d44d38]' : 'text-[#8c7b70] hover:bg-[#1a120b] hover:text-[#eaddcf]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? "animate-pulse" : ""}/>
                  <span className="text-sm uppercase tracking-wider">{name}</span>
                </div>
                {count > 0 && <span className="text-xs bg-[#3e3228] px-1.5 py-0.5 rounded text-[#eaddcf] font-mono">{count}</span>}
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main 
          className="flex-1 relative flex flex-col"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {/* Background File Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#1a120b] relative custom-scrollbar">
            
            {/* Empty State */}
            {files.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                <div className="w-64 h-64 border-2 border-dashed border-[#3e3228] rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <div className="w-48 h-48 border border-[#3e3228] rounded-full" />
                </div>
                <p className="mt-8 font-serif text-2xl tracking-widest text-[#8c7b70]">AWAITING INPUT</p>
                <p className="text-sm font-mono mt-2 text-[#5c4d44]">Drag & Drop classified documents here</p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file, idx) => {
                const ext = file.name.split('.').pop().toLowerCase();
                let CatIcon = File;
                Object.values(CATEGORIES).forEach(cat => {
                   if (cat.exts.includes(ext)) CatIcon = cat.icon;
                });

                return (
                  <div 
                    key={idx}
                    onClick={() => setViewingFile(file)}
                    className="
                      group relative aspect-square bg-[#261f1a] border border-[#3e3228] p-4 flex flex-col items-center justify-center 
                      cursor-pointer hover:border-[#d44d38] hover:bg-[#2a221d] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                    "
                  >
                    <div className="mb-3 text-[#8c7b70] group-hover:text-[#d44d38] transition-colors">
                      <CatIcon size={32} strokeWidth={1.5} />
                    </div>
                    <p className="text-center text-xs font-mono text-[#eaddcf] line-clamp-2 px-2 break-all group-hover:text-white transition-colors">
                      {file.name}
                    </p>
                    <span className="absolute top-2 right-2 text-[10px] text-[#5c4d44] font-bold uppercase border border-[#3e3228] px-1">{ext}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragging && (
             <div className="absolute inset-0 bg-[#d44d38]/10 backdrop-blur-sm border-4 border-dashed border-[#d44d38] z-40 flex items-center justify-center">
               <p className="font-serif text-3xl text-[#eaddcf] bg-[#1a120b] px-8 py-4 border border-[#d44d38] shadow-2xl">RELEASE TO DEPOSIT</p>
             </div>
          )}

          {/* Viewer Overlay */}
          {viewingFile && (
            <div className="absolute inset-0 z-40 bg-[#1a120b] flex flex-col">
              {/* Note: The sidebar (nav) is sibling to this <main>, so it remains visible on the left.
                  However, this overlay covers the Grid. 
                  Clicking the sidebar buttons triggers switchCategory which calls setViewingFile(null), 
                  effectively closing this overlay. */}
               <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// 5. Home Page
const HomePage = ({ onEnter }) => {
  return (
    <div className={`h-screen w-full relative flex flex-col items-center justify-center overflow-hidden ${THEME.bg}`}>
      
      {/* Abstract Background Art */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-[#3e3228] to-transparent transform skew-x-12" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#d44d38] rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-6 animate-[fadeInDown_1s_ease-out]">
          <h2 className={`font-serif text-[#d44d38] text-xl md:text-2xl tracking-[0.2em] italic mb-2`}>The Chronicles of</h2>
          <h1 className={`
            font-serif text-6xl md:text-8xl lg:text-9xl text-[#eaddcf] 
            tracking-tighter leading-[0.85] 
            drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]
            transform scale-y-110
          `}>
            MONTE<br/>
            <span className="text-7xl md:text-9xl lg:text-[10rem] ml-12 md:ml-24 block mt-2">CRISTO</span>
          </h1>
        </div>

        <p className="mt-8 text-[#8c7b70] font-mono text-sm md:text-base tracking-widest max-w-lg mx-auto leading-relaxed animate-[fadeIn_1.5s_ease-out_0.5s_both]">
          "All human wisdom is contained in these two words — Wait and Hope."
        </p>

        <div className="mt-16 animate-[fadeInUp_1s_ease-out_1s_both]">
          <MonteButton onClick={onEnter} primary>
            Enter The Archives
            <ArrowRight size={18} />
          </MonteButton>
        </div>
      </div>

      {/* Decorative Borders */}
      <div className="absolute top-4 left-4 w-32 h-32 border-l-2 border-t-2 border-[#eaddcf]/20" />
      <div className="absolute bottom-4 right-4 w-32 h-32 border-r-2 border-b-2 border-[#eaddcf]/20" />
      
      <div className="absolute bottom-8 text-[#5c4d44] text-xs font-mono tracking-[0.2em]">
        SYSTEM OPTIMIZED // 60FPS // SECURE STORAGE
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home'); 

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400&display=swap');
        
        :root {
          --font-serif: 'Cinzel', serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .font-serif { font-family: var(--font-serif); }
        .font-mono { font-family: var(--font-mono); }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a120b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3e3228; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d44d38; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <GrainOverlay />
      
      {page === 'home' ? (
        <HomePage onEnter={() => setPage('vault')} />
      ) : (
        <VaultPage onBack={() => setPage('home')} />
      )}
    </>
  );
}
