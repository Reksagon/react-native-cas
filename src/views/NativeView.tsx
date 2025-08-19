import { requireNativeComponent, UIManager, NativeModules } from 'react-native';
import type {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';
import type { AdViewFailedEvent, AdViewPresentedEvent } from '../utils/types';
import { AdViewSize } from '../utils/types';
import { LINKING_ERROR } from '../utils/strings';

const COMPONENT_NAME = 'AdView';

export type NativeBannerProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  size: {
    size: AdViewSize;
    isAdaptive?: boolean;
  };
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;

  // Events
  onAdViewLoaded?: (e: NativeSyntheticEvent<{ width: number; height: number }>) => void;
  onAdViewFailed?: (e: NativeSyntheticEvent<AdViewFailedEvent>) => void;
  onAdViewClicked?: () => void;
  isAdLoaded?: (e: NativeSyntheticEvent<boolean>) => void;
  onAdViewImpression?: (e: NativeSyntheticEvent<AdViewPresentedEvent>) => void;
};

export const BannerAdView =
  UIManager.getViewManagerConfig(COMPONENT_NAME) != null
    ? requireNativeComponent<NativeBannerProps>(COMPONENT_NAME)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const AdViewCommands = UIManager.getViewManagerConfig('AdView').Commands;
export const CasModule = NativeModules.CasModule;
export const MediationManagerModule = NativeModules.MediationManagerModule;
