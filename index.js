const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// In-memory job storage
const jobs = new Map();

// Create necessary directories
const BASE_DIR = path.join(__dirname, 'builds');
const TEMP_DIR = path.join(__dirname, 'temp');
fs.ensureDirSync(BASE_DIR);
fs.ensureDirSync(TEMP_DIR);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Web2Droid x2y API by x2y dev tools',
    endpoints: {
      'POST /api/v1/generate-apk': 'Generate APK from website URL',
      'GET /api/v1/job/:jobId': 'Check job status',
      'GET /health': 'Health check'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/v1/generate-apk', (req, res) => {
  const { url, packageName, options = {} } = req.body;
  
  if (!url || !packageName) {
    return res.status(400).json({ 
      error: 'URL and packageName are required' 
    });
  }
  
  const jobId = generateJobId();
  const jobData = {
    id: jobId,
    url,
    packageName,
    options,
    status: 'queued',
    createdAt: new Date().toISOString(),
    progress: 0
  };
  
  jobs.set(jobId, jobData);
  
  // Start processing job
  processJob(jobId, jobData);
  
  res.json({
    jobId,
    status: 'queued',
    message: 'Build job created successfully'
  });
});

app.get('/api/v1/job/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json(job);
});

function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function processJob(jobId, jobData) {
  jobData.status = 'processing';
  jobData.progress = 10;
  
  try {
    // Validate URL
    const urlObj = new URL(jobData.url);
    
    // Fetch website content
    const response = await axios.get(jobData.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Web2Droid-Bot/1.0'
      }
    });
    
    jobData.progress = 20;
    
    // Parse HTML and extract metadata
    const $ = cheerio.load(response.data);
    const metadata = extractMetadata($, jobData.url);
    
    jobData.progress = 30;
    
    // Create Android project structure
    const projectDir = path.join(TEMP_DIR, jobId);
    fs.ensureDirSync(projectDir);
    
    // Create directory structure
    const appDir = path.join(projectDir, 'app');
    fs.ensureDirSync(appDir);
    
    const srcDir = path.join(appDir, 'src', 'main');
    fs.ensureDirSync(srcDir);
    
    const javaDir = path.join(srcDir, 'java', 'com', 'web2droid', getPackageNameFromId(jobData.packageName));
    fs.ensureDirSync(javaDir);
    
    const resDir = path.join(srcDir, 'res');
    fs.ensureDirSync(resDir);
    
    const valuesDir = path.join(resDir, 'values');
    fs.ensureDirSync(valuesDir);
    
    const drawableDir = path.join(resDir, 'drawable');
    fs.ensureDirSync(drawableDir);
    
    const mipmapDir = path.join(resDir, 'mipmap');
    fs.ensureDirSync(mipmapDir);
    
    // Generate AndroidManifest.xml
    const manifestContent = generateAndroidManifest(jobData.packageName, metadata, jobData.options);
    const manifestPath = path.join(srcDir, 'AndroidManifest.xml');
    fs.writeFileSync(manifestPath, manifestContent);
    
    jobData.progress = 40;
    
    // Create MainActivity.java
    const activityContent = generateMainActivity(jobData.url, jobData.options);
    const activityPath = path.join(javaDir, 'MainActivity.java');
    fs.writeFileSync(activityPath, activityContent);
    
    jobData.progress = 50;
    
    // Create strings.xml
    const stringsContent = generateStringsXml(metadata);
    const stringsPath = path.join(valuesDir, 'strings.xml');
    fs.writeFileSync(stringsPath, stringsContent);
    
    // Create styles.xml
    const stylesContent = generateStylesXml();
    const stylesPath = path.join(valuesDir, 'styles.xml');
    fs.writeFileSync(stylesPath, stylesContent);
    
    // Create layout file
    const layoutDir = path.join(resDir, 'layout');
    fs.ensureDirSync(layoutDir);
    
    const layoutContent = generateLayoutXml();
    const layoutPath = path.join(layoutDir, 'activity_main.xml');
    fs.writeFileSync(layoutPath, layoutContent);
    
    jobData.progress = 60;
    
    // Create build.gradle for app
    const appBuildGradle = generateAppBuildGradle(jobData.packageName);
    const appBuildPath = path.join(appDir, 'build.gradle');
    fs.writeFileSync(appBuildPath, appBuildGradle);
    
    // Create build.gradle for project
    const projectBuildGradle = generateProjectBuildGradle();
    const projectBuildPath = path.join(projectDir, 'build.gradle');
    fs.writeFileSync(projectBuildPath, projectBuildGradle);
    
    // Create gradle.properties
    const gradleProps = generateGradleProperties();
    const propsPath = path.join(projectDir, 'gradle.properties');
    fs.writeFileSync(propsPath, gradleProps);
    
    // Create settings.gradle
    const settingsGradle = generateSettingsGradle();
    const settingsPath = path.join(projectDir, 'settings.gradle');
    fs.writeFileSync(settingsPath, settingsGradle);
    
    jobData.progress = 70;
    
    // Create basic drawable resources
    const icLauncherPath = path.join(drawableDir, 'ic_launcher.png');
    fs.writeFileSync(icLauncherPath, Buffer.from('dummy image content'));
    
    const mipmapIcLauncherPath = path.join(mipmapDir, 'ic_launcher.png');
    fs.writeFileSync(mipmapIcLauncherPath, Buffer.from('dummy image content'));
    
    jobData.progress = 80;
    
    // Build APK using Gradle
    const apkPath = await buildApkWithGradle(projectDir, jobData.packageName);
    
    jobData.progress = 90;
    
    // Move APK to builds directory
    const finalApkPath = path.join(BASE_DIR, `${jobData.packageName}.apk`);
    fs.moveSync(apkPath, finalApkPath);
    
    jobData.status = 'completed';
    jobData.progress = 100;
    jobData.downloadUrl = `/download/${jobId}`;
    jobData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
  } catch (error) {
    jobData.status = 'failed';
    jobData.error = error.message;
  }
}

