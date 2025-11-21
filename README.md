# Web2Droid x2y API

Converts any website URL to installable Android APK. A system that takes ANY website URL and spits out an installable Android APK by wrapping the website inside a customized WebView container—like a PWA on steroids—then packages it as a real Android app with permissions, icons, offline capabilities, and background services.

## Features

- **Universal URL Support**: Works with any valid website URL
- **Custom Package Names**: Specify your own Android package identifier
- **Offline Capabilities**: Built-in service worker support for offline functionality
- **Push Notifications**: Optional push notification integration
- **Custom Splash Screen**: Brand-specific startup screen
- **Permission Management**: Automatic permission detection and handling
- **Icon Generation**: Automatic app icon creation from website favicon
- **Background Services**: Support for background operations
- **PWA Integration**: Full Progressive Web App feature support

## Requirements

- **Node.js** (v14 or higher)
- **Android Studio** with SDK
- **Java Development Kit (JDK)** 8 or higher
- **Gradle** build system
- **Windows, macOS, or Linux** operating system

## Installation

### 1. Install Dependencies

First, install Node.js from https://nodejs.org/

Then clone or create the project directory:```
mkdir web2droid-x2y-api
cd web2droid-x2y-api```
### 2. Install Android SDK

Download Android Studio from https://developer.android.com/studio and install it.

### 3. Set Environment Variables

On Windows:
- Open System Properties → Advanced → Environment Variables
- Add system variable: `ANDROID_HOME` = `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
- Update PATH variable to include:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`
  - `%ANDROID_HOME%\cmdline-tools\latest\bin`

### 4. Install Project Dependencies  
```npm install```
### 5. Start the API Server
```npm start```

The API will start running on `http://localhost:3000`

## API Endpoints

### Generate APK
```POST /api/v1/generate-apk```
Request body:
```json
{
  "url": "http://example.com",
  "packageName": "com.example.webapp",
  "options": {
    "offlineMode": true,
    "pushNotifications": false,
    "customSplash": false
  }
}
```
Response:```{
  "jobId": "job_1234567890_abc123def",
  "status": "queued",
  "message": "Build job created successfully"
}```

Check Job Status
```GET /api/v1/job/{jobId}```

Health Check
```GET /health```

**Usage Example**
Send a POST request to generate APK:
`curl -X POST http://localhost:3000/api/v1/generate-apk \
-H "Content-Type: application/json" \
-d "{\"url\": \"http://example.com\", \"packageName\": \"com.example.webapp\", \"options\": {\"offlineMode\": true}}"`

You'll receive a job ID in response
Check job status:
``curl http://localhost:3000/api/v1/job/[jobId]``

When status is *"completed",* download the APK using the download URL
Core Capabilities.

The system wraps websites in a customized WebView container, automatically generates Android project files, builds APKs using headless build tools, and provides downloadable artifacts with full Android compatibility.
## Stopping the Server

To stop the API server, press `Ctrl+C` in the Command Prompt window where it's running. This will terminate the Node.js process and stop the server.
***Made with love and passion by  [x2y dev tools](x2ydevs.xyz)**