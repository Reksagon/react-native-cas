#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <ReactCommon/RCTTurboModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "CASMobileAdsSpec.h"
#endif

@interface CAS : RCTEventEmitter <RCTBridgeModule
#ifdef RCT_NEW_ARCH_ENABLED
, CASMobileAdsSpec
#endif
>
@end
