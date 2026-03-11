module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { unstable_transformImportMeta: true }],
  ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};

