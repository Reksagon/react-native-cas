export type FullscreenAdType = {
  isAdLoaded(): Promise<boolean>;
  loadAd(options?: any): Promise<void>;
  showAd(): Promise<void>;

  addAdLoadedEventListener(listener: () => void): void;
  removeAdLoadedEventListener(): void;

  addAdLoadFailedEventListener(listener: (error: string) => void): void;
  removeAdLoadFailedEventListener(): void;

  addAdClickedEventListener(listener: () => void): void;
  removeAdClickedEventListener(): void;

  addAdDisplayedEventListener(listener: () => void): void;
  removeAdDisplayedEventListener(): void;

  addAdFailedToShowEventListener(listener: (error: string) => void): void;
  removeAdFailedToShowEventListener(): void;

  addAdDismissedEventListener(listener: () => void): void;
  removeAdDismissedEventListener(): void;

  addAdImpressionEventListener(listener: (info: any) => void): void;
  removeAdImpressionEventListener(): void;
};