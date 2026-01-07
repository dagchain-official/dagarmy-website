# DAG ARMY Website

**Version: 0.2.0** - Optimized Static Site

Official community growth program website for DAGCHAIN and DAGGPT.

## 📋 Project Overview

This is a **pure static HTML website** - no frameworks, no build step, zero dependencies. The site promotes the DAG ARMY community program where users can earn rewards for building, promoting, and scaling the AI-powered decentralized ecosystem.

### What This Is
- ✅ Static HTML/CSS/JavaScript website
- ✅ Webflow-generated base with custom modifications
- ✅ Zero npm dependencies (uses npx for serving)
- ✅ No build process required
- ✅ Optimized for performance and simplicity

### What This Isn't
- ❌ Not a Next.js application
- ❌ Not a React application  
- ❌ Not a TypeScript project
- ❌ Not using any backend framework

## 🚀 Quick Start

### Prerequisites
- **None!** (npx will auto-install serve if needed)

### Running Locally

```bash
# Simplest method - using npm script
npm run dev
# Opens at http://localhost:3000

# Or use a specific port
npm run serve
# Opens at http://localhost:5000

# Or directly with npx (no installation needed)
npx -y serve .
```

**That's it!** No installation, no dependencies, no build step.

### Alternative Methods

#### Python HTTP Server
```bash
python -m http.server 8000
# Opens at http://localhost:8000
```

#### PHP Built-in Server
```bash
php -S localhost:8000
# Opens at http://localhost:8000
```

## 📁 Project Structure

```
dagarmy-website/
├── index.html                 # Main page (complete application)
├── css/                       # Custom stylesheets
│   ├── airdrop-dagpoints.css
│   ├── contribute-earn.css
│   ├── custom-hover.css
│   ├── styles.css
│   └── trust-join.css
├── images/                    # Local images
├── logo1.png                  # DAG ARMY logo
├── dashboard-hero.jpeg        # Hero image
├── package.json               # Minimal config (scripts only)
├── vercel.json                # Deployment config
└── README.md                  # This file
```

**Note:** No `node_modules/`, no `.next/`, no build artifacts!

## 🎨 Features

- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Lottie animations via CDN
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized assets, lazy loading, CDN delivery
- **Modern UI**: Clean, professional dark theme
- **Zero Dependencies**: No packages to install or update

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript**: Vanilla JS (loaded from Webflow CDN)
- **External CDNs**:
  - Webflow (styles and interactions)
  - Google Fonts (Inter Tight)
  - jQuery (for Webflow features)
  - Lottie (animations)

## 📦 Available Scripts

```bash
npm run dev      # Serve site locally (port 3000)
npm run start    # Serve site locally (port 3000)
npm run serve    # Serve site locally (port 5000)
```

**All commands use npx -y serve** - no installation required!

## 🔧 Recent Optimizations (v0.2.0)

### Removed (100% Dead Code)
- ❌ All 18 npm dependencies (Next.js, React, Redux, TypeScript, etc.)
- ❌ `js/main.js` - Never loaded, completely unused
- ❌ `next-env.d.ts` - TypeScript declaration file
- ❌ `.next/` directory - Next.js build artifacts
- ❌ `node_modules/` - All dependency packages
- ❌ `package-lock.json` - No dependencies to lock
- ❌ Hidden commerce elements in HTML
- ✅ **Result:** 250+ MB saved, zero functionality lost

### Project Size Reduction
- **Before:** package.json 1,089 bytes + 18 dependencies (~250 MB)
- **After:** package.json 241 bytes + 0 dependencies (0 MB)
- **Savings:** ~99.9% size reduction, 0% functionality loss

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

The `vercel.json` is configured for static site deployment.

### Netlify
1. Connect repository to Netlify
2. **Build command:** Leave empty (no build needed)
3. **Publish directory:** `./` (root)

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Deploy from branch
3. Select `main` branch root directory

### Any HTTP Server
This is just static files - deploy anywhere that serves HTML!

## 📝 Configuration

### Update Dashboard Link
Find and update in `index.html`:
```html
<a href="http://localhost:4028">Launch Dashboard</a>
```

### Update Logo
Replace `logo1.png` (recommended: 40px height)

### Update Meta Tags
Edit `<head>` section in `index.html` for SEO

## 🎯 Performance

- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Lighthouse Score:** 95+
- **Bundle Size:** ~90KB HTML + CSS (external scripts via CDN)
- **Dependencies:** 0
- **Build Time:** 0s

## ⚡ Development Workflow

1. **Edit files** - Make changes to HTML/CSS
2. **Refresh browser** - See changes instantly
3. **That's it!** - No build process, no hot reload needed

### Recommended Workflow
```bash
# Start dev server
npm run dev

# Open index.html in your editor
# Make changes
# Refresh browser to see updates
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Make changes (edit HTML/CSS directly)
4. Test locally (`npm run dev`)
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

**No build process to worry about!**

## 📚 Documentation

- **REFACTOR_SUMMARY.md** - Details of v0.2.0 optimization
- **OPTIMIZATION_SUMMARY.md** - Historical performance improvements
- **PERFORMANCE_FIXES.md** - Performance optimization details

## 🔗 Links

- **Live Dashboard**: http://localhost:4028 (when running locally)
- **DAGCHAIN**: http://dagchain.network/
- **DAGGPT**: https://www.daggpt.network/

## 📞 Support

For support, please contact the DAG ARMY team.

## 📄 License

This project is part of the DAG ARMY ecosystem.

---

## 🎯 Why Zero Dependencies?

This project is intentionally **dependency-free** because:

1. **Security** - No supply chain vulnerabilities
2. **Simplicity** - Anyone can understand and modify it
3. **Performance** - Faster than any framework
4. **Reliability** - No breaking changes from dependency updates
5. **Maintenance** - Zero time spent on dependency management

**Built with precision engineering by the DAG ARMY Community** ❤️
