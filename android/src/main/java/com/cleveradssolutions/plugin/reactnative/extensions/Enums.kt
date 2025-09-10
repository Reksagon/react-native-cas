package com.cleveradssolutions.plugin.reactnative.extensions

inline fun <reified T : Enum<T>> Int.toEnum(): T? {
  val values = enumValues<T>()
  return if (this in values.indices) values[this] else null
}

inline fun <reified T : Enum<T>> T.toInt(): Int = this.ordinal

