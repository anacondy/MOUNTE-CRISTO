# 📚 MONTE CRISTO - Technical Documentation

This document provides a comprehensive explanation of the Monte Cristo application's architecture, code structure, and implementation details.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Components](#core-components)
4. [Custom Hooks](#custom-hooks)
5. [Media Players](#media-players)
6. [File Viewer](#file-viewer)
7. [Styling System](#styling-system)
8. [Performance Optimizations](#performance-optimizations)
9. [Code Examples](#code-examples)

---

## Architecture Overview

Monte Cristo is built as a single-page React application using a component-based architecture. The app follows these design principles:

- **Component Composition**: Small, reusable components combined to build complex UIs
- **Hooks for State**: React hooks manage all state and side effects
- **CSS-in-JS**: Tailwind CSS classes for styling with custom animations
- **Memory Safety**: Proper cleanup of resources like Object URLs and event listeners

```
┌─────────────────────────────────────────────────────────┐
│                        App                              │
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │    HomePage      │    │       VaultPage          │  │
│  │                  │    │  ┌─────────────────────┐ │  │
│  │  ┌────────────┐  │    │  │    FileViewer       │ │  │
│  │  │MonteButton │  │    │  │  ┌───────────────┐  │ │  │
│  │  └────────────┘  │    │  │  │ AudioPlayer   │  │ │  │
│  └──────────────────┘    │  │  │ VideoPlayer   │  │ │  │
│                          │  │  │ CodeViewer    │  │ │  │
│                          │  │  └───────────────┘  │ │  │
│                          │  └─────────────────────┘ │  │
│                          └──────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐   │
│  │              GrainOverlay (global)               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

### `/src/App.jsx`

The main application file containing all components. Organized into sections:

1. **Constants & Utilities** - Theme colors, categories, helper functions
2. **UI Components** - Buttons, overlays, feedback elements
3. **Media Controls & Players** - Audio/Video players with controls
4. **File Viewer** - Universal file preview component
5. **Page Components** - HomePage and VaultPage
6. **Main App** - Root component with page routing

---

## Core Components

### GrainOverlay

Creates a subtle film grain effect using SVG noise filter for the vintage aesthetic.

```jsx
/**
 * Grain overlay effect for vintage/film aesthetic
 * Uses SVG noise filter for performance-optimized grain effect
 */
const GrainOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
    <svg className='h-full w-full'>
      <filter id='noise'>
        {/* Creates fractal noise pattern */}
        <feTurbulence 
          type='fractalNoise' 
          baseFrequency='0.8'  // Grain density
          numOctaves='3'       // Detail levels
          stitchTiles='stitch' // Seamless tiling
        />
      </filter>
      <rect width='100%' height='100%' filter='url(#noise)' />
    </svg>
  </div>
);
```

**Key Features:**
- Uses `pointer-events-none` to allow interaction with elements below
- `mix-blend-overlay` blends with underlying content
- Low opacity (3%) for subtle effect
- Fixed positioning covers entire viewport

---

### MonteButton

Reusable button component with hover effects and primary/secondary variants.

```jsx
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
      relative overflow-hidden 
      px-8 py-3 
      font-serif tracking-widest uppercase 
      transition-all duration-300
      border border-[#eaddcf]/20 
      hover:border-[#d44d38] 
      group
      ${primary 
        ? 'bg-[#d44d38] text-[#1a120b] font-bold hover:bg-[#b03a28]' 
        : 'hover:bg-[#eaddcf]/5'}
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </button>
);
```

**Key Features:**
- Conditional styling based on `primary` prop
- Smooth hover transitions (300ms)
- Supports custom className extension
- Uses Tailwind's `group` for coordinated hover effects

---

### VolumeFeedback

Displays visual feedback when volume changes or mute is toggled.

```jsx
/**
 * Volume/Mute feedback overlay
 * Shows visual feedback when volume is changed or muted
 * Uses red color for the accent as per requirements
 */
const VolumeFeedback = ({ isMuted, volume, visible, type = 'mute' }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-2 animate-[fadeInOut_0.8s_ease-out_forwards]">
        {type === 'mute' ? (
          // Mute/Unmute feedback with icon and text
          <div className="flex items-center gap-4 text-[#d44d38] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {isMuted ? <VolumeX size={80} /> : <Volume2 size={80} />}
            <span className="font-serif text-4xl tracking-widest uppercase">
              {isMuted ? 'MUTED' : 'UNMUTED'}
            </span>
          </div>
        ) : (
          // Volume percentage feedback
          <div className="flex items-center gap-4 text-[#d44d38] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            <Volume2 size={64} />
            <span className="font-serif text-5xl tracking-widest font-bold">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
```

**Key Features:**
- Red accent color (#d44d38) for visibility
- Custom fadeInOut animation (0.8s)
- Drop shadow for text readability
- Supports both mute status and volume percentage

---

## Custom Hooks

### useObjectUrl

Safely manages browser Object URLs to prevent memory leaks.

```jsx
/**
 * Custom hook for safely creating and managing object URLs
 * Automatically revokes URLs on cleanup to prevent memory leaks
 * 
 * @param {File} file - The file to create a URL for
 * @returns {string|null} - The object URL or null
 */
const useObjectUrl = (file) => {
  const [url, setUrl] = useState(null);
  
  useEffect(() => {
    // Return early if no file provided
    if (!file) return;
    
    // Create new Object URL for the file
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    
    // Cleanup: revoke URL when file changes or component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]); // Re-run when file changes
  
  return url;
};
```

**Why This Matters:**
- Object URLs consume memory until explicitly revoked
- Without cleanup, switching between many files would cause memory leaks
- The cleanup function runs before each new URL creation and on unmount

---

## Media Players

### CustomAudioPlayer

Full-featured audio player with frequency visualizer.

```jsx
const CustomAudioPlayer = ({ url }) => {
  // Refs for DOM elements and Web Audio API
  const audioRef = useRef(null);           // <audio> element
  const canvasRef = useRef(null);          // <canvas> for visualizer
  const animationRef = useRef(null);       // requestAnimationFrame ID
  const analyserRef = useRef(null);        // Web Audio AnalyserNode
  const audioContextRef = useRef(null);    // Web Audio Context

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedbackState, setFeedbackState] = useState({ visible: false, type: 'mute' });

  // Initialize Web Audio API for visualizer
  useEffect(() => {
    if (!url || !audioRef.current) return;

    // Create AudioContext only once (reuse across file switches)
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser for frequency data
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Determines frequency resolution
      
      // Connect audio element -> analyser -> speakers
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [url]);

  // ... (visualizer drawing, controls, etc.)
};
```

**Visualizer Drawing:**

```jsx
/**
 * Draw audio visualizer bars using Canvas API
 * Optimized with requestAnimationFrame for 60fps
 */
const drawVisualizer = useCallback(() => {
  if (!canvasRef.current || !analyserRef.current) return;
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const bufferLength = analyserRef.current.frequencyBinCount; // 128 bars
  const dataArray = new Uint8Array(bufferLength);
  
  const renderFrame = () => {
    // Schedule next frame first for smooth animation
    animationRef.current = requestAnimationFrame(renderFrame);
    
    // Get current frequency data
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate bar dimensions
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    // Draw each frequency bar
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      
      // Red accent color with opacity based on height
      ctx.fillStyle = `rgba(212, 77, 56, ${barHeight / 100})`;
      
      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 2);
      ctx.fill();
      
      x += barWidth + 1;
    }
  };
  
  renderFrame();
}, []);
```

---

### CustomVideoPlayer

Video player with overlay controls and keyboard shortcuts.

```jsx
const CustomVideoPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedbackState, setFeedbackState] = useState({ visible: false, type: 'mute' });

  // Auto-play and reload on URL change
  // This fixes blank screen issues when switching videos
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();  // Force reload for different codecs
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.warn("Auto-play blocked", e));
    }
  }, [url]);

  // Memoized handlers to prevent recreation on each render
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

  // Volume adjustment with automatic unmute
  const adjustVolume = useCallback((delta) => {
    if (videoRef.current) {
      const newVol = Math.max(0, Math.min(1, volume + delta));
      videoRef.current.volume = newVol;
      setVolume(newVol);
      
      // Auto-unmute if adjusting from muted state
      if (newVol > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      showFeedback('volume');
    }
  }, [volume, isMuted]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.code === 'Space') togglePlay();
      if (e.code === 'ArrowUp') adjustVolume(0.1);
      if (e.code === 'ArrowDown') adjustVolume(-0.1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute, togglePlay, adjustVolume]);

  // ... render JSX
};
```

---

## File Viewer

The FileViewer component handles preview for all supported file types:

```jsx
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

  // File navigation with keyboard arrows
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

  // ... render appropriate viewer based on file type
};
```

### Code Execution

The app can execute HTML, JS, CSS, and JSX code in a sandboxed iframe:

```jsx
/**
 * Generate executable HTML for different code types
 * Supports HTML, JS, CSS, and JSX with Babel compilation
 */
const getRunnerSrc = useCallback(() => {
  // HTML files use their URL directly
  if (isHtml) return url;
  
  // JavaScript execution with console capture
  if (isJs && codeContent) {
    const jsRunner = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; color: #eaddcf; background: #0d0907; 
                 font-family: monospace; padding: 20px; }
        </style>
      </head>
      <body>
        <div id="console"></div>
        <script>
          // Override console.log to display in page
          const log = (msg) => 
            document.getElementById('console').innerHTML += '<div>> ' + msg + '</div>';
          console.log = log;
          
          try {
            ${codeContent}  // Execute user code
          } catch (e) { 
            log('Error: ' + e.message); 
          }
        </script>
      </body>
      </html>`;
    return URL.createObjectURL(new Blob([jsRunner], { type: 'text/html' }));
  }
  
  // JSX execution with Babel transpilation
  if (isJsx && codeContent) {
    // Remove "export default" since we're not in a module context
    const cleanCode = codeContent.replace(/export\s+default\s+/g, '');
    
    const jsxRunner = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <!-- Load React and Babel from CDN -->
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body { margin: 0; font-family: sans-serif; 
                 color: #eaddcf; background: #0d0907; overflow: hidden; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          // Error handling
          window.onerror = function(msg, url, line) {
            document.body.innerHTML += '<div style="color:red; padding:20px;">Error: ' 
              + msg + ' line ' + line + '</div>';
          };

          // User's JSX code
          ${cleanCode}
          
          // Auto-mount App component if defined
          try {
            const rootElement = document.getElementById('root');
            const root = ReactDOM.createRoot(rootElement);
            if (typeof App !== 'undefined') {
              root.render(<App />);
            }
          } catch(e) {
            document.body.innerHTML += '<div style="color:red; padding:20px;">Mount Error: ' 
              + e.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;
    return URL.createObjectURL(new Blob([jsxRunner], { type: 'text/html' }));
  }
  
  return '';
}, [url, codeContent, isHtml, isJs, isJsx, isCss]);
```

---

## Styling System

### Theme Colors

The application uses a carefully crafted color palette:

```javascript
const THEME = {
  bg: 'bg-[#1a120b]',       // Deep antique brown/black
  text: 'text-[#eaddcf]',   // Aged paper white
  accent: 'text-[#d44d38]', // Dried blood red
  accentBg: 'bg-[#d44d38]',
  border: 'border-[#3e3228]', // Leather brown
  paper: 'bg-[#261f1a]',    // Dark paper
  overlay: 'bg-[#1a120b]/90',
};
```

### Custom Animations

Defined in the CSS:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: scale(0.9); }
  20% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.1); }
}
```

### Responsive Design

```css
/* 16:9 aspect ratio devices */
@media (min-aspect-ratio: 16/9) {
  .sidebar-responsive { width: 280px; }
  .grid-responsive { grid-template-columns: repeat(5, 1fr); }
}

