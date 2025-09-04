import { CASMobileAds } from '../modules/CASMobileAds';
import { addEventListener, removeEventListener } from '../EventEmitter';
const EVENTS = {
    LOADED: 'onRewardedLoaded',
    LOAD_FAILED: 'onRewardedLoadFailed',
    CLICKED: 'onRewardedClicked',
    DISPLAYED: 'onRewardedDisplayed',
    FAILED_TO_SHOW: 'onRewardedFailedToShow',
    HIDDEN: 'onRewardedHidden',
    COMPLETED: 'onRewardedCompleted',
    IMPRESSION: 'onRewardedImpression',
};
export const RewardedAd = {
    isAdLoaded: CASMobileAds.isRewardedAdLoaded,
    loadAd: CASMobileAds.loadRewardedAd,
    showAd: CASMobileAds.showRewardedAd,
    addAdLoadedEventListener: (l) => addEventListener(EVENTS.LOADED, l),
    removeAdLoadedEventListener: () => removeEventListener(EVENTS.LOADED),
    addAdLoadFailedEventListener: (l) => addEventListener(EVENTS.LOAD_FAILED, l),
    removeAdLoadFailedEventListener: () => removeEventListener(EVENTS.LOAD_FAILED),
    addAdClickedEventListener: (l) => addEventListener(EVENTS.CLICKED, l),
    removeAdClickedEventListener: () => removeEventListener(EVENTS.CLICKED),
    addAdDisplayedEventListener: (l) => addEventListener(EVENTS.DISPLAYED, l),
    removeAdDisplayedEventListener: () => removeEventListener(EVENTS.DISPLAYED),
    addAdFailedToShowEventListener: (l) => addEventListener(EVENTS.FAILED_TO_SHOW, l),
    removeAdFailedToShowEventListener: () => removeEventListener(EVENTS.FAILED_TO_SHOW),
    addAdDismissedEventListener: (l) => addEventListener(EVENTS.HIDDEN, l),
    removeAdDismissedEventListener: () => removeEventListener(EVENTS.HIDDEN),
    addAdImpressionEventListener: (l) => addEventListener(EVENTS.IMPRESSION, l),
    removeAdImpressionEventListener: () => removeEventListener(EVENTS.IMPRESSION),
};
