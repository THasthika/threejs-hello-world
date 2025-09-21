# Three.js Hello World - Modular Framework

A modern Three.js application built with **TypeScript** and **Webpack**, featuring a **modular framework architecture** for building scalable 3D applications. Includes scene management, component system, and interactive controls.

## 🚀 Live Demo

Visit the live demo: [https://THasthika.github.io/threejs-hello-world](https://THasthika.github.io/threejs-hello-world)

## ✨ Features

### Framework Architecture
- **Modular Scene System**: Easy-to-extend BaseScene with lifecycle management
- **Component-Based GameObjects**: Reusable 3D object components with transform controls
- **Scene Manager**: Dynamic scene switching with transition support
- **Input Management**: Centralized event handling with scene-specific controls
- **Camera Controller**: Abstracted OrbitControls with utility methods

### Interactive Features
- **3D Scene**: Rotating cube with realistic lighting and shadows
- **Camera Controls**: Click and drag to orbit, zoom, and pan around the scene
- **Scene Input Handling**: Each scene manages its own input interactions
- **Keyboard Controls**: Scene-specific keyboard shortcuts (C, W, R, Space)
- **UI Controls**: Color customization, wireframe toggle, speed adjustment
- **Auto Rotation**: Toggle automatic camera rotation around objects
- **Responsive Design**: Works on desktop and mobile devices

### Development Features
- **TypeScript**: Full type safety and modern JavaScript features
- **Webpack**: Modern bundling with hot reload and optimization
- **Modular Architecture**: Easily extensible framework for complex 3D applications
- **Scene Switching**: Built-in support for multiple scenes and transitions
- **Component System**: Reusable GameObject components
- **Automatic Deployment**: Uses GitHub Actions for CI/CD
- **Code Splitting**: Optimized bundles for production

## 🛠️ Technologies Used

### Core Framework
- **TypeScript**: Type-safe JavaScript development with strict mode
- **Three.js**: 3D graphics library with TypeScript definitions
- **Webpack 5**: Module bundling and development server with HMR

### Architecture Components
- **Modular Scene System**: BaseScene, SceneManager, GameObject classes
- **Input Management**: Centralized InputManager with scene-specific handlers
- **Camera Controls**: OrbitControls abstraction with utility methods
- **Component System**: Reusable 3D object components

### Development Tools
- **ESLint**: Code linting with TypeScript rules and strict configuration
- **CSS3**: Modern styling with component-based architecture
- **GitHub Actions**: Automated CI/CD pipeline with type checking
- **GitHub Pages**: Free hosting platform with automatic deployment

## 📁 Project Structure

```
threejs-hello-world/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── src/
│   ├── core/                   # Framework core components
│   │   ├── App.ts              # Main application orchestrator
│   │   ├── BaseScene.ts        # Abstract scene base class
│   │   ├── SceneManager.ts     # Scene lifecycle management
│   │   ├── GameObject.ts       # Abstract 3D object base class
│   │   ├── CameraController.ts # Camera controls abstraction
│   │   └── InputManager.ts     # Centralized input handling
│   ├── scenes/                 # Scene implementations
│   │   └── HelloWorldScene.ts  # Demo scene with cube
│   ├── objects/                # GameObject implementations
│   │   └── Cube.ts            # Rotating cube component
│   ├── main.ts                 # Application entry point
│   ├── index.ts                # Framework exports for npm
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
   - Edit `package.json` and replace `THasthika` with your GitHub username
   - Update the `publicPath` in `webpack.config.js`
4. **Push changes** - GitHub Actions will automatically build and deploy your site

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/THasthika/threejs-hello-world.git
   cd threejs-hello-world
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

### Camera Controls
- **Mouse Drag**: Click and hold left mouse button to orbit around the scene
- **Mouse Wheel**: Scroll to zoom in and out  
- **Right Click + Drag**: Pan the camera around the scene
- **Auto Rotate Button**: Toggle automatic camera rotation
- **Reset Camera Button**: Return camera to initial position and orientation

### Scene-Specific Controls (HelloWorldScene)

#### UI Controls
- **Change Color Button**: Randomly changes the cube color
- **Toggle Wireframe Button**: Switches between solid and wireframe view
- **Rotation Speed Slider**: Adjust cube rotation speed (0-0.05)

#### Keyboard Controls
- **C**: Randomize cube color
- **W**: Toggle wireframe mode
- **R**: Reset cube to center position
- **Space**: Scale animation (cube grows then shrinks)

## ⚙️ Framework Architecture

### Core Components

#### App Class (`src/core/App.ts`)
- Main application orchestrator
- Manages renderer, camera, and core Three.js setup
- Integrates with SceneManager for scene lifecycle
- Handles global input manager and window events

#### SceneManager (`src/core/SceneManager.ts`)
- Manages scene lifecycle and switching
- Supports scene transitions (instant, fade, slide)
- Handles input manager delegation to active scenes
- Provides scene registration and unregistration

#### BaseScene (`src/core/BaseScene.ts`)
- Abstract base class for all scenes
- Provides GameObject management and lighting systems
- Handles scene-specific input setup and cleanup
- Includes dispose and resize event handling

#### GameObject (`src/core/GameObject.ts`)
- Abstract base class for all 3D objects
- Provides transform controls (position, rotation, scale)
- Includes update lifecycle and disposal methods
- Type-safe transform manipulation

#### CameraController (`src/core/CameraController.ts`)
- Abstracts OrbitControls with utility methods
- Provides camera reset, auto-rotation, and constraint management
- Handles window resize and camera configuration
- Type-safe camera manipulation

#### InputManager (`src/core/InputManager.ts`)
- Centralized event handling system
- Supports UI element binding and keyboard controls
- Provides scene-specific input delegation
- Handles cleanup and memory management

### Creating New Scenes

```typescript
// 1. Extend BaseScene
class MyScene extends BaseScene {
  protected init(): void {
    // Initialize scene objects
  }

  public update(deltaTime: number): void {
    // Update scene logic
  }

  protected override setupInputHandlers(): void {
    if (!this.inputManager) return;
    
    // Setup scene-specific input handlers
    this.inputManager.setupButton('myButton', () => {
      // Handle button click
    });
  }
}

// 2. Register with SceneManager
sceneManager.registerScene('myScene', new MyScene());
await sceneManager.switchToScene('myScene');
```

### Creating New GameObjects

```typescript
// 1. Extend GameObject
class MyObject extends GameObject {
  constructor(options: MyObjectOptions) {
    super();
    // Initialize geometry and materials
  }

  public update(deltaTime: number): void {
    // Update object logic
    super.update(deltaTime);
  }
}

// 2. Add to scene
scene.addGameObject('myObject', new MyObject(options));
```

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
   cd threejs-hello-world
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Make changes** and test locally

4. **Commit and push** to trigger automatic deployment

### Framework Development

#### Adding a New Scene

1. Create a new scene class in `src/scenes/`:
   ```typescript
   import { BaseScene, SceneOptions } from '../core/BaseScene';
   
   export class MyScene extends BaseScene {
     protected init(): void {
       // Scene initialization
     }
     
     public update(deltaTime: number): void {
       // Scene update logic
     }
     
     protected override setupInputHandlers(): void {
       // Scene-specific input handling
     }
   }
   ```

2. Register the scene in `src/main.ts`:
   ```typescript
   const myScene = new MyScene(options);
   sceneManager.registerScene('myScene', myScene);
   ```

3. Switch to the scene:
   ```typescript
   await sceneManager.switchToScene('myScene');
   ```

#### Adding a New GameObject

1. Create a new object class in `src/objects/`:
   ```typescript
   import { GameObject } from '../core/GameObject';
   
   export class MyObject extends GameObject {
     constructor(options: MyObjectOptions) {
       super();
       // Initialize Three.js geometry and materials
     }
     
     public update(deltaTime: number): void {
       // Update logic
       super.update(deltaTime);
     }
   }
   ```

2. Use in a scene:
   ```typescript
   const myObject = new MyObject(options);
   this.addGameObject('myObject', myObject);
   ```

### Code Structure

#### Core Framework Files

- **`App.ts`**: Main application orchestrator, handles Three.js setup
- **`SceneManager.ts`**: Scene lifecycle management and transitions
- **`BaseScene.ts`**: Abstract scene with GameObject and input management
- **`GameObject.ts`**: Abstract 3D object with transform and lifecycle
- **`CameraController.ts`**: Camera controls with utility methods
- **`InputManager.ts`**: Centralized input handling and event management

#### Implementation Files

- **`HelloWorldScene.ts`**: Demo scene showcasing framework capabilities
- **`Cube.ts`**: Example GameObject with rotation and material controls
- **`main.ts`**: Application initialization and scene setup

## 🌟 Framework Enhancement Ideas

### Scene System Extensions
- **Scene Transitions**: Implement fade, slide, and custom transition effects
- **Scene Persistence**: Save and restore scene state across transitions
- **Scene Preloading**: Background loading of scenes for smooth transitions
- **Scene Hierarchy**: Parent-child scene relationships and inheritance

### GameObject System Extensions
- **Component Architecture**: Add modular components (Transform, Renderer, Collider)
- **Asset Management**: Centralized loading and caching of 3D models and textures
- **Animation System**: Timeline-based animations and state machines
- **Physics Integration**: Add physics engine integration for realistic motion

### Advanced Features
- **Post-processing Pipeline**: Bloom, depth of field, screen-space effects
- **Particle Systems**: GPU-accelerated particle effects and simulations
- **Audio Integration**: 3D spatial audio with scene synchronization
- **VR/AR Support**: WebXR integration for immersive experiences
- **Multi-scene Rendering**: Split-screen and picture-in-picture rendering
- **Performance Monitoring**: Built-in profiling and optimization tools

### Development Tools
- **Scene Editor**: Visual scene composition and editing tools
- **Inspector Panel**: Runtime debugging and property editing
- **Asset Pipeline**: Automated asset optimization and conversion
- **Hot Reload**: Live scene and asset reloading during development

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

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **WebGL 2.0 required**: Most devices since 2017
- **Mobile support**: iOS 14+, Android 9+
- **TypeScript support**: Built with TypeScript 5.2+

## 📚 API Documentation

### Global Access

The framework provides global debugging access:

```javascript
// Access the main app instance
window.threeApp.getStats();
window.threeApp.switchToScene('sceneName');

// Access the scene manager
window.sceneManager.getCurrentScene();
window.sceneManager.getRegisteredScenes();
```

### Framework Exports

The framework can be used as an npm package:

```typescript
import { 
  App, 
  SceneManager, 
  BaseScene, 
  GameObject,
  CameraController,
  InputManager 
} from 'threejs-hello-world';
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/THasthika/threejs-hello-world/issues)
- 📚 **Three.js Docs**: [threejs.org](https://threejs.org/docs/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/THasthika/threejs-hello-world/discussions)

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D graphics library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript development
- [Webpack](https://webpack.js.org/) - Modern module bundling
- [GitHub Pages](https://pages.github.com/) - Free hosting platform
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation

---

🚀 **Ready to build amazing 3D applications with this modular framework!**