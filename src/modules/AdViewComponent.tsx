import Component, { Commands } from './CASAdViewNativeComponent';

export const AdViewComponent = Component;

export const AdViewCommands = {
  isAdLoaded: (ref: any) => Commands.isAdLoaded(ref),
  loadAd: (ref: any) => Commands.loadAd(ref),
  destroy: (ref: any) => Commands.destroy(ref),
};

export type { NativeProps as AdViewProps } from './CASAdViewNativeComponent';

export type AdViewImpressionEvent = Readonly<{ data: string }>;

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};

export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}
