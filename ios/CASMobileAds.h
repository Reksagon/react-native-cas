#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <React/RCTComponentViewProtocol.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcherProtocol.h>
#endif

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CASMobileAds : RCTEventEmitter <RCTBridgeModule>
@end
