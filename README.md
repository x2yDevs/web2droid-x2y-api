# Web2Droid x2y API

Converts any website URL to installable Android APK.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/badge/npm-v1.0.2-blue.svg)](https://www.npmjs.com/package/web2droid-x2y-api) <!-- Assuming a package exists for versioning -->
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/x2yDevs/web2droid-x2y-api/graphs/commit-activity)

## 📝 Description

The Web2Droid x2y API (v1.0.2) is a robust Node.js-based service designed to transform any website URL into a fully installable Android APK. It functions as a powerful system that wraps web content within a customized WebView container—much like a Progressive Web App (PWA) on steroids—then packages it as a native Android application.

This API automates the entire process: it fetches the provided website, intelligently analyzes its structure and metadata, generates all necessary Android project files (including Java code, XML resources, and build scripts), and compiles them into a downloadable Android APK file. Version 1.0.2 brings significant enhancements for customization and robustness, offering extensive control over the generated application's features, appearance, and behavior.

## 🌟 Features

*   **Universal URL Support**: Works with any valid website URL.
*   **Custom Package Names**: Specify your own Android package identifier.
*   **Offline Capabilities**: Built-in service worker support for offline functionality.
*   **Push Notifications**: Optional push notification integration.
*   **Custom App Name/Description**: Override default app name and description from website metadata.
*   **Custom App Icon/Splash Screen**: Provide custom icon and splash screen images via URL or base64 data.
*   **Advanced WebView Options**: Configure WebView settings like JavaScript, zoom controls, etc.
*   **Additional Permissions**: Request specific Android permissions beyond defaults.
*   **Permission Management**: Automatic permission detection and handling for basic needs.
*   **Icon Generation**: Automatic app icon creation from website favicon (if custom icon not provided).
*   **Background Services**: Support for background operations.
*   **PWA Integration**: Full Progressive Web App feature support.
*   **API Endpoint for Downloads**: Dedicated endpoint for securely downloading completed APKs with expiry checks.
*   **Build Process Improvements**: Includes timeout and build log capture for better error reporting.
*   **Security Enhancements**: Basic input validation and resource limits.

## 🚀 Technologies Used

The Web2Droid x2y API leverages a powerful combination of web and Android development technologies:

*   **Node.js (v14+)**: Powers the backend API server.
*   **Android Studio**: Provides the integrated development environment and essential SDK components.
*   **Android SDK**: Includes critical tools like Build-Tools, Platform-Tools, and Command-line Tools for building Android applications.
*   **Java Development Kit (JDK 8+)**: Required for compiling Android applications.
*   **Gradle**: The build automation system used by Android Studio for compiling APKs.
*   **Customized WebView Container**: The core component for rendering web content within the Android app.
*   **Headless Build Tools**: Utilizes Gradle and Android SDK in a non-GUI environment for automated builds.

## 🛠️ Installation

To set up the Web2Droid x2y API, you'll need to install several prerequisites and then the project dependencies.

### 1. Prerequisites

Ensure you have the following software installed and configured:

