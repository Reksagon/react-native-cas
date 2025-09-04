//#import "CAS.h"
//#import <CAS/CAS.h>
//#import "CASNativeAdViewManager.h"
//#import "CASNativeAdView.h"
//
//@implementation CASNativeAdViewManager
//
//RCT_EXPORT_MODULE(CASNativeAdView)
//
//// Props
//RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
//RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
//RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
//RCT_EXPORT_VIEW_PROPERTY(extraParameters, NSArray)
//RCT_EXPORT_VIEW_PROPERTY(strLocalExtraParameters, NSArray)
//RCT_EXPORT_VIEW_PROPERTY(boolLocalExtraParameters, NSArray)
//
//// Callback
//RCT_EXPORT_VIEW_PROPERTY(onAdLoadedEvent, RCTDirectEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(onAdLoadFailedEvent, RCTDirectEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(onAdClickedEvent, RCTDirectEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(onAdRevenuePaidEvent, RCTDirectEventBlock)
//
//+ (BOOL)requiresMainQueueSetup
//{
//    return YES;
//}
//
//- (UIView *)view
//{
//    return [[CASNativeAdView alloc] initWithBridge: self.bridge];
//}
//
//RCT_EXPORT_METHOD(loadAd:(nonnull NSNumber *)viewTag)
//{
//    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
//        
//        UIView *view = viewRegistry[viewTag];
//        if ( ![view isKindOfClass: [CASNativeAdView class]] )
//        {
//            [[CAS shared] log: @"Cannot find CASNativeAdView with tag %@", viewTag];
//            return;
//        }
//        
//        CASNativeAdView *nativeAdView = (CASNativeAdView *) view;
//        [nativeAdView loadAd];
//    }];
//}
//
//RCT_EXPORT_METHOD(updateAssetView:(nonnull NSNumber *)viewTag assetViewTag:(NSInteger)assetViewTag assetViewName:(NSString *)assetViewName)
//{
//    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
//        
//        UIView *view = viewRegistry[viewTag];
//        if ( ![view isKindOfClass: [CASNativeAdView class]] )
//        {
//            [[CAS shared] log: @"Cannot find CASNativeAdView with tag %@", viewTag];
//            return;
//        }
//        
//        CASNativeAdView *nativeAdView = (CASNativeAdView *) view;
//        
//        if ( [assetViewName isEqualToString: @"TitleView"] )
//        {
//            [nativeAdView setTitleView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"AdvertiserView"] )
//        {
//            [nativeAdView setAdvertiserView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"BodyView"] )
//        {
//            [nativeAdView setBodyView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"CallToActionView"] )
//        {
//            [nativeAdView setCallToActionView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"IconView"] )
//        {
//            [nativeAdView setIconView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"OptionsView"] )
//        {
//            [nativeAdView setOptionsView: @(assetViewTag)];
//        }
//        else if ( [assetViewName isEqualToString: @"MediaView"] )
//        {
//            [nativeAdView setMediaView: @(assetViewTag)];
//        }
//    }];
//}
//
//RCT_EXPORT_METHOD(renderNativeAd:(nonnull NSNumber *)viewTag)
//{
//    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
//
//        UIView *view = viewRegistry[viewTag];
//        if ( ![view isKindOfClass: [CASNativeAdView class]] )
//        {
//            [[CAS shared] log: @"Cannot find CASNativeAdView with tag %@", viewTag];
//            return;
//        }
//        
//        CASNativeAdView *nativeAdView = (CASNativeAdView *) view;
//        [nativeAdView renderNativeAd];
//    }];
//}
//
//@end
