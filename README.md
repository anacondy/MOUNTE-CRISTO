# 📜 MONTE CRISTO - The Archives

> **🔗 Live Site: [https://anacondy.github.io/MOUNTE-CRISTO/](https://anacondy.github.io/MOUNTE-CRISTO/)**

*"All human wisdom is contained in these two words — Wait and Hope."*

A vintage-themed file archive vault application inspired by Alexandre Dumas' "The Count of Monte Cristo". This elegant web application allows you to organize, preview, and manage your files with a beautifully crafted interface featuring a dark, antique aesthetic.

---

## 📸 Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/9b38e3ce-0b1d-4a90-951a-0a072792877f)

### Vault / Archives
![Vault Page](https://github.com/user-attachments/assets/92837478-13e1-4e41-bf03-9678b3ec2ba9)

---

## ✨ Features

### 🎨 **Stunning Visual Design**
- Vintage book-inspired dark theme with aged paper colors
- Blood red accents for interactive elements
- Film grain overlay for authentic vintage feel
- Smooth 60fps animations throughout
- Responsive design for 16:9 and 20:9 devices

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

- **GPU Acceleration**: CSS transforms use `translateZ(0)` for hardware acceleration
- **Code Splitting**: Vendor and icon chunks are split for better caching
- **Efficient Animations**: Uses `requestAnimationFrame` for 60fps visualizer
- **Memory Management**: Object URLs are properly revoked to prevent memory leaks
- **Lazy Loading**: Components render only when needed

---

## 📱 Responsive Design

The application is optimized for various screen sizes and aspect ratios:

- **Mobile (< 640px)**: Compact grid, bottom navigation tabs
- **Tablet (640px - 1024px)**: Medium grid, sidebar navigation
- **Desktop (> 1024px)**: Full grid, expanded sidebar
- **16:9 Aspect Ratio**: Optimized sidebar width and grid columns
- **20:9 Aspect Ratio**: Compact sidebar for ultra-wide screens

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
  <strong>SYSTEM OPTIMIZED // 60FPS // SECURE STORAGE</strong>
</p>