const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project root and workspace root
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force resolving to workspace root node_modules
config.resolver.disableHierarchicalLookup = false;

// 4. NativeWind v2 - using CSS import directly (no withNativeWind needed for web)
// For React Native, uncomment: const { withNativeWind } = require('nativewind/metro');
// module.exports = withNativeWind(config, { input: './src/index.css' });

module.exports = config;
