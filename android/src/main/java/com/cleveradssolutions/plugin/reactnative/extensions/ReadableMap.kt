package com.cleveradssolutions.plugin.reactnative.extensions

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getStringOrEmpty(key: String): String {
  return if (this.hasKey(key) && !this.isNull(key)) this.getString(key) ?: "" else ""
}

fun ReadableMap.getDoubleOrZero(key: String): Double {
  return if (this.hasKey(key) && !this.isNull(key)) this.getDouble(key) else 0.0
}

fun ReadableMap.getIntOrZero(key: String): Int {
  return if (this.hasKey(key) && !this.isNull(key)) this.getInt(key) else 0
}

inline fun ReadableMap.has(key: String, cb: () -> Unit) {
  if (hasKey(key) && !isNull(key)) cb()
}

fun ReadableArray.toStringSet(): Set<String> {
  val list = this.toArrayList()
  return list.filterIsInstance<String>().toSet()
}