*   **Node.js**: Version 14 or higher. Download and install from [https://nodejs.org/](https://nodejs.org/).
*   **Android SDK**:
    *   Download and install [Android Studio](https://developer.android.com/studio).
    *   Via the SDK Manager in Android Studio, install the following components:
        *   `Android SDK Build-Tools` (latest recommended)
        *   `Android SDK Platform-Tools`
        *   `Android SDK Command-line Tools`
        *   An appropriate `Android SDK Platform` (API level 33 recommended)
*   **Java Development Kit (JDK)**: Version 8 or higher. Android Studio usually prompts for this, or you can download it from Oracle/OpenJDK.
*   **Gradle**: This is typically bundled with Android Studio. Ensure it's accessible via your command line (you should be able to run `gradle -v` in a new terminal).

#### Environment Variables

Set the following environment variables:

*   **`ANDROID_HOME`**: Point this to your Android SDK installation directory.
    *   *Example (Windows):* `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
    *   *Example (macOS/Linux):* `/Users/[YourUsername]/Library/Android/sdk`
*   **`PATH`**: Add the following directories to your system's PATH variable:
    *   `%ANDROID_HOME%\platform-tools`
    *   `%ANDROID_HOME%\tools`
    *   `%ANDROID_HOME%\cmdline-tools\latest\bin`
    *   *(On macOS/Linux, use `$ANDROID_HOME/platform-tools`, etc.)*

### 2. Clone or Create Project Directory

#### If you have the source code locally:

```bash
cd C:\path\to\your\projects
git clone https://github.com/x2yDevs/web2droid-x2y-api.git
cd web2droid-x2y-api
```

#### If you are creating a new project directory:

```bash
mkdir web2droid-x2y-api
cd web2droid-x2y-api
```

### 3. Install Project Dependencies

Navigate into your project directory and install the Node.js dependencies:

```bash
npm install
```

This command reads the `package.json` file and installs all required Node.js packages.

### 4. Configuration

The API uses default settings defined in the `index.js` file. Configuration is primarily done via environment variables (though none are strictly required for the basic setup described here) or by modifying the source code directly (e.g., default ports, directories like `BASE_DIR` and `TEMP_DIR`). For production deployments, it's recommended to use environment variables for sensitive settings or to manage configurations.

## 💡 Usage

Follow these steps to start the API server, generate an APK, and manage the build process.

### 1. Start the API Server

Run the following command in the project directory:

```bash
npm start
```

The server will start and listen on the default port (3000). You should see a message similar to: `Web2Droid x2y API v1.0.2 running on port 3000`.

### 2. Generate an APK

Send a `POST` request to the `/api/v1/generate-apk` endpoint with the following JSON payload:

```json
{
  "url": "https://example.com",
  "packageName": "com.example.myapp",
  "options": {
    "offlineMode": true,
    "pushNotifications": false,
    "appName": "My Custom App",            
    "appDescription": "A custom app.",     
    "customIconUrl": "https://example.com/icon.png", 
    "customSplashUrl": "https://example.com/splash.png", 
    "customIconData": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", 
    "customSplashData": "...",             
    "webViewOptions": {                    
      "javaScriptEnabled": true,
      "builtInZoomControls": true,
      "domStorageEnabled": true,
      "databaseEnabled": true,
      "loadWithOverviewMode": true,
      "useWideViewPort": true
    },
    "additionalPermissions": [             
      "android.permission.CAMERA",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

#### Request Body Parameters:

*   `url` (string, **required**): The URL of the website to convert.
*   `packageName` (string, **required**): The desired Android package name (e.g., `com.yourcompany.yourapp`). Must follow Android package naming conventions.
*   `options` (object, *optional*): An object containing optional settings:
    *   `offlineMode` (boolean): Enable offline caching (default: `false`).
    *   `pushNotifications` (boolean): Enable push notification support (basic implementation).
    *   `appName` (string): Custom app name for the APK (overrides website title).
    *   `appDescription` (string): Custom app description (overrides website description).
    *   `customIconUrl` (string): URL to a PNG/JPG icon file.
    *   `customSplashUrl` (string): URL to a PNG/JPG splash screen file.
    *   `customIconData` (string): Base64 encoded icon image data.
    *   `customSplashData` (string): Base64 encoded splash screen image data.
    *   `webViewOptions` (object): Configure WebView behavior:
        *   `javaScriptEnabled` (boolean): Enable/Disable JavaScript (default: `true`).
        *   `builtInZoomControls` (boolean): Enable/Disable zoom controls (default: `false`).
        *   `domStorageEnabled` (boolean): Enable/Disable DOM storage (default: `true`).
        *   `databaseEnabled` (boolean): Enable/Disable database (default: `true`).
        *   `loadWithOverviewMode` (boolean): Enable/Disable overview mode (default: `true`).
        *   `useWideViewPort` (boolean): Enable/Disable wide viewport (default: `true`).
    *   `additionalPermissions` (array of strings): Array of additional Android permissions (e.g., `["android.permission.CAMERA"]`).

#### Example Request using `curl`:

```bash
curl -X POST http://localhost:3000/api/v1/generate-apk \
     -H "Content-Type: application/json" \
     -d '{
           "url": "https://google.com",
           "packageName": "com.example.googleapp",
           "options": {
             "offlineMode": true,
             "appName": "Google App",
             "customIconUrl": "https://example.com/myicon.png"
           }
         }'
```

### 3. Check Job Status

The initial `POST` request returns a `jobId`. Use this ID to check the build progress and status:

```
GET http://localhost:3000/api/v1/job/{jobId}
```

#### Example response during processing:

```json
{
  "id": "job_1234567890_abc123def",
  "url": "https://google.com",
  "packageName": "com.example.googleapp",
  "options": { /* ... */ },
  "status": "processing",
  "createdAt": "2025-11-22T10:00:00.000Z",
  "progress": 50,
  "logs": [
    "[2025-11-22T10:00:01.000Z] Job started",
    "[2025-11-22T10:00:02.000Z] Fetched URL content",
    "[2025-11-22T10:00:03.000Z] Parsed HTML and extracted metadata",
    "[2025-11-22T10:00:04.000Z] Generated AndroidManifest.xml"
  ]
}
```

#### Example response when completed:

```json
{
  "id": "job_1234567890_abc123def",
  "url": "https://google.com",
  "packageName": "com.example.googleapp",
  "options": { /* ... */ },
  "status": "completed",
  "createdAt": "2025-11-22T10:00:00.000Z",
  "progress": 100,
  "downloadUrl": "/api/v1/download/job_1234567890_abc123def",
  "expiresAt": "2025-11-23T10:00:00.000Z",
  "logs": [ /* ... */ ]
}
```

### 4. Download the APK

When the job status is `completed`, you can download the generated APK file using the `downloadUrl` provided in the job status response:

```
GET http://localhost:3000/api/v1/download/{jobId}
```

**Important**: This endpoint checks if the job exists, is completed, and has not expired based on the `expiresAt` timestamp. The APK file is served from the `builds` directory.

### API Endpoints Summary

*   `GET /`: API information and available endpoints.
*   `GET /health`: Health check endpoint.
*   `POST /api/v1/generate-apk`: Initiate APK generation.
*   `GET /api/v1/job/{jobId}`: Check the status of an APK generation job.
*   `GET /api/v1/download/{jobId}`: Download the completed APK file.

### Stopping the Server

To stop the API server, press `Ctrl+C` in the terminal window where it's running. This will terminate the Node.js process and stop the server.

## 🤝 Contributing

We welcome contributions to the Web2Droid x2y API! If you have suggestions, bug reports, or want to contribute code, please follow these guidelines:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Make your changes.**
4.  **Commit your changes** with clear, descriptive messages.
5.  **Push your branch** to your forked repository.
6.  **Open a Pull Request** against the `main` branch of the original repository.

Please ensure your code adheres to the project's coding style and includes relevant tests where applicable.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any inquiries or support, please reach out to the x2y Dev Tools team.

Developed by [x2y Devs Tools](https://github.com/x2yDevs)