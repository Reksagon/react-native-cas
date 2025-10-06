import React, {
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
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
} from 'react-native';

import {
  AdViewComponent,
  AdViewCommands,
  AdViewSize,
  type AdViewProps,
  type AdViewRef,
  type AdViewImpressionEvent,
} from '../modules/AdViewComponent';
import type { AdError } from '../types/Types';

const ADVIEW_SIZE = {
  [AdViewSize.BANNER]: { width: 320, height: 50 },
  [AdViewSize.LEADERBOARD]: { width: 728, height: 90 },
  [AdViewSize.MREC]: { width: 300, height: 250 },
  [AdViewSize.ADAPTIVE]: { width: 0, height: 50 }, 
  [AdViewSize.SMART]: { width: 320, height: 50 },
} as const;

function minHeightFor(size: AdViewSize) {
  switch (size) {
    case AdViewSize.MREC: return 250;
    case AdViewSize.LEADERBOARD: return 90;
    default: return 50;
  }
}

type Dim = { width: number; height: number };

export const AdView = forwardRef<AdViewRef, AdViewProps>(function AdView(
  {
    style,
    size,
    isAutoloadEnabled = true,
    autoRefresh = true,
    loadOnMount = true,
    refreshInterval,
    onAdViewLoaded,
    onAdViewFailed,
    onAdViewClicked,
    onAdViewImpression,
    ...nativeProps
  },
  ref,
) {
  const viewRef = useRef<any>(null);
  const layoutRef = useRef<LayoutRectangle | null>(null);
  const { width: screenWidth } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const dimensionsRef = useRef<Dim>({ width: 0, height: minHeightFor(size) });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const containerStyle = useMemo(() => {
    const mh = minHeightFor(size);
    return StyleSheet.compose(style as any, { minHeight: mh });
  }, [size, style]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const layout = { ...e.nativeEvent.layout };
      layoutRef.current = layout;
      setContainerWidth(layout.width);
    },
    []
  );

  const recalcDimensions = useCallback(() => {
    const base = ADVIEW_SIZE[size] ?? ADVIEW_SIZE[AdViewSize.BANNER];

    const isBannerLike =
      size === AdViewSize.BANNER ||
      size === AdViewSize.SMART ||
      size === AdViewSize.ADAPTIVE;

    const width = isBannerLike ? (containerWidth ?? screenWidth) : (base.width || screenWidth);
    const height = base.height || minHeightFor(size);

    const next: Dim = {
      width: Math.max(Math.round(width), 1),
      height: Math.max(Math.round(height), 1),
    };

    const cur = dimensionsRef.current;
    if (cur.width !== next.width || cur.height !== next.height) {
      dimensionsRef.current = next;
      forceUpdate();
    }
  }, [size, containerWidth, screenWidth]);

  useEffect(() => { recalcDimensions(); }, [recalcDimensions]);

  const onLoaded = useCallback((e: NativeSyntheticEvent<{ width?: number; height?: number }>) => {
  const h = e.nativeEvent?.height ?? 0;
  if (h > 0 && h !== dimensionsRef.current.height) {
    dimensionsRef.current = { ...dimensionsRef.current, height: h };
    forceUpdate();
  }
  onAdViewLoaded?.(e);
}, [onAdViewLoaded]);


  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<{ error: AdError }>) => onAdViewFailed?.(e),
    [onAdViewFailed],
  );

  const onClickedCb = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<AdViewImpressionEvent>) => onAdViewImpression?.(e),
    [onAdViewImpression],
  );

  const isAdLoaded = useCallback(async (): Promise<boolean> => {
    return AdViewCommands.isAdLoaded(viewRef.current);
  }, []);

  const loadAd = useCallback(async () => {
    AdViewCommands.loadAd(viewRef.current);
  }, []);

  useEffect(() => {
    if (loadOnMount) {
      AdViewCommands.loadAd(viewRef.current);
    }
  }, [loadOnMount]);

  useEffect(() => {
    if (typeof refreshInterval === 'number') {
      AdViewCommands.setRefreshInterval(viewRef.current, refreshInterval | 0);
    } else {
      AdViewCommands.setRefreshInterval(viewRef.current, autoRefresh ? 30 : 0);
    }
  }, [refreshInterval, autoRefresh]);

  useImperativeHandle(ref, () => ({ isAdLoaded, loadAd }), [isAdLoaded, loadAd]);

  return (
    <View onLayout={onLayout} style={containerStyle}>
      <AdViewComponent
        ref={viewRef}
        style={dimensionsRef.current}
        size={size}
        isAutoloadEnabled={isAutoloadEnabled}
        autoRefresh={autoRefresh}
        loadOnMount={loadOnMount}
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
