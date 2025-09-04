#import "CAS.h"
#import <CAS/CAS.h>

@implementation CAS

RCT_EXPORT_MODULE();

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeCASSpecJSI>(params);
}

- (NSNumber *)multiply:(double)a b:(double)b {
    return @(a * b);
}

@end