/* 20:9 and wider aspect ratios */
@media (min-aspect-ratio: 20/9) {
  .sidebar-responsive { width: 200px; }
  .grid-responsive { grid-template-columns: repeat(6, 1fr); }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .sidebar-responsive {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: auto;
    max-height: 40vh;
  }
}
```

---

## Performance Optimizations

### GPU Acceleration

```jsx
// Use transform for hardware acceleration
<div className="gpu-accelerated">
  {/* Content is rendered on GPU */}
</div>
```

```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

### Memoization

```jsx
// Memoize expensive calculations
const filteredFiles = useMemo(() => {
  if (activeCategory === 'All') return files;
  const catData = CATEGORIES[activeCategory];
  return files.filter(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    return catData.exts.includes(ext);
  });
}, [files, activeCategory]);

// Memoize callbacks to prevent child re-renders
const togglePlay = useCallback(() => {
  if (videoRef.current) {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  }
}, [isPlaying]);
```

### Animation Frame Management

```jsx
// Proper cleanup of animation frames
useEffect(() => {
  if (isPlaying) {
    drawVisualizer();
  } else {
    // Cancel animation when not playing
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }
  
  // Cleanup on unmount
  return () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
}, [isPlaying]);
```

---

## Code Examples

### Adding a New File Category

