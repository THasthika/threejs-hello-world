import { BaseScene } from './BaseScene';
import { InputManager } from './InputManager';

/**
 * Scene transition types for future extensibility
 */
export enum SceneTransition {
    INSTANT = 'instant',
    FADE = 'fade',
    SLIDE = 'slide'
}

/**
 * Scene transition options
 */
export interface SceneTransitionOptions {
    type: SceneTransition;
    duration?: number;
}

/**
 * SceneManager handles scene lifecycle, switching, and management
 * Provides a clean interface for the App class to manage scenes without
 * being coupled to specific scene implementations
 */
export class SceneManager {
    private currentScene: BaseScene | null = null;
    private scenes: Map<string, BaseScene> = new Map();
    private isTransitioning = false;
    private inputManager: InputManager | null = null;

    /**
     * Set the input manager for scene input handling
     */
    setInputManager(inputManager: InputManager): void {
        this.inputManager = inputManager;
        // Setup input for current scene if one is active
        if (this.currentScene) {
            this.currentScene.setInputManager(inputManager);
        }
    }

    /**
     * Register a scene with a unique identifier
     */
    registerScene(id: string, scene: BaseScene): void {
        this.scenes.set(id, scene);
    }

    /**
     * Unregister a scene
     */
    unregisterScene(id: string): void {
        const scene = this.scenes.get(id);
        if (scene) {
            if (this.currentScene === scene) {
                this.currentScene = null;
            }
            scene.dispose();
            this.scenes.delete(id);
        }
    }

    /**
     * Switch to a registered scene
     */
    async switchToScene(
        sceneId: string, 
        options: SceneTransitionOptions = { type: SceneTransition.INSTANT }
    ): Promise<void> {
        if (this.isTransitioning) {
            console.warn('Scene transition already in progress');
            return;
        }

        const newScene = this.scenes.get(sceneId);
        if (!newScene) {
            throw new Error(`Scene with id '${sceneId}' not found`);
        }

        if (this.currentScene === newScene) {
            return; // Already in this scene
        }

        this.isTransitioning = true;

        try {
            // Handle transition based on type
            switch (options.type) {
                case SceneTransition.INSTANT:
                    await this.instantTransition(newScene);
                    break;
                case SceneTransition.FADE:
                    await this.fadeTransition(newScene, options.duration || 500);
                    break;
                case SceneTransition.SLIDE:
                    await this.slideTransition(newScene, options.duration || 500);
                    break;
                default:
                    await this.instantTransition(newScene);
            }
        } finally {
            this.isTransitioning = false;
        }
    }

    /**
     * Get the current active scene
     */
    getCurrentScene(): BaseScene | null {
        return this.currentScene;
    }

    /**
     * Get all registered scene IDs
     */
    getRegisteredScenes(): string[] {
        return Array.from(this.scenes.keys());
    }

    /**
     * Check if a scene is registered
     */
    hasScene(sceneId: string): boolean {
        return this.scenes.has(sceneId);
    }

    /**
     * Update the current scene
     */
    update(deltaTime: number): void {
        if (this.currentScene && !this.isTransitioning) {
            this.currentScene.update(deltaTime);
        }
    }

    /**
     * Dispose of all scenes and cleanup
     */
    dispose(): void {
        if (this.currentScene) {
            this.currentScene.clearInputManager();
            this.currentScene.dispose();
            this.currentScene = null;
        }

        for (const scene of this.scenes.values()) {
            scene.clearInputManager();
            scene.dispose();
        }
        this.scenes.clear();
        this.inputManager = null;
    }

    /**
     * Instant transition - immediate switch
     */
    private async instantTransition(newScene: BaseScene): Promise<void> {
        if (this.currentScene) {
            this.currentScene.clearInputManager();
            this.currentScene.dispose();
        }
        this.currentScene = newScene;
        
        // Setup input manager for the new scene
        if (this.inputManager) {
            this.currentScene.setInputManager(this.inputManager);
        }
        // Note: init() is automatically called in BaseScene constructor
    }

    /**
     * Fade transition - for future implementation
     */
    private async fadeTransition(newScene: BaseScene, duration: number): Promise<void> {
        // For now, just do instant transition
        // In the future, this could implement actual fade effects
        await this.instantTransition(newScene);
    }

    /**
     * Slide transition - for future implementation
     */
    private async slideTransition(newScene: BaseScene, duration: number): Promise<void> {
        // For now, just do instant transition
        // In the future, this could implement actual slide effects
        await this.instantTransition(newScene);
    }
}