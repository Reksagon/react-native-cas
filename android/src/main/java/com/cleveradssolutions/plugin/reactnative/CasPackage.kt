package com.cleveradssolutions.plugin.reactnative

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class CasPackage : TurboReactPackage() {

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
            BannerAdViewManager()
        )
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
        val name = CAS_MOBILE_ADS_MODULE_NAME
        val isTurbo = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        hashMapOf(
            name to ReactModuleInfo(
                name, name,
                false, false,
                 false,
                false, isTurbo
            )
        )
    }

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == CAS_MOBILE_ADS_MODULE_NAME) {
            CASMobileAdsModule(reactContext)
        } else null
    }

    companion object { const val CAS_MOBILE_ADS_MODULE_NAME = "CASMobileAds" }
}
