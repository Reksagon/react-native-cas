/**
 * Public interfaces for fullscreen ad surfaces.
 * Each function mirrors a native command or emits a native event.
 *
 * Event naming:
 * - Loaded / LoadFailed: fired after `loadAd()`
 * - Showed / FailedToShow / Dismissed / Clicked: lifecycle of `showAd()`
 * - Impression: contains parsed revenue/partner payload (see AdContentInfo)
 */
import type { AdError, AdContentInfo } from './AdView';

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

  /** Fired when an ad has been loaded successfully. */
  addAdLoadedEventListener(l: () => void): void;
  /** Removes the Loaded listener. */
  removeAdLoadedEventListener(): void;

  /** Fired when an ad has failed to load. */
  addAdLoadFailedEventListener(l: (adError: AdError) => void): void;
  /** Removes the LoadFailed listener. */
  removeAdLoadFailedEventListener(): void;

  /** Fired when the ad is clicked. */
  addAdClickedEventListener(l: () => void): void;
  /** Removes the Clicked listener. */
  removeAdClickedEventListener(): void;

  /** Fired when the ad is presented. */
  addAdShowedEventListener(l: () => void): void;
  /** Removes the Showed listener. */
  removeAdShowedEventListener(): void;

  /** Fired when the ad fails to present. */
  addAdFailedToShowEventListener(l: (adError: AdError) => void): void;
  /** Removes the FailedToShow listener. */
  removeAdFailedToShowEventListener(): void;

  /** Fired when the ad is dismissed/closed by the user. */
  addAdDismissedEventListener(l: () => void): void;
  /** Removes the Dismissed listener. */
  removeAdDismissedEventListener(): void;

  /** Fired on impression; provides parsed monetization payload. */
  addAdImpressionEventListener(l: (info: AdContentInfo) => void): void;
  /** Removes the Impression listener. */
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
  /** Fired when the user has earned the reward. */
  addAdUserEarnRewardEventListener(l: () => void): void;
  /** Removes the EarnReward listener. */
  removeAdUserEarnRewardLoadedEventListener(): void;
};
