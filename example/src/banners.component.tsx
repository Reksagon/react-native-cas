import React from 'react';
import { View, NativeSyntheticEvent } from 'react-native';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import {
  AdView,
  AdViewSize,
} from 'react-native-cas';

type OnFailedEvent = { code: number; message: string };
type OnLoadedEvent = { width?: number; height?: number };
type OnImpressionEvent = { impression: string }; 

export const Banners = () => {
  const { logCasInfo } = useCasContext();

  const onLoad =
    (label: string) =>
    (e?: NativeSyntheticEvent<OnLoadedEvent>) => {
      const { width, height } = e?.nativeEvent ?? {};
      const size = width && height ? `${width}x${height}dp` : undefined;
      logCasInfo(`${label} loaded`, size);
    };

  const onFail =
    (label: string) =>
    (e: NativeSyntheticEvent<OnFailedEvent>) => {
      const { code, message } = e.nativeEvent;
      logCasInfo(`${label} failed`, `${code}: ${message}`);
    };

  const onClick =
    (label: string) =>
    () => {
      logCasInfo(`${label} clicked`);
    };

  const onImpression =
    (label: string) =>
    (e: NativeSyntheticEvent<OnImpressionEvent>) => {
      logCasInfo(`${label} impression`, e.nativeEvent.impression);
    };

  return (
    <View style={styles.screen} >
      <AdView
        size={AdViewSize.BANNER}
        refreshInterval={20}
        onAdViewLoaded={onLoad('Banner (B)')}
        onAdViewClicked={onClick('Banner (B)')}
        onAdViewFailed={onFail('Banner (B)')}
        onAdViewImpression={onImpression('Banner (B)')}
      />


      <AdView
        size={AdViewSize.MREC}
        refreshInterval={25}
        onAdViewLoaded={onLoad('MREC (M)')}
        onAdViewFailed={onFail('MREC (M)')}
        onAdViewImpression={onImpression('MREC (M)')}
      />

      <AdView
        size={AdViewSize.ADAPTIVE}
        refreshInterval={30}
        onAdViewLoaded={onLoad('Adaptive (A)')}
        onAdViewFailed={onFail('Adaptive (A)')}
        onAdViewImpression={onImpression('Adaptive (A)')}
      />
    </View>
  );
};
