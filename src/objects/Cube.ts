import * as THREE from 'three';
import { GameObject, GameObjectOptions } from '../core/GameObject';

export interface CubeOptions extends GameObjectOptions {
  size?: number;
  color?: number;
  wireframe?: boolean;
  rotationSpeed?: THREE.Vector3;
}

export class Cube extends GameObject {
  private rotationSpeed: THREE.Vector3;
  private isWireframe: boolean = false;

  constructor(options: CubeOptions = {}) {
    const size = options.size ?? 1;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshLambertMaterial({ 
      color: options.color ?? 0x00ff00,
      wireframe: options.wireframe ?? false
    });

    super(geometry, material, options);

    this.rotationSpeed = options.rotationSpeed?.clone() ?? new THREE.Vector3(0.01, 0.01, 0);
    this.isWireframe = options.wireframe ?? false;
  }

  protected init(): void {
    // Any cube-specific initialization
  }

  public update(deltaTime: number): void {
    // Rotate the cube
    this.transform.rotation.x += this.rotationSpeed.x * deltaTime;
    this.transform.rotation.y += this.rotationSpeed.y * deltaTime;
    this.transform.rotation.z += this.rotationSpeed.z * deltaTime;
    
    this.updateTransform();
  }

  // Cube-specific methods
  public setColor(color: number): void {
    (this.material as THREE.MeshLambertMaterial).color.setHex(color);
  }

  public getColor(): number {
    return (this.material as THREE.MeshLambertMaterial).color.getHex();
  }

  public toggleWireframe(): void {
    this.isWireframe = !this.isWireframe;
    (this.material as THREE.MeshLambertMaterial).wireframe = this.isWireframe;
  }

  public setWireframe(wireframe: boolean): void {
    this.isWireframe = wireframe;
    (this.material as THREE.MeshLambertMaterial).wireframe = wireframe;
  }

  public isWireframeMode(): boolean {
    return this.isWireframe;
  }

  public setRotationSpeed(speed: THREE.Vector3): void;
  public setRotationSpeed(x: number, y: number, z: number): void;
  public setRotationSpeed(speedOrX: THREE.Vector3 | number, y?: number, z?: number): void {
    if (speedOrX instanceof THREE.Vector3) {
      this.rotationSpeed.copy(speedOrX);
    } else {
      this.rotationSpeed.set(speedOrX, y ?? speedOrX, z ?? 0);
    }
  }

  public getRotationSpeed(): THREE.Vector3 {
    return this.rotationSpeed.clone();
  }

  public setUniformRotationSpeed(speed: number): void {
    this.rotationSpeed.set(speed, speed, 0);
  }

  // Random color generation
  public randomizeColor(): void {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    if (randomColor !== undefined) {
      this.setColor(randomColor);
    }
  }
}