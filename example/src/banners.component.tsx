import { useCallback, useRef } from 'react';
import { Button, View } from 'react-native';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { AdView, AdViewSize } from 'react-native-cas';
import type { AdViewRef, AdContentInfo } from 'react-native-cas';

export const formatImpression = (i?: AdContentInfo) => {
  if (!i) return '(no impression payload)';
  return [
    `fmt=${i.format ?? '-'}`,
    `rev=${i.revenue ?? 0}${i.revenuePrecision ? `(${i.revenuePrecision})` : ''}`,
    `total=${i.revenueTotal ?? 0}`,
    `depth=${i.impressionDepth ?? 0}`,
    `src=${i.sourceName ?? '-'}`,
    `unit=${i.sourceUnitId ?? '-'}`,
    i.creativeId ? `creative=${i.creativeId}` : null,
  ].filter(Boolean).join(' ');
};

const getErr = (adInfo: any) => (adInfo?.nativeEvent ?? adInfo)?.error;
const getImp = (adInfo: any) => (adInfo?.nativeEvent ?? adInfo)?.impression;

export const Banners = () => {
  const { logCasInfo } = useCasContext();
  const ref = useRef<AdViewRef | null>(null);

  const nextAd = useCallback(() => ref.current?.loadAd(), []);

  return (
    <View style={styles.screen}>
      <Button title="Next ad" onPress={nextAd} />

      <AdView
        size={AdViewSize.BANNER}
        onAdViewLoaded={() => logCasInfo('Banner (B) loaded')}
        onAdViewClicked={() => logCasInfo('Banner (B) clicked')}
        onAdViewFailed={(adInfo) => {
          const err = getErr(adInfo);
          logCasInfo('Banner (B) failed', err ? `${err.code}: ${err.message}` : '(no error adInfo)');
        }}
        onAdViewImpression={(adInfo) =>
          logCasInfo('Banner (B) impression', formatImpression(getImp(adInfo)))
        }
      />

      <AdView
        ref={ref}
        size={AdViewSize.MREC}
        onAdViewLoaded={() => logCasInfo('MREC loaded')}
        onAdViewFailed={(adInfo) => {
          const err = getErr(adInfo);
          logCasInfo('MREC failed', err ? `${err.code}: ${err.message}` : '(no error adInfo)');
        }}
        onAdViewImpression={(adInfo) =>
          logCasInfo('MREC impression', formatImpression(getImp(adInfo)))
        }
      />

      <AdView
        size={AdViewSize.ADAPTIVE}
        refreshInterval={20}
        onAdViewLoaded={() => logCasInfo('Adaptive loaded')}
        onAdViewFailed={(adInfo) => {
          const err = getErr(adInfo);
          logCasInfo('Adaptive failed', err ? `${err.code}: ${err.message}` : '(no error adInfo)');
        }}
        onAdViewImpression={(adInfo) =>
          logCasInfo('Adaptive impression', formatImpression(getImp(adInfo)))
        }
      />
    </View>
  );
};
