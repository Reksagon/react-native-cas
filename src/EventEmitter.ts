import {
  NativeEventEmitter,
  NativeModules,
  EmitterSubscription,
} from 'react-native';
import CASMobileAdsNative from './modules/NativeCASMobileAdsModule';

type Unsubscribe = () => void;

const CASNative =
  (NativeModules as any).CASMobileAds ?? CASMobileAdsNative;

class CASEmitter extends NativeEventEmitter {
  private ready = false;
  private perEventCount = new Map<string, number>();
  private totalCount = 0;

  constructor() {
    super(CASNative);
  }

  private inc(event: string) {
    const cur = this.perEventCount.get(event) ?? 0;
    this.perEventCount.set(event, cur + 1);
    this.totalCount += 1;
  }

  private dec(event: string) {
    const cur = this.perEventCount.get(event) ?? 0;
    if (cur <= 1) this.perEventCount.delete(event);
    else this.perEventCount.set(event, cur - 1);

    if (this.totalCount > 0) this.totalCount -= 1;
  }

  addListener<T = any>(
    event: string,
    listener: (payload: T) => void,
    context?: Record<string, unknown>,
  ): EmitterSubscription {
    if (!this.ready && typeof CASNative?.eventsNotifyReady === 'function') {
      try { CASNative.eventsNotifyReady(true); } catch {}
      this.ready = true;
    }


    if (typeof CASNative?.addListener === 'function') {
      CASNative.addListener(event);
    }

    this.inc(event);
    const sub = super.addListener(event, listener as any, context);
    (sub as any).eventType = event;
    let removed = false;

    sub.remove = () => {
      if (removed) return;
      removed = true;

      if (typeof CASNative?.removeListeners === 'function') {
        try { CASNative.removeListeners(1); } catch {}
      }
      this.dec(event);
    };

    return sub;
  }

  removeAllListeners(event: string): void {
    const n = this.perEventCount.get(event) ?? 0;
    if (n > 0 && typeof CASNative?.removeListeners === 'function') {
      try { CASNative.removeListeners(n); } catch {}
      this.totalCount = Math.max(0, this.totalCount - n);
      this.perEventCount.delete(event);
    }
    super.removeAllListeners(event);
  }
}

const emitter = new CASEmitter();

export function addEventListener<T = void>(
  name: string,
  cb: (p: T) => void,
): Unsubscribe {
  const sub = emitter.addListener<T>(name, cb);
  return () => sub.remove();
}

export function removeEventListener(name: string): void {
  emitter.removeAllListeners(name);
}
