class ThreeJSHelloWorld {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.animationId = null;
        this.rotationSpeed = 0.01;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x222222);
        
        // Add renderer to page
        document.getElementById('container').appendChild(this.renderer.domElement);

        // Create cube geometry and material
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            wireframe: false
        });
        this.cube = new THREE.Mesh(geometry, material);
        
        // Add cube to scene
        this.scene.add(this.cube);

        // Add some lighting for better visual effect
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Update material to respond to lighting
        this.cube.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate the cube
        this.cube.rotation.x += this.rotationSpeed;
        this.cube.rotation.y += this.rotationSpeed;

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle color change button
        document.getElementById('colorBtn').addEventListener('click', () => this.changeColor());
        
        // Handle wireframe toggle
        document.getElementById('wireframeBtn').addEventListener('click', () => this.toggleWireframe());
        
        // Handle speed control
        document.getElementById('speedRange').addEventListener('input', (e) => this.setSpeed(e.target.value));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    changeColor() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.cube.material.color.setHex(randomColor);
    }

    toggleWireframe() {
        this.cube.material.wireframe = !this.cube.material.wireframe;
    }

    setSpeed(speed) {
        this.rotationSpeed = parseFloat(speed);
    }

    destroy() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('resize', () => this.onWindowResize());
        
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById('container');
            if (container && this.renderer.domElement.parentNode === container) {
                container.removeChild(this.renderer.domElement);
            }
        }
    }
}

// Initialize the application when the page loads
let app;
window.addEventListener('load', () => {
    app = new ThreeJSHelloWorld();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});