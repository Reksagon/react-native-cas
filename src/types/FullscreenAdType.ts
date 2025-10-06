import type { AdError, AdContentInfo } from './Types';

export type FullscreenAdBase = {
  isAdLoaded(): Promise<boolean>;
  loadAd(options?: any): Promise<void>;
  showAd(): Promise<void>;
  destroy(): Promise<void>;

  setAutoloadEnabled(enabled: boolean): Promise<void>;

  addAdLoadedEventListener(l: () => void): void;
  removeAdLoadedEventListener(): void;

  addAdLoadFailedEventListener(l: (e: AdError) => void): void;
  removeAdLoadFailedEventListener(): void;

  addAdClickedEventListener(l: () => void): void;
  removeAdClickedEventListener(): void;

  addAdShowedEventListener(l: () => void): void;
  removeAdShowedEventListener(): void;

  addAdFailedToShowEventListener(l: (e: AdError) => void): void;
  removeAdFailedToShowEventListener(): void;

  addAdDismissedEventListener(l: () => void): void;
  removeAdDismissedEventListener(): void;

  addAdImpressionEventListener(l: (i: AdContentInfo) => void): void;
  removeAdImpressionEventListener(): void;
};

export type AppOpenAdType = FullscreenAdBase & {
  setAutoshowEnabled(enabled: boolean): Promise<void>;
};

export type InterstitialAdType = FullscreenAdBase & {
  setAutoshowEnabled(enabled: boolean): Promise<void>;
  setMinInterval(seconds: number): Promise<void>;
  restartInterval(): Promise<void>;
};

export type RewardedAdType = FullscreenAdBase & {
  addAdUserEarnRewardEventListener(l: () => void): void;
  removeAdUserEarnRewardLoadedEventListener(): void;
};