```jsx
// In the CATEGORIES object, add:
const CATEGORIES = {
  // ... existing categories
  Models3D: { 
    icon: Box3D,  // Import from lucide-react
    exts: ['obj', 'fbx', 'gltf', 'glb', 'stl'] 
  },
};
```

### Adding a New Keyboard Shortcut

```jsx
// In the useEffect for keyboard handling:
useEffect(() => {
  const handleKeyDown = (e) => {
    // ... existing handlers
    
    // Add new shortcut
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      handleDelete(); // Your handler function
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [/* dependencies */]);
```

### Creating a Custom Media Control

```jsx
const CustomControl = ({ onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className="
      p-2 rounded-full
      bg-[#1a120b]/80
      border border-[#3e3228]
      text-[#eaddcf]
      hover:border-[#d44d38]
      hover:text-[#d44d38]
      transition-all duration-200
      hover:scale-110
    "
    title={label}
  >
    <Icon size={20} />
  </button>
);
```

---

## Contributing

When contributing to this codebase, please follow these guidelines:

1. **Component Naming**: Use PascalCase for components (e.g., `CustomVideoPlayer`)
2. **File Organization**: Keep related code together in logical sections
3. **Documentation**: Add JSDoc comments for functions and components
4. **Performance**: Use `useMemo` and `useCallback` for expensive operations
5. **Cleanup**: Always clean up event listeners, timers, and resources in useEffect

---

<p align="center">
  <em>"The Count of Monte Cristo" by Alexandre Dumas</em><br/>
  <strong>SYSTEM OPTIMIZED // 60FPS // SECURE STORAGE</strong>
</p>
