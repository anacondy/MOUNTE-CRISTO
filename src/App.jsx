/**
 * MONTE CRISTO - The Archives
 * A vintage-themed file archive vault application
 * 
 * This application combines the best features from multiple iterations:
 * - Volume feedback with red color styling
 * - File navigation with keyboard arrows
 * - Auto-play support for audio/video
 * - Audio visualizer with animated bars
 * - JS/CSS/JSX code execution in sandbox
 * - Optimized for 60fps performance
 * - Responsive design for 16:9 and 20:9 devices
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Folder, File, Image, Film, Music, Code, Archive, Box, ArrowRight, 
  Upload, X, Maximize2, Minimize2, Play, Pause, FileText, Layers, 
  Terminal, Shield, ShieldAlert, Volume2, VolumeX, Atom, ChevronLeft, ChevronRight 
} from 'lucide-react';

/**
 * ============================================================================
 * CONSTANTS & UTILITIES
 * ============================================================================
 */

/**
 * File categories with their associated icons and extensions
 * Used for filtering and displaying appropriate icons
 */
const CATEGORIES = {
  Images: { icon: Image, exts: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'bmp', 'tiff', 'svg', 'raw', 'ico'] },
  Videos: { icon: Film, exts: ['mp4', 'mkv', 'mov', 'avi', 'flv', 'wmv', 'webm', 'm4v'] },
  GIFs: { icon: Layers, exts: ['gif'] },
  Documents: { icon: FileText, exts: ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls', 'pptx', 'ppt', 'csv', 'rtf', 'odt'] },
  Audio: { icon: Music, exts: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'] },
  Archives: { icon: Archive, exts: ['zip', 'rar', '7z', 'tar', 'gz', 'iso'] },
  Executables: { icon: Box, exts: ['exe', 'msi', 'bat', 'apk'] },
  Code: { icon: Code, exts: ['py', 'js', 'html', 'css', 'cpp', 'java', 'sql', 'json', 'jsx', 'tsx'] },
};

/**
 * Theme colors following the Monte Cristo vintage aesthetic
 * Deep browns, aged paper colors, and blood red accents
 */
const THEME = {
  bg: 'bg-[#1a120b]', 
  text: 'text-[#eaddcf]', 
  accent: 'text-[#d44d38]', 
  accentBg: 'bg-[#d44d38]',
  border: 'border-[#3e3228]', 
  paper: 'bg-[#261f1a]', 
  overlay: 'bg-[#1a120b]/90',
};

/**
 * Custom hook for safely creating and managing object URLs
 * Automatically revokes URLs on cleanup to prevent memory leaks
 * @param {File} file - The file to create a URL for
 * @returns {string|null} - The object URL or null
 */
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
 * Format time in MM:SS format for media players
 * @param {number} time - Time in seconds
 * @returns {string} - Formatted time string
 */
const formatTime = (time) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * ============================================================================
 * UI COMPONENTS
 * ============================================================================
 */

/**
 * Grain overlay effect for vintage/film aesthetic
 * Uses SVG noise filter for performance-optimized grain effect
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

/**
 * Styled button component with hover effects
 * @param {ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {boolean} primary - Use primary (accent) styling
 * @param {string} className - Additional CSS classes
 */
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

/**
 * Volume/Mute feedback overlay
 * Shows visual feedback when volume is changed or muted
 * Uses red color for the accent as per requirements
 * @param {boolean} isMuted - Current mute state
 * @param {number} volume - Current volume (0-1)
 * @param {boolean} visible - Show/hide overlay
 * @param {string} type - 'mute' or 'volume'
 */
const VolumeFeedback = ({ isMuted, volume, visible, type = 'mute' }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-2 animate-[fadeInOut_0.8s_ease-out_forwards]">
        {type === 'mute' ? (
          <div className="flex items-center gap-4 text-[#d44d38] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {isMuted ? <VolumeX size={80} strokeWidth={1.5} /> : <Volume2 size={80} strokeWidth={1.5} />}
            <span className="font-serif text-4xl tracking-widest uppercase">{isMuted ? 'MUTED' : 'UNMUTED'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-[#d44d38] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            <Volume2 size={64} strokeWidth={1.5} />
            <span className="font-serif text-5xl tracking-widest font-bold">{Math.round(volume * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * MEDIA CONTROLS & PLAYERS
 * ============================================================================
 */

/**
 * Shared media controls component for audio/video
 * Features timeline, play/pause, mute, and time display
 */
const MediaControls = ({ isPlaying, isMuted, currentTime, duration, onPlayPause, onMute, onSeek, type = 'video' }) => {
  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className={`
      absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0907] via-[#1a120b]/90 to-transparent 
      px-6 py-6 transition-all duration-500 ease-out
      ${type === 'audio' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
    `}>
      {/* Timeline with scrubber */}
      <div 
        className="w-full h-1.5 bg-[#3e3228] cursor-pointer mb-4 rounded-full overflow-hidden group/timeline relative"
        onClick={onSeek}
      >
        <div 
          className="h-full bg-[#d44d38] relative shadow-[0_0_10px_#d44d38] gpu-accelerated" 
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#eaddcf] rounded-full shadow opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-xs tracking-wider text-[#eaddcf]">
        <div className="flex items-center gap-4">
          <button onClick={onPlayPause} className="hover:text-[#d44d38] transition-colors hover:scale-110 transform duration-200">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={onMute} className="hover:text-[#d44d38] transition-colors hover:scale-110 transform duration-200" title="Mute (M)">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div className="text-[#5c4d44] uppercase tracking-[0.2em] text-[10px]">
          {type === 'audio' ? 'High Fidelity Audio' : 'HD Playback'}
        </div>
      </div>
    </div>
  );
};

/**
 * Custom audio player with visualizer
 * Features:
 * - Audio frequency visualizer bars
 * - Keyboard controls (M for mute, Space for play/pause, arrows for volume)
 * - Auto-play on file load
 * - Volume feedback overlay
 */
const CustomAudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedbackState, setFeedbackState] = useState({ visible: false, type: 'mute' });

  // Auto-play when URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.warn("Auto-play blocked", e));
    }
  }, [url]);

  // Initialize Web Audio API context for visualizer
  useEffect(() => {
    if (!url || !audioRef.current) return;

    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [url]);

  /**
   * Draw audio visualizer bars using Canvas API
   * Optimized with requestAnimationFrame for 60fps
   */
  const drawVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      // Pre-calculate RGB base for performance
      const baseRgb = '212, 77, 56';
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgba(${baseRgb}, ${barHeight / 100})`;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 2);
        ctx.fill();
        x += barWidth + 1;
      }
    };
    renderFrame();
  }, []);

  // Start/stop visualizer based on playing state
  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      drawVisualizer();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, url, drawVisualizer]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newState = !isMuted;
      audioRef.current.muted = newState;
      setIsMuted(newState);
      showFeedback('mute');
    }
  }, [isMuted]);

  const adjustVolume = useCallback((delta) => {
    if (audioRef.current) {
      const newVol = Math.max(0, Math.min(1, volume + delta));
      audioRef.current.volume = newVol;
      setVolume(newVol);
      if (newVol > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
      showFeedback('volume');
    }
  }, [volume, isMuted]);

  const showFeedback = (type) => {
    setFeedbackState({ visible: true, type });
    setTimeout(() => setFeedbackState(prev => ({ ...prev, visible: false })), 800);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();

      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.code === 'Space') togglePlay();
      if (e.code === 'ArrowUp') adjustVolume(0.1);
      if (e.code === 'ArrowDown') adjustVolume(-0.1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute, togglePlay, adjustVolume]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    if (audioRef.current) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#150f0a] overflow-hidden">
      <VolumeFeedback isMuted={isMuted} volume={volume} visible={feedbackState.visible} type={feedbackState.type} />
      
      <audio 
        ref={audioRef} 
        src={url} 
        crossOrigin="anonymous"
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Visualizer canvas */}
      <div className="absolute inset-x-0 bottom-24 h-64 flex items-end justify-center px-10 opacity-80">
        <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
      </div>

      {/* Center music icon with pulse effect */}
      <div className={`relative z-10 transition-transform duration-700 gpu-accelerated ${isPlaying ? 'scale-110' : 'scale-100'}`}>
        <div className="w-48 h-48 rounded-full bg-[#1a120b] border-4 border-[#3e3228] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <Music size={64} className={`text-[#d44d38] transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-50'}`} />
        </div>
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border border-[#d44d38] animate-[ping_2s_linear_infinite] opacity-20" />
        )}
      </div>

      <MediaControls 
        type="audio"
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        currentTime={currentTime} 
        duration={duration} 
        onPlayPause={togglePlay} 
        onMute={toggleMute} 
        onSeek={handleSeek} 
      />
    </div>
  );
};

/**
 * Custom video player with overlay controls
 * Features:
 * - Click to play/pause
 * - Keyboard controls
 * - Auto-play and reload on file switch
 * - Volume feedback overlay
 */
const CustomVideoPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedbackState, setFeedbackState] = useState({ visible: false, type: 'mute' });

  // Auto-play and reload on URL change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.warn("Auto-play blocked", e));
    }
  }, [url]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
      showFeedback('mute');
    }
  }, [isMuted]);

  const adjustVolume = useCallback((delta) => {
    if (videoRef.current) {
      const newVol = Math.max(0, Math.min(1, volume + delta));
      videoRef.current.volume = newVol;
      setVolume(newVol);
      if (newVol > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      showFeedback('volume');
    }
  }, [volume, isMuted]);

  const showFeedback = (type) => {
    setFeedbackState({ visible: true, type });
    setTimeout(() => setFeedbackState(prev => ({ ...prev, visible: false })), 800);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();

      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.code === 'Space') togglePlay();
      if (e.code === 'ArrowUp') adjustVolume(0.1);
      if (e.code === 'ArrowDown') adjustVolume(-0.1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute, togglePlay, adjustVolume]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
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
    <div className="relative group w-full h-full flex items-center justify-center bg-black overflow-hidden">
      <VolumeFeedback isMuted={isMuted} volume={volume} visible={feedbackState.visible} type={feedbackState.type} />
      
      <video 
        ref={videoRef}
        src={url}
        playsInline 
        className="max-h-full max-w-full shadow-2xl cursor-pointer bg-black"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Center play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
          <div className="p-6 rounded-full border border-[#d44d38] bg-[#1a120b]/80 text-[#d44d38] animate-[pulse_3s_infinite]">
            <Play size={48} fill="currentColor" />
          </div>
        </div>
      )}

      <MediaControls 
        type="video"
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        currentTime={currentTime} 
        duration={duration} 
        onPlayPause={togglePlay} 
        onMute={toggleMute} 
        onSeek={handleSeek} 
      />
    </div>
  );
};

