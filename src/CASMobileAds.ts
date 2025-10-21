import CASMobileAdsNative from './modules/NativeCASMobileAdsModule';
import { type InitializationStatus, type InitializationParams, type Gender, ConsentFlowStatus } from './types/Types';
import { version as reactNativeVersion } from 'react-native/Libraries/Core/ReactNativeVersion';
import { MobileAds as MobileAdsModule } from './types/MobileAds';

class MobileAds implements MobileAdsModule {
  initialize(casId: string, options: InitializationParams = {}): Promise<InitializationStatus> {
    if (typeof casId !== 'string') {
      return Promise.reject(new Error('initialize(casId, options?): casId must be a string'));
    }
    const params: any = {};
    params.reactNativeVersion = `${reactNativeVersion.major}.${reactNativeVersion.minor}.${reactNativeVersion.patch}`;
    if (options.targetAudience != null) params.targetAudience = Number(options.targetAudience);
    params.showConsentFormIfRequired = options.showConsentFormIfRequired !== undefined ? options.showConsentFormIfRequired : true;
    params.forceTestAds = options.forceTestAds !== undefined ? options.forceTestAds : false;

    if (Array.isArray(options.testDeviceIds)) params.testDeviceIds = options.testDeviceIds;
    if (options.mediationExtras != null) params.mediationExtras = options.mediationExtras;
    if (options.debugPrivacyGeography !== undefined) {
      params.debugPrivacyGeography = options.debugPrivacyGeography;
    }
    return CASMobileAdsNative.initialize(casId, params);
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
    CASMobileAdsNative.setUserAge(age as any);
  }

  setUserGender(gender: number): void {
    CASMobileAdsNative.setUserGender(gender as any);
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
    CASMobileAdsNative.setTrialAdFreeInterval(interval as any);
  }
}

export const CASMobileAds = new MobileAds();

export default CASMobileAds;