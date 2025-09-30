import { NativeModules, NativeEventEmitter } from 'react-native';
import type { CASSpec } from './CASMobileAdsSpec';
import type { InitConfiguration, CASSettings, InitOptions } from '../types/Types';

const { CASMobileAds: CASMobileAdsNative } = NativeModules as unknown as {
  CASMobileAds: CASSpec;
};

export const eventEmitter = new NativeEventEmitter(NativeModules.CASMobileAds);

export class CASMobileAds {
  static setMediationExtras(key: string, value: string): Promise<void> {
    if (typeof key !== 'string' || typeof value !== 'string') {
      return Promise.reject(new Error('setMediationExtras(key, value): both key and value must be strings'));
    }
    return CASMobileAdsNative.setMediationExtras(key, value);
  }

  static initialize(casId: string, options: InitOptions = {}): Promise<InitConfiguration> {
    if (typeof casId !== 'string') {
      return Promise.reject(new Error('initialize(casId, options?): casId must be a string'));
    }
    const payload: any = {};
    if (options.audience != null) payload.audience = options.audience;
    if (options.showConsentFormIfRequired !== undefined)
      payload.showConsentFormIfRequired = options.showConsentFormIfRequired; 
    if (options.forceTestAds !== undefined)
      payload.forceTestAds = options.forceTestAds; 

    if (Array.isArray(options.testDeviceIds)) payload.testDeviceIds = options.testDeviceIds;
    if (options.trialAdFreeInterval != null) payload.trialAdFreeInterval = options.trialAdFreeInterval | 0;

    return CASMobileAdsNative.initialize(casId, Object.keys(payload).length ? payload : null);
  }

  static isInitialized(): Promise<boolean> {
    return CASMobileAdsNative.isInitialized();
  }

  static isInterstitialAdLoaded() { return CASMobileAdsNative.isInterstitialAdLoaded(); }
  static loadInterstitialAd() { return CASMobileAdsNative.loadInterstitialAd(); }
  static showInterstitialAd() { return CASMobileAdsNative.showInterstitialAd(); }
  static setInterstitialAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setInterstitialAutoloadEnabled(enabled); }
  static setInterstitialAutoshowEnabled(enabled: boolean) { return CASMobileAdsNative.setInterstitialAutoshowEnabled(enabled); }
  static setInterstitialMinInterval(seconds: number) { return CASMobileAdsNative.setInterstitialMinInterval(seconds); }
  static restartInterstitialInterval() { return CASMobileAdsNative.restartInterstitialInterval(); }
  static destroyInterstitial() { return CASMobileAdsNative.destroyInterstitial(); }

  static isRewardedAdLoaded() { return CASMobileAdsNative.isRewardedAdLoaded(); }
  static loadRewardedAd() { return CASMobileAdsNative.loadRewardedAd(); }
  static showRewardedAd() { return CASMobileAdsNative.showRewardedAd(); }
  static setRewardedAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setRewardedAutoloadEnabled(enabled); }
  static destroyRewarded() { return CASMobileAdsNative.destroyRewarded(); }

  static isAppOpenAdLoaded() { return CASMobileAdsNative.isAppOpenAdLoaded(); }
  static loadAppOpenAd() { return CASMobileAdsNative.loadAppOpenAd(); }
  static showAppOpenAd() { return CASMobileAdsNative.showAppOpenAd(); }
  static setAppOpenAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setAppOpenAutoloadEnabled(enabled); }
  static setAppOpenAutoshowEnabled(enabled: boolean) { return CASMobileAdsNative.setAppOpenAutoshowEnabled(enabled); }
  static destroyAppOpen() { return CASMobileAdsNative.destroyAppOpen(); }

  static showConsentFlow() { return CASMobileAdsNative.showConsentFlow(); }
  static setConsentFlowEnabled(enabled: boolean) { CASMobileAdsNative.setConsentFlowEnabled(enabled); }
  static addConsentFlowDismissedEventListener(listener: (status: number) => void) {
  const sub = eventEmitter.addListener('consentFlowDismissed', (e: any) => {
    listener(typeof e?.status === 'number' ? e.status : -1);
  });
  return () => sub.remove();
}


  static getSDKVersion() { return CASMobileAdsNative.getSDKVersion(); }
  static setTestMode(enabled: boolean) { CASMobileAdsNative.setTestMode(enabled);
}
  static getSettings(): Promise<CASSettings> { return CASMobileAdsNative.getSettings(); }
  static setSettings(settings: Partial<CASSettings>) { return CASMobileAdsNative.setSettings(settings); }
}
