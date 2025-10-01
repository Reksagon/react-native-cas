#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNCASMobileAdsSpec/RNCASMobileAdsSpec.h>
@interface CASMobileAds : RCTEventEmitter <NativeCASMobileAdsModuleSpec, CASScreenContentDelegate, CASImpressionDelegate>
#else
#import <React/RCTBridgeModule.h>
@interface CASMobileAds : RCTEventEmitter <RCTBridgeModule, CASScreenContentDelegate, CASImpressionDelegate>
#endif

@end
