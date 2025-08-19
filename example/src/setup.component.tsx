import React, {useCallback, useEffect} from 'react';
import {AdType, CAS} from 'react-native-cas';
import {useCasContext} from './cas.context';
import {Button, UIManager, NativeModules} from 'react-native';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Setup = () => {
  const context = useCasContext();
  const navigation = useNavigation();

  // 🔎 одразу після маунту перевіряємо, що нативні частини є
  useEffect(() => {
    console.log('[SETUP] mounted');
    console.log('[SETUP] NativeModules.CasModule =', !!NativeModules.CasModule);
    console.log('[SETUP] NativeModules.MediationManagerModule =', !!NativeModules.MediationManagerModule);
    console.log('[SETUP] getViewManagerConfig(BannerAdView) =', UIManager.getViewManagerConfig('BannerAdView')); // у Fabric може бути null — це ок
  }, []);

  const initCas = useCallback(async () => {
    console.log('[SETUP] initCas pressed');
    try {
      await CAS.debugValidateIntegration();
      console.log('[SETUP] validateIntegration done');

      const {manager, result} = await CAS.buildManager(
        {
          consentFlow: { enabled: true, requestATT: true },
          testMode: true,
          userId: 'user_id',
          adTypes: [AdType.Interstitial, AdType.Banner, AdType.Rewarded, AdType.AppOpen],
          casId: '1058803540',
        },
        (params) => console.log('[SETUP] consentFlow dismissed status =', params.status)
      );

      context.setManager(manager);
      console.log('[SETUP] manager initialized, result =', result);
      navigation.navigate('Menu' as never);
    } catch (e) {
      console.log('[SETUP] initCas error ->', e);
    }
  }, [context, navigation]);

  // 👇 щоб виключити проблему з кнопкою/навігацією — автозапуск один раз
  useEffect(() => { initCas(); }, [initCas]);

  const showFlow = useCallback(() => {
    console.log('[SETUP] showFlow pressed');
    return CAS.showConsentFlow({ requestATT: true }, (p) =>
      console.log('[SETUP] consentFlow dismissed status =', p.status)
    );
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Initialize CAS" onPress={initCas} />
      <Button title="Show Consent Flow" onPress={showFlow} />
    </SafeAreaView>
  );
};
