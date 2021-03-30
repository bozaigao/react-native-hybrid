/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Medlinker.h"
#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
static id<MedlinkerDelegate> delegate;
@implementation Medlinker

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}


- (NSArray *)supportedEvents
{
  return @[@"__event__"];
}

/**
 *url解码
 */
- (NSString *)URLDecodedString:(NSString *)str
{
NSString *decodedString=(__bridge_transfer NSString *)CFURLCreateStringByReplacingPercentEscapesUsingEncoding(NULL, (__bridge CFStringRef)str, CFSTR(""), CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding));

return decodedString;
}

RCT_EXPORT_METHOD(exc:(NSString*)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if(delegate){
        [delegate exc:[self URLDecodedString:url] resolver:resolve rejecter:reject];
    }
    
}

+(void)setDelegate:(id<MedlinkerDelegate>) medlinkerDelegate
{
    delegate = medlinkerDelegate;
}

+(id)allocWithZone:(NSZone *)zone {
  static RCTBridge *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

-(void)emit:(NSDictionary*) dictionary
{
   
    [self sendEventWithName:@"__event__" body:dictionary];
}

@end
