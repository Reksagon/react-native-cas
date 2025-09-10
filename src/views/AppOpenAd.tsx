import { CASMobileAds } from '../modules/CASMobileAds';
import type { FullscreenAdType } from '../types/FullscreenAdType';
import type { AdError, AdErrorCode } from '../types/Types';
import { addEventListener, removeEventListener } from '../EventEmitter';

type AnyEvent = { type?: string; [k: string]: any };
const NAME = 'appopen';
const isMe = (t: AnyEvent) => t?.type === NAME;
const toAdError = (e: AnyEvent): AdError => ({
  code: Number(e?.code ?? 0) as AdErrorCode,
  message: String(e?.message ?? ''),
});

export const AppOpenAd: FullscreenAdType = {
  isAdLoaded: CASMobileAds.isAppOpenAdLoaded,
  loadAd: () => CASMobileAds.loadAppOpenAd(true as any),
  showAd: CASMobileAds.showAppOpenAd,

  addAdLoadedEventListener: (l) =>
    addEventListener('adLoaded', (e: AnyEvent) => isMe(e) && l()),
  removeAdLoadedEventListener: () => removeEventListener('adLoaded'),

  addAdLoadFailedEventListener: (l) =>
    addEventListener('adFailedToLoad', (e: AnyEvent) => isMe(e) && l(toAdError(e))),
  removeAdLoadFailedEventListener: () => removeEventListener('adFailedToLoad'),

  addAdClickedEventListener: (l) =>
    addEventListener('onClicked', (e: AnyEvent) => isMe(e) && l()),
  removeAdClickedEventListener: () => removeEventListener('onClicked'),

  addAdDisplayedEventListener: (l) =>
    addEventListener('onShown', (e: AnyEvent) => isMe(e) && l()),
  removeAdDisplayedEventListener: () => removeEventListener('onShown'),

  addAdFailedToShowEventListener: (l) =>
    addEventListener('onShowFailed', (e: AnyEvent) => isMe(e) && l(toAdError(e))),
  removeAdFailedToShowEventListener: () => removeEventListener('onShowFailed'),

  addAdDismissedEventListener: (l) =>
    addEventListener('onClosed', (e: AnyEvent) => isMe(e) && l()),
  removeAdDismissedEventListener: () => removeEventListener('onClosed'),

  addAdImpressionEventListener: (l) => addEventListener('onImpression', l),
  removeAdImpressionEventListener: () => removeEventListener('onImpression'),
};
