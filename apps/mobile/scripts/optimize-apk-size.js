const fs = require('fs');
const path = require('path');

// The script runs from apps/mobile/scripts/ or apps/mobile/
// Let's resolve the path robustly
const projectRoot = path.join(__dirname, '..');
const gradlePath = path.join(projectRoot, 'android', 'app', 'build.gradle');

console.log('[Optimize APK] Looking for build.gradle at:', gradlePath);

if (fs.existsSync(gradlePath)) {
  let content = fs.readFileSync(gradlePath, 'utf8');
  
  if (content.includes('defaultConfig {')) {
    if (!content.includes('abiFilters')) {
      content = content.replace(
        'defaultConfig {',
        'defaultConfig {\n        ndk {\n            abiFilters "arm64-v8a"\n        }'
      );
      fs.writeFileSync(gradlePath, content, 'utf8');
      console.log('[Optimize APK] Successfully added arm64-v8a abiFilters to build.gradle');
    } else {
      console.log('[Optimize APK] abiFilters already configured in build.gradle');
    }
  } else {
    console.log('[Optimize APK] Could not find defaultConfig block in build.gradle');
  }
} else {
  console.error('[Optimize APK] build.gradle not found! Ensure prebuild ran successfully.');
}
