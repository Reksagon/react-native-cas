/**
 * Public interfaces for fullscreen ad surfaces.
 * Each function mirrors a native command or emits a native event.
 *
 * Events:
 * - Loaded / LoadFailed: fired after `loadAd()`
 * - Showed / FailedToShow / Dismissed / Clicked: lifecycle of `showAd()`
 * - Impression: contains parsed revenue/partner payload (see AdContentInfo)
 *
 * Unsubscription:
 * - `add*EventListener` ПОВЕРТАЄ лямбду `() => void` для відписки (рекомендовано).
 * - Методи `remove*EventListener()` залишені для зворотної сумісності (deprecated).
 */
import type { AdError, AdContentInfo } from './AdView';

export type Unsubscribe = () => void;

export type FullscreenAdBase = {
  /** Resolves `true` if an ad is currently loaded and ready. */
  isAdLoaded(): Promise<boolean>;

  /** Starts loading an ad; results are delivered via events. */
  loadAd(options?: any): void;
  /** Attempts to show a loaded ad immediately. */
  showAd(): void;
  /** Releases underlying native resources. */
  destroy(): void;

  /** Automatically load the next ad as soon as possible. */
  setAutoloadEnabled(enabled: boolean): void;

  /** Fired when an ad has been loaded successfully. Returns unsubscribe. */
  addAdLoadedEventListener(l: () => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdLoadedEventListener(). */
  removeAdLoadedEventListener(): void;

  /** Fired when an ad has failed to load. Returns unsubscribe. */
  addAdLoadFailedEventListener(l: (adError: AdError) => void): Unsubscribe;
  /**  Use the unsubscribe function returned by addAdLoadFailedEventListener(). */
  removeAdLoadFailedEventListener(): void;

  /** Fired when the ad is clicked. Returns unsubscribe. */
  addAdClickedEventListener(l: () => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdClickedEventListener(). */
  removeAdClickedEventListener(): void;

  /** Fired when the ad is presented. Returns unsubscribe. */
  addAdShowedEventListener(l: () => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdShowedEventListener(). */
  removeAdShowedEventListener(): void;

  /** Fired when the ad fails to present. Returns unsubscribe. */
  addAdFailedToShowEventListener(l: (adError: AdError) => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdFailedToShowEventListener(). */
  removeAdFailedToShowEventListener(): void;

  /** Fired when the ad is dismissed/closed by the user. Returns unsubscribe. */
  addAdDismissedEventListener(l: () => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdDismissedEventListener(). */
  removeAdDismissedEventListener(): void;

  /** Fired on impression; provides parsed monetization payload. Returns unsubscribe. */
  addAdImpressionEventListener(l: (info: AdContentInfo) => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdImpressionEventListener(). */
  removeAdImpressionEventListener(): void;
};

/** App-open specific options. */
export type AppOpenAdType = FullscreenAdBase & {
  /** Shows ad automatically once it loads (cold start flows). */
  setAutoshowEnabled(enabled: boolean): void;
};

export type InterstitialAdType = FullscreenAdBase & {
  /** Shows ad automatically once it loads. */
  setAutoshowEnabled(enabled: boolean): void;
  /** Minimal interval in seconds between shows. */
  setMinInterval(seconds: number): void;
  /** Restarts the interval countdown from now. */
  restartInterval(): void;
};

/** Rewarded specific events. */
export type RewardedAdType = FullscreenAdBase & {
  /** Fired when the user has earned the reward. Returns unsubscribe. */
  addAdUserEarnRewardEventListener(l: () => void): Unsubscribe;
  /** Use the unsubscribe function returned by addAdUserEarnRewardEventListener(). */
  removeAdUserEarnRewardLoadedEventListener(): void;
};
