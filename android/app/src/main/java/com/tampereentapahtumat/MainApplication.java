package com.tampereentapahtumat;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.attehuhtakangas.navigationbar.NavigationBarPackage;
import com.bottomsheetbehavior.BottomSheetBehaviorPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.newrelic.agent.android.NewRelic;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.wix.rnnewrelic.RNNewRelicPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNSpinkitPackage(),
                    new VectorIconsPackage(),
                    new MapsPackage(),
                    new ReactNativeI18n(),
                    new RNGeocoderPackage(),
                    new BlurViewPackage(),
                    new NavigationBarPackage(),
                    new BottomSheetBehaviorPackage(),
                    new RNCalendarPackage(),
                    new RNNewRelicPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public void onCreate() {
        super.onCreate();
        NewRelic.withApplicationToken(BuildConfig.NEW_RELIC_TOKEN).start(this);
    }
}