/**
 * ============================================================================
 * FILE VIEWER
 * ============================================================================
 */

/**
 * Main file viewer component
 * Handles preview for all supported file types:
 * - Images, Videos, Audio, PDFs
 * - Code files (JS, CSS, HTML, JSX, TSX, etc.)
 * - Executable code in sandboxed iframe
 */
const FileViewer = ({ file, onClose, onNext, onPrev }) => {
  const url = useObjectUrl(file);
  const type = file?.type || '';
  const ext = file?.name.split('.').pop().toLowerCase();
  
  // File type detection
  const isVideo = type.startsWith('video');
  const isAudio = type.startsWith('audio');
  const isImage = type.startsWith('image');
  const isPdf = type === 'application/pdf';
  const isHtml = ext === 'html' || ext === 'htm';
  const isJsx = ext === 'jsx' || ext === 'tsx';
  const isJs = ext === 'js';
  const isCss = ext === 'css';
  const isCode = CATEGORIES.Code.exts.includes(ext) || type.startsWith('text');

  // Code execution state
  const [runCode, setRunCode] = useState(false);
  const [codeContent, setCodeContent] = useState(null);

  // File navigation with keyboard
  useEffect(() => {
    const handleNavigation = (e) => {
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [onNext, onPrev]);

  // Read code content for preview
  useEffect(() => {
    if (isCode || isHtml || isJsx) {
      const reader = new FileReader();
      reader.onload = (e) => setCodeContent(e.target.result);
      reader.readAsText(file);
    }
  }, [file, isCode, isHtml, isJsx]);

  /**
   * Generate executable HTML for different code types
   * Supports HTML, JS, CSS, and JSX with Babel compilation
   */
  const getRunnerSrc = useCallback(() => {
    if (isHtml) return url;
    
    if (isJs && codeContent) {
      const jsRunner = `
        <!DOCTYPE html>
        <html>
        <head><style>body{margin:0;color:#eaddcf;background:#0d0907;font-family:monospace;padding:20px;}</style></head>
        <body>
          <div id="console"></div>
          <script>
            const log = (msg) => document.getElementById('console').innerHTML += '<div>> ' + msg + '</div>';
            console.log = log;
            try {
              ${codeContent}
            } catch (e) { log('Error: ' + e.message); }
          </script>
        </body></html>`;
      return URL.createObjectURL(new Blob([jsRunner], { type: 'text/html' }));
    }
    
    if (isCss && codeContent) {
      const cssRunner = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: sans-serif; background: #fff; color: #000; }
            ${codeContent}
          </style>
        </head>
        <body>
          <h1>CSS Preview</h1>
          <p>The styles from <strong>${file.name}</strong> are applied to this document.</p>
          <div class="box">Sample Element</div>
          <button>Sample Button</button>
        </body></html>`;
      return URL.createObjectURL(new Blob([cssRunner], { type: 'text/html' }));
    }
    
    if (isJsx && codeContent) {
      const cleanCode = codeContent.replace(/export\s+default\s+/g, '');
      
      // Note: These CDN scripts are loaded in a sandboxed iframe for JSX execution.
      // The sandbox attribute restricts the iframe's capabilities.
      // Using specific versions (react@18.2.0, react-dom@18.2.0) for consistency.
      const jsxRunner = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js"></script>
          <style>body { margin: 0; font-family: sans-serif; color: #eaddcf; background: #0d0907; overflow: hidden; } </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            window.onerror = function(msg, url, line) {
              document.body.innerHTML += '<div style="color:red; padding:20px;">Error: ' + msg + ' line ' + line + '</div>';
            };

            ${cleanCode}
            
            try {
              const rootElement = document.getElementById('root');
              const root = ReactDOM.createRoot(rootElement);
              if (typeof App !== 'undefined') {
                root.render(<App />);
              }
            } catch(e) {
              console.error("Mount error:", e);
              document.body.innerHTML += '<div style="color:red; padding:20px;">Mount Error: ' + e.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;
      return URL.createObjectURL(new Blob([jsxRunner], { type: 'text/html' }));
    }
    return '';
  }, [url, codeContent, isHtml, isJs, isJsx, isCss, file?.name]);

  const runnerUrl = useMemo(() => getRunnerSrc(), [getRunnerSrc, runCode]);

  // Terminal simulation for non-web code
  const TerminalView = () => (
    <div className="w-full h-full bg-[#0d0907] p-6 font-mono text-sm overflow-auto text-green-500">
      <div className="mb-2">root@monte-cristo-vault:~/code# {ext} {file.name}</div>
      <div className="mb-4 text-white/50">Initializing secure compilation environment...</div>
      <div className="mb-4">
        [SYSTEM] Backend compiler connection established.<br/>
        [SYSTEM] Uploading {file.size} bytes...<br/>
        [SYSTEM] Executing binary...
      </div>
      <div className="border-l-2 border-green-500 pl-4 py-2 my-4 bg-green-900/10 text-[#eaddcf]">
        {`> Execution simulation for ${file.name}`}<br/>
        {`> Output: Hello from ${ext.toUpperCase()}!`}<br/>
        {`> Process finished with exit code 0`}
      </div>
      <div className="animate-pulse">_</div>
    </div>
  );

  if (!url) return <div className="text-center p-10 animate-pulse text-[#d44d38]">Deciphering...</div>;

  const canRun = isHtml || isJsx || isJs || isCss;
  const isOtherCode = isCode && !canRun;

  return (
    <div className="relative w-full h-full flex flex-col bg-black/50 backdrop-blur-md rounded-sm border border-[#3e3228] overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3e3228] bg-[#1a120b] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <h3 className="font-serif text-lg truncate text-[#eaddcf] uppercase tracking-wider">{file.name}</h3>
          {(isCode || isHtml) && (
            <div className="flex items-center gap-2 ml-4 px-2 py-1 bg-[#261f1a] rounded border border-[#3e3228]">
              <button 
                onClick={() => setRunCode(!runCode)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 transition-colors ${runCode ? 'text-[#d44d38]' : 'text-[#8c7b70] hover:text-[#eaddcf]'}`}
              >
                {runCode ? <Code size={14}/> : (isJsx ? <Atom size={14}/> : <Play size={14}/>)}
                {runCode ? 'View Source' : 'Run Code'}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation arrows */}
          <div className="flex items-center gap-1 text-[#5c4d44] mr-4">
            <ChevronLeft size={20} className="hover:text-[#d44d38] cursor-pointer transition-colors" onClick={onPrev} />
            <span className="text-xs font-mono">NAV</span>
            <ChevronRight size={20} className="hover:text-[#d44d38] cursor-pointer transition-colors" onClick={onNext} />
          </div>
          <button onClick={onClose} className="p-1 text-[#8c7b70] hover:text-[#d44d38] transition-colors"><X size={20} /></button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#0d0907] relative">
        {isVideo && <CustomVideoPlayer url={url} />}
        
        {isAudio && <CustomAudioPlayer url={url} />}

        {isImage && (
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            <img src={url} alt="preview" className="max-h-full max-w-full object-contain shadow-2xl" />
          </div>
        )}

        {isPdf && (
          <iframe src={url} title="PDF" className="w-full h-full border-none" />
        )}

        {/* Code execution iframe */}
        {canRun && runCode && (
          <iframe 
            title="preview"
            src={isHtml ? url : runnerUrl} 
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-modals allow-popups allow-forms allow-same-origin"
          />
        )}
        
        {/* Terminal simulation */}
        {isOtherCode && runCode && <TerminalView />}

        {/* Code source viewer */}
        {((isCode && !runCode) || (canRun && !runCode)) && (
          <div className="w-full h-full text-left p-6 bg-[#1a120b] font-mono text-xs overflow-auto">
            <p className="mb-4 text-[#5c4d44] border-b border-[#3e3228] pb-2 flex justify-between">
              <span>// Source Code Preview</span>
              <span>{file.type}</span>
            </p>
            <pre className="text-[#eaddcf] whitespace-pre-wrap leading-relaxed opacity-90">
              {codeContent || "Loading binary sequence..."}
            </pre>
          </div>
        )}

        {/* Fallback for unsupported types */}
        {!isVideo && !isAudio && !isImage && !isPdf && !isCode && !isHtml && !isJsx && (
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

/**
 * ============================================================================
 * PAGE COMPONENTS
 * ============================================================================
 */

/**
 * Vault page - Main file management interface
 * Features:
 * - Drag & drop file upload
 * - Category-based filtering
 * - Grid view of files
 * - Keyboard shortcut for import (Ctrl+I)
 */
const VaultPage = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  // Ctrl+I keyboard shortcut for import
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

  // Filter files by category
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

  const switchCategory = (category) => {
    setActiveCategory(category);
    setViewingFile(null); 
  };

  // Navigation between files
  const handleNavigate = (direction) => {
    if (!viewingFile || filteredFiles.length <= 1) return;
    const currentIndex = filteredFiles.indexOf(viewingFile);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex >= filteredFiles.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = filteredFiles.length - 1;
    
    setViewingFile(filteredFiles[nextIndex]);
  };

  return (
    <div className={`h-screen h-[100dvh] flex flex-col ${THEME.bg} ${THEME.text} overflow-hidden font-sans`}>
      {/* Top Bar */}
      <header className="h-16 border-b border-[#3e3228] flex items-center justify-between px-4 sm:px-6 bg-[#1a120b] shrink-0 z-20 shadow-lg safe-area-inset-top">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onBack} className="hover:text-[#d44d38] transition-colors font-serif italic text-sm sm:text-lg opacity-70 hover:opacity-100">
            ← Exit Vault
          </button>
          <h2 className="font-serif text-lg sm:text-2xl tracking-widest border-l border-[#3e3228] pl-2 sm:pl-4 text-[#eaddcf] hidden sm:block">ARCHIVES</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <label className="cursor-pointer flex items-center gap-2 hover:text-[#d44d38] transition-colors group">
            <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform"/>
            <span className="uppercase text-[10px] sm:text-xs tracking-widest font-bold font-serif text-[#eaddcf] hidden sm:inline">Import (Ctrl+I)</span>
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
        <nav className="w-48 sm:w-64 border-r border-[#3e3228] bg-[#150f0a] flex flex-col p-2 sm:p-4 gap-1 sm:gap-2 overflow-y-auto shrink-0 z-30 hidden md:flex">
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
          {/* File Grid */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#1a120b] relative smooth-scroll">
            
            {/* Empty State */}
            {files.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                <div className="w-48 sm:w-64 h-48 sm:h-64 border-2 border-dashed border-[#3e3228] rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <div className="w-36 sm:w-48 h-36 sm:h-48 border border-[#3e3228] rounded-full" />
                </div>
                <p className="mt-8 font-serif text-xl sm:text-2xl tracking-widest text-[#8c7b70]">AWAITING INPUT</p>
                <p className="text-xs sm:text-sm font-mono mt-2 text-[#5c4d44]">Drag & Drop classified documents here</p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
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
                      group relative aspect-square bg-[#261f1a] border border-[#3e3228] p-3 sm:p-4 flex flex-col items-center justify-center 
                      cursor-pointer hover:border-[#d44d38] hover:bg-[#2a221d] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                      gpu-accelerated
                    "
                  >
                    <div className="mb-2 sm:mb-3 text-[#8c7b70] group-hover:text-[#d44d38] transition-colors">
                      <CatIcon size={28} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
                    </div>
                    <p className="text-center text-[10px] sm:text-xs font-mono text-[#eaddcf] line-clamp-2 px-1 sm:px-2 break-all group-hover:text-white transition-colors">
                      {file.name}
                    </p>
                    <span className="absolute top-1 sm:top-2 right-1 sm:right-2 text-[8px] sm:text-[10px] text-[#5c4d44] font-bold uppercase border border-[#3e3228] px-1">{ext}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-[#d44d38]/10 backdrop-blur-sm border-4 border-dashed border-[#d44d38] z-40 flex items-center justify-center">
              <p className="font-serif text-xl sm:text-3xl text-[#eaddcf] bg-[#1a120b] px-4 sm:px-8 py-2 sm:py-4 border border-[#d44d38] shadow-2xl">RELEASE TO DEPOSIT</p>
            </div>
          )}

          {/* Viewer Overlay */}
          {viewingFile && (
            <div className="absolute inset-0 z-40 bg-[#1a120b] flex flex-col">
              <FileViewer 
                file={viewingFile} 
                onClose={() => setViewingFile(null)} 
                onNext={() => handleNavigate(1)}
                onPrev={() => handleNavigate(-1)}
              />
            </div>
          )}

        </main>
      </div>

      {/* Mobile category tabs */}
      <div className="md:hidden border-t border-[#3e3228] bg-[#150f0a] px-2 py-2 flex gap-2 overflow-x-auto safe-area-inset-bottom">
        <button 
          onClick={() => switchCategory('All')}
          className={`shrink-0 px-3 py-2 rounded text-xs font-mono ${activeCategory === 'All' ? 'bg-[#d44d38] text-[#1a120b]' : 'text-[#8c7b70]'}`}
        >
          All ({files.length})
        </button>
        {Object.entries(CATEGORIES).slice(0, 5).map(([name, data]) => {
          const count = files.filter(f => data.exts.includes(f.name.split('.').pop().toLowerCase())).length;
          return (
            <button 
              key={name}
              onClick={() => switchCategory(name)}
              className={`shrink-0 px-3 py-2 rounded text-xs font-mono ${activeCategory === name ? 'bg-[#d44d38] text-[#1a120b]' : 'text-[#8c7b70]'}`}
            >
              {name} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Home page - Landing page with title and enter button
 */
const HomePage = ({ onEnter }) => {
  return (
    <div className={`h-screen h-[100dvh] w-full relative flex flex-col items-center justify-center overflow-hidden ${THEME.bg}`}>
      
      {/* Abstract background art */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-[#3e3228] to-transparent transform skew-x-12" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#d44d38] rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-6 animate-[fadeInDown_1s_ease-out]">
          <h2 className="font-serif text-[#d44d38] text-lg sm:text-xl md:text-2xl tracking-[0.2em] italic mb-2">The Chronicles of</h2>
          <h1 className="
            font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-[#eaddcf] 
            tracking-tighter leading-[0.85] 
            drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]
            transform scale-y-110
          ">
            MONTE<br/>
            <span className="text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] ml-8 sm:ml-12 md:ml-24 block mt-2">CRISTO</span>
          </h1>
        </div>

        <p className="mt-8 text-[#8c7b70] font-mono text-xs sm:text-sm md:text-base tracking-widest max-w-lg mx-auto leading-relaxed animate-[fadeIn_1.5s_ease-out_0.5s_both]">
          "All human wisdom is contained in these two words — Wait and Hope."
        </p>

        <div className="mt-12 sm:mt-16 animate-[fadeInUp_1s_ease-out_1s_both]">
          <MonteButton onClick={onEnter} primary>
            Enter The Archives
            <ArrowRight size={18} />
          </MonteButton>
        </div>
      </div>

      {/* Decorative borders */}
      <div className="absolute top-4 left-4 w-16 sm:w-32 h-16 sm:h-32 border-l-2 border-t-2 border-[#eaddcf]/20" />
      <div className="absolute bottom-4 right-4 w-16 sm:w-32 h-16 sm:h-32 border-r-2 border-b-2 border-[#eaddcf]/20" />
      
      <div className="absolute bottom-4 sm:bottom-8 text-[#5c4d44] text-[10px] sm:text-xs font-mono tracking-[0.2em]">
        SYSTEM OPTIMIZED // 60FPS // SECURE STORAGE
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * MAIN APP COMPONENT
 * ============================================================================
 */

export default function App() {
  const [page, setPage] = useState('home'); 

  return (
    <>
      <GrainOverlay />
      
      {page === 'home' ? (
        <HomePage onEnter={() => setPage('vault')} />
      ) : (
        <VaultPage onBack={() => setPage('home')} />
      )}
    </>
  );
}
