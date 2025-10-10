import React, { useCallback, useEffect, useState } from 'react';
import { ConsentFlowStatus } from 'react-native-cas';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { CASMobileAds, Audience, PrivacyGeography } from 'react-native-cas';
import { useCasContext } from './cas.context';
import { useNavigation } from '@react-navigation/native';

const CONSENT_STATUS_NAME: Record<number, string> = {
   // There was no attempt to show the consent flow.
  0: 'unknown',
  // User consent obtained. Personalized vs non-personalized undefined.
  3: 'obtained',
  // User consent not required.
  4: 'notRequired',
  // User consent unavailable.
  5: 'unavailable',
  // There was an internal error.
  10: 'internalError',
  // There was an error loading data from the network.
  11: 'networkError',
  // There was an error with the UI context is passed in.
  12: 'contextInvalid',
  // There was an error with another form is still being displayed.
  13: 'flowStillShowing',
};

export const Setup = () => {
  const { logCasInfo } = useCasContext();
  const navigation = useNavigation();

const consentStatusName = (code: number) =>
  CONSENT_STATUS_NAME[code] ?? `unknown(${code})`;

  const initCas = useCallback(async () => {
    try {
      const init = await CASMobileAds.initialize('1058803540', {
        forceTestAds: true,
        audience: Audience.NotChildren,    
        debugPrivacyGeography: PrivacyGeography.europeanEconomicArea,        
        showConsentFormIfRequired: true          });
      logCasInfo('initialize:', {
        isConsentRequired: init?.isConsentRequired ?? false,
        consentFlowStatus: consentStatusName(init?.consentFlowStatus ?? 0)
    });
      
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
