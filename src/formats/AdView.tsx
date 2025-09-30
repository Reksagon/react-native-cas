import React from 'react';
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
  useWindowDimensions,
  NativeSyntheticEvent,
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';

import { AdViewComponent } from '../native/AdViewComponent';
import { AdViewCommands } from '../native/Commands';
import type {
  AdError,
  AdViewRef,
  AdViewProps,
  AdViewImpressionEvent,
} from '../types/Types';
import { AdViewSize } from '../types/Types';
import { CASMobileAds } from '../modules/CASMobileAds';

const pr = PixelRatio.get();

const BASE = {
  [AdViewSize.BANNER]: { width: 320, height: 50 },
  [AdViewSize.LEADERBOARD]: { width: 728, height: 90 },
  [AdViewSize.MREC]: { width: 300, height: 250 },
  [AdViewSize.ADAPTIVE]: { width: 0, height: 0 },
  [AdViewSize.SMART]: { width: 320, height: 50 }, 
} as const;

const getAdaptiveHeightForWidth = async (width: number): Promise<number> => {
  try {
    const height = await CASMobileAds.getAdaptiveBannerHeightForWidth(width);
    if (typeof height === 'number' && height > 0) return height;
  } catch {}
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

  useReducer((x) => x + 1, 0);

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
      setMeasured((prev) => ({ ...prev, width: layout.width }));
    }
  }, [size]);

  useEffect(() => {
    let cancelled = false;

    const recalc = async () => {
      if (size === AdViewSize.ADAPTIVE || size === AdViewSize.SMART || size === AdViewSize.BANNER) {
        const width = containerWidth ?? screenWidth;
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
    (e: NativeSyntheticEvent<any>) => {
      const { width: ew, height: eh } = e.nativeEvent as { width: number; height: number };
      if (Platform.OS === 'android') {
        let w = ew / pr;
        const h = layoutRef.current?.height ?? eh / pr;
        if (Math.floor(w) % 2) w += 1; else w -= 1;
        setMeasured({ width: w, height: h });
      }
      onAdViewLoaded?.(e);
    },
    [onAdViewLoaded]
  );

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<{ error: AdError }>) => onAdViewFailed?.(e),
    [onAdViewFailed]
  );

  const onClickedCb = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<AdViewImpressionEvent>) => onAdViewImpression?.(e),
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
      <AdViewComponent
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