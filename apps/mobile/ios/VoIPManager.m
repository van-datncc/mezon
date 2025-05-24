#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(VoIPManager, RCTEventEmitter)

// Register for VoIP push notifications
RCT_EXTERN_METHOD(registerForVoIPPushes:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Get current VoIP token
RCT_EXTERN_METHOD(getVoIPToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// End call through CallKit
RCT_EXTERN_METHOD(endCall:(NSString *)callId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Answer call through CallKit
RCT_EXTERN_METHOD(answerCall:(NSString *)callId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Export supported events
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"VoIPTokenReceived", @"VoIPNotificationReceived", @"VoIPCallEnded", @"VoIPCallAccepted", @"VoIPCallDeclined"];
}

@end
