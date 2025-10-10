package com.cleveradssolutions.plugin.reactnative

import androidx.annotation.NonNull
import com.cleveradssolutions.plugin.reactnative.views.AdViewManagerImpl
import com.cleveradssolutions.plugin.reactnative.views.CASAdView
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.AdViewManagerDelegate
import com.facebook.react.viewmanagers.AdViewManagerInterface

@ReactModule(name = AdViewManagerImpl.NAME)
class BannerAdViewManager :
  SimpleViewManager<CASAdView>(),
  AdViewManagerInterface<CASAdView> {

  private val delegate: ViewManagerDelegate<CASAdView> =
    AdViewManagerDelegate<CASAdView, BannerAdViewManager>(this)

  override fun getDelegate() = delegate
  override fun getName() = AdViewManagerImpl.NAME
  override fun createViewInstance(ctx: ThemedReactContext): CASAdView = AdViewManagerImpl.createViewInstance(ctx)
  override fun setSize(view: CASAdView, value: String?) = AdViewManagerImpl.setSize(view, value)
  override fun setIsAutoloadEnabled(view: CASAdView, value: Boolean) = AdViewManagerImpl.setIsAutoloadEnabled(view, value)
  override fun setLoadOnMount(view: CASAdView, value: Boolean) = AdViewManagerImpl.setLoadOnMount(view, value)
  override fun setRefreshInterval(view: CASAdView, @NonNull value: Int) = AdViewManagerImpl.setRefreshInterval(view, value)
  override fun onAfterUpdateTransaction(view: CASAdView) {
    super.onAfterUpdateTransaction(view)
    AdViewManagerImpl.onAfterUpdateTransaction(view)
  }
  override fun onDropViewInstance(view: CASAdView) {
    AdViewManagerImpl.onDropViewInstance(view)
    super.onDropViewInstance(view)
  }
  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> = AdViewManagerImpl.getExportedCustomDirectEventTypeConstants()
  override fun isAdLoaded(view: CASAdView) = AdViewManagerImpl.commandIsAdLoaded(view)
  override fun loadAd(view: CASAdView) = AdViewManagerImpl.commandLoadAd(view)
  override fun destroy(view: CASAdView) = AdViewManagerImpl.commandDestroy(view)
  override fun setCasId(view: CASAdView?, value: String?) {
    if (view != null) {
      AdViewManagerImpl.setCasId(view, value)
    }
  }
}
