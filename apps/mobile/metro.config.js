const { withNxMetro } = require('@nx/react-native');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
	transformer: {
		ramBundle: 'index',
		babelTransformerPath: require.resolve('react-native-svg-transformer'),
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
				unstable_transformProfile: 'hermes-canary',
			},
		}),
		minifierConfig: {
			keep_fnames: true,
			mangle: {
				keep_fnames: true,
			},
		},
	},
	resolver: {
		assetExts: assetExts.filter((ext) => ext !== 'svg'),
		sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
		platforms: ['ios', 'native'],
	},
};

module.exports = withNxMetro(mergeConfig(defaultConfig, customConfig), {
	debug: false,
	extensions: [],
	watchFolders: [],
});
