import type { AdError, AdContentInfo } from './Types';

export type FullscreenAdType = {
  isAdLoaded(): Promise<boolean>;
  loadAd(options?: any): Promise<void>;
  showAd(): Promise<void>;

  setAutoloadEnabled(enabled: boolean): Promise<void>;
  setAutoshowEnabled?(enabled: boolean): Promise<void>; 
  setMinInterval?(seconds: number): Promise<void>;
  restartInterval?(): Promise<void>;

  destroy(): Promise<void>;

  addAdLoadedEventListener(listener: () => void): void;
  removeAdLoadedEventListener(): void;

  addAdLoadFailedEventListener(listener: (error: AdError) => void): void;
  removeAdLoadFailedEventListener(): void;

  addAdClickedEventListener(listener: () => void): void;
  removeAdClickedEventListener(): void;

  addAdShowedEventListener(listener: () => void): void;
  removeAdShowedEventListener(): void;

  addAdFailedToShowEventListener(listener: (error: AdError) => void): void;
  removeAdFailedToShowEventListener(): void;

  addAdDismissedEventListener(listener: () => void): void;
  removeAdDismissedEventListener(): void;

  addAdImpressionEventListener(listener: (info: AdContentInfo) => void): void;
  removeAdImpressionEventListener(): void;
  
};
