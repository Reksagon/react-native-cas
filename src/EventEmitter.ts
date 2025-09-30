import { NativeEventEmitter, NativeModules, EmitterSubscription } from 'react-native';

const emitter = new NativeEventEmitter(NativeModules.CASMobileAds);

const registry = new Map<string, Set<EmitterSubscription>>();

export type Unsub = () => void;

export const addEventListener = (name: string, cb: (p?: any) => void): Unsub => {
  const sub = emitter.addListener(name, cb);
  if (!registry.has(name)) registry.set(name, new Set());
  registry.get(name)!.add(sub);

  return () => {
    sub.remove();
    const set = registry.get(name);
    if (set) {
      set.delete(sub);
      if (set.size === 0) registry.delete(name);
    }
  };
};

export const removeEventListener = (name: string): void => {
  const set = registry.get(name);
  if (!set) return;
  for (const sub of set) sub.remove();
  registry.delete(name);
};
