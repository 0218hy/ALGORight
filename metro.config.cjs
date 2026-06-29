const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ws') {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'src/shims/ws.js'),
    };
  }

  if (moduleName === '@supabase/realtime-js') {
    return {
      type: 'sourceFile',
      filePath: path.join(
        __dirname,
        'node_modules/@supabase/realtime-js/dist/module/index.js'
      ),
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
