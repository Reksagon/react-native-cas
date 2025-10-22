package com.cleveradssolutions.plugin.reactnative

import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = AdViewManagerImpl.NAME)
class CASMobileAdsViewManager : SimpleViewManager<CASBannerView>() {

  override fun getName() = AdViewManagerImpl.NAME

  override fun createViewInstance(ctx: ThemedReactContext): CASBannerView =
    AdViewManagerImpl.createViewInstance(ctx)

  @ReactProp(name = "size")
  fun setSize(view: CASBannerView, value: String?) =
    AdViewManagerImpl.setSize(view, value)

  @ReactProp(name = "autoload", defaultBoolean = true)
  fun setAutoload(view: CASBannerView, value: Boolean) =
    AdViewManagerImpl.setAutoload(view, value)

  @ReactProp(name = "refreshInterval")
  fun setRefreshInterval(view: CASBannerView, value: Int) =
    AdViewManagerImpl.setRefreshInterval(view, value)

  @ReactProp(name = "casId")
  fun setCasId(view: CASBannerView, value: String?) =
    AdViewManagerImpl.setCasId(view, value)

  override fun onAfterUpdateTransaction(view: CASBannerView) {
    super.onAfterUpdateTransaction(view)
    AdViewManagerImpl.onAfterUpdateTransaction(view)
  }

  override fun onDropViewInstance(view: CASBannerView) {
    AdViewManagerImpl.onDropViewInstance(view)
    super.onDropViewInstance(view)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
    AdViewManagerImpl.getExportedCustomDirectEventTypeConstants()

  override fun getCommandsMap(): Map<String, Int> = mapOf(
    "loadAd"  to 1
  )

  override fun receiveCommand(view: CASBannerView, commandId: Int, args: ReadableArray?) {
    when (commandId) {
      1 -> AdViewManagerImpl.commandLoadAd(view)
    }
  }
}
