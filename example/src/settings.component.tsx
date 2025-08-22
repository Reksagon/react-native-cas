import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { CASMobileAds, Audience, Gender } from 'react-native-cas';

export const Settings = () => {
  const { logCasInfo } = useCasContext();

  const getSettings = useCallback(async () => {
    try {
      const settings = await CASMobileAds.getSettings();
      const targeting = await CASMobileAds.getTargetingOptions();
      logCasInfo('Current CAS settings: ', JSON.stringify(settings));
      logCasInfo('Current Targeting settings: ', JSON.stringify(targeting));
    } catch (e: any) {
      logCasInfo('getSettings error: ', String(e?.message ?? e));
    }
  }, [logCasInfo]);

  const setSettings = useCallback(async () => {
    try {
      await CASMobileAds.setSettings({ taggedAudience: Audience.Children });
      await CASMobileAds.setTargetingOptions({ gender: Gender.Male, age: 12 });
      await getSettings();
    } catch (e: any) {
      logCasInfo('setSettings error: ', String(e?.message ?? e));
    }
  }, [getSettings, logCasInfo]);

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Get settings" onPress={getSettings} />
      <Button title="Change settings (Children, age 12, Male)" onPress={setSettings} />
    </SafeAreaView>
  );
};

export default Settings;
