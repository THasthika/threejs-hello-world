import { App } from './core/App';
import { SceneManager } from './core/SceneManager';
import { HelloWorldScene } from './scenes/HelloWorldScene';
import './styles.css';

// Application initialization
class Main {
  private app: App | null = null;
  private sceneManager: SceneManager | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    const container = document.getElementById('container');
    if (!container) {
      throw new Error('Container element not found!');
    }

    // Create scene manager and register scenes
    this.sceneManager = new SceneManager();
    
    // Create and register the HelloWorld scene
    const helloWorldScene = new HelloWorldScene({
      backgroundColor: 0x222222,
      cubeColor: 0x00ff00,
      cubeSize: 1,
      rotationSpeed: 0.01
    });
    
    this.sceneManager.registerScene('helloWorld', helloWorldScene);
    
    // Switch to the initial scene
    this.sceneManager.switchToScene('helloWorld');

    // Initialize the app with scene manager
    this.app = new App({
      container,
      sceneManager: this.sceneManager,
      backgroundColor: 0x222222,
      enableOrbitControls: true,
      autoRotate: false
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.dispose();
    });

    // Log successful initialization
    console.log('Three.js Hello World App initialized successfully!');
    console.log('Framework components:', {
      sceneManager: 'SceneManager with registered scenes',
      currentScene: 'HelloWorldScene with built-in input handling',
      gameObjects: 'Cube with rotation',
      cameraControls: 'OrbitControls with damping',
      inputManager: 'Event handling system',
      keyboardControls: 'C=color, W=wireframe, R=reset, Space=scale animation'
    });
  }

  private dispose(): void {
    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }
    
    if (this.app) {
      this.app.dispose();
      this.app = null;
    }
  }

  // Public API for external access
  public getApp(): App | null {
    return this.app;
  }

  public getSceneManager(): SceneManager | null {
    return this.sceneManager;
  }

  public switchToScene(sceneId: string): Promise<void> {
    if (!this.sceneManager) {
      throw new Error('SceneManager not initialized');
    }
    return this.sceneManager.switchToScene(sceneId);
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const main = new Main();
  
  // Make app accessible globally for debugging
  (window as any).threeApp = main.getApp();
  (window as any).sceneManager = main.getSceneManager();
  
  console.log('Access the app via window.threeApp for debugging');
  console.log('Access the scene manager via window.sceneManager for scene switching');
});

// Export for potential external use
export { Main };
export * from './core/App';
export * from './core/SceneManager';
export * from './core/BaseScene';
export * from './core/GameObject';
export * from './core/CameraController';
export * from './core/InputManager';
export * from './scenes/HelloWorldScene';
export * from './objects/Cube';