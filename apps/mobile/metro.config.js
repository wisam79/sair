const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Extend Expo's default watchFolders (do NOT replace — expo-doctor requires defaults)
// Expo defaults already include: workspaceRoot/node_modules, mobile, admin, packages/core
config.watchFolders = [
  ...(config.watchFolders || []),
  workspaceRoot,
  path.resolve(workspaceRoot, 'packages/core'),
];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Align with Expo's recommendation
config.resolver.disableHierarchicalLookup = false;

// 3.5. Force CJS resolution for Zustand on web to avoid import.meta syntax errors in browser
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    return context.resolveRequest(
      { ...context, unstable_conditionNames: ['default', 'require'] },
      moduleName,
      platform,
    );
  }
  // Let default resolver handle everything else
  return context.resolveRequest(context, moduleName, platform);
};

// 4. Blocklist apps/admin, Next.js, Firebase, and other build folders
const exclusionList = require('metro-config/private/defaults/exclusionList').default;
config.resolver.blockList = exclusionList([
  // Block admin app completely
  /apps[/\\]admin[/\\]/,
  // Block Next.js folders
  /[/\\]\.next[/\\]/,
  // Block Firebase folders
  /[/\\]\.firebase[/\\]/,
  // Block build artifacts (but NOT the mobile app's own dist)
  new RegExp(`^(?!${escapeRegex(projectRoot.replace(/\\/g, '/'))}).*[/\\\\]dist[/\\\\]`),
  /[/\\]build[/\\]/,
  // Block common cache folders
  /[/\\]\.cache[/\\]/,
  /[/\\]\.expo[/\\]/,
  // Block Playwright test artifacts and tests to avoid file watcher crashes
  /[/\\]test-results[/\\]/,
  /[/\\]tests[/\\]/,
]);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = config;
