package com.totaramobileapp;

import android.app.Application;

import android.content.Context;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.futurepress.staticserver.FPStaticServerPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import cx.evermeet.versioninfo.RNVersionInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NetInfoPackage(),
            new FPStaticServerPackage(),
            new RNZipArchivePackage(),
            new RNFSPackage(),
            new RNVersionInfoPackage(),
            new AsyncStoragePackage(),
            new CookieManagerPackage(),
            new RNCWebViewPackage(),
            new SplashScreenReactPackage(),
            new RNLocalizePackage(),
            new SvgPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new RNNotificationsPackage(MainApplication.this),
            new ReactNativeFirebaseAppPackage()
      );
      packages.add(new MyReactNativePackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
