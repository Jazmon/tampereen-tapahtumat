package com.tampereentapahtumat;

import android.app.Activity;
import android.content.Intent;
import android.provider.CalendarContract;

import com.facebook.common.references.SharedReference;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Calendar;

/**
 * Created by atte on 12/11/2016.
 */

public class RNCalendar extends ReactContextBaseJavaModule {
    private static final String NAME = "Calendar";

    public RNCalendar(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void insertEvent(ReadableMap map, Promise promise) {

        final Activity activity = getCurrentActivity();

        try {
            double start = map.getDouble("start");
            double end = map.getDouble("end");
            String title = map.getString("title");
            String description = map.getString("description");
            String location = map.getString("location");

            Calendar beginTime = Calendar.getInstance();
            beginTime.setTimeInMillis((long) start);

            Calendar endTime = Calendar.getInstance();
            endTime.setTimeInMillis((long) end);

            /*
             * TODO: check if the props are given and are not null
             * and decide which are optional
             */

            Intent intent = new Intent(Intent.ACTION_INSERT)
                    .setData(CalendarContract.Events.CONTENT_URI)
                    .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, beginTime.getTimeInMillis())
                    .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endTime.getTimeInMillis())
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
