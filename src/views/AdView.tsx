import * as React from 'react';
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useReducer,
  findNodeHandle,
  UIManager,
  View,
  useWindowDimensions,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeAdView } from '../native/NativeAdView';
import { Commands } from '../native/Commands';
import { addEventListener, removeEventListener } from '../EventEmitter';
import type {
  AdViewRef,
  AdViewProps,
  AdInfoEvent,
  AdLoadFailedEvent,
  AdViewPresentedEvent,
} from '../types/Types';
import { CASMobileAds } from '../modules/CASMobileAds';

// Default sizes
const ADVIEW_SIZE = {
  banner: { width: 320, height: 50 },
  leader: { width: 728, height: 90 },
  mrec: { width: 300, height: 250 },
};

// Event constants
const ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT = ""
const ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT = ""


const handleAdViewEvent = <T extends AdInfoEvent | AdLoadFailedEvent | AdViewPresentedEvent>(
  event: NativeSyntheticEvent<T>,
  callback?: (adInfo: T) => void
) => {
  if (!callback) return;
  callback(event.nativeEvent);
};

export const AdView = forwardRef<AdViewRef, AdViewProps>(function AdView(
  {
    style,
    size,
    adUnitId,
    placement,
    customData,
    extraParameters,
    localExtraParameters,
    isAutoloadEnabled = true,
    refreshInterval,
    //
    onAdViewLoaded,
    onAdViewFailed,
    onAdViewClicked,
    onAdViewExpanded,
    onAdViewCollapsed,
    onAdViewRevenuePaid,
    onAdViewDisplayed,
    ...props
  },
  ref
) {
  const adViewRef = useRef<any>();
  const { width: screenWidth } = useWindowDimensions();
  const dimensions = useRef<{ width?: number | string; height?: number | string }>({});
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isInitialized, setIsInitialized] = useState(false);

  const sendCommand = (command: string, args: any[] = []) => {
    if (!adViewRef.current) return;
    const reactTag = findNodeHandle(adViewRef.current);
    if (!reactTag) return;
    UIManager.dispatchViewManagerCommand(
      reactTag,
      UIManager.getViewManagerConfig('AdView').Commands[command],
      args
    );
  };

  useImperativeHandle(ref, () => ({
    loadAd: () => sendCommand('loadAd'),
    startAutoRefresh: () => sendCommand('startAutoRefresh'),
    stopAutoRefresh: () => sendCommand('stopAutoRefresh'),
    destroy: () => sendCommand('destroy'),
    isAdLoaded: async () => Commands.isAdLoaded(adViewRef.current),
  }));

  // Calculate size
  useEffect(() => {
    (async () => {
      const initialized = await CASMobileAds.isInitialized();
      setIsInitialized(initialized);
      if (!initialized) console.warn('AdView mounted before SDK initialized.');

      let width: number | string = 'auto';
      let height: number | string = 'auto';

      switch (size) {
        case 'BANNER':
          width = screenWidth;
          height = ADVIEW_SIZE.banner.height;
          break;
        case 'LEADERBOARD':
          width = screenWidth;
          height = ADVIEW_SIZE.leader.height;
          break;
        case 'MREC':
          width = ADVIEW_SIZE.mrec.width;
          height = ADVIEW_SIZE.mrec.height;
          break;
        case 'ADAPTIVE':
        case 'SMART':
          // width = screenWidth;
          // try {
          //   height = await .getAdaptiveBannerHeightForWidth(screenWidth);
          // } catch {
          //   height = ADVIEW_SIZE.banner.height;
          // }
          // break;
      }

      dimensions.current = { width, height };
      forceUpdate();
    })();
  }, [size, screenWidth]);

  if (!isInitialized || !dimensions.current.width || !dimensions.current.height) {
    return <View style={style} {...props} />;
  }

  return (
    <NativeAdView
      ref={adViewRef}
      style={[style, dimensions.current]}
      adUnitId={adUnitId}
      adFormat={size}
      placement={placement}
      customData={customData}
      autoRefresh={isAutoloadEnabled}
      refreshInterval={refreshInterval}
      extraParameters={extraParameters}
      localExtraParameters={localExtraParameters}
      //
      onAdViewLoaded={(e) => handleAdViewEvent(e, onAdViewLoaded)}
      onAdViewFailed={(e) => handleAdViewEvent(e, onAdViewFailed)}
      onAdViewClicked={() => onAdViewClicked?.()}
      onAdViewExpanded={() => onAdViewExpanded?.()}
      onAdViewCollapsed={() => onAdViewCollapsed?.()}
      onAdViewRevenuePaid={(e) => handleAdViewEvent(e, onAdViewRevenuePaid)}
      onAdViewDisplayed={(e) => handleAdViewEvent(e, onAdViewDisplayed)}
      {...props}
    />
  );
});

// Preload / destroy helpers
/*
export const preloadAdView = async (
  adUnitId: string,
  size: string,
  options: { placement?: string; customData?: string; extraParameters?: object; localExtraParameters?: object } = {}
) => {
  return preloadNativeUIComponentAdView(
    adUnitId,
    size,
    options.placement,
    options.customData,
    options.extraParameters,
    options.localExtraParameters
  );
};

export const destroyAdView = async (adViewId: number) => {
  return destroyNativeUIComponentAdView(adViewId);
};

// EventEmitter wrappers
export const addAdViewLoadedListener = (listener: (adInfo: AdInfo) => void) => {
  addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, listener);
};

export const removeAdViewLoadedListener = () => {
  removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT);
};

export const addAdViewLoadFailedListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
  addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, listener);
};

export const removeAdViewLoadFailedListener = () => {
  removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT);
};

*/