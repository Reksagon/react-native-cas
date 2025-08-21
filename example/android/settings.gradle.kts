import com.facebook.react.ReactSettingsExtension

pluginManagement {
    includeBuild("../node_modules/@react-native/gradle-plugin")
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
        maven { url = uri("https://sdk.cleveradssolutions.com/repo") }
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenLocal()
        google()
        mavenCentral()

        maven {
            name = "CASBetaRepo"
            url = uri("https://repo.repsy.io/mvn/cleveradssolutions/beta")
            content { includeGroup("com.cleveradssolutions") }
        }
        maven {
            name = "MintegralAdsRepo"
            url = uri("https://dl-maven-android.mintegral.com/repository/mbridge_android_sdk_oversea")
            content { includeGroup("com.mbridge.msdk.oversea") }
        }
        maven {
            name = "PangleAdsRepo"
            url = uri("https://artifact.bytedance.com/repository/pangle")
            content { includeGroup("com.pangle.global") }
        }
        maven {
            name = "ChartboostAdsRepo"
            url = uri("https://cboost.jfrog.io/artifactory/chartboost-ads/")
            content { includeGroup("com.chartboost") }
        }
        maven {
            name = "SuperAwesomeAdsRepo"
            url = uri("https://aa-sdk.s3-eu-west-1.amazonaws.com/android_repo")
            content { includeGroup("tv.superawesome.sdk.publisher") }
        }
        maven {
            name = "YSONetworkRepo"
            url = uri("https://ysonetwork.s3.eu-west-3.amazonaws.com/sdk/android")
            content { includeGroup("com.ysocorp") }
        }
        maven {
            name = "OguryAdsRepo"
            url = uri("https://maven.ogury.co")
            content {
                includeGroup("co.ogury")
                includeGroup("co.ogury.module")
            }
        }
        maven {
            name = "SmaatoAdsRepo"
            url = uri("https://s3.amazonaws.com/smaato-sdk-releases/")
            content { includeGroup("com.smaato.android.sdk") }
        }
        maven {
            name = "MadexAdsRepo"
            url = uri("https://sdkpkg.sspnet.tech")
            content {
                includeGroup("sspnet.tech")
                includeGroup("sspnet.tech.adapters")
            }
        }
    }
}

plugins {
    id("com.facebook.react.settings")
}

extensions.configure<ReactSettingsExtension> {
    autolinkLibrariesFromCommand()
}

rootProject.name = "CasExample"
include(":app")


includeBuild("../node_modules/@react-native/gradle-plugin")