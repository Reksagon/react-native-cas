import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native';

import { BannerAdView, AdViewCommands } from './NativeView';
import { AdViewSize, AdViewFailedEvent, AdViewPresentedEvent, AdViewRef, AdViewProps } from './types';

const pr = PixelRatio.get();

export const isTablet = (() => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = Dimensions.get('window').width * pixelDensity;
  const adjustedHeight = Dimensions.get('window').height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  }
  return pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920);
})();

const sizes = {
  [AdViewSize.B]: { width: 320, height: 50 },
  [AdViewSize.L]: { width: 728, height: 90 },
  [AdViewSize.M]: { width: 300, height: 250 },
  [AdViewSize.A]: { width: 0, height: 0 },
  [AdViewSize.S]: {
    width: isTablet ? 728 : 320,
    height: isTablet ? 90 : 50,
  },
};

export const BannerAd = forwardRef<AdViewRef, AdViewProps>(
  (props, ref) => {
    const [size, setSize] = useState(sizes[props.size]);
    const layout = useRef<LayoutRectangle | null>(null);
    const bannerRef = useRef(null);

    const style = useMemo(() => {
      return props.size === AdViewSize.A
        ? {
            flex: 1,
            width: Dimensions.get('window').width,
          }
        : StyleSheet.compose(props.style, sizes[props.size]);
    }, [props.size, props.style]);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
      layout.current = e.nativeEvent.layout;
      setSize(e.nativeEvent.layout);
    }, []);

    const onAdViewLoaded = useCallback(
      (e: NativeSyntheticEvent<{ width: number; height: number }>) => {
        if (Platform.OS === 'android') {
          let width = e.nativeEvent.width / pr;
          const height = layout.current?.height ?? e.nativeEvent.height / pr;

          if (Math.floor(width) % 2) {
            width += 1;
          } else {
            width -= 1;
          }

          setSize({ height, width });
        }
        props.onAdViewLoaded?.();
      },
      [props.onAdViewLoaded]
    );

    const onAdViewFailed = useCallback(
      (e: NativeSyntheticEvent<AdViewFailedEvent>) => {
        props.onAdViewFailed?.(e.nativeEvent);
      },
      [props.onAdViewFailed]
    );

    const onAdViewClicked = useCallback(() => {
      props.onAdViewClicked?.();
    }, [props.onAdViewClicked]);

    const onAdViewImpression = useCallback(
      (e: NativeSyntheticEvent<AdViewPresentedEvent>) => {
        props.onAdViewImpression?.(e.nativeEvent);
      },
      [props.onAdViewImpression]
    );

    // API fot ref
    const isAdLoaded = useCallback(async (): Promise<boolean> => {
      return new Promise((resolve) => {
        const nodeHandle = findNodeHandle(bannerRef.current);
        if (nodeHandle) {
          UIManager.dispatchViewManagerCommand(
            nodeHandle,
            AdViewCommands.isAdLoaded,
            []
          );
        }
        // BannerAdView call callback isAdLoaded
        (bannerRef.current as any).onCheckIsAdLoaded = resolve;
      });
    }, []);

    const loadAd = useCallback(async () => {
      const nodeHandle = findNodeHandle(bannerRef.current);
      if (nodeHandle) {
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          AdViewCommands.loadAd,
          []
        );
      }
    }, []);

    useImperativeHandle(ref, () => ({
      isAdLoaded,
      loadAd,
    }));

    return (
      <View onLayout={onLayout} style={style}>
        <BannerAdView
          ref={bannerRef}
          size={{
            isAdaptive: props.size === AdViewSize.A ? true : undefined,
            size: props.size,
          }}
          onAdViewImpression={onAdViewImpression}
          onAdViewClicked={onAdViewClicked}
          onAdViewFailed={onAdViewFailed}
          onAdViewLoaded={onAdViewLoaded}
          isAdLoaded={(ready: NativeSyntheticEvent<boolean>) => {
            if ((bannerRef.current as any).onCheckIsAdLoaded) {
              (bannerRef.current as any).onCheckIsAdLoaded(ready.nativeEvent);
              (bannerRef.current as any).onCheckIsAdLoaded = null;
            }
          }}
          style={size}
          isAutoloadEnabled={props.isAutoloadEnabled}
          refreshInterval={props.refreshInterval}
        />
      </View>
    );
  }
);
