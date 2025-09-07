package com.cleveradssolutions.plugin.reactnative.extensions

import com.cleversolutions.ads.AdImpression
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap

fun AdImpression.toReadableMap(): ReadableMap {
  val map = WritableNativeMap()

  map.putInt("adType", this.adType.ordinal)
  map.putDouble("cpm", this.cpm)
  map.putInt("impressionDepth", this.impressionDepth)
  map.putDouble("lifetimeRevenue", this.lifetimeRevenue)
  map.putInt("priceAccuracy", this.priceAccuracy)

  this.identifier.let { map.putString("identifier", it) }
  this.network.let { map.putString("network", it) }
  this.versionInfo.let { map.putString("versionInfo", it) }
  this.creativeIdentifier?.let { map.putString("creativeIdentifier", it) }

  return map
}
