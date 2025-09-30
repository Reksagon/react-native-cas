import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { CASMobileAds } from 'react-native-cas';
import { StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';
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

      const init = await CASMobileAds.initialize('1058803540', true, true);
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

/*
export const Setup = () => {
  const { logCasInfo } = useCasContext();
  const navigation = useNavigation();

  // const initCas = useCallback(async () => {
  //   try {
  //     const unsub = CASMobileAds.addConsentFlowDismissedEventListener((status) => {
  //       logCasInfo('consentFlowDismissed:', status);
  //     });
  //     const init = await CASMobileAds.initialize('1058803540', true);
  //     logCasInfo('initialize:', init);
  //     const v = await CASMobileAds.getSDKVersion();
  //     logCasInfo('sdkVersion:', v);
  //     navigation.navigate('Menu' as never);
  //   } catch (e: any) {
  //     logCasInfo('initialize error:', String(e?.message ?? e));
  //   }
  // }, [logCasInfo, navigation]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    CASMobileAds.initialize("1058803540", true, true).then(() => {
      console.log("✅ CASMobileAds initialized");
      setInitialized(true);
    }).catch((e) => {
      console.error("❌ CASMobileAds failed to initialize", e);
    });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Text>
        {initialized ? "✅ SDK Initialized" : "⏳ Initializing..."}
      </Text>
    </SafeAreaView>
  );
};
*/