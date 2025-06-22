export type EventHandler = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, Set<EventHandler>>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
  }

  once(event: string, handler: EventHandler): void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  listenerCount(event: string): number {
    const handlers = this.events.get(event);
    return handlers ? handlers.size : 0;
  }
}

export function addEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler, options);
  
  return () => {
    target.removeEventListener(event, handler, options);
  };
}

export function addEventListeners(
  target: EventTarget,
  events: Record<string, EventListener>,
  options?: AddEventListenerOptions
): () => void {
  const cleanups = Object.entries(events).map(([event, handler]) =>
    addEventListener(target, event, handler, options)
  );
  
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
}

export function createCustomEvent<T = any>(
  name: string,
  detail?: T,
  options?: CustomEventInit
): CustomEvent<T> {
  return new CustomEvent(name, {
    ...options,
    detail,
  });
}

export function dispatchCustomEvent<T = any>(
  target: EventTarget,
  name: string,
  detail?: T,
  options?: CustomEventInit
): boolean {
  const event = createCustomEvent(name, detail, options);
  return target.dispatchEvent(event);
}

export function delegate(
  parent: HTMLElement,
  eventType: string,
  selector: string,
  handler: (event: Event, element: HTMLElement) => void
): () => void {
  const listener = (event: Event) => {
    const target = event.target as HTMLElement;
    const delegateTarget = target.closest(selector);
    
    if (delegateTarget && parent.contains(delegateTarget)) {
      handler(event, delegateTarget as HTMLElement);
    }
  };
  
  return addEventListener(parent, eventType, listener);
}

export function throttleEvent(
  handler: EventHandler,
  delay: number
): EventHandler {
  let lastCall = 0;
  
  return (...args: any[]) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      handler(...args);
    }
  };
}

export function debounceEvent(
  handler: EventHandler,
  delay: number
): EventHandler {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => handler(...args), delay);
  };
}