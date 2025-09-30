import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { AdError, AdContentInfo } from '../types/Types';

export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}

export type AdViewFailedEvent = Readonly<{
  error: AdError;
}>;

export type AdViewImpressionEvent = Readonly<{
  impression: AdContentInfo;
}>;

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  casId?: string;

  onAdViewLoaded?: (e: NativeSyntheticEvent<{ width: number; height: number }>) => void;
  onAdViewFailed?: (e: NativeSyntheticEvent<{ error: AdError }>) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (e: NativeSyntheticEvent<{ impression: AdContentInfo }>) => void;
  isAdLoaded?: (ready: NativeSyntheticEvent<boolean>) => void;
};

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};

export const AdViewComponent = requireNativeComponent<AdViewProps>('AdView');

export const AdViewCommands = {
  loadAd: (ref: any) => {
    const tag = findNodeHandle(ref);
    if (!tag) return;
    UIManager.dispatchViewManagerCommand(
      tag,
      UIManager.getViewManagerConfig('AdView').Commands.loadAd,
      []
    );
  },

  destroy: (ref: any) => {
    const tag = findNodeHandle(ref);
    if (!tag) return;
    UIManager.dispatchViewManagerCommand(
      tag,
      UIManager.getViewManagerConfig('AdView').Commands.destroy,
      []
    );
  },

  setRefreshInterval: (ref: any, seconds: number) => {
    const tag = findNodeHandle(ref);
    if (!tag) return;
    UIManager.dispatchViewManagerCommand(
      tag,
      UIManager.getViewManagerConfig('AdView').Commands.setRefreshInterval,
      [seconds | 0]
    );
  },

  isAdLoaded: (ref: any): Promise<boolean> => {
    const tag = findNodeHandle(ref);
    if (!tag) return Promise.resolve(false);
    return new Promise((resolve) => {
      if (ref) (ref as any).__onIsLoaded = resolve;
      UIManager.dispatchViewManagerCommand(
        tag,
        UIManager.getViewManagerConfig('AdView').Commands.isAdLoaded,
        []
      );
    });
  },
};
