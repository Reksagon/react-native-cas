package com.cleveradssolutions.plugin.reactnative.extensions

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

inline fun ReadableMap.has(key: String, cb: () -> Unit) {
  if (hasKey(key) && !isNull(key)) cb()
}

fun ReadableArray.toStringSet(): Set<String> =
  toArrayList().filterIsInstance<String>().toSet()
