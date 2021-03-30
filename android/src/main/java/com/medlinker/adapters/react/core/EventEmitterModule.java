package com.medlinker.adapters.react.core;

import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class EventEmitterModule implements EventEmitter {
    private ReactContext mReactContext;

    public EventEmitterModule(ReactContext reactContext) {
        mReactContext = reactContext;
    }

    @Override
    public void emit(Bundle eventBody) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("__event__", Arguments.fromBundle(eventBody));
    }
}
