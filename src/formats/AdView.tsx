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

import {
  AdViewComponent,
  AdViewCommands,
  AdViewSize,
  type AdViewProps,
  type AdViewRef,
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
    return StyleSheet.compose(style as any, { minHeight: mh, alignSelf: 'stretch', width: '100%' });
  }, [defaultSize, style]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const layout = { ...e.nativeEvent.layout };
    layoutRef.current = layout;
    setContainerWidth(layout.width);
  }, []);

  const recalcDimensions = useCallback(() => {
  const base = ADVIEW_SIZE[defaultSize] ?? ADVIEW_SIZE[AdViewSize.BANNER];

  const width = containerWidth ?? screenWidth;

  const height = base.height || minHeightFor(defaultSize);

  const next: Dim = {
    width: Math.max(Math.round(width), 1),
    height: Math.max(Math.round(height), 1),
  };

  const cur = dimensionsRef.current;
  if (cur.width !== next.width || cur.height !== next.height) {
    dimensionsRef.current = next;
    forceUpdate();
  }
}, [defaultSize, containerWidth, screenWidth]);


  useEffect(() => { recalcDimensions(); }, [recalcDimensions]);


  const onLoaded = useCallback(
    (e: NativeSyntheticEvent<{ width?: number; height?: number }>) => {
      const density = PixelRatio.get();
      const rawH = e.nativeEvent?.height ?? 0;
      const h = rawH > 0 ? Math.round(rawH / density) : 0;  

      if (h > 0 && h !== dimensionsRef.current.height) {
        dimensionsRef.current = { ...dimensionsRef.current, height: h };
        forceUpdate();
      }
      onAdViewLoaded?.(e);
    },
    [onAdViewLoaded],
  );

  const onFailedCb = useCallback(
    (e: NativeSyntheticEvent<{ error: AdError }>) => onAdViewFailed?.(e),
    [onAdViewFailed],
  );

  const onClickedCb = useCallback(
    (e: NativeSyntheticEvent<{}>) => onAdViewClicked?.(e),
    [onAdViewClicked]
  );

  const onImpressionCb = useCallback(
    (e: NativeSyntheticEvent<{ data: string }>) => onAdViewImpression?.(e),
    [onAdViewImpression]
  );

  const isAdLoaded = useCallback(async (): Promise<boolean> => {
    return AdViewCommands.isAdLoaded(viewRef.current) as unknown as boolean;
  }, []);

  const loadAd = useCallback(async () => {
    AdViewCommands.loadAd(viewRef.current);
  }, []);

  useEffect(() => {
    if (!loadOnMount) return;

    const isBannerLike =
      defaultSize === AdViewSize.BANNER ||
      defaultSize === AdViewSize.SMART ||
      defaultSize === AdViewSize.ADAPTIVE;

    if (isBannerLike) {
      if (containerWidth == null) return; 
    }
    AdViewCommands.loadAd(viewRef.current);
  }, [loadOnMount, defaultSize, containerWidth]);

  useImperativeHandle(ref, () => ({ isAdLoaded, loadAd }), [isAdLoaded, loadAd]);

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
        onAdViewIsLoaded={(ready: NativeSyntheticEvent<{ isAdLoaded: boolean }>) => {
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
