/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@protocol MedlinkerDelegate <NSObject>
- (void)exc:(NSString*)url
   resolver:(RCTPromiseResolveBlock)resolve
   rejecter:(RCTPromiseRejectBlock)reject;
@end

@interface Medlinker : RCTEventEmitter<RCTBridgeModule>
-(void)emit:(NSDictionary*) dictionary;
+(void)setDelegate:(id<MedlinkerDelegate>) medlinkerDelegate;
@end
