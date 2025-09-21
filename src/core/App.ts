import * as THREE from 'three';
import { CameraController } from '../core/CameraController';
import { InputManager } from '../core/InputManager';
import { HelloWorldScene } from '../scenes/HelloWorldScene';

export interface AppOptions {
  container: HTMLElement;
  backgroundColor?: number;
  cubeColor?: number;
  cubeSize?: number;
  rotationSpeed?: number;
  enableOrbitControls?: boolean;
  autoRotate?: boolean;
}

export class App {
  // Core Three.js components
  private scene!: HelloWorldScene;
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
    this.initializeScene(options);
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

  private initializeScene(options: AppOptions): void {
    this.scene = new HelloWorldScene({
      backgroundColor: options.backgroundColor ?? 0x222222,
      cubeColor: options.cubeColor ?? 0x00ff00,
      cubeSize: options.cubeSize ?? 1,
      rotationSpeed: options.rotationSpeed ?? 0.01
    });

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

    // Setup window resize handling
    this.inputManager.onResize(() => this.handleResize());
    
    // Setup cleanup on page unload
    this.inputManager.onBeforeUnload(() => this.dispose());
  }

  private setupEventHandlers(): void {
    // Color change button
    this.inputManager.setupButton('colorBtn', () => {
      this.scene.changeCubeColor();
    });

    // Wireframe toggle button
    this.inputManager.setupButton('wireframeBtn', () => {
      this.scene.toggleCubeWireframe();
    });

    // Auto rotate toggle button
    this.inputManager.setupButton('autoRotateBtn', () => {
      this.cameraController.toggleAutoRotate();
    });

    // Reset camera button
    this.inputManager.setupButton('resetCameraBtn', () => {
      this.cameraController.reset();
    });

    // Speed slider
    this.inputManager.setupSlider('speedRange', (value: number) => {
      this.scene.setCubeRotationSpeed(value);
      
      // Also update auto-rotate speed if enabled
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

    // Notify scene of resize
    this.scene.onResize(width, height);
  }

  private animate(): void {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    // Get delta time
    const deltaTime = this.clock.getDelta();

    // Update camera controls
    this.cameraController.update();

    // Update scene
    this.scene.update(deltaTime);

    // Render
    this.renderer.render(this.scene.getScene(), this.camera);
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

  // Scene control methods
  public getScene(): HelloWorldScene {
    return this.scene;
  }

  public getCameraController(): CameraController {
    return this.cameraController;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  // Advanced control methods
  public setCubeColor(color: number): void {
    this.scene.setCubeColor(color);
  }

  public setCubeWireframe(wireframe: boolean): void {
    this.scene.setCubeWireframe(wireframe);
  }

  public setCubeRotationSpeed(speed: number): void {
    this.scene.setCubeRotationSpeed(speed);
  }

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
      cubeColor: this.scene.getCubeColor(),
      cubeRotationSpeed: this.scene.getCubeRotationSpeed(),
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

    // Dispose scene
    if (this.scene) {
      this.scene.dispose();
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