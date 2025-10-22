package com.cleveradssolutions.plugin.reactnative

import com.cleveradssolutions.plugin.reactnative.views.AdViewManagerImpl
import com.cleveradssolutions.plugin.reactnative.views.CASAdView
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = AdViewManagerImpl.NAME)
class CASMobileAdsViewManager : SimpleViewManager<CASAdView>() {

  override fun getName() = AdViewManagerImpl.NAME

  override fun createViewInstance(ctx: ThemedReactContext): CASAdView =
    AdViewManagerImpl.createViewInstance(ctx)

  @ReactProp(name = "size")
  fun setSize(view: CASAdView, value: String?) =
    AdViewManagerImpl.setSize(view, value)

  @ReactProp(name = "autoload", defaultBoolean = true)
  fun setAutoload(view: CASAdView, value: Boolean) =
    AdViewManagerImpl.setAutoload(view, value)

  @ReactProp(name = "refreshInterval")
  fun setRefreshInterval(view: CASAdView, value: Int) =
    AdViewManagerImpl.setRefreshInterval(view, value)

  @ReactProp(name = "casId")
  fun setCasId(view: CASAdView, value: String?) =
    AdViewManagerImpl.setCasId(view, value)

  override fun onAfterUpdateTransaction(view: CASAdView) {
    super.onAfterUpdateTransaction(view)
    AdViewManagerImpl.onAfterUpdateTransaction(view)
  }

  override fun onDropViewInstance(view: CASAdView) {
    AdViewManagerImpl.onDropViewInstance(view)
    super.onDropViewInstance(view)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
    AdViewManagerImpl.getExportedCustomDirectEventTypeConstants()

  override fun getCommandsMap(): Map<String, Int> = mapOf(
    "loadAd"  to 1
  )

  override fun receiveCommand(view: CASAdView, commandId: Int, args: ReadableArray?) {
    when (commandId) {
      1 -> AdViewManagerImpl.commandLoadAd(view)
    }
  }
}
