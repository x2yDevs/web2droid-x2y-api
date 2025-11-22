# Web2Droid x2y API v1.0.2

[![npm version](https://badge.fury.io/js/x2y-web2droid-x2y-api.svg)](https://badge.fury.io/js/x2y-web2droid-x2y-api)

Converts any website URL to installable Android APK. A system that takes ANY website URL and spits out an installable Android APK by wrapping the website inside a customized WebView container—like a PWA on steroids—then packages it as a real Android app with permissions, icons, offline capabilities, and background services.

Developed by [x2y devs tools](x2ydevs.xyz)

## What It Does

The Web2Droid x2y API is a Node.js-based service that automates the creation of Android applications from web content. It fetches the provided website, analyzes its structure and metadata, generates the necessary Android project files (including Java code, XML resources, and build scripts), and compiles them into a downloadable Android APK file.

## Features

- **Universal URL Support**: Works with any valid website URL.
- **Custom Package Names**: Specify your own Android package identifier.
- **Offline Capabilities**: Built-in service worker support for offline functionality.
- **Push Notifications**: Optional push notification integration.
- **Custom App Name/Description**: Override default app name and description from website metadata.
- **Custom App Icon/Splash Screen**: Provide custom icon and splash screen images via URL or base64 data.
- **Advanced WebView Options**: Configure WebView settings like JavaScript, zoom controls, etc.
- **Additional Permissions**: Request specific Android permissions beyond defaults.
- **Permission Management**: Automatic permission detection and handling for basic needs.
- **Icon Generation**: Automatic app icon creation from website favicon (if custom icon not provided).
- **Background Services**: Support for background operations.
- **PWA Integration**: Full Progressive Web App feature support.
- **API Endpoint for Downloads**: Dedicated endpoint for securely downloading completed APKs with expiry checks.
- **Build Process Improvements**: Includes timeout and build log capture for better error reporting.
- **Security Enhancements**: Basic input validation and resource limits.

## Requirements

- **Node.js** (v14 or higher)
- **Android Studio** with SDK (specifically `build-tools`, `platform-tools`, `cmdline-tools`)
- **Java Development Kit (JDK)** 8 or higher
- **Gradle** build system (included with Android Studio)
- **Windows, macOS, or Linux** operating system

## Installation

### 1. Prerequisites

- **Node.js**: Install from https://nodejs.org/
- **Android SDK**: Download and install Android Studio from https://developer.android.com/studio. Ensure you install the necessary components via the SDK Manager:
    - Android SDK Build-Tools (latest recommended)
    - Android SDK Platform-Tools
    - Android SDK Command-line Tools
    - An appropriate Android SDK Platform (API level 33 recommended)
- **Environment Variables**: Set the `ANDROID_HOME` environment variable to your Android SDK location (e.g., `C:\Users\[YourUsername]\AppData\Local\Android\Sdk` on Windows). Add `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\tools`, `%ANDROID_HOME%\cmdline-tools\latest\bin` to your system's `PATH` variable.
- **Gradle**: Ensure Gradle is accessible via the command line (`gradle -v` should work in a new terminal/command prompt).

### 2. Clone or Create Project Directory

If you have the source code locally:

``cd C:\path\to\your\projects
git clone https://github.com/x2yDevs/web2droid-x2y-api.git
cd web2droid-x2y-api``

If you are creating a new project directory:

``mkdir web2droid-x2y-api
cd web2droid-x2y-api``

### 3. Install Project Dependencies

``npm instal``

This command reads the `package.json` file and installs all required Node.js packages listed in the `dependencies` section.

## Configuration

The API uses default settings defined in the `index.js` file. Configuration is primarily done via environment variables (though none are strictly required for the basic setup described here) or by modifying the source code directly (e.g., default ports, directories like `BASE_DIR` and `TEMP_DIR`).

## Usage

### 1. Start the API Server

Run the following command in the project directory:

``npm start``

The server will start and listen on the default port (3000). You should see a message like `Web2Droid x2y API v1.0.2 running on port 3000`.

### 2. Generate an APK

Send a `POST` request to the `/api/v1/generate-apk` endpoint with the following JSON payload:

``json
{
  "url": "https://example.com",
  "packageName": "com.example.myapp",
  "options": {
    "offlineMode": true,
    "pushNotifications": false,
    "appName": "My Custom App",            // Optional: Custom app name
    "appDescription": "A custom app.",     // Optional: Custom app description
    "customIconUrl": "https://example.com/icon.png", // Optional: Custom icon via URL
    "customSplashUrl": "https://example.com/splash.png", // Optional: Custom splash via URL
    "customIconData": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", // Optional: Custom icon as base64 string
    "customSplashData": "...",             // Optional: Custom splash as base64 string
    "webViewOptions": {                    // Optional: WebView settings
      "javaScriptEnabled": true,
      "builtInZoomControls": true,
      "domStorageEnabled": true
    },
    "additionalPermissions": [             // Optional: Additional Android permissions
      "android.permission.CAMERA",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  }
}``


***Request Body Parameters:***

``url (string, required)``: The URL of the website to convert.

``packageName (string, required)``: The desired Android package name (e.g., ``com.yourcompany.yourapp)``. Must follow Android package naming conventions.

``options (object, optional)``: An object containing optional settings.

``offlineMode (boolean)``: Enable offline caching (default: false).

``pushNotifications (boolean)``: Enable push notification support (basic implementation).

``appName (string)``: Custom app name for the APK (overrides website title).

``appDescription (string)``: Custom app description (overrides website description).

``customIconUrl (string)``: URL to a PNG/JPG icon file.

``customSplashUrl (string)``: URL to a PNG/JPG splash screen file.

``customIconData (string)``: Base64 encoded icon image data.

``customSplashData (string)``: Base64 encoded splash screen image data.

``webViewOptions (object)``: Configure WebView behavior.

``javaScriptEnabled (boolean)``: Enable/Disable JavaScript (default: true).

``builtInZoomControls (boolean)``: Enable/Disable zoom controls (default: false).

``domStorageEnabled (boolean)``: Enable/Disable DOM storage (default: true).

``databaseEnabled (boolean)``: Enable/Disable database (default: true).

``loadWithOverviewMode (boolean)``: Enable/Disable overview mode (default: true).

``useWideViewPort (boolean)``: Enable/Disable wide viewport (default: true).

``additionalPermissions (array of strings)``: Array of additional Android permissions (e.g., ["android.permission.CAMERA"]).

**Example Request using curl:**


``curl -X POST http://localhost:3000/api/v1/generate-apk \
-H "Content-Type: application/json" \
-d '{
  "url": "https://google.com",
  "packageName": "com.example.googleapp",
  "options": {
    "offlineMode": true,
    "appName": "Google App",
    "customIconUrl": "https://example.com/myicon.png"
  }
}``

**3. Check Job Status**

The initial POST request returns a jobId. Use this ID to check the build progress and status:

``GET http://localhost:3000/api/v1/job/{jobId}``

***Example response during processing:***


``{
  "id": "job_1234567890_abc123def",
  "url": "https://google.com",
  "packageName": "com.example.googleapp",
  "options": { ... },
  "status": "processing",
  "createdAt": "2025-11-22T10:00:00.000Z",
  "progress": 50,
  "logs": [
    "[2025-11-22T10:00:01.000Z] Job started",
    "[2025-11-22T10:00:02.000Z] Fetched URL content",
    "[2025-11-22T10:00:03.000Z] Parsed HTML and extracted metadata",
    "[2025-11-22T10:00:04.000Z] Generated AndroidManifest.xml"
  ]
}``


***Example response when completed:***

``{
  "id": "job_1234567890_abc123def",
  "url": "https://google.com",
  "packageName": "com.example.googleapp",
  "options": { ... },
  "status": "completed",
  "createdAt": "2025-11-22T10:00:00.000Z",
  "progress": 100,
  "downloadUrl": "/api/v1/download/job_1234567890_abc123def",
  "expiresAt": "2025-11-23T10:00:00.000Z",
  "logs": [ ... ]
}``


**4. Download the APK**

When the job status is completed, you can download the generated APK file using the downloadUrl provided in the job status response:


``GET http://localhost:3000/api/v1/download/{jobId}``

Important: This endpoint checks if the job exists, is completed, and has not expired based on the expiresAt timestamp. The APK file is served from the builds directory.

**Core Capabilities**

The system wraps websites in a customized WebView container, automatically generates Android project files, builds APKs using headless build tools (Gradle + Android SDK), and provides downloadable artifacts with full Android compatibility. Version 1.0.2 adds significant enhancements for customization and robustness.

**API Endpoints**

``GET /``: API information and available endpoints.
``GET /health``: Health check.
``POST /api/v1/generate-apk``: Initiate APK generation.
``GET /api/v1/job/{jobId}``: Check job status.
``GET /api/v1/download/{jobId}``: Download completed APK.

**Stopping the Server**
To stop the API server, press ``Ctrl+C`` in the Command Prompt window where it's running. This will terminate the Node.js process and stop the server.

Made by [x2y dev tools](x2ydevs.xyz)