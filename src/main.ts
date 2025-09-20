import * as THREE from 'three';
import './styles.css';

interface ThreeJSHelloWorldOptions {
  backgroundColor?: number;
  cubeColor?: number;
  rotationSpeed?: number;
}

class ThreeJSHelloWorld {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
  private animationId: number | null = null;
  private rotationSpeed: number = 0.01;
  private container: HTMLElement;

  constructor(container: HTMLElement, options: ThreeJSHelloWorldOptions = {}) {
    this.container = container;
    
    // Initialize Three.js objects
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Create cube with proper typing
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: options.cubeColor ?? 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    
    // Set initial options
    this.rotationSpeed = options.rotationSpeed ?? 0.01;
    
    this.init(options);
    this.animate();
    this.setupEventListeners();
  }

  private init(options: ThreeJSHelloWorldOptions): void {
    // Setup camera
    this.camera.position.z = 5;

    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(options.backgroundColor ?? 0x222222);
    
    // Add renderer to container
    this.container.appendChild(this.renderer.domElement);

    // Add cube to scene
    this.scene.add(this.cube);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate the cube
    this.cube.rotation.x += this.rotationSpeed;
    this.cube.rotation.y += this.rotationSpeed;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  private setupEventListeners(): void {
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle color change button
    const colorBtn = document.getElementById('colorBtn');
    if (colorBtn) {
      colorBtn.addEventListener('click', this.changeColor.bind(this));
    }
    
    // Handle wireframe toggle
    const wireframeBtn = document.getElementById('wireframeBtn');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', this.toggleWireframe.bind(this));
    }
    
    // Handle speed control
    const speedRange = document.getElementById('speedRange') as HTMLInputElement;
    if (speedRange) {
      speedRange.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        this.setSpeed(parseFloat(target.value));
      });
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private changeColor(): void {
    const colors: number[] = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    if (randomColor !== undefined) {
      this.cube.material.color.setHex(randomColor);
    }
  }

  private toggleWireframe(): void {
    this.cube.material.wireframe = !this.cube.material.wireframe;
  }

  private setSpeed(speed: number): void {
    this.rotationSpeed = speed;
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    // Clean up Three.js resources
    this.cube.geometry.dispose();
    this.cube.material.dispose();
    this.renderer.dispose();
    
    // Remove renderer from DOM
    if (this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Application initialization
class App {
  private threeApp: ThreeJSHelloWorld | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    const container = document.getElementById('container');
    if (!container) {
      throw new Error('Container element not found!');
    }

    this.threeApp = new ThreeJSHelloWorld(container, {
      backgroundColor: 0x222222,
      cubeColor: 0x00ff00,
      rotationSpeed: 0.01
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  private destroy(): void {
    if (this.threeApp) {
      this.threeApp.destroy();
      this.threeApp = null;
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

export { ThreeJSHelloWorld, App };