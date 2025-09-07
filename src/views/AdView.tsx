import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useState,
  useReducer,
  useEffect,
} from 'react';

import {
  View,
  UIManager,
  findNodeHandle,
  useWindowDimensions,
  NativeSyntheticEvent,
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';

import { NativeAdView } from '../native/NativeAdView';
import { AdViewCommands } from '../native/Commands';
import { addEventListener, removeEventListener } from '../EventEmitter';

import type {
  AdViewRef,
  AdViewProps,
  AdInfoEvent,
  AdLoadFailedEvent,
  AdViewPresentedEvent,
} from '../types/Types';
import { AdViewSize } from '../types/Types';
import { CASMobileAds } from '../modules/CASMobileAds';


const EVENTS = {
  ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_CLICKED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_CLICKED_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_EXPANDED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_EXPANDED_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_COLLAPSED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_COLLAPSED_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_REVENUE_PAID_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_REVENUE_PAID_EVENT',
  ON_NATIVE_UI_COMPONENT_ADVIEW_DISPLAYED_EVENT:
    'ON_NATIVE_UI_COMPONENT_ADVIEW_DISPLAYED_EVENT',
};

const pr = PixelRatio.get();

const isTablet = (() => {
  const d = pr;
  const w = Dimensions.get('window').width * d;
  const h = Dimensions.get('window').height * d;
  if (d < 2 && (w >= 1000 || h >= 1000)) return true;
  return d === 2 && (w >= 1920 || h >= 1920);
})();

const BASE = {
  [AdViewSize.BANNER]: { width: 320, height: 50 }, 
  [AdViewSize.LEADERBOARD]: { width: 728, height: 90 }, 
  [AdViewSize.MREC]: { width: 300, height: 250 }, 
  [AdViewSize.ADAPTIVE]: { width: 0, height: 0 }, 
  [AdViewSize.SMART]: { width: isTablet ? 728 : 320, height: isTablet ? 90 : 50 }, 
} as const;


const handleAdViewEvent = <
  T extends AdInfoEvent | AdLoadFailedEvent | AdViewPresentedEvent
>(
  event: NativeSyntheticEvent<T>,
  cb?: (payload: T) => void
) => {
  cb?.(event.nativeEvent);
};

const getAdaptiveHeightForWidth = async (w: number): Promise<number> => {
  const api = (CASMobileAds as any)?.getAdaptiveBannerHeightForWidth;
  if (typeof api === 'function') {
    try {
      const h = await api(w);
      if (typeof h === 'number' && h > 0) return h;
    } catch {}
  }
  return BASE[AdViewSize.BANNER].height;
};


export const AdView = forwardRef<AdViewRef, AdViewProps>(function AdView(
  {
    style,
    size,
    isAutoloadEnabled = true,
    refreshInterval,
    onAdViewLoaded,
    onAdViewFailed,
    onAdViewClicked,
    onAdViewImpression,
    ...nativeProps
  },
  ref
) {
  const viewRef = useRef<any>(null);
  const layoutRef = useRef<LayoutRectangle | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [measured, setMeasured] = useState<{ width: number; height: number }>(() => {
    if (size === AdViewSize.ADAPTIVE) {
      return { width: Dimensions.get('window').width, height: BASE[AdViewSize.BANNER].height };
    }
    return BASE[size];
  });

  const containerStyle = useMemo(() => {
    if (size === AdViewSize.ADAPTIVE) {
      return StyleSheet.compose(style as any, {
        width: Dimensions.get('window').width,
      });
    }
    return StyleSheet.compose(style as any, BASE[size]);
  }, [size, style]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
  const layout = { ...e.nativeEvent.layout };
  layoutRef.current = layout;
  setContainerWidth(layout.width); 

  if (size === AdViewSize.ADAPTIVE || size === AdViewSize.BANNER || size === AdViewSize.SMART) {
    setMeasured(prev => ({ ...prev, width: layout.width }));
  }
}, [size]);


  useEffect(() => {
  let cancelled = false;

    const recalc = async () => {
    if (size === AdViewSize.ADAPTIVE || size === AdViewSize.SMART || size === AdViewSize.BANNER) {
      const width = (containerWidth ?? screenWidth);
      const height = await getAdaptiveHeightForWidth(width);
      if (!cancelled) setMeasured({ width, height });
    } else {
      setMeasured(BASE[size]);
    }
  };

  recalc();
  return () => { cancelled = true; };
}, [size, screenWidth, containerWidth]); 


  const onLoaded = useCallback(
  (e: NativeSyntheticEvent<{ width: number; height: number }>) => {
    const { width: ew, height: eh } = e.nativeEvent; 
    if (Platform.OS === 'android') {
      let w = ew / pr;
      const h = layoutRef.current?.height ?? eh / pr;
      if (Math.floor(w) % 2) w += 1; else w -= 1;
      setMeasured({ width: w, height: h });
    }
    onAdViewLoaded?.();
  },
  [onAdViewLoaded]
);

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<AdLoadFailedEvent>) => onAdViewFailed?.(e.nativeEvent),
    [onAdViewFailed]
  );

  const onClickedCb = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<AdViewPresentedEvent>) =>
      onAdViewImpression?.(e.nativeEvent),
    [onAdViewImpression]
  );

  const isAdLoaded = useCallback(async (): Promise<boolean> => {
    return AdViewCommands.isAdLoaded(viewRef.current);
  }, []);

  const loadAd = useCallback(async () => {
    AdViewCommands.loadAd(viewRef.current);
  }, []);

  useImperativeHandle(ref, () => ({ isAdLoaded, loadAd }), [isAdLoaded, loadAd]);

  return (
    <View onLayout={onLayout} style={containerStyle}>
      <NativeAdView
        ref={viewRef}
        style={measured}
        size={size}
        isAutoloadEnabled={isAutoloadEnabled}
        refreshInterval={refreshInterval}
        onAdViewLoaded={onLoaded}
        onAdViewFailed={onFailedCb}
        onAdViewClicked={onClickedCb}
        onAdViewImpression={onImpressionCb}
        isAdLoaded={(ready: NativeSyntheticEvent<boolean>) => {
          const cur: any = viewRef.current;
          if (cur?.__onIsLoaded) {
            cur.__onIsLoaded(ready.nativeEvent);
            cur.__onIsLoaded = null;
          }
        }}
        {...nativeProps}
      />
    </View>
  );
});

