import { CasModule as CASModule } from '../utils/native';
import type {
  BuildManagerParams,
  BuildManagerResult,
  TargetingOptions,
  AudienceNetworkDataProcessingOptions,
  CASSettings,
  onDismissConsentFlowListener,
  ConsentFlowParams,
} from '../utils/types';
import { MediationManager } from './mediation-manager.module';
import { NativeEventEmitter, Platform } from 'react-native';

class Cas {
  private eventEmitter = new NativeEventEmitter(CASModule);

  buildManager = async (
    params: BuildManagerParams,
    cb: onDismissConsentFlowListener
  ): Promise<BuildManagerResult> => {
    let unsub = this.eventEmitter.addListener('consentFlowDismissed', (e) => {
      cb(e);
      unsub.remove();
    });

    const result = await CASModule.buildManager(params);

    return {
      result,
      manager: new MediationManager(),
    };
  };

  showConsentFlow = async (
    params: Omit<ConsentFlowParams, 'enabled'>,
    cb: onDismissConsentFlowListener
  ) => CASModule.showConsentFlow(params, cb);

  getSDKVersion = async (): Promise<string> => CASModule.getSDKVersion();

  getTargetingOptions = async (): Promise<TargetingOptions> =>
    CASModule.getTargetingOptions();

  setTargetingOptions = async (options: Partial<TargetingOptions>) =>
    CASModule.setTargetingOptions(options);

  getSettings = async (): Promise<CASSettings> => CASModule.getSettings();

  setSettings = async (settings: Partial<CASSettings>) =>
    CASModule.setSettings(settings);

  restartInterstitialInterval = async () =>
    CASModule.restartInterstitialInterval();

  debugValidateIntegration = async () => CASModule.debugValidateIntegration();

  // Facebook specific
  setAudienceNetworkDataProcessingOptions = async (
    params: AudienceNetworkDataProcessingOptions
  ) => CASModule.setAudienceNetworkDataProcessingOptions(params);

  setAdvertiserTrackingEnabled = async (enable: boolean) =>
    Platform.OS === 'ios' && CASModule.setAdvertiserTrackingEnabled(enable);

  // Google specific
  setGoogleAdsConsentForCookies = async (enabled: boolean) =>
    Platform.OS === 'android' &&
    CASModule.setGoogleAdsConsentForCookies(enabled);
}

export const CAS = new Cas();