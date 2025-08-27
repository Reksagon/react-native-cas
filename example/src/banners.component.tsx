import { useCallback, useRef } from 'react';
import { Button, View } from 'react-native';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { AdView, AdViewSize } from 'react-native-cas';
import type { AdViewRef } from 'react-native-cas';

export const Banners = () => {
  const { logCasInfo } = useCasContext();
  const ref = useRef<AdViewRef | null>(null);

  const nextAd = useCallback(() => {
    ref.current?.loadAd();
  }, []);

  return (
    <View style={styles.screen}>
      <Button title="Next ad" onPress={nextAd} />

      <AdView
        size={AdViewSize.B}
        onAdViewLoaded={() => logCasInfo('Banner (B) loaded')}
        onAdViewClicked={() => logCasInfo('Banner (B) clicked')}
        onAdViewFailed={(e) => logCasInfo('Banner (B) failed', e)}
        onAdViewImpression={(e) => logCasInfo('Banner (B) impression', e)}
      />

      <AdView
        ref={ref}
        isAutoloadEnabled={false}
        size={AdViewSize.M}
        onAdViewLoaded={() => logCasInfo('MREC loaded')}
        onAdViewFailed={(e) => logCasInfo('MREC failed', e)}
      />

      <AdView
        size={AdViewSize.A}
        refreshInterval={20}
        onAdViewLoaded={() => logCasInfo('Adaptive loaded')}
        onAdViewFailed={(e) => logCasInfo('Adaptive failed', e)}
      />
    </View>
  );
};
