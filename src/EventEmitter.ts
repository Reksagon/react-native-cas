import { NativeEventEmitter, NativeModules } from 'react-native';
import type { EventSubscription } from 'react-native';

const { CASMobileAds } = NativeModules;
const emitter = new NativeEventEmitter(CASMobileAds);

const subscriptions: Record<string, EventSubscription> = {};

export const addEventListener = <T>(event: string, handler: (event: T) => void): void => {
  const sub = emitter.addListener(event, handler);
  const prev = subscriptions[event];
  if (prev) prev.remove();
  subscriptions[event] = sub;
};

export const removeEventListener = (event: string): void => {
  const sub = subscriptions[event];
  if (sub) {
    sub.remove();
    delete subscriptions[event];
  }
};
