import Component, { Commands } from './CASAdViewNativeComponent';

export const AdViewComponent = Component;

export const AdViewCommands = {
  loadAd: (ref: any) => Commands.loadAd(ref),
  destroy: (ref: any) => Commands.destroy(ref),
};

export type { NativeProps as AdViewProps } from './CASAdViewNativeComponent';

export type AdViewImpressionEvent = Readonly<{
  impression: {
    format: string;
    revenue: number;
    revenuePrecision: string;
    sourceUnitId: string;
    sourceName: string;
    creativeId?: string;
    revenueTotal: number;
    impressionDepth: number;
  };
}>;


export type AdViewRef = {
  loadAd: () => void;
  destroy:() => void;

};

export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}
