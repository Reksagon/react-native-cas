import type { AdError, AdContentInfo } from './Types';

export type FullscreenAdBase = {
  isAdLoaded(): Promise<boolean>;

  loadAd(options?: any): void;
  showAd(): void;
  destroy(): void;

  setAutoloadEnabled(enabled: boolean): void;

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
  setAutoshowEnabled(enabled: boolean): void; 
};

export type InterstitialAdType = FullscreenAdBase & {  
  setAutoshowEnabled(enabled: boolean): void; 
  setMinInterval(seconds: number): void;      
  restartInterval(): void;                    
};

export type RewardedAdType = FullscreenAdBase & {
  addAdUserEarnRewardEventListener(l: () => void): void;
  removeAdUserEarnRewardLoadedEventListener(): void;
};
