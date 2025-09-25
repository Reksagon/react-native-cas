import { NativeEventEmitter } from 'react-native';
import { eventEmitter } from './modules/CASMobileAds'; 

type FullType = 'interstitial' | 'rewarded' | 'appopen';
const TITLE: Record<FullType, string> = {
  interstitial: 'Interstitial',
  rewarded: 'Rewarded',
  appopen: 'AppOpen',
};

type CB = (arg?: any) => void;
const bus = new Map<string, Set<CB>>();

export const addEventListener = (name: string, cb: CB) => {
  if (!bus.has(name)) bus.set(name, new Set());
  bus.get(name)!.add(cb);
};
export const removeEventListener = (name: string) => bus.get(name)?.clear();

const emit = (name: string, payload?: any) => {
  const set = bus.get(name);
  if (!set) return;
  set.forEach((cb) => cb(payload));
};

const normError = (p: any) =>
  p?.error ? p.error :
  { code: p?.errorCode ?? p?.code, message: p?.errorMessage ?? p?.message };

let wired = false;
const wire = () => {
  if (wired) return; wired = true;

  (eventEmitter as NativeEventEmitter).addListener('adLoaded', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}Loaded`);
  });

  (eventEmitter as NativeEventEmitter).addListener('adFailedToLoad', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}LoadFailed`, normError(p));
  });

  (eventEmitter as NativeEventEmitter).addListener('onShown', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}Displayed`);  
  });

  (eventEmitter as NativeEventEmitter).addListener('onShowFailed', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}FailedToShow`, normError(p));
  });

  (eventEmitter as NativeEventEmitter).addListener('onClicked', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}Clicked`);
  });

  (eventEmitter as NativeEventEmitter).addListener('onClosed', (p: any) => {
    const t = TITLE[p?.type as FullType]; if (!t) return;
    emit(`on${t}Hidden`);
  });

  (eventEmitter as NativeEventEmitter).addListener('onRewarded', (_p: any) => {
    emit('onRewardedCompleted');
  });
};

wire();
