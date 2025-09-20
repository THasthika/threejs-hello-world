# Three.js Hello World - TypeScript & Webpack

A modern Three.js hello world application built with **TypeScript** and **Webpack**, featuring a rotating 3D cube with interactive controls, deployed automatically to GitHub Pages.

## 🚀 Live Demo

Visit the live demo: [https://yourusername.github.io/threejs-hello-world-pages](https://yourusername.github.io/threejs-hello-world-pages)

## ✨ Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Webpack**: Modern bundling with hot reload and optimization
- **Interactive 3D Cube**: A rotating cube with realistic lighting
- **Color Customization**: Click to randomly change the cube color
- **Wireframe Toggle**: Switch between solid and wireframe rendering
- **Speed Control**: Adjust rotation speed with a slider
- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Deployment**: Uses GitHub Actions for CI/CD
- **Code Splitting**: Optimized bundles for production

## 🛠️ Technologies Used

- **TypeScript**: Type-safe JavaScript development
- **Webpack 5**: Module bundling and development server
- **Three.js**: 3D graphics library with TypeScript definitions
- **CSS3**: Modern styling with CSS modules support
- **ESLint**: Code linting with TypeScript rules
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Free hosting platform

## 📁 Project Structure

```
threejs-hello-world-pages/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── main.ts                 # TypeScript application entry
│   ├── styles.css              # Application styles
│   └── index.html              # HTML template
├── dist/                       # Built output (generated)
├── webpack.config.js           # Webpack configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.json              # ESLint configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Documentation
```

## 🚀 Quick Start

### Option 1: Fork and Deploy (Recommended)

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Set Source to "GitHub Actions"
3. **Update repository URLs**:
   - Edit `package.json` and replace `yourusername` with your GitHub username
   - Update the `publicPath` in `webpack.config.js`
4. **Push changes** - GitHub Actions will automatically build and deploy your site

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/threejs-hello-world-pages.git
   cd threejs-hello-world-pages
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server with hot reload**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:8080`

### Option 3: Manual Build and Deploy

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## 🎮 Controls

- **Change Color**: Randomly changes the cube color
- **Toggle Wireframe**: Switches between solid and wireframe view
- **Rotation Speed**: Slider to adjust rotation speed (0-0.05)

## ⚙️ Configuration

### Customizing the Application

Edit `src/main.ts` to customize:

- **Cube properties**: Change geometry, materials, colors with full TypeScript support
- **Camera settings**: Adjust field of view, position with type safety
- **Lighting**: Modify ambient and directional lights
- **Animation**: Alter rotation speed and direction

### Styling

Edit `src/styles.css` to customize:

- **Colors and gradients**: Update the color scheme
- **Layout**: Modify control panel position and appearance
- **Responsive breakpoints**: Adjust mobile layout

### Build Configuration

Edit `webpack.config.js` to modify:

- **Bundle optimization**: Code splitting, minification
- **Development server**: Port, hot reload settings
- **Output paths**: Change build directory and file naming

### TypeScript Configuration

Edit `tsconfig.json` to adjust:

- **Compiler options**: Target ES version, strict mode settings
- **Type checking**: Enable/disable specific TypeScript checks
- **Module resolution**: Configure how modules are resolved

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow that:

1. **Triggers** on pushes to the `main` branch
2. **Installs** dependencies with npm
3. **Type checks** the TypeScript code
4. **Builds** the application with Webpack
5. **Deploys** the built `dist/` folder to GitHub Pages automatically

### Manual Deployment

Use the included npm scripts:

```bash
# Type check the code
npm run type-check

# Build for production
npm run build

# Deploy current build
npm run deploy

# Build and deploy in one command
npm run predeploy && npm run deploy
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for development (unminified)
npm run build:dev

# Clean build directory
npm run clean
```

## 🔧 Development

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Setup Development Environment

1. **Clone and install**:
   ```bash
   git clone <your-repo-url>
   cd threejs-hello-world-pages
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Make changes** and test locally

4. **Commit and push** to trigger automatic deployment

### Code Structure

#### `src/main.ts`
Contains the main Three.js application class with methods for:
- Scene initialization with TypeScript interfaces
- Rendering loop with proper typing
- Event handling with type-safe DOM manipulation
- Resource cleanup and memory management

#### `src/styles.css`
Responsive styles including:
- Modern glassmorphism design
- Mobile-friendly layout
- Smooth animations and transitions

#### `src/index.html`
HTML template processed by Webpack with:
- Dynamic title injection
- Automatic script and style inclusion
- Semantic HTML5 structure

#### `webpack.config.js`
Webpack configuration with:
- TypeScript compilation via ts-loader
- CSS processing and extraction
- Development server with hot reload
- Production optimization and code splitting

## 🌟 Enhancement Ideas

- **Additional Shapes**: Add spheres, cylinders, custom geometries
- **Particle Systems**: Create animated particle effects
- **Post-processing**: Add bloom, depth of field effects
- **Audio Integration**: Sync animations with audio
- **VR Support**: Add WebXR for virtual reality
- **Physics**: Integrate physics engine for realistic motion

## 🐛 Troubleshooting

### Common Issues

1. **GitHub Pages not updating**:
   - Check Actions tab for deployment status
   - Ensure GitHub Pages is enabled in repository settings

2. **Local server not working**:
   - Ensure Python 3 is installed
   - Try alternative: `python -m http.server 8000`

3. **Three.js errors**:
   - Check browser console for error messages
   - Ensure Three.js CDN is accessible

### Browser Compatibility

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+
- **WebGL required**: Most devices since 2015
- **Mobile support**: iOS 12+, Android 7+

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/threejs-hello-world-pages/issues)
- 📚 **Three.js Docs**: [threejs.org](https://threejs.org/docs/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/threejs-hello-world-pages/discussions)

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D library
- [GitHub Pages](https://pages.github.com/) - Free hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform

---

Made with ❤️ and JavaScript