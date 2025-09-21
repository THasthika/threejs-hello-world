import * as THREE from 'three';
import { CameraController } from '../core/CameraController';
import { InputManager } from '../core/InputManager';
import { SceneManager } from '../core/SceneManager';
import { BaseScene } from '../core/BaseScene';

export interface AppOptions {
  container: HTMLElement;
  sceneManager: SceneManager;
  backgroundColor?: number;
  enableOrbitControls?: boolean;
  autoRotate?: boolean;
}

export class App {
  // Core Three.js components
  private sceneManager!: SceneManager;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cameraController!: CameraController;
  private inputManager!: InputManager;

  // App state
  private container: HTMLElement;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private isRunning: boolean = false;

  constructor(options: AppOptions) {
    this.container = options.container;
    this.clock = new THREE.Clock();

    // Initialize Three.js components
    this.initializeRenderer();
    this.initializeCamera();
    this.initializeSceneManager(options);
    this.initializeCameraController(options);
    this.initializeInputManager();

    // Setup UI event handlers
    this.setupEventHandlers();

    // Start the application
    this.start();
  }

  private initializeRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.container.appendChild(this.renderer.domElement);
  }

  private initializeCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    
    this.camera.position.set(0, 0, 5);
  }

  private initializeSceneManager(options: AppOptions): void {
    this.sceneManager = options.sceneManager;

    // Set renderer clear color to match scene
    this.renderer.setClearColor(options.backgroundColor ?? 0x222222);
  }

  private initializeCameraController(options: AppOptions): void {
    this.cameraController = new CameraController(this.camera, this.renderer, {
      enableDamping: true,
      dampingFactor: 0.05,
      enableZoom: true,
      enableRotate: options.enableOrbitControls ?? true,
      enablePan: true,
      autoRotate: options.autoRotate ?? false,
      autoRotateSpeed: 2.0,
      maxDistance: 20,
      minDistance: 2
    });
  }

  private initializeInputManager(): void {
    this.inputManager = new InputManager({
      preventContextMenu: true
    });

    this.inputManager.setupKeyboardHandling();

    // Pass input manager to scene manager
    this.sceneManager.setInputManager(this.inputManager);

    // Setup window resize handling
    this.inputManager.onResize(() => this.handleResize());
    
    // Setup cleanup on page unload
    this.inputManager.onBeforeUnload(() => this.dispose());
  }

  private setupEventHandlers(): void {
    // Auto rotate toggle button
    this.inputManager.setupButton('autoRotateBtn', () => {
      this.cameraController.toggleAutoRotate();
    });

    // Reset camera button
    this.inputManager.setupButton('resetCameraBtn', () => {
      this.cameraController.reset();
    });

    // Speed slider - this will need to be handled by the scene or externally
    this.inputManager.setupSlider('speedRange', (value: number) => {
      // Auto-rotate speed adjustment
      if (this.cameraController.isAutoRotateEnabled()) {
        this.cameraController.setAutoRotateSpeed(value * 100);
      }
    });
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera
    this.cameraController.handleResize(width, height);
    
    // Update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Notify current scene of resize
    const currentScene = this.sceneManager.getCurrentScene();
    if (currentScene && typeof (currentScene as any).onResize === 'function') {
      (currentScene as any).onResize(width, height);
    }
  }

  private animate(): void {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    // Get delta time
    const deltaTime = this.clock.getDelta();

    // Update camera controls
    this.cameraController.update();

    // Update scene manager
    this.sceneManager.update(deltaTime);

    // Render current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (currentScene) {
      this.renderer.render(currentScene.getScene(), this.camera);
    }
  }

  // Public API methods
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  public stop(): void {
    this.isRunning = false;
    
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clock.stop();
  }

  public pause(): void {
    this.stop();
  }

  public resume(): void {
    this.start();
  }

  // Scene management methods
  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  public getCurrentScene(): BaseScene | null {
    return this.sceneManager.getCurrentScene();
  }

  public switchToScene(sceneId: string): Promise<void> {
    return this.sceneManager.switchToScene(sceneId);
  }

  public getCameraController(): CameraController {
    return this.cameraController;
  }

  public getInputManager(): InputManager {
    return this.inputManager;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  // Camera control methods
  public enableCameraControls(enabled: boolean): void {
    this.cameraController.enableControls(enabled);
  }

  public resetCamera(): void {
    this.cameraController.reset();
  }

  public toggleAutoRotate(): void {
    this.cameraController.toggleAutoRotate();
  }

  // Statistics and debugging
  public getStats(): any {
    return {
      isRunning: this.isRunning,
      frameRate: 1 / this.clock.getDelta(),
      currentScene: this.sceneManager.getCurrentScene()?.constructor.name || 'None',
      registeredScenes: this.sceneManager.getRegisteredScenes(),
      cameraPosition: this.cameraController.getCameraPosition(),
      autoRotateEnabled: this.cameraController.isAutoRotateEnabled()
    };
  }

  // Cleanup
  public dispose(): void {
    this.stop();

    // Dispose managers
    if (this.inputManager) {
      this.inputManager.dispose();
    }

    if (this.cameraController) {
      this.cameraController.dispose();
    }

    // Dispose scene manager
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }

    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
      
      // Remove from DOM
      if (this.container && this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}