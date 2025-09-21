import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface CameraControllerOptions {
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  maxDistance?: number;
  minDistance?: number;
  maxPolarAngle?: number;
  minPolarAngle?: number;
}

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private options: Required<CameraControllerOptions>;
  private initialPosition: THREE.Vector3;
  private initialTarget: THREE.Vector3;

  constructor(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    options: CameraControllerOptions = {}
  ) {
    this.camera = camera;
    this.renderer = renderer;
    
    // Store initial position and target
    this.initialPosition = camera.position.clone();
    this.initialTarget = new THREE.Vector3(0, 0, 0);

    // Set default options
    this.options = {
      enableDamping: options.enableDamping ?? true,
      dampingFactor: options.dampingFactor ?? 0.05,
      enableZoom: options.enableZoom ?? true,
      enableRotate: options.enableRotate ?? true,
      enablePan: options.enablePan ?? true,
      autoRotate: options.autoRotate ?? false,
      autoRotateSpeed: options.autoRotateSpeed ?? 2.0,
      maxDistance: options.maxDistance ?? 20,
      minDistance: options.minDistance ?? 2,
      maxPolarAngle: options.maxPolarAngle ?? Math.PI,
      minPolarAngle: options.minPolarAngle ?? 0
    };

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setupControls();
  }

  private setupControls(): void {
    // Basic settings
    this.controls.enableDamping = this.options.enableDamping;
    this.controls.dampingFactor = this.options.dampingFactor;
    this.controls.enableZoom = this.options.enableZoom;
    this.controls.enableRotate = this.options.enableRotate;
    this.controls.enablePan = this.options.enablePan;

    // Auto rotate
    this.controls.autoRotate = this.options.autoRotate;
    this.controls.autoRotateSpeed = this.options.autoRotateSpeed;

    // Distance limits
    this.controls.maxDistance = this.options.maxDistance;
    this.controls.minDistance = this.options.minDistance;

    // Angle limits
    this.controls.maxPolarAngle = this.options.maxPolarAngle;
    this.controls.minPolarAngle = this.options.minPolarAngle;

    // Set initial target
    this.controls.target.copy(this.initialTarget);
  }

  public update(): void {
    this.controls.update();
  }

  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // Control methods
  public enableControls(enabled: boolean): void {
    this.controls.enabled = enabled;
  }

  public toggleAutoRotate(): void {
    this.controls.autoRotate = !this.controls.autoRotate;
  }

  public setAutoRotate(enabled: boolean): void {
    this.controls.autoRotate = enabled;
  }

  public setAutoRotateSpeed(speed: number): void {
    this.controls.autoRotateSpeed = speed;
    this.options.autoRotateSpeed = speed;
  }

  public reset(): void {
    this.camera.position.copy(this.initialPosition);
    this.controls.target.copy(this.initialTarget);
    this.controls.reset();
  }

  public setTarget(target: THREE.Vector3): void {
    this.controls.target.copy(target);
  }

  public getTarget(): THREE.Vector3 {
    return this.controls.target.clone();
  }

  public setCameraPosition(position: THREE.Vector3): void {
    this.camera.position.copy(position);
  }

  public getCameraPosition(): THREE.Vector3 {
    return this.camera.position.clone();
  }

  // Advanced control methods
  public setZoomLimits(min: number, max: number): void {
    this.controls.minDistance = min;
    this.controls.maxDistance = max;
    this.options.minDistance = min;
    this.options.maxDistance = max;
  }

  public setPolarAngleLimits(min: number, max: number): void {
    this.controls.minPolarAngle = min;
    this.controls.maxPolarAngle = max;
    this.options.minPolarAngle = min;
    this.options.maxPolarAngle = max;
  }

  public setDampingFactor(factor: number): void {
    this.controls.dampingFactor = factor;
    this.options.dampingFactor = factor;
  }

  public enableDamping(enabled: boolean): void {
    this.controls.enableDamping = enabled;
    this.options.enableDamping = enabled;
  }

  // Getters for current state
  public isAutoRotateEnabled(): boolean {
    return this.controls.autoRotate;
  }

  public getAutoRotateSpeed(): number {
    return this.controls.autoRotateSpeed;
  }

  public isControlsEnabled(): boolean {
    return this.controls.enabled;
  }

  public getControls(): OrbitControls {
    return this.controls;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  // Cleanup
  public dispose(): void {
    this.controls.dispose();
  }
}