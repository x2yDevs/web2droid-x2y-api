const express = require('express');

function generateSettingsGradle() {
  return `include ':app'
rootProject.name = 'Web2DroidApp'`;
}

function getPackageNameFromId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20);
}

// Updated build function with timeout and log capture
function buildApkWithGradle(projectDir, packageName, jobData) {
  return new Promise((resolve, reject) => {
    const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const buildCmd = `${gradleCmd} assembleRelease`;
    const buildTimeout = 300000; // 5 minutes timeout in milliseconds

    const child = exec(buildCmd, { cwd: projectDir, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        clearTimeout(timeoutId);
        if (error) {
            // Capture logs even on failure
            if (stdout) jobData.logs.push(`[${new Date().toISOString()}] Build stdout:\n${stdout}`);
            if (stderr) jobData.logs.push(`[${new Date().toISOString()}] Build stderr:\n${stderr}`);
            const errorMsg = `Build failed: ${stderr || error.message}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
            return;
        }
        
        // Capture logs on success
        if (stdout) jobData.logs.push(`[${new Date().toISOString()}] Build stdout:\n${stdout}`);
        if (stderr) jobData.logs.push(`[${new Date().toISOString()}] Build stderr (if any):\n${stderr}`);

        const apkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
        if (fs.existsSync(apkPath)) {
            console.log(`APK built successfully at: ${apkPath}`);
            resolve(apkPath);
        } else {
            // Try debug APK if release failed
            const debugApkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
            if (fs.existsSync(debugApkPath)) {
                console.log(`Release APK not found, using debug APK at: ${debugApkPath}`);
                resolve(debugApkPath);
            } else {
                const errorMsg = 'APK file not found after build';
                console.error(errorMsg);
                reject(new Error(errorMsg));
            }
        }
    });

    // Set timeout
    const timeoutId = setTimeout(() => {
        child.kill(); // Kill the child process
        const errorMsg = `Build process timed out after ${buildTimeout / 1000} seconds`;
        console.error(errorMsg);
        jobData.logs.push(`[${new Date().toISOString()}] ${errorMsg}`);
        reject(new Error(errorMsg));
    }, buildTimeout);

    // Handle process errors
    child.on('error', (err) => {
        clearTimeout(timeoutId);
        const errorMsg = `Build process error: ${err.message}`;
        console.error(errorMsg);
        jobData.logs.push(`[${new Date().toISOString()}] ${errorMsg}`);
        reject(new Error(errorMsg));
    });
  });
}


app.listen(PORT, () => {
  console.log(`Web2Droid x2y API v1.0.2 running on port ${PORT}`);
});