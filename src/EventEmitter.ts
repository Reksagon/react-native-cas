import { NativeEventEmitter, NativeModules, EmitterSubscription } from 'react-native';

const emitter = new NativeEventEmitter(NativeModules.CASMobileAds);

const registry = new Map<string, Set<EmitterSubscription>>();

export const addEventListener = (name: string, cb: (p?: any) => void): void => {
  const subscription = emitter.addListener(name, cb);
  if (!registry.has(name)) registry.set(name, new Set());
  registry.get(name)!.add(subscription);
};

export const removeEventListener = (name: string): void => {
  const set = registry.get(name);
  if (!set) return;
  for (const sub of set) sub.remove();
  registry.delete(name);
};
