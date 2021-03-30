package com.medlinker.adapters.react;

import android.net.Uri;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.URLDecoder;

class MedlinkerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    ExcInterface exeInterface;

    public MedlinkerModule(ReactApplicationContext context, ExcInterface exeInterface) {
        super(context);
        this.context = context;
        this.exeInterface = exeInterface;
    }

    @NonNull
    @Override
    public String getName() {
        return "Medlinker";
    }

    @ReactMethod
    public void exc(String url, Promise promise) {
        if(exeInterface!=null){
            exeInterface.exc(Uri.decode(url),promise);
        }else {
            promise.reject("native端没有实现ExcInterface接口!");
        }
    }
}
