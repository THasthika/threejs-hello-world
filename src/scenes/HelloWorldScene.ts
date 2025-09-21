import * as THREE from 'three';
import { BaseScene, SceneOptions } from '../core/BaseScene';
import { Cube } from '../objects/Cube';

export interface HelloWorldSceneOptions extends SceneOptions {
  cubeColor?: number;
  cubeSize?: number;
  rotationSpeed?: number;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
}

export class HelloWorldScene extends BaseScene {
  private cube: Cube;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private lastTime: number = 0;

  constructor(options: HelloWorldSceneOptions = {}) {
    super(options);
    
    // Store options with defaults
    const cubeColor = options.cubeColor ?? 0x00ff00;
    const cubeSize = options.cubeSize ?? 1;
    const rotationSpeed = options.rotationSpeed ?? 0.01;
    const ambientIntensity = options.ambientLightIntensity ?? 0.6;
    const directionalIntensity = options.directionalLightIntensity ?? 0.8;

    // Create cube
    this.cube = new Cube({
      size: cubeSize,
      color: cubeColor,
      rotationSpeed: new THREE.Vector3(rotationSpeed, rotationSpeed, 0)
    });

    // Create lights
    this.ambientLight = new THREE.AmbientLight(0x404040, ambientIntensity);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    this.directionalLight.position.set(1, 1, 1);

    // Add to scene
    this.addGameObject('cube', this.cube);
    this.addLight(this.ambientLight);
    this.addLight(this.directionalLight);
  }

  protected init(): void {
    // Additional scene initialization if needed
  }

  protected override setupInputHandlers(): void {
    if (!this.inputManager) return;

    // Color change button
    this.inputManager.setupButton('colorBtn', () => {
      this.changeCubeColor();
    });

    // Wireframe toggle button
    this.inputManager.setupButton('wireframeBtn', () => {
      this.toggleCubeWireframe();
    });

    // Speed slider
    this.inputManager.setupSlider('speedRange', (value: number) => {
      this.setCubeRotationSpeed(value);
    });

    // Optional: Add keyboard controls
    this.inputManager.onKeyDown((event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyC':
          this.changeCubeColor();
          break;
        case 'KeyW':
          this.toggleCubeWireframe();
          break;
        case 'KeyR':
          this.resetCube();
          break;
        case 'Space':
          event.preventDefault();
          this.animateCubeScale(2, 500);
          setTimeout(() => this.animateCubeScale(1, 500), 500);
          break;
      }
    });
  }

  protected override cleanupInputHandlers(): void {
    // Remove event listeners if needed
    // InputManager handles most cleanup automatically
  }

  public update(deltaTime: number): void {
    // Update all game objects
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.update) {
        gameObject.update(deltaTime);
      }
    });

    // Store time for next frame
    this.lastTime = deltaTime;
  }

  // Cube control methods
  public getCube(): Cube {
    return this.cube;
  }

  public changeCubeColor(): void {
    this.cube.randomizeColor();
  }

  public toggleCubeWireframe(): void {
    this.cube.toggleWireframe();
  }

  public setCubeRotationSpeed(speed: number): void {
    this.cube.setUniformRotationSpeed(speed);
  }

  public setCubeColor(color: number): void {
    this.cube.setColor(color);
  }

  public setCubeWireframe(wireframe: boolean): void {
    this.cube.setWireframe(wireframe);
  }

  // Light control methods
  public setAmbientLightIntensity(intensity: number): void {
    this.ambientLight.intensity = intensity;
  }

  public setDirectionalLightIntensity(intensity: number): void {
    this.directionalLight.intensity = intensity;
  }

  public setDirectionalLightPosition(x: number, y: number, z: number): void {
    this.directionalLight.position.set(x, y, z);
  }

  // Getters for current state
  public getCubeColor(): number {
    return this.cube.getColor();
  }

  public isCubeWireframe(): boolean {
    return this.cube.isWireframeMode();
  }

  public getCubeRotationSpeed(): THREE.Vector3 {
    return this.cube.getRotationSpeed();
  }

  public getAmbientLightIntensity(): number {
    return this.ambientLight.intensity;
  }

  public getDirectionalLightIntensity(): number {
    return this.directionalLight.intensity;
  }

  // Scene-specific methods
  public resetCube(): void {
    this.cube.setPosition(0, 0, 0);
    this.cube.setRotation(0, 0, 0);
    this.cube.setScale(1);
  }

  public animateCubeScale(scale: number, duration: number = 1000): void {
    // Simple scale animation (could be enhanced with a proper tween library)
    const startScale = this.cube.getScale();
    const targetScale = new THREE.Vector3(scale, scale, scale);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentScale = startScale.clone().lerp(targetScale, progress);
      this.cube.setScale(currentScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}