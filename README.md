# Ahmed Elsayed - Portfolio Website

[![Website](https://img.shields.io/badge/demo-live-brightgreen)](https://ahmedtyson.github.io/Ahmed.Elsayed.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Last Updated](https://img.shields.io/github/last-commit/AhmedTyson/Ahmed.Elsayed.dev)](https://github.com/AhmedTyson/Ahmed.Elsayed.dev)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/AhmedTyson/Ahmed.Elsayed.dev/actions)

> A modern, responsive portfolio website showcasing the work and skills of Ahmed Elsayed — .NET Full Stack Developer & Business Information Systems student.

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Performance & Optimization](#performance--optimization)
- [Theme System](#theme-system)
- [Projects Showcase](#projects-showcase)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Contact](#contact)
- [License](#license)

## Overview

This portfolio highlights my journey as a developer, featuring projects, technical skills, certifications, and professional experience. Built with modern web technologies, it focuses on performance, accessibility, and user experience with comprehensive theme support and mobile-first responsive design.

**Key Highlights:**
- 10+ completed projects across web development, AI, and database systems
- 4 professional certifications in development technologies
- 2+ years of hands-on coding experience
- Academic excellence: 3.58 GPA in Business Information Systems

## Live Demo

🚀 **[Visit Portfolio →](https://ahmedtyson.github.io/Ahmed.Elsayed.dev/)**

## Features

### Core Functionality
- **📱 Responsive Design** - Mobile-first approach with optimized layouts
- **🎨 Multi-Theme Support** - Light, Dark, and Gradient themes with system detection
- **🔍 Project Filtering** - Category-based showcase (Web, AI, Python)
- **📺 Live Demos** - Embedded iframe previews of projects
- **📄 CV Download** - Direct access to professional resume
- **📞 Contact Integration** - Multiple communication channels

### User Experience
- **⚡ Performance Optimized** - Lazy loading, compressed assets, fast load times
- **♿ Accessibility First** - WCAG 2.1 AA compliant, semantic HTML, ARIA labels
- **🎭 Interactive Animations** - Smooth scrolling, hover effects, counter animations
- **💾 Persistent Preferences** - Theme choice saved in localStorage

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ |
| **Framework** | Bootstrap 5 |
| **Icons & Fonts** | Font Awesome 6, Google Fonts (Inter, JetBrains Mono) |
| **Storage** | LocalStorage API |
| **Deployment** | GitHub Pages with CI/CD |

## Project Structure

```
Ahmed.Elsayed.dev/
├── 📁 .github/
│   └── workflows/
│       └── static.yml          # GitHub Actions CI/CD
├── 📁 community/               # Community guidelines
├── 📁 docs/optimization/       # Documentation
├── 📁 public/                  # Public assets
│   └── assets/
│       └── documents/
│           └── Ahmed_Elsayed_NET_Developer_CV.pdf
├── 📁 src/                     # Source code
│   ├── pages/
│   │   ├── index.html
│   │   └── projects/
│   │       ├── main-projects.html
│   │       ├── library-management-system.html
│   │       ├── petopia-website.html
│   │       ├── personal-assistant.html
│   │       ├── javanova.html
│   │       ├── portfolio-website.html
│   │       └── car-loan-calculator.html
│   ├── scripts/
│   │   └── main.js             # Interactive functionality
│   ├── styles/
│   │   ├── main.css
│   │   └── components/
│   │       └── projects.css
│   └── templates/
│       └── project-template.html
├── 📄 index.html               # Main entry point
├── 📄 package.json            # Project configuration
├── 📄 .editorconfig           # Editor configuration
├── 📄 .gitignore              # Git ignore rules
├── 📄 LICENSE                 # MIT License
└── 📄 README.md               # This file
```

## Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Basic knowledge of HTML/CSS/JavaScript (for customization)

### Installation

```bash
# Clone the repository
git clone https://github.com/AhmedTyson/Ahmed.Elsayed.dev.git
cd Ahmed.Elsayed.dev

# Serve locally using Python
python -m http.server 3000

# Or using Node.js
npx live-server

# Or using npm (if package.json is configured)
npm start
```

### Development Workflow

1. **Content Updates**: Edit HTML files in `src/pages/` or root `index.html`
2. **Styling Changes**: Modify CSS in `src/styles/` or root stylesheets
3. **Functionality Updates**: Update JavaScript in `src/scripts/main.js`
4. **New Projects**: Use `src/templates/project-template.html` as a starting point

## Performance & Optimization

### Core Web Vitals
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Features
- **Lazy Loading**: Images and iframes load on viewport intersection
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Asset Compression**: Optimized images with WebP fallbacks
- **Efficient Caching**: Strategic use of browser cache and localStorage
- **Critical CSS**: Inline above-the-fold styles

## Theme System

The portfolio features an advanced theming system:

```javascript
// Theme options
const themes = ['light', 'dark', 'gradient'];

// Features
- System preference detection
- Manual theme switching
- Persistent user choice (localStorage)
- Smooth transitions between themes
- Gradient mode with custom color schemes
```

### Responsive Breakpoints
| Device | Width Range | Approach |
|--------|-------------|----------|
| Mobile | 320px - 767px | Single column, touch-optimized |
| Tablet | 768px - 991px | Two-column hybrid layout |
| Desktop | 992px - 1199px | Multi-column with sidebar |
| Large Display | 1200px+ | Fixed-width container |

## Projects Showcase

### Featured Projects

1. **Sierra ILS Library Management System** (May 2025)
   - OOP-based system with comprehensive functionality
   - Technologies: Python, .NET design patterns, SOLID principles

2. **PETOPIA - Pet Adoption Platform** (March 2025)
   - Modern web interface with responsive design
   - Technologies: HTML5, CSS3, JavaScript

3. **AI Personal Assistant** (Sep 2024)
   - GPT-3 powered web application
   - Technologies: Flask, Python, PostgreSQL, GPT-3

4. **JavaNova Learning Academy** (July 2025)
   - Educational platform for Java development
   - Technologies: HTML5, CSS3, JavaScript

5. **Portfolio Website** (Aug 2025)
   - Responsive design with modern interface
   - Technologies: HTML5, CSS3, JavaScript, Bootstrap

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Project Addition Guidelines
- Add project page in `src/pages/projects/`
- Update main projects listing in `index.html`
- Include live demo links where applicable
- Follow existing code style and structure

## Changelog

| Version | Date | Description |
|---------|------|-------------|
| **v2.0** | Aug 2025 | Complete responsive redesign with enhanced mobile experience |
| **v1.5** | Jul 2025 | Added project filtering and improved animations |
| **v1.0** | Jun 2025 | Initial release with core portfolio features |

### Recent Updates
- ✅ Fixed CV download file paths
- ✅ Enhanced accessibility with ARIA labels and contrast improvements
- ✅ Added security policy and community guidelines
- ✅ Implemented automated CI/CD workflow

## Contact

**Ahmed Elsayed Abdel-Al**

📧 **Email**: [ahmed.elsayed.abdelal.2025@gmail.com](mailto:ahmed.elsayed.abdelal.2025@gmail.com)  
💼 **LinkedIn**: [ahmed-elsayed-8b9bba28a](https://linkedin.com/in/ahmed-elsayed-8b9bba28a)  
🐙 **GitHub**: [AhmedTyson](https://github.com/AhmedTyson)  
📍 **Location**: Qalyubia, Egypt

### Professional Background
- **Education**: Bachelor of Business Information Systems, Helwan University (GPA: 3.58)
- **Specialization**: .NET Full Stack Development, Python, Database Systems
- **Philosophy**: *"Clarity Over Complexity"* - Creating software that's genuinely valuable to users

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by Ahmed Elsayed | © 2025**

[⭐ Star this repo](https://github.com/AhmedTyson/Ahmed.Elsayed.dev) if you found it helpful!

</div>
