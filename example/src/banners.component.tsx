
import { View } from 'react-native';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { AdView, AdViewSize, type AdViewRef, type AdContentInfo } from 'react-native-cas';


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

  return (
    <View style={styles.screen}>
      <AdView
        size={AdViewSize.BANNER}
        onAdViewLoaded={() => logCasInfo('Banner (B) loaded')}
        onAdViewClicked={() => logCasInfo('Banner (B) clicked')}
        refreshInterval={20}          
        onAdViewFailed={(adInfo) => {
          const err = getErr(adInfo);
          logCasInfo('Banner (B) failed', err ? `${err.code}: ${err.message}` : '(no error adInfo)');
        }}
        onAdViewImpression={(adInfo) =>
          logCasInfo('Banner (B) impression', formatImpression(getImp(adInfo)))
        }
      />

      <AdView
        size={AdViewSize.MREC}
        refreshInterval={25}
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
        refreshInterval={30}
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
