import com.facebook.react.ReactSettingsExtension

pluginManagement {
  includeBuild("../node_modules/@react-native/gradle-plugin")
}

plugins {
  id("com.facebook.react.settings")
}

// Kotlin DSL еквівалент виклику autolink
extensions.configure<ReactSettingsExtension> {
  autolinkLibrariesFromCommand()
}

rootProject.name = "CasExample"
include(":app")

// підключаємо підпроєкт бібліотеки
include(":react-native-cas")
project(":react-native-cas").projectDir = file("../../android")

includeBuild("../node_modules/@react-native/gradle-plugin")
