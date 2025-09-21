import * as THREE from 'three';

export interface SceneOptions {
  backgroundColor?: number;
  enableFog?: boolean;
  fogColor?: number;
  fogNear?: number;
  fogFar?: number;
}

export abstract class BaseScene {
  protected scene: THREE.Scene;
  protected gameObjects: Map<string, any> = new Map();
  protected lights: THREE.Light[] = [];
  protected options: Required<SceneOptions>;

  constructor(options: SceneOptions = {}) {
    this.scene = new THREE.Scene();
    
    // Set default options
    this.options = {
      backgroundColor: options.backgroundColor ?? 0x222222,
      enableFog: options.enableFog ?? false,
      fogColor: options.fogColor ?? 0x222222,
      fogNear: options.fogNear ?? 1,
      fogFar: options.fogFar ?? 100
    };

    this.setupScene();
    this.init();
  }

  private setupScene(): void {
    // Set background color
    this.scene.background = new THREE.Color(this.options.backgroundColor);

    // Setup fog if enabled
    if (this.options.enableFog) {
      this.scene.fog = new THREE.Fog(
        this.options.fogColor,
        this.options.fogNear,
        this.options.fogFar
      );
    }
  }

  // Abstract methods that must be implemented by child classes
  protected abstract init(): void;
  public abstract update(deltaTime: number): void;

  // GameObject management
  public addGameObject(id: string, gameObject: any): void {
    this.gameObjects.set(id, gameObject);
    if (gameObject.getMesh) {
      this.scene.add(gameObject.getMesh());
    }
  }

  public removeGameObject(id: string): void {
    const gameObject = this.gameObjects.get(id);
    if (gameObject) {
      if (gameObject.getMesh) {
        this.scene.remove(gameObject.getMesh());
      }
      if (gameObject.dispose) {
        gameObject.dispose();
      }
      this.gameObjects.delete(id);
    }
  }

  public getGameObject(id: string): any {
    return this.gameObjects.get(id);
  }

  // Light management
  public addLight(light: THREE.Light): void {
    this.lights.push(light);
    this.scene.add(light);
  }

  public removeLight(light: THREE.Light): void {
    const index = this.lights.indexOf(light);
    if (index > -1) {
      this.lights.splice(index, 1);
      this.scene.remove(light);
    }
  }

  // Getters
  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getGameObjects(): Map<string, any> {
    return this.gameObjects;
  }

  // Lifecycle methods
  public onResize(width: number, height: number): void {
    // Override in child classes if needed
  }

  public dispose(): void {
    // Dispose all game objects
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.dispose) {
        gameObject.dispose();
      }
    });
    this.gameObjects.clear();

    // Remove all lights
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights.length = 0;

    // Clear scene
    this.scene.clear();
  }
}