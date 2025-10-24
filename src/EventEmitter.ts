import { NativeEventEmitter } from 'react-native';
import CASMobileAdsNative from './modules/NativeCASMobileAdsModule';

type Unsubscribe = () => void;

const counts = new Map<string, number>();

const emitter = new NativeEventEmitter(CASMobileAdsNative);

export function addAdEventListener<T = void>(
  event: string,
  listener: (payload: T) => void,
): Unsubscribe {
  if (typeof listener !== 'function') {
    throw new Error(`addAdEventListener(_, *) 'listener' expected a function.`);
  }
  CASMobileAdsNative.addListener(event);
  counts.set(event, (counts.get(event) ?? 0) + 1);

  const sub = emitter.addListener(event, listener);

  return () => {
    sub.remove();
    CASMobileAdsNative.removeListeners(1);
    const next = (counts.get(event) ?? 1) - 1;
    next <= 0 ? counts.delete(event) : counts.set(event, next);
  };
}

export function removeAllAdEventListeners(event: string): void {
  const n = counts.get(event) ?? 0;
  if (n > 0) {
    CASMobileAdsNative.removeListeners(n);
    counts.delete(event);
  }
  emitter.removeAllListeners(event);
}