export const preloadNativeUIComponentAdView = async (
  adUnitId: string,
  adFormat: string,
  adViewSize: AdViewSize,
  options: {
    placement?: string | null;
    customData?: string | null;
    extraParameters?: Record<string, any>;
    localExtraParameters?: Record<string, any>;
  } = {}
): Promise<number> => {
  const {
    placement = null,
    customData = null,
    extraParameters = {},
    localExtraParameters = {},
  } = options;

  const fn = (CASMobileAds as any)?.preloadNativeUIComponentAdView;
  if (typeof fn === 'function') {
    return fn(adUnitId, adFormat, adViewSize, placement, customData, extraParameters, localExtraParameters);
  }
  return Promise.reject(new Error('preloadNativeUIComponentAdView is not implemented'));
};

export const destroyNativeUIComponentAdView = async (adViewId: number): Promise<void> => {
  if (adViewId === undefined) {
    return Promise.reject(new Error('adViewId is not provided'));
  }
  const fn = (CASMobileAds as any)?.destroyNativeUIComponentAdView;
  if (typeof fn === 'function') {
    return fn(adViewId);
  }
  return Promise.reject(new Error('destroyNativeUIComponentAdView is not implemented'));
};

export const addAdViewLoadedListener = (l: (adInfo: any) => void) =>
  addEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, l);
export const removeAdViewLoadedListener = () =>
  removeEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT);

export const addAdViewLoadFailedListener = (l: (err: any) => void) =>
  addEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, l);
export const removeAdViewLoadFailedListener = () =>
  removeEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT);