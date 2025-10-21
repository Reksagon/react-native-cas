import React, {
  forwardRef, useRef, useImperativeHandle, useCallback,
  useMemo, useState, useReducer, useEffect,
} from 'react';
import {
  View, useWindowDimensions, NativeSyntheticEvent,
  LayoutChangeEvent, StyleSheet, StyleProp, ViewStyle, PixelRatio,
} from 'react-native';

import type {
  AdViewInfo, 
  AdError, 
  AdContentInfo,
  AdViewRef,
  AdViewProps
} from '../types';
import {AdViewSize} from '../types/AdView';

import Component, { Commands } from '../modules/NativeCASAdViewComponent';


export const AdViewComponent = Component;

export const AdViewCommands = {
  loadAd: (ref: any) => { if (ref) Commands.loadAd(ref); },
  destroy: (ref: any) => { if (ref) Commands.destroy(ref); },
};

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
    autoReload: isAutoloadEnabled = true,
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
    (e: NativeSyntheticEvent<AdViewInfo>) => {
      const w = e.nativeEvent.width;
      const h = e.nativeEvent.height;

      if (w !== dimensionsRef.current.width || h !== dimensionsRef.current.height) {
        dimensionsRef.current = { width: w, height: h };
        forceUpdate();
      }

      onAdViewLoaded?.(e.nativeEvent);
    },
    [onAdViewLoaded, isFluid],
  );

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<AdError>) => {
      onAdViewFailed?.(e.nativeEvent as AdError);
    },
    [onAdViewFailed],
  );

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<AdContentInfo>) => {
      onAdViewImpression?.(e.nativeEvent as AdContentInfo);
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
        loadOnMount={loadOnMount}
        autoReload={isAutoloadEnabled}
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
