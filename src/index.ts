// Main framework exports
export { App } from './core/App';
export { SceneManager, SceneTransition } from './core/SceneManager';
export { BaseScene } from './core/BaseScene';
export { GameObject } from './core/GameObject';
export { CameraController } from './core/CameraController';
export { InputManager } from './core/InputManager';

// Scene implementations
export { HelloWorldScene } from './scenes/HelloWorldScene';

// GameObject implementations
export { Cube } from './objects/Cube';

// Types and interfaces
export type { AppOptions } from './core/App';
export type { SceneOptions } from './core/BaseScene';
export type { CameraControllerOptions } from './core/CameraController';
export type { InputManagerOptions } from './core/InputManager';
export type { SceneTransitionOptions } from './core/SceneManager';

// Main application
export * from './main';