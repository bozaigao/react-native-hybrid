package com.medlinker.adapters.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.medlinker.adapters.react.core.EventEmitterModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MedlinkerPackage implements ReactPackage {
  ExcInterface excInterface = null;
  public EventEmitterModule eventEmitterModule;

  public MedlinkerPackage(ExcInterface excInterface){
    this.excInterface = excInterface;
  }
  /**
   * @param reactContext react application context that can be used to create modules
   * @return list of native modules to register with the newly created catalyst instance
   */
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    eventEmitterModule =  new EventEmitterModule(reactContext);
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new MedlinkerModule(reactContext, this.excInterface));
    return modules;
  }

  /**
   * @param reactContext
   * @return a list of view managers that should be registered with {UIManagerModule}
   */
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
