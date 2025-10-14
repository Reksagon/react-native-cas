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
  StyleProp,
  ViewStyle,
  PixelRatio,
} from 'react-native';

import { AdViewComponent, AdViewCommands } from '../modules/AdViewComponent';
import { AdViewSize, type AdViewProps, type AdViewRef } from '../types/AdView';

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

type Dim = { width: number | '100%'; height: number };
type Props = AdViewProps & { style?: StyleProp<ViewStyle> };

export const AdView = forwardRef<AdViewRef, Props>(function AdView(
  {
    style,
    size,
    isAutoloadEnabled = true,
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
  const defaultSize = (size ?? AdViewSize.BANNER) as AdViewSize;

  const dimensionsRef = useRef<Dim>({
    width: '100%',
    height: minHeightFor(defaultSize),
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const containerStyle = useMemo(() => {
    const mh = minHeightFor(defaultSize);
    return StyleSheet.compose(style as any, {
      minHeight: mh,
      width: '100%',
      alignSelf: 'stretch',
    });
  }, [defaultSize, style]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const layout = { ...e.nativeEvent.layout };
    layoutRef.current = layout;
    setContainerWidth(layout.width);
  }, []);

  const recalcDimensions = useCallback(() => {
    const base = ADVIEW_SIZE[defaultSize] ?? ADVIEW_SIZE[AdViewSize.BANNER];

    const baseWidth = base.width && base.width > 0 ? base.width : (containerWidth ?? screenWidth);
    const width = Math.max(Math.round(baseWidth), 1);
    const height = Math.max(base.height || minHeightFor(defaultSize), 1);

    const cur = dimensionsRef.current;
    if (cur.width !== width || cur.height !== height) {
      dimensionsRef.current = { width, height };
      forceUpdate();
    }
  }, [defaultSize, containerWidth, screenWidth]);

  useEffect(() => { recalcDimensions(); }, [recalcDimensions]);

  const onLoaded = useCallback(
    (e: NativeSyntheticEvent<{ width?: number; height?: number }>) => {
      const density = PixelRatio.get();
      const rawW = e.nativeEvent?.width ?? 0;
      const rawH = e.nativeEvent?.height ?? 0;
      const w = rawW > 0 ? Math.round(rawW / density) : 0;
      const h = rawH > 0 ? Math.round(rawH / density) : 0;

      let changed = false;
      const cur = dimensionsRef.current;

      if (h > 0 && h !== cur.height) {
        dimensionsRef.current = { ...cur, height: h };
        changed = true;
      }
      if (w > 0 && (typeof cur.width !== 'number' || w !== cur.width)) {
        dimensionsRef.current = { ...dimensionsRef.current, width: w };
        changed = true;
      }

      if (changed) forceUpdate();
      onAdViewLoaded?.(e);
    },
    [onAdViewLoaded],
  );

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<{ code: number; message: string }>) => onAdViewFailed?.(e),
    [onAdViewFailed],
  );

  const onClickedCb = useCallback(
    (e: any) => onAdViewClicked?.(e),
    [onAdViewClicked]
  );

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<{
      impression: {
        format: string; revenue: number; revenuePrecision: string;
        sourceUnitId: string; sourceName: string; creativeId?: string;
        revenueTotal: number; impressionDepth: number;
      }
    }>) => onAdViewImpression?.(e),
    [onAdViewImpression],
  );

  const loadAd = useCallback(() => {
    AdViewCommands.loadAd(viewRef.current);
  }, []);

  useEffect(() => {
    if (!loadOnMount) return;

    const isBannerLike =
      defaultSize === AdViewSize.BANNER ||
      defaultSize === AdViewSize.SMART ||
      defaultSize === AdViewSize.ADAPTIVE;

    if (isBannerLike && containerWidth == null) return;

    AdViewCommands.loadAd(viewRef.current);
  }, [loadOnMount, defaultSize, containerWidth]);

  useImperativeHandle(ref, () => ({
    loadAd: () => AdViewCommands.loadAd(viewRef.current),
    destroy: () => AdViewCommands.destroy(viewRef.current),
  }), []);

  return (
    <View onLayout={onLayout} style={containerStyle}>
      <AdViewComponent
        ref={viewRef}
        style={dimensionsRef.current}    
        size={defaultSize}
        isAutoloadEnabled={isAutoloadEnabled}
        loadOnMount={false}
        refreshInterval={refreshInterval}
        onAdViewLoaded={onLoaded}
        onAdViewFailed={onFailedCb}
        onAdViewClicked={onClickedCb}
        onAdViewImpression={onImpressionCb}
        {...nativeProps}
      />
    </View>
  );
});
