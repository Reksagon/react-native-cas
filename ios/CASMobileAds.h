#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>
#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUtils.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNCASMobileAdsSpec/RNCASMobileAdsSpec.h>
@interface CASMobileAds : RCTEventEmitter <NativeCASMobileAdsModuleSpec, CASScreenContentDelegate, CASImpressionDelegate>
#else
#import <React/RCTBridgeModule.h>
@interface CASMobileAds : RCTEventEmitter <RCTBridgeModule, CASScreenContentDelegate, CASImpressionDelegate>
#endif

+ (NSDictionary *)convertImpressionInfo:(CASContentInfo *)info;
@end
