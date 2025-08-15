package com.cas.extensions

import com.cleversolutions.ads.AdImpression
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap

fun AdImpression.toReadableMap(): ReadableMap {
  val map = WritableNativeMap()

  // базові поля
  map.putInt("adType", this.adType.ordinal)
  map.putDouble("cpm", this.cpm)
  map.putInt("impressionDepth", this.impressionDepth)
  map.putDouble("lifetimeRevenue", this.lifetimeRevenue)
  map.putInt("priceAccuracy", this.priceAccuracy)

  // опційні / рядкові — кладемо лише якщо є
  this.identifier?.let { map.putString("identifier", it) }
  this.network?.let { map.putString("network", it) }
  this.versionInfo?.let { map.putString("versionInfo", it) }
  this.creativeIdentifier?.let { map.putString("creativeIdentifier", it) }

  return map
}
