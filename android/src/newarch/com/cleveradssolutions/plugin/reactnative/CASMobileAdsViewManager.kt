package com.cleveradssolutions.plugin.reactnative

import com.cleveradssolutions.plugin.reactnative.views.AdViewManagerImpl
import com.cleveradssolutions.plugin.reactnative.views.CASAdView
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.CASAdViewManagerDelegate
import com.facebook.react.viewmanagers.CASAdViewManagerInterface

@ReactModule(name = AdViewManagerImpl.NAME)
class CASMobileAdsViewManager :
  SimpleViewManager<CASAdView>(),
  CASAdViewManagerInterface<CASAdView> {

  private val delegate: ViewManagerDelegate<CASAdView> =
    CASAdViewManagerDelegate<CASAdView, CASMobileAdsViewManager>(this)

  override fun getDelegate() = delegate
  override fun getName() = AdViewManagerImpl.NAME
  override fun createViewInstance(ctx: ThemedReactContext): CASAdView =
    AdViewManagerImpl.createViewInstance(ctx)

  override fun setSizeConfig(view: CASAdView, value: ReadableMap?) =
    AdViewManagerImpl.setSizeConfig(view, value)

  override fun setAutoload(view: CASAdView, value: Boolean) =
    AdViewManagerImpl.setAutoload(view, value)

  override fun setRefreshInterval(view: CASAdView, value: Int) =
    AdViewManagerImpl.setRefreshInterval(view, value)

  override fun setCasId(view: CASAdView, value: String?) =
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

  override fun loadAd(view: CASAdView) = AdViewManagerImpl.commandLoadAd(view)
}
