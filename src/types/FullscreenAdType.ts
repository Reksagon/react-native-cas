import type { AdError, AdContentInfo } from './Types';

export type FullscreenAdBase = {
  isAdLoaded(): Promise<boolean>;
  loadAd(options?: any): Promise<void>;
  showAd(): Promise<void>;
  destroy(): Promise<void>;

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

export type InterstitialAdType = FullscreenAdBase & {
  setAutoloadEnabled(enabled: boolean): Promise<void>;
  setAutoshowEnabled(enabled: boolean): Promise<void>;
  setMinInterval(seconds: number): Promise<void>;
  restartInterval(): Promise<void>;
};

export type RewardedAdType = FullscreenAdBase & {
  setAutoloadEnabled(enabled: boolean): Promise<void>;
  addAdUserEarnRewardEventListener(l: () => void): void;
  removeAdUserEarnRewardLoadedEventListener(): void;
};

export type AppOpenAdType = FullscreenAdBase & {
  setAutoloadEnabled(enabled: boolean): Promise<void>;
  setAutoshowEnabled(enabled: boolean): Promise<void>;
};
