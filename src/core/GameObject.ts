import * as THREE from 'three';

export interface GameObjectOptions {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

export abstract class GameObject {
  protected mesh: THREE.Mesh;
  protected geometry: THREE.BufferGeometry;
  protected material: THREE.Material;
  protected transform: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };

  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    options: GameObjectOptions = {}
  ) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(geometry, material);

    // Setup transform
    this.transform = {
      position: options.position?.clone() ?? new THREE.Vector3(),
      rotation: options.rotation?.clone() ?? new THREE.Euler(),
      scale: options.scale?.clone() ?? new THREE.Vector3(1, 1, 1)
    };

    this.updateTransform();
    this.init();
  }

  // Abstract method for child-specific initialization
  protected abstract init(): void;

  // Abstract method for frame updates
  public abstract update(deltaTime: number): void;

  // Transform methods
  public setPosition(x: number, y: number, z: number): void;
  public setPosition(position: THREE.Vector3): void;
  public setPosition(xOrPosition: number | THREE.Vector3, y?: number, z?: number): void {
    if (xOrPosition instanceof THREE.Vector3) {
      this.transform.position.copy(xOrPosition);
    } else {
      this.transform.position.set(xOrPosition, y!, z!);
    }
    this.updateTransform();
  }

  public setRotation(x: number, y: number, z: number): void;
  public setRotation(rotation: THREE.Euler): void;
  public setRotation(xOrRotation: number | THREE.Euler, y?: number, z?: number): void {
    if (xOrRotation instanceof THREE.Euler) {
      this.transform.rotation.copy(xOrRotation);
    } else {
      this.transform.rotation.set(xOrRotation, y!, z!);
    }
    this.updateTransform();
  }

  public setScale(x: number, y: number, z: number): void;
  public setScale(scale: THREE.Vector3): void;
  public setScale(uniform: number): void;
  public setScale(xOrScaleOrUniform: number | THREE.Vector3, y?: number, z?: number): void {
    if (xOrScaleOrUniform instanceof THREE.Vector3) {
      this.transform.scale.copy(xOrScaleOrUniform);
    } else if (y === undefined && z === undefined) {
      // Uniform scaling
      this.transform.scale.set(xOrScaleOrUniform, xOrScaleOrUniform, xOrScaleOrUniform);
    } else {
      this.transform.scale.set(xOrScaleOrUniform, y!, z!);
    }
    this.updateTransform();
  }

  protected updateTransform(): void {
    this.mesh.position.copy(this.transform.position);
    this.mesh.rotation.copy(this.transform.rotation);
    this.mesh.scale.copy(this.transform.scale);
  }

  // Getters
  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public getPosition(): THREE.Vector3 {
    return this.transform.position.clone();
  }

  public getRotation(): THREE.Euler {
    return this.transform.rotation.clone();
  }

  public getScale(): THREE.Vector3 {
    return this.transform.scale.clone();
  }

  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }

  public getMaterial(): THREE.Material {
    return this.material;
  }

  // Utility methods
  public setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  public isVisible(): boolean {
    return this.mesh.visible;
  }

  public lookAt(target: THREE.Vector3): void {
    this.mesh.lookAt(target);
  }

  // Cleanup
  public dispose(): void {
    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      if (Array.isArray(this.material)) {
        this.material.forEach(mat => mat.dispose());
      } else {
        this.material.dispose();
      }
    }
  }
}