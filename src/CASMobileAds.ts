import CASMobileAdsNative from './modules/NativeCASMobileAdsModule';
import type { InitializationStatus, InitializationParams } from './types/Initialization';
import { ConsentFlowStatus } from './types/Initialization';
import { version as reactNativeVersion } from 'react-native/Libraries/Core/ReactNativeVersion';
import { MobileAds as MobileAdsModule } from './types/MobileAds';

class MobileAds implements MobileAdsModule {
  initialize(casId: string, options: InitializationParams = {}): Promise<InitializationStatus> {
    if (typeof casId !== 'string') {
      return Promise.reject(new Error('initialize(casId, options?): casId must be a string'));
    }

    return CASMobileAdsNative.initialize(casId, {
      reactNativeVersion: `${reactNativeVersion.major}.${reactNativeVersion.minor}.${reactNativeVersion.patch}`,
      targetAudience:
        options.targetAudience !== undefined ? Number(options.targetAudience) : undefined,
      showConsentFormIfRequired: options.showConsentFormIfRequired ?? true,
      forceTestAds: options.forceTestAds ?? false,
      testDeviceIds: options.testDeviceIds,
      debugGeography:
        options.debugGeography !== undefined ? Number(options.debugGeography) : undefined,
      mediationExtras: options.mediationExtras,
    });
  }

  isInitialized(): Promise<boolean> {
    return CASMobileAdsNative.isInitialized();
  }

  showConsentFlow(): Promise<ConsentFlowStatus> {
    return CASMobileAdsNative.showConsentFlow();
  }

  getSDKVersion(): Promise<string> {
    return CASMobileAdsNative.getSDKVersion();
  }

  setDebugLoggingEnabled(enabled: boolean): void {
    CASMobileAdsNative.setDebugLoggingEnabled(enabled);
  }

  setAdSoundsMuted(muted: boolean): void {
    CASMobileAdsNative.setAdSoundsMuted(muted);
  }

  setUserAge(age: number): void {
    CASMobileAdsNative.setUserAge(age);
  }

  setUserGender(gender: number): void {
    CASMobileAdsNative.setUserGender(gender);
  }

  setAppContentUrl(contentUrl?: string): void {
    CASMobileAdsNative.setAppContentUrl(contentUrl);
  }

  setAppKeywords(keywords: string[]): void {
    CASMobileAdsNative.setAppKeywords(keywords);
  }

  setLocationCollectionEnabled(enabled: boolean): void {
    CASMobileAdsNative.setLocationCollectionEnabled(enabled);
  }

  setTrialAdFreeInterval(interval: number): void {
    CASMobileAdsNative.setTrialAdFreeInterval(interval);
  }
}

export const CASMobileAds = new MobileAds();

export default CASMobileAds;
