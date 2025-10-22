import React, { forwardRef, useRef, useImperativeHandle, useCallback, useMemo, useState, useReducer, useEffect } from 'react';
import { View, useWindowDimensions, NativeSyntheticEvent, LayoutChangeEvent, StyleSheet, StyleProp, ViewStyle, PixelRatio, ViewProps, DimensionValue } from 'react-native';

import type { AdViewInfo, AdError, AdContentInfo, BannerAdViewRef, BannerAdViewProps } from '../types';
import { BannerAdSize } from '../types/BannerAdView';

import CASBannerAdComponent, { Commands } from '../modules/NativeCASAdViewComponent';

type SizeDimensions = { width: number; height: number };

export const BannerAdView = forwardRef<BannerAdViewRef, BannerAdViewProps & ViewProps>(function AdView(
  { size = BannerAdSize.BANNER, maxWidth, maxHeight, autoload = true, refreshInterval, onAdViewLoaded, onAdViewFailed, onAdViewClicked, onAdViewImpression, style, ...otherProps },
  ref
) {
  const adViewRef = useRef(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [dimensions, setDimensions] = useState<SizeDimensions>({ width: 1, height: 1 });
  const sizeConfig = useMemo(
    () => ({
      sizeType: size,
      maxWidth: maxWidth ?? screenWidth,
      maxHeight: maxHeight ?? screenHeight,
    }),
    [size, maxWidth, maxHeight, screenWidth, screenHeight]
  );

  useImperativeHandle(
    ref,
    () => ({
      loadAd: () => {
        adViewRef.current && Commands.loadAd(adViewRef.current);
      },
    }),
    []
  );

  const onLoadedCallback = useCallback(
    (e: NativeSyntheticEvent<AdViewInfo>) => {
      const w = Math.ceil(e.nativeEvent.width);
      const h = Math.ceil(e.nativeEvent.height);

      if (w != dimensions.width || h != dimensions.height) {
        setDimensions({ width: w, height: h });
      }

      onAdViewLoaded?.(e.nativeEvent);
    },
    [onAdViewLoaded]
  );

  const onFailedCallback = useCallback(
    (e: NativeSyntheticEvent<AdError>) => {
      onAdViewFailed?.(e.nativeEvent as AdError);
    },
    [onAdViewFailed]
  );

  const onImpressionCallback = useCallback(
    (e: NativeSyntheticEvent<AdContentInfo>) => {
      onAdViewImpression?.(e.nativeEvent as AdContentInfo);
    },
    [onAdViewImpression]
  );

  const onClickedCallback = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);

  return (
    <CASBannerAdComponent
      ref={adViewRef}
      sizeConfig={sizeConfig}
      autoload={autoload}
      refreshInterval={refreshInterval}
      onAdViewLoaded={onLoadedCallback}
      onAdViewFailed={onFailedCallback}
      onAdViewClicked={onClickedCallback}
      onAdViewImpression={onImpressionCallback}
      style={[style, dimensions]}
      {...otherProps}
    />
  );
});
