module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['tap', 'browserify'],
    files: [
      {pattern: 'src/test-build-only/phaser.js'},
      {pattern: 'test/integration/*.js'},
      {pattern: 'src/assets/**/*.*', watched: false, included: false},
    ],
    preprocessors: {
      'test/integration/*.js': ['browserify']
    },
    browsers: [
      process.env['WATCH'] ? 'Chrome' : 'ChromeHeadless'
    ],
    singleRun: !process.env['WATCH']
  })
};
