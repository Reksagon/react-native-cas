package com.cas

import com.cas.views.BannerAdViewManager
import com.cas.extensions.MediationManagerWrapper
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import android.util.Log;

class CasPackage : ReactPackage {
  private val managerWrapper = MediationManagerWrapper()

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
      Log.d("RN_CAS", "createNativeModules called")
    return listOf(
      CasModule(reactContext, managerWrapper),
      MediationManagerModule(reactContext, managerWrapper)
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    Log.d("RN_CAS", "createViewManagers called")
    return listOf(
      BannerAdViewManager(managerWrapper)
    )
  }
}
