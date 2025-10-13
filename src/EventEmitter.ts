import { NativeEventEmitter, NativeModules, EmitterSubscription } from 'react-native';

const emitter = new NativeEventEmitter(NativeModules.CASMobileAds);
const registry = new Map<string, Set<EmitterSubscription>>();

export const addEventListener = <T = void>(
  name: string,
  cb: (p: T) => void
): void => {
  const sub = emitter.addListener(name, cb as any);
  if (!registry.has(name)) registry.set(name, new Set());
  registry.get(name)!.add(sub);
};

export const removeEventListener = (name: string): void => {
  const set = registry.get(name);
  if (!set) return;
  for (const sub of set) sub.remove();
  registry.delete(name);
};
