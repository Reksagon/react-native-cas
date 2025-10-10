package com.cleveradssolutions.plugin.reactnative

import com.cleveradssolutions.plugin.reactnative.views.AdViewManagerImpl
import com.cleveradssolutions.plugin.reactnative.views.CASAdView
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = AdViewManagerImpl.NAME)
class BannerAdViewManager : SimpleViewManager<CASAdView>() {

  override fun getName() = AdViewManagerImpl.NAME

  override fun createViewInstance(ctx: ThemedReactContext): CASAdView =
    AdViewManagerImpl.createViewInstance(ctx)

  @ReactProp(name = "size")
  fun setSize(view: CASAdView, value: String?) =
    AdViewManagerImpl.setSize(view, value)

  @ReactProp(name = "isAutoloadEnabled", defaultBoolean = true)
  fun setIsAutoloadEnabled(view: CASAdView, value: Boolean) =
    AdViewManagerImpl.setIsAutoloadEnabled(view, value)

  @ReactProp(name = "loadOnMount", defaultBoolean = true)
  fun setLoadOnMount(view: CASAdView, value: Boolean) =
    AdViewManagerImpl.setLoadOnMount(view, value)

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
    "isAdLoaded" to 0,
    "loadAd"     to 1,
    "destroy"    to 2
  )

  override fun receiveCommand(view: CASAdView, commandId: Int, args: ReadableArray?) {
    when (commandId) {
      0 -> AdViewManagerImpl.commandIsAdLoaded(view)
      1 -> AdViewManagerImpl.commandLoadAd(view)
      2 -> AdViewManagerImpl.commandDestroy(view)
    }
  }
}
