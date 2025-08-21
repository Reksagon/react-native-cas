import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { useCasContext } from './cas.context';

export const NativeCasDebugTap = () => {
  const { logCasInfo } = useCasContext();

  useEffect(() => {
    const subs: { remove: () => void }[] = [];
    const add = (moduleName: string, events: string[]) => {
      const mod = (NativeModules as any)[moduleName];
      if (!mod) return;
      const emitter = new NativeEventEmitter(mod);
      events.forEach((evt) => {
        subs.push(
          emitter.addListener(evt, (payload) => {
            logCasInfo(`[${moduleName}] ${evt}:`, payload);
          })
        );
      });
    };
    add('MediationManagerModule', [
      'adLoaded',
      'adFailedToLoad',
      'onShown',
      'onShowFailed',
      'onClicked',
      'onComplete',
      'onClosed',
    ]);
    add('CASMobileAds', ['consentFlowDismissed']);
    return () => subs.forEach((s) => s.remove());
  }, [logCasInfo]);

  return null;
};
