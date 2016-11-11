package com.tampereentapahtumat;

import android.app.Activity;
import android.content.Intent;
import android.provider.CalendarContract;

import com.facebook.common.references.SharedReference;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Calendar;

/**
 * Created by atte on 12/11/2016.
 */

public class RNCalendar extends ReactContextBaseJavaModule {
    private static final String NAME = "Calendar";
    private ReactApplicationContext mReactApplicationContext;

    public RNCalendar(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactApplicationContext = reactContext;
    }

    @ReactMethod
    public void insertEvent(ReadableMap map, Promise promise) {
        /*
        Calendar beginTime = Calendar.getInstance();
        beginTime.set(2016, 11, 13, 12, 0);

        Calendar endTime = Calendar.getInstance();
        endTime.set(2016, 11, 13, 14, 0);
        */

        final Activity activity = getCurrentActivity();

        try {
            int start = map.getInt("startMillis");
            int end = map.getInt("endMillis");
            String title = map.getString("title");
            String description = map.getString("description");
            String location = map.getString("location");
        /* TODO: check if the props are given and are not null
         * and decide which are optional
         */

            Intent intent = new Intent(Intent.ACTION_INSERT)
                    .setData(CalendarContract.Events.CONTENT_URI)
                    .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, start)
                    .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end)
                    .putExtra(CalendarContract.Events.TITLE, title)
                    .putExtra(CalendarContract.Events.DESCRIPTION, description)
                    .putExtra(CalendarContract.Events.EVENT_LOCATION, location)
                    .putExtra(CalendarContract.Events.AVAILABILITY, CalendarContract.Events.AVAILABILITY_BUSY);
            if (activity != null) {
                activity.startActivity(intent);
                promise.resolve(true);
            } else {
                promise.resolve(false);
            }

        } catch (SharedReference.NullReferenceException | NullPointerException e) {
            promise.reject("Something went wrong :)", e);
        }

    }

    @Override
    public String getName() {
        return NAME;
    }
}
