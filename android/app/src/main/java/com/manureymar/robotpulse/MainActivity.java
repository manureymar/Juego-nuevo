package com.manureymar.robotpulse;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/** Offline Android host. All game files are packaged inside this APK. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private WebView webView;
    private boolean resumed;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(Color.rgb(7, 19, 36));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(7, 19, 36));
        frame.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(frame);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            frame.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setTextZoom(100);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        immersive();
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportZoom(false);
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!"https".equals(uri.getScheme()) || !HOST.equals(uri.getHost())) return missing();
                String path = uri.getPath();
                if (path == null || path.contains("..") || path.contains("\\")) return missing();
                if (path.equals("/")) path = "/index.html";
                String asset = path.substring(1);
                try {
                    InputStream stream = getAssets().open(asset);
                    String mime = mimeType(asset);
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Cache-Control", "no-cache");
                    headers.put("X-Content-Type-Options", "nosniff");
                    return new WebResourceResponse(mime, (mime.startsWith("text/") || mime.equals("application/json")) ? "UTF-8" : null, 200, "OK", headers, stream);
                } catch (IOException error) { return missing(); }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !HOST.equals(request.getUrl().getHost());
            }
        });
        webView.loadUrl("https://" + HOST + "/index.html");
    }

    private static String mimeType(String name) {
        if (name.endsWith(".html")) return "text/html";
        if (name.endsWith(".js")) return "text/javascript";
        if (name.endsWith(".css")) return "text/css";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".mp3")) return "audio/mpeg";
        if (name.endsWith(".wav")) return "audio/wav";
        if (name.endsWith(".ttf")) return "font/ttf";
        if (name.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", new HashMap<>(), new ByteArrayInputStream(new byte[0]));
    }

    @Override public void onBackPressed() {
        webView.evaluateJavascript("window.robotPulseBack ? window.robotPulseBack() : false", result -> {
            if ("false".equals(result) || "null".equals(result)) finish();
        });
    }
    private void immersive() {
        if (Build.VERSION.SDK_INT >= 30) {
            android.view.WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                controller.hide(WindowInsets.Type.systemBars());
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                android.view.View.SYSTEM_UI_FLAG_FULLSCREEN |
                android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) immersive();
    }
    @Override protected void onPause() {
        resumed = false;
        webView.evaluateJavascript("document.dispatchEvent(new Event('robotpulse:pause'))", result -> {
            if (!resumed && webView != null) webView.onPause();
        });
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        resumed = true;
        if (webView != null) {
            webView.onResume();
            webView.evaluateJavascript("document.dispatchEvent(new Event('robotpulse:resume'))", null);
        }
        immersive();
    }
    @Override protected void onDestroy() { if (webView != null) { webView.stopLoading(); webView.destroy(); webView = null; } super.onDestroy(); }
}
