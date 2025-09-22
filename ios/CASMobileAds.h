#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <React/RCTComponentViewProtocol.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcherProtocol.h>
#endif

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

#import <RNCASMobileAdsSpec/RNCASMobileAdsSpec.h>

@interface CASMobileAds : RCTEventEmitter <NativeCASMobileAdsModuleSpec, CASScreenContentDelegate, CASImpressionDelegate>
@end
