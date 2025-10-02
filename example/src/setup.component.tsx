import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { CASMobileAds, Audience } from 'react-native-cas';
import { useCasContext } from './cas.context';
import { useNavigation } from '@react-navigation/native';

export const Setup = () => {
  const { logCasInfo } = useCasContext();
  const navigation = useNavigation();

  const initCas = useCallback(async () => {
    try {
      const unsub = CASMobileAds.addConsentFlowDismissedEventListener((status) => {
        logCasInfo('consentFlowDismissed:', status);
      });
      const init = await CASMobileAds.initialize('1058803540', {
        forceTestAds: true,
        audience: Audience.NotChildren,            
        showConsentFormIfRequired: true,       
        trialAdFreeInterval: 0   });
      logCasInfo('initialize:', init);
      
      const v = await CASMobileAds.getSDKVersion();
      logCasInfo('sdkVersion:', v);
      
      navigation.navigate('Menu' as never);

    } catch (e: any) {
      logCasInfo('initialize error:', String(e?.message ?? e));
    }
  }, [logCasInfo, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Initialize CAS" onPress={initCas} />
    </SafeAreaView>
  );
};