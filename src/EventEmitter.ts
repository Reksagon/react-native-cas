import { NativeEventEmitter, NativeModules } from 'react-native';
import type { EventSubscription } from 'react-native';

const { CASMobileAds } = NativeModules;
const emitter = new NativeEventEmitter(CASMobileAds);

const subscriptions: Record<string, EventSubscription> = {};

export const addEventListener = <T>(event: string, handler: (event: T) => void): void => {
  const subscription = emitter.addListener(event, handler);
  const current = subscriptions[event];
  if (current) current.remove();
  subscriptions[event] = subscription;
};

export const removeEventListener = (event: string): void => {
  const current = subscriptions[event];
  if (current) {
    current.remove();
    delete subscriptions[event];
  }
};
