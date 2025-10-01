import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewProps,
  HostComponent,
} from 'react-native';
import type { Double, DirectEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

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

export type AdViewEvent = Readonly<{
  contentInfo: AdContentInfo;
}>;

export interface NativeProps extends ViewProps {
  size: AdViewSize;
  casId?: string;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  /** Whether to automatically load the ad on mount. Defaults to `true`. */
  loadOnMount?: WithDefault<boolean, true>;

  onAdViewLoaded?: DirectEventHandler<AdViewEvent>;
  onAdViewFailed?: DirectEventHandler<AdViewFailedEvent>;
  onAdViewClicked?: DirectEventHandler<AdViewEvent>;
  onAdViewImpression?: DirectEventHandler<AdViewEvent>;
};

type CASMobileAdsViewNativeComponentType = HostComponent<NativeProps>;

/**
 * Native commands callable from JS for managing AdView.
 */
interface NativeCommands {
    /**
     * Manually starts loading a new ad when `loadOnMount` is `false`.
     *
     * @param viewRef - Reference to the native ad view component.
     */
    loadAd(viewRef: React.ElementRef<CASMobileAdsViewNativeComponentType>): void;
}

/**
 * JS interface to ad view commands for {@link AppLovinMAXAdView}.
 */
export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd'],
});

/**
 * Native view component for displaying a banner or MREC ad.
 */
export default codegenNativeComponent<NativeProps>('CASAdView') as HostComponent<NativeProps>;

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
