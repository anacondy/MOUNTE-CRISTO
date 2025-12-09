# 📜 MONTE CRISTO - The Archives

> **🔗 Live Site: [https://anacondy.github.io/MOUNTE-CRISTO/](https://anacondy.github.io/MOUNTE-CRISTO/)**

*"All human wisdom is contained in these two words — Wait and Hope."*

A vintage-themed file archive vault application inspired by Alexandre Dumas' "The Count of Monte Cristo". This elegant web application allows you to organize, preview, and manage your files with a beautifully crafted interface featuring a dark, antique aesthetic.

---

## 📸 Screenshots

### Desktop View (1920x1080)
![Desktop Home Page](https://github.com/user-attachments/assets/9ff32b55-87bf-43ea-abf7-152630364c09)

![Desktop Vault](https://github.com/user-attachments/assets/a01c8555-1e1e-4918-9ac2-319aaab5063e)

### Tablet View (768x1024)
![Tablet View](https://github.com/user-attachments/assets/da0797b1-37fb-466e-9519-95691303ad62)

### Mobile 16:9 (360x640)
![Mobile 16:9](https://github.com/user-attachments/assets/0d4fe225-c049-4efe-80e6-c2e803ace94e)

### Mobile 20:9 (360x800)
![Mobile 20:9](https://github.com/user-attachments/assets/893226d5-75d5-47d2-b524-1c0895714ba6)

---

## ✨ Features

### 🎨 **Stunning Visual Design**
- Vintage book-inspired dark theme with aged paper colors
- Blood red accents for interactive elements
- Film grain overlay for authentic vintage feel
- Smooth animations optimized for 60Hz, 90Hz, 120Hz, and 144Hz displays
- Fully responsive design for all screen sizes and aspect ratios
- Hardware-accelerated rendering for buttery-smooth performance

### 📁 **File Management**
- Drag & drop file upload
- Category-based filtering (Images, Videos, Audio, Documents, Code, Archives, etc.)
- Grid view with file type icons
- Keyboard shortcut for quick import (Ctrl+I)

### 🎬 **Media Playback**
- Custom video player with overlay controls
- Custom audio player with frequency visualizer
- Auto-play on file selection
- Keyboard controls:
  - `Space` - Play/Pause
  - `M` - Mute/Unmute
  - `↑/↓` - Volume control
  - `←/→` - Navigate between files

### 💻 **Code Preview & Execution**
- Syntax-highlighted code preview
- Live execution for HTML, JavaScript, CSS, and JSX files
- Sandboxed iframe for safe code execution
- Terminal simulation for non-web languages

### 🔊 **Volume Feedback**
- Visual overlay showing mute/unmute status
- Volume percentage display with red accent color
- Smooth fade animations

---

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Web Audio API** - Audio visualization

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/anacondy/MOUNTE-CRISTO.git

# Navigate to project directory
cd MOUNTE-CRISTO

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```
MOUNTE-CRISTO/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles & Tailwind imports
├── public/
│   └── favicon.svg      # Site favicon
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies & scripts
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+I` | Import files |
| `Space` | Play/Pause media |
| `M` | Toggle mute |
| `↑` | Increase volume |
| `↓` | Decrease volume |
| `←` | Previous file |
| `→` | Next file |

---

## 🎯 Performance Optimizations

### High Refresh Rate Support
- **144Hz/120Hz/90Hz Ready**: Optimized animations and scrolling for high refresh rate displays
- **Adaptive Performance**: Automatically scales to device capabilities
- **Hardware Acceleration**: Full GPU acceleration using CSS transforms and `will-change` properties
- **Smooth Scrolling**: Touch-optimized scrolling with `-webkit-overflow-scrolling: touch`

### Mobile Optimization
- **60 FPS Target**: Optimized for smooth performance even on low-end devices
- **Touch-Optimized**: Minimum 44px touch targets for better mobile usability
- **Responsive Images**: Content-visibility and lazy loading for faster initial load
- **Reduced Motion Support**: Respects user preferences for reduced animations

### Build & Code Optimizations
- **Code Splitting**: Vendor and icon chunks separated for optimal caching
- **Tree Shaking**: Unused code eliminated during build
- **Minification**: Terser with 2-pass compression for smallest bundle size
- **Asset Optimization**: Images inlined under 10KB, fonts preloaded
- **CSS Optimization**: PostCSS with Autoprefixer for maximum compatibility

### Runtime Optimizations
- **Efficient Animations**: Uses `requestAnimationFrame` for 60fps+ visualizer
- **Memory Management**: Object URLs properly revoked to prevent memory leaks
- **Lazy Rendering**: Components render only when needed
- **Event Debouncing**: Optimized event handlers to reduce CPU usage

---

## 📱 Responsive Design

The application is fully optimized for all modern devices and screen configurations:

### Desktop & Monitors
- **Full HD (1920x1080)**: Expanded layout with full sidebar (280px)
- **4K & Ultra-wide**: Optimized for 16:9 and wider aspect ratios
- **High Refresh Rate**: Smooth 144Hz/120Hz/90Hz support

### Tablets
- **Landscape (768x1024)**: Medium grid (3 columns), 240px sidebar
- **Portrait Mode**: Adaptive layout with touch-optimized controls
- **iPad & Surface**: Fully tested and optimized

### Mobile Devices
- **16:9 Aspect Ratio (360x640)**: Standard mobile phones, 2-column grid
- **20:9 Aspect Ratio (360x800)**: Modern smartphones (Samsung, Pixel, etc.)
- **Bottom Navigation**: Fixed bottom tabs for easy thumb access on mobile
- **Safe Areas**: Respects device notches and rounded corners
- **Touch Gestures**: Swipe, drag & drop, pinch-to-zoom where applicable

### Performance Targets
- **Desktop**: Optimized for 144fps on high-refresh displays, 60fps minimum target
- **Tablets**: Targets 90fps on modern tablets, 60fps minimum
- **Mobile**: Targets smooth 60fps even on budget devices
- **Smooth Scrolling**: Optimized for minimal jank and butter-smooth performance

---

## 📄 Documentation

For detailed documentation about the code structure and features, see [DOCUMENTATION.md](./DOCUMENTATION.md).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Alexandre Dumas' "The Count of Monte Cristo"
- Fonts: [Cinzel](https://fonts.google.com/specimen/Cinzel) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Icons: [Lucide React](https://lucide.dev/)

---

<p align="center">
  <strong>OPTIMIZED FOR 144Hz // MOBILE & PC // SMOOTH 60+ FPS // ZERO LAG</strong>
</p>