import React, { useCallback } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { CASMobileAds, Audience } from 'react-native-cas';

export const Settings = () => {
  const { logCasInfo } = useCasContext();

  const getSettings = useCallback(async () => {
    try {
      const settings = await CASMobileAds.getSettings();
      logCasInfo('Current CAS settings: ', JSON.stringify(settings));
    } catch (e: any) {
      logCasInfo('getSettings error: ', String(e?.message ?? e));
    }
  }, [logCasInfo]);

  const setSettings = useCallback(async () => {
    try {
      await CASMobileAds.setSettings({
        taggedAudience: Audience.Children,
        debugMode: true,
        age: 12,
        keywords: ['kids','toys'],
        contentUrl: 'https://cas.ai',
        trialAdFreeInterval: 120,
      });
      await getSettings();
    } catch (e: any) {
      logCasInfo('setSettings error: ', String(e?.message ?? e));
    }
  }, [getSettings, logCasInfo]);

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Get settings" onPress={getSettings} />
      <Button
        title="Change settings (Children)"
        onPress={setSettings}
      />
    </SafeAreaView>
  );
};

export default Settings;
