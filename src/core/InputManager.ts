export type EventCallback = (event: Event) => void;
export type SimpleCallback = () => void;

export interface InputManagerOptions {
  preventContextMenu?: boolean;
}

export class InputManager {
  private eventListeners: Map<string, Map<string, EventCallback>> = new Map();
  private options: Required<InputManagerOptions>;

  constructor(options: InputManagerOptions = {}) {
    this.options = {
      preventContextMenu: options.preventContextMenu ?? true
    };

    this.setupGlobalListeners();
  }

  private setupGlobalListeners(): void {
    // Prevent context menu on right click if enabled
    if (this.options.preventContextMenu) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.triggerEvent('window', 'resize');
  }

  // Element-based event management
  public addEventToElement(
    elementId: string,
    eventType: string,
    callback: EventCallback
  ): void {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id '${elementId}' not found`);
      return;
    }

    const wrappedCallback = (event: Event) => {
      callback(event);
    };

    element.addEventListener(eventType, wrappedCallback);

    // Store for cleanup
    if (!this.eventListeners.has(elementId)) {
      this.eventListeners.set(elementId, new Map());
    }
    this.eventListeners.get(elementId)!.set(eventType, wrappedCallback);
  }

  public removeEventFromElement(elementId: string, eventType: string): void {
    const element = document.getElementById(elementId);
    const callbacks = this.eventListeners.get(elementId);
    
    if (element && callbacks && callbacks.has(eventType)) {
      const callback = callbacks.get(eventType)!;
      element.removeEventListener(eventType, callback);
      callbacks.delete(eventType);
      
      if (callbacks.size === 0) {
        this.eventListeners.delete(elementId);
      }
    }
  }

  // Global event system
  private globalEvents: Map<string, Map<string, EventCallback[]>> = new Map();

  public addEventListener(
    target: string,
    eventType: string,
    callback: EventCallback
  ): void {
    if (!this.globalEvents.has(target)) {
      this.globalEvents.set(target, new Map());
    }
    
    const targetEvents = this.globalEvents.get(target)!;
    if (!targetEvents.has(eventType)) {
      targetEvents.set(eventType, []);
    }
    
    targetEvents.get(eventType)!.push(callback);
  }

  public removeEventListener(
    target: string,
    eventType: string,
    callback: EventCallback
  ): void {
    const targetEvents = this.globalEvents.get(target);
    if (targetEvents && targetEvents.has(eventType)) {
      const callbacks = targetEvents.get(eventType)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private triggerEvent(target: string, eventType: string, event?: Event): void {
    const targetEvents = this.globalEvents.get(target);
    if (targetEvents && targetEvents.has(eventType)) {
      const callbacks = targetEvents.get(eventType)!;
      callbacks.forEach(callback => {
        if (event) {
          callback(event);
        }
      });
    }
  }

  // Convenience methods for common UI elements
  public setupButton(
    buttonId: string,
    clickCallback: EventCallback
  ): void {
    this.addEventToElement(buttonId, 'click', clickCallback);
  }

  public setupSlider(
    sliderId: string,
    inputCallback: (value: number) => void
  ): void {
    this.addEventToElement(sliderId, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      inputCallback(parseFloat(target.value));
    });
  }

  public setupColorPicker(
    pickerId: string,
    changeCallback: (color: string) => void
  ): void {
    this.addEventToElement(pickerId, 'change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      changeCallback(target.value);
    });
  }

  // Window events
  public onResize(callback: SimpleCallback): void {
    this.addEventListener('window', 'resize', () => callback());
  }

  public onBeforeUnload(callback: SimpleCallback): void {
    window.addEventListener('beforeunload', () => callback());
  }

  // Keyboard handling
  private keyStates: Map<string, boolean> = new Map();

  public setupKeyboardHandling(): void {
    document.addEventListener('keydown', (event) => {
      this.keyStates.set(event.code, true);
      this.triggerEvent('keyboard', 'keydown', event);
    });

    document.addEventListener('keyup', (event) => {
      this.keyStates.set(event.code, false);
      this.triggerEvent('keyboard', 'keyup', event);
    });
  }

  public isKeyPressed(keyCode: string): boolean {
    return this.keyStates.get(keyCode) ?? false;
  }

  public onKeyDown(callback: (event: KeyboardEvent) => void): void {
    this.addEventListener('keyboard', 'keydown', callback as EventCallback);
  }

  public onKeyUp(callback: (event: KeyboardEvent) => void): void {
    this.addEventListener('keyboard', 'keyup', callback as EventCallback);
  }

  // Cleanup
  public dispose(): void {
    // Remove all element event listeners
    this.eventListeners.forEach((callbacks, elementId) => {
      callbacks.forEach((callback, eventType) => {
        this.removeEventFromElement(elementId, eventType);
      });
    });
    this.eventListeners.clear();

    // Clear global events
    this.globalEvents.clear();

    // Clear key states
    this.keyStates.clear();

    // Remove global listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    if (this.options.preventContextMenu) {
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    }
  }
}