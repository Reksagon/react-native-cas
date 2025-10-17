import React, {
  forwardRef, useRef, useImperativeHandle, useCallback,
  useMemo, useState, useReducer, useEffect,
} from 'react';
import {
  View, useWindowDimensions, NativeSyntheticEvent,
  LayoutChangeEvent, StyleSheet, StyleProp, ViewStyle, PixelRatio,
} from 'react-native';

import { AdViewComponent, AdViewCommands } from '../modules/AdViewComponent';
import {
  AdViewLoaded, AdViewFailed, AdImpression, AdViewSize,
  type AdViewProps, type AdViewRef
} from '../types/AdView';

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
  const { width: screenWidth } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const defaultSize = (size ?? AdViewSize.BANNER) as AdViewSize;

  const baseSize = ADVIEW_SIZE[defaultSize] ?? ADVIEW_SIZE[AdViewSize.BANNER];
  const isFluid = defaultSize === AdViewSize.ADAPTIVE || defaultSize === AdViewSize.SMART;

  const dimensionsRef = useRef<Dim>({
    width: isFluid ? '100%' : Math.max(baseSize.width || 0, 1),
    height: minHeightFor(defaultSize),
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const containerStyle = useMemo(() => {
    const mh = minHeightFor(defaultSize);
    const base: any = { minHeight: mh };
    if (isFluid) {
      base.alignSelf = 'stretch';
      base.width = '100%';
    }
    return StyleSheet.compose(style as any, base);
  }, [defaultSize, isFluid, style]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const recalcDimensions = useCallback(() => {
    const base = ADVIEW_SIZE[defaultSize] ?? ADVIEW_SIZE[AdViewSize.BANNER];

    const width = isFluid
      ? Math.max(Math.round(containerWidth ?? screenWidth), 1)
      : Math.max(base.width || 0, 1);

    const height = Math.max(base.height || minHeightFor(defaultSize), 1);

    const cur = dimensionsRef.current;
    if (cur.width !== width || cur.height !== height) {
      dimensionsRef.current = { width, height };
      forceUpdate();
    }
  }, [defaultSize, isFluid, containerWidth, screenWidth]);

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
      if (isFluid && w > 0 && typeof cur.width === 'number' && w !== cur.width) {
        dimensionsRef.current = { ...dimensionsRef.current, width: w };
        changed = true;
      }

      if (changed) forceUpdate();
      onAdViewLoaded?.({ width: w, height: h } as AdViewLoaded);
    },
    [onAdViewLoaded, isFluid],
  );

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<{ code: number; message: string }>) => {
      onAdViewFailed?.(e.nativeEvent as AdViewFailed);
    },
    [onAdViewFailed],
  );

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<{ impression: AdImpression }>) => {
      onAdViewImpression?.(e.nativeEvent.impression as AdImpression);
    },
    [onAdViewImpression],
  );

  const onClickedCb = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);

  useEffect(() => {
  let mounted = true;

  if (!loadOnMount) return;
  if (isFluid && containerWidth == null) return;

  if (mounted && viewRef.current) {
    AdViewCommands.loadAd(viewRef.current);
  }

  return () => {
    mounted = false;
    };
  }, [loadOnMount, isFluid, containerWidth]);

  useImperativeHandle(ref, () => ({
  loadAd: () => {
    if (viewRef.current) AdViewCommands.loadAd(viewRef.current);
  },
  destroy: () => {
    if (viewRef.current) AdViewCommands.destroy(viewRef.current);
    },
  }), []);


  useEffect(() => () => AdViewCommands.destroy?.(viewRef.current), []);

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
