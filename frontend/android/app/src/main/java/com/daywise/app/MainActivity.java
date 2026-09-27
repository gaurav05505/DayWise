package com.daywise.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.daywise.app.widget.DayWiseWidgetPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DayWiseWidgetPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
