import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Folder, File, Image, Film, Music, Code, Archive, Box, ArrowRight, Upload, X, Maximize2, Minimize2, Play, Pause, FileText, Layers } from 'lucide-react';

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
  bg: 'bg-[#1a120b]', // Deep antique brown/black
  text: 'text-[#eaddcf]', // Aged paper
  accent: 'text-[#d44d38]', // Dried blood red/rusty
  accentBg: 'bg-[#d44d38]',
  border: 'border-[#3e3228]', // Rough wood/leather
  paper: 'bg-[#261f1a]', // Darker paper
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

/**
 * COMPONENTS
 */

// 1. CRT/Grain Effect Overlay for that "Live/Vintage" feel
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

// 2. Custom Button
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

// 3. File Viewer Component (The "Engine")
const FileViewer = ({ file, onClose }) => {
  const url = useObjectUrl(file);
  const type = file?.type || '';
  const ext = file?.name.split('.').pop().toLowerCase();
  
  const isVideo = type.startsWith('video');
  const isAudio = type.startsWith('audio');
  const isImage = type.startsWith('image');
  const isPdf = type === 'application/pdf';
  const isCode = CATEGORIES.Code.exts.includes(ext) || type.startsWith('text');

  if (!url) return <div className="text-center p-10 animate-pulse">Deciphering...</div>;

  return (
    <div className="relative w-full h-full flex flex-col bg-black/50 backdrop-blur-md rounded-sm border border-[#3e3228] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3e3228] bg-[#1a120b]">
        <h3 className="font-serif text-lg truncate pr-4 text-[#eaddcf]">{file.name}</h3>
        <div className="flex gap-2">
           {/* Actions could go here */}
          <button onClick={onClose} className="p-1 hover:text-[#d44d38] transition-colors"><X size={20} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-[#0d0907]">
        {isVideo && (
          <video src={url} controls autoPlay className="max-h-full max-w-full shadow-2xl" />
        )}
        {isAudio && (
          <div className="w-full max-w-md p-8 bg-[#261f1a] border border-[#3e3228] rounded flex flex-col items-center gap-4">
            <Music size={48} className="text-[#d44d38] animate-pulse" />
            <audio src={url} controls autoPlay className="w-full" />
          </div>
        )}
        {isImage && (
          <img src={url} alt="preview" className="max-h-full max-w-full object-contain shadow-2xl" />
        )}
        {isPdf && (
          <iframe src={url} title="PDF" className="w-full h-full border-none" />
        )}
        {isCode && (
          <div className="w-full h-full text-left p-4 bg-[#1a120b] font-mono text-xs overflow-auto text-green-400/80">
            <p className="mb-2 text-gray-500">// Preview of {file.name}</p>
             {/* Note: In a real app we'd fetch text content, here we simulate the viewer frame */}
            <div className="whitespace-pre-wrap">
              {`/* Content ready for inspection. \n   Size: ${(file.size / 1024).toFixed(2)} KB \n   Type: ${file.type} */`}
            </div>
          </div>
        )}
        {!isVideo && !isAudio && !isImage && !isPdf && !isCode && (
          <div className="text-center space-y-4">
             <Box size={64} className="mx-auto text-[#3e3228]" />
             <p className="font-serif text-xl text-[#eaddcf]">File Encrypted / Binary</p>
             <p className="text-sm text-[#8c7b70]">This archival format ({ext}) cannot be previewed visually, but is ready for processing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Working Page (The Vault)
const VaultPage = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div className={`h-screen flex flex-col ${THEME.bg} ${THEME.text} overflow-hidden font-sans`}>
      {/* Top Bar */}
      <header className="h-16 border-b border-[#3e3228] flex items-center justify-between px-6 bg-[#1a120b] shrink-0 z-20">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="hover:text-[#d44d38] transition-colors font-serif italic text-lg">
             ← Exit Vault
           </button>
           <h2 className="font-serif text-2xl tracking-widest border-l border-[#3e3228] pl-4">ARCHIVES</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 hover:text-[#d44d38] transition-colors">
            <Upload size={18} />
            <span className="uppercase text-xs tracking-widest font-bold">Import Asset</span>
            <input type="file" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 border-r border-[#3e3228] bg-[#150f0a] flex flex-col p-4 gap-2 overflow-y-auto shrink-0">
          <button 
             onClick={() => setActiveCategory('All')}
             className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-300 flex items-center justify-between group ${activeCategory === 'All' ? 'bg-[#3e3228] text-[#eaddcf]' : 'text-[#8c7b70] hover:text-[#eaddcf]'}`}
          >
             <span className="font-serif tracking-wide">All Materials</span>
             <span className="text-xs opacity-50">{files.length}</span>
          </button>
          
          <div className="h-px bg-[#3e3228] my-2" />
          
          {Object.entries(CATEGORIES).map(([name, data]) => {
            const Icon = data.icon;
            const count = files.filter(f => data.exts.includes(f.name.split('.').pop().toLowerCase())).length;
            const isActive = activeCategory === name;
            
            return (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
                className={`
                  w-full text-left px-4 py-3 rounded-sm transition-all duration-200 flex items-center justify-between
                  ${isActive ? 'bg-[#261f1a] text-[#d44d38] border-l-2 border-[#d44d38]' : 'text-[#8c7b70] hover:bg-[#1a120b] hover:text-[#eaddcf]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span className="text-sm uppercase tracking-wider">{name}</span>
                </div>
                {count > 0 && <span className="text-xs bg-[#3e3228] px-1.5 py-0.5 rounded text-[#eaddcf]">{count}</span>}
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
          {/* Background File Grid or Preview */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#1a120b] relative">
            
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
                    <p className="text-center text-xs font-mono text-[#eaddcf] line-clamp-2 px-2 break-all group-hover:text-white">
                      {file.name}
                    </p>
                    <span className="absolute top-2 right-2 text-[10px] text-[#5c4d44] font-bold uppercase">{ext}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragging && (
             <div className="absolute inset-0 bg-[#d44d38]/10 backdrop-blur-sm border-4 border-dashed border-[#d44d38] z-40 flex items-center justify-center">
               <p className="font-serif text-3xl text-[#eaddcf] bg-[#1a120b] px-8 py-4 border border-[#d44d38]">RELEASE TO DEPOSIT</p>
             </div>
          )}

          {/* Viewer Overlay */}
          {viewingFile && (
            <div className="absolute inset-0 z-50 bg-[#1a120b]/95 p-6 md:p-12 animate-[fadeIn_0.2s_ease-out]">
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
      
      {/* Abstract Background Art - mimicking the book cover strokes */}
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
      
      {/* Footer */}
      <div className="absolute bottom-8 text-[#5c4d44] text-xs font-mono tracking-[0.2em]">
        SYSTEM OPTIMIZED // 60FPS // SECURE STORAGE
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home'); // 'home' or 'vault'

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
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { bg: #1a120b; }
        ::-webkit-scrollbar-thumb { background: #3e3228; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #d44d38; }

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
