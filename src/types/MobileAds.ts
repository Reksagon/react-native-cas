import type { InitializationStatus, InitializationParams } from './Initialization';
import { ConsentFlowStatus } from './Initialization';

export interface MobileAds {
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
  initialize(casId: string, options: InitializationParams): Promise<InitializationStatus>;

  /**
   * Is SDK initialized.
   */
  isInitialized(): Promise<boolean>;

  /** Presents the consent flow form; resolves with provider-specific result code. */
  showConsentFlow(): Promise<ConsentFlowStatus>;

  /** Returns the underlying native SDK version, e.g. "4.3.0". */
  getSDKVersion(): Promise<string>;

  /** Enables verbose logging to the native console/logcat. */
  setDebugLoggingEnabled(enabled: boolean): void;

  /** Mutes/unmutes ad sounds where supported by networks. */
  setAdSoundsMuted(muted: boolean): void;

  /**
   * Sets the user’s age for ad targeting. Provide a positive integer.
   * Note: Only pass data you are legally allowed to share.
   */
  setUserAge(age: number): void;

  /**
   * Sets the user’s gender for ad targeting.
   * @param gender See {@link Gender}
   */
  setUserGender(gender: number): void;

  /**
   * Sets a content URL to help contextual targeting, e.g. an article URL.
   * Pass `undefined` to clear the value.
   */
  setAppContentUrl(contentUrl?: string): void;

  /** Sets a list of keywords to help contextual targeting. */
  setAppKeywords(keywords: string[]): void;

  /** Enables/disables coarse location collection where permitted. Disabled by default. */
  setLocationCollectionEnabled(enabled: boolean): void;

  /**
   * Sets the trial ad-free interval (in seconds) since first install.
   * During the interval, no ads are shown except Rewarded.
   */
  setTrialAdFreeInterval(interval: number): void;
}

/** Optional targeting value. */
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}
