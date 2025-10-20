import CASMobileAdsNative from './modules/NativeCASMobileAdsModule';
import { type InitializationStatus, type InitializationParams, type Gender, ConsentFlowStatus } from './types/Types';
import { version as reactNativeVersion } from 'react-native/Libraries/Core/ReactNativeVersion';

export class CASMobileAds {
  /**
   * Initializes the CAS Mobile Ads SDK.
   *
   * Call this method as early as possible after the app launches to reduce
   * latency on the session's first ad load.
   *
   * If this method is not called, the first ad load automatically
   * initializes the CAS Mobile Ads SDK with CAS Id defined in ad load arguments.
   *
   * **Note:** This {@link Promise} may take an unexpectedly long time to complete,
   * as it will only resolve once the SDK has either successfully initialized
   * or failed with a error.
   *
   * If an error occurs, the SDK will attempt automatic reinitialization internally.
   * However, this {@link Promise} will not be updated with subsequent {@link InitializationStatus}.
   *
   * For the most up-to-date {@link InitializationStatus}, call this method again at a later time.
   *
   * @param casId
   * The unique identifier for the CAS content.
   * Use `demo` value to force test ads mode for all devices.
   */
  static initialize(casId: string, options: InitializationParams = {}): Promise<InitializationStatus> {
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

  /**
   * Is SDK initialized.
   */
  static isInitialized(): Promise<boolean> {
    return CASMobileAdsNative.isInitialized();
  }

  /** Presents the consent flow form; resolves with provider-specific result code. */
  static showConsentFlow(): Promise<ConsentFlowStatus> {
    return CASMobileAdsNative.showConsentFlow();
  }

  /** Returns the underlying native SDK version, e.g. "4.3.0". */
  static getSDKVersion() {
    return CASMobileAdsNative.getSDKVersion();
  }

  /** Enables verbose logging to the native console/logcat. */
  static setDebugLoggingEnabled(enabled: boolean): void {
    CASMobileAdsNative.setDebugLoggingEnabled(enabled);
  }

  /** Mutes/unmutes ad sounds where supported by networks. */
  static setAdSoundsMuted(muted: boolean): void {
    CASMobileAdsNative.setAdSoundsMuted(muted);
  }

  /**
   * Sets the user’s age for ad targeting. Provide a positive integer.
   * Note: Only pass data you are legally allowed to share.
   */
  static setUserAge(age: number): void {
    CASMobileAdsNative.setUserAge(age as any);
  }

  /**
   * Sets the user’s gender for ad targeting.
   * @param gender See {@link Gender}
   */
  static setUserGender(gender: number): void {
    CASMobileAdsNative.setUserGender(gender as any);
  }

  /**
   * Sets a content URL to help contextual targeting, e.g. an article URL.
   * Pass `undefined` to clear the value.
   */
  static setAppContentUrl(contentUrl?: string): void {
    CASMobileAdsNative.setAppContentUrl(contentUrl);
  }

  /** Sets a list of keywords to help contextual targeting. */
  static setAppKeywords(keywords: string[]): void {
    CASMobileAdsNative.setAppKeywords(keywords);
  }

  /** Enables/disables coarse location collection where permitted. Disabled by default. */
  static setLocationCollectionEnabled(enabled: boolean): void {
    CASMobileAdsNative.setLocationCollectionEnabled(enabled);
  }

  /**
   * Sets the trial ad-free interval (in seconds) since first install.
   * During the interval, no ads are shown except Rewarded.
   */
  static setTrialAdFreeInterval(interval: number): void {
    CASMobileAdsNative.setTrialAdFreeInterval(interval as any);
  }
}