function extractMetadata($, baseUrl) {
  return {
    title: $('title').text() || 'Web App',
    description: $('meta[name="description"]').attr('content') || 'Web application',
    icon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || null,
    themeColor: $('meta[name="theme-color"]').attr('content') || '#ffffff'
  };
}

function generateAndroidManifest(packageName, metadata, options) {
  let permissions = '<uses-permission android:name="android.permission.INTERNET" />\n';
  permissions += '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n';
  
  if (options.pushNotifications) {
    permissions += '<uses-permission android:name="android.permission.WAKE_LOCK" />\n';
    permissions += '<uses-permission android:name="android.permission.VIBRATE" />\n';
  }
  
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}">
    
    ${permissions}
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
}

function generateMainActivity(url, options) {
  let activityCode = `package com.web2droid.${getPackageNameFromId(url)};

import android.Manifest;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.annotation.TargetApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private final static int FILE_CHOOSER_REQUEST_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        setupWebView();
        webView.loadUrl("${url}");
    }
    
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        if (${options.offlineMode ? 'true' : 'false'}) {
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, request.getUrl());
                    startActivity(intent);
                    return true;
                }
                return false;
            }
        });
        
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }
            
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
            
            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                return true;
            }
        });
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback == null) return;
            Uri[] result = null;
            if (resultCode == RESULT_OK && intent != null) {
                String dataString = intent.getDataString();
                if (dataString != null) {
                    result = new Uri[]{Uri.parse(dataString)};
                }
            }
            filePathCallback.onReceiveValue(result);
            filePathCallback = null;
        }
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;

  if (options.pushNotifications) {
    activityCode = activityCode.replace(
      'import androidx.core.content.ContextCompat;',
      'import androidx.core.content.ContextCompat;\nimport android.app.NotificationChannel;\nimport android.app.NotificationManager;\nimport android.os.Build;'
    );
  }
  
  return activityCode;
}

function generateStringsXml(metadata) {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${metadata.title}</string>
    <string name="app_description">${metadata.description}</string>
</resources>`;
}

function generateStylesXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">#008577</item>
        <item name="colorPrimaryDark">#00574B</item>
        <item name="colorAccent">#D81B60</item>
    </style>
</resources>`;
}

function generateLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
        
</LinearLayout>`;
}

function generateAppBuildGradle(packageName) {
  return `apply plugin: 'com.android.application'

android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "${packageName}"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.webkit:webkit:1.7.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'com.google.android.material:material:1.9.0'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`;
}

function generateProjectBuildGradle() {
  return `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`;
}

function generateGradleProperties() {
  return `// Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true`;
}

function generateSettingsGradle() {
  return `include ':app'
rootProject.name = 'Web2DroidApp'`;
}

function getPackageNameFromId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20);
}

function buildApkWithGradle(projectDir, packageName) {
  return new Promise((resolve, reject) => {
    const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const buildCmd = `${gradleCmd} assembleRelease`;
    
    exec(buildCmd, { cwd: projectDir, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Build failed: ${stderr || error.message}`));
        return;
      }
      
      const apkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
      if (fs.existsSync(apkPath)) {
        resolve(apkPath);
      } else {
        // Try debug APK if release failed
        const debugApkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
        if (fs.existsSync(debugApkPath)) {
          resolve(debugApkPath);
        } else {
          reject(new Error('APK file not found after build'));
        }
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Web2Droid x2y API running on port ${PORT}`);
});