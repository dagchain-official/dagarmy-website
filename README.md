# DAG ARMY Website

Official community growth program website for DAGCHAIN and DAGGPT.

## 📋 Project Overview

This is a static website built with Webflow and exported as HTML. The site promotes the DAG ARMY community program where users can earn rewards for building, promoting, and scaling the AI-powered decentralized ecosystem.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dagarmy-website
```

2. Install dependencies:
```bash
npm install
```

### Running Locally

#### Option 1: Using npm serve (Recommended)
```bash
npm run serve
```
The site will be available at `http://localhost:5000`

#### Option 2: Using Next.js dev server
```bash
npm run dev
```
The site will be available at `http://localhost:3000`

#### Option 3: Using Python HTTP Server
```bash
python -m http.server 8000
```
The site will be available at `http://localhost:8000`

## 📁 Project Structure

```
dagarmy-website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom styles (extracted from inline)
├── js/
│   └── main.js            # Main JavaScript file (organized)
├── logo1.png              # DAG ARMY logo
├── dashboard-hero.jpeg    # Dashboard preview image
├── package.json           # Node.js dependencies
├── README.md              # This file
└── node_modules/          # Dependencies (gitignored)
```

## 🎨 Features

- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Lottie animations and CSS transitions
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized assets and lazy loading
- **Modern UI**: Clean, professional design with dark theme

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript**: Vanilla JS for interactions
- **Webflow**: Original design platform
- **Lottie**: Animation library
- **Google Fonts**: Inter Tight font family

## 📦 Available Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run serve    # Serve static files (custom script)
```

## 🔧 Optimization Done

1. **Code Organization**:
   - Extracted inline CSS to separate file
   - Organized JavaScript into modular functions
   - Added proper comments and documentation

2. **Performance**:
   - Lazy loading for images
   - Optimized asset delivery
   - Minified external resources

3. **Maintainability**:
   - Clean file structure
   - Separated concerns (HTML/CSS/JS)
   - Added comprehensive documentation

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `./`

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch as source

## 📝 Configuration

### Update Dashboard Link
Edit line 367 in `index.html` to change the dashboard URL:
```html
<a href="http://localhost:4028" ...>Launch Dashboard</a>
```

### Update Logo
Replace `logo1.png` with your custom logo (recommended size: 40px height)

### Update Meta Tags
Edit the `<head>` section in `index.html` for SEO customization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the DAG ARMY ecosystem.

## 🔗 Links

- **Dashboard**: http://localhost:4028
- **Main Website**: [Add your main website URL]
- **Documentation**: [Add documentation URL]
- **Community**: [Add community links]

## 📞 Support

For support, please contact the DAG ARMY team or open an issue in the repository.

---

**Built with ❤️ by the DAG ARMY Community**
