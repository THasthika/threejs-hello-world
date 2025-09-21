import { App } from './core/App';
import './styles.css';

// Application initialization
class Main {
  private app: App | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    const container = document.getElementById('container');
    if (!container) {
      throw new Error('Container element not found!');
    }

    // Initialize the app with configuration
    this.app = new App({
      container,
      backgroundColor: 0x222222,
      cubeColor: 0x00ff00,
      cubeSize: 1,
      rotationSpeed: 0.01,
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
      scene: 'HelloWorldScene',
      gameObjects: 'Cube with rotation',
      cameraControls: 'OrbitControls with damping',
      inputManager: 'Event handling system'
    });
  }

  private dispose(): void {
    if (this.app) {
      this.app.dispose();
      this.app = null;
    }
  }

  // Public API for external access
  public getApp(): App | null {
    return this.app;
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const main = new Main();
  
  // Make app accessible globally for debugging
  (window as any).threeApp = main.getApp();
  
  console.log('Access the app via window.threeApp for debugging');
});

// Export for potential external use
export { Main };
export * from './core/App';
export * from './core/BaseScene';
export * from './core/GameObject';
export * from './core/CameraController';
export * from './core/InputManager';
export * from './scenes/HelloWorldScene';
export * from './objects/Cube';