/**
 * When running `grunt`, provides a live dev server at localhost:3017.
 * More details in ./README.md.
 */

var devBuildConfig = require('./dev-build-config.js');

module.exports = function (grunt) {
  var deployBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'deploy');
  var liveReloadPort = deployBuild ? false : devBuildConfig.liveReloadPort;

  var deployName;
  if (deployBuild) {
    deployName = grunt.option("name") || "unnamed";
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws-s3');
  }

  // Bundles up `require`s in javascript
  grunt.loadNpmTasks('grunt-browserify');

  // Copies assets over
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Watches for changes, re-triggers build & live-reloads
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Runs static webserver serving build folder
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Opens webpage with server on first build
  grunt.loadNpmTasks('grunt-open');

  // Simple templates (used on Code.org)
  grunt.loadNpmTasks('grunt-ejs');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      src: 'src/js',
      js: '<%= project.src %>/game/{,*/}*.js',
      dest: 'build/js',
      bundle: 'build/js/app.bundled.js',
      bundleURL: 'js/app.bundled.js',
      port: devBuildConfig.port
    },
    /**
     * Runs static a static webserver
     */
    connect: {
      dev: {
        options: {
          port: '<%= project.port %>',
          base: './build'
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', '<%= project.js %>'],
      options: {jshintrc: '.jshintrc'}
    },
    watch: {
      options: {livereload: liveReloadPort},
      js: {files: '<%= project.dest %>/**/*.js', tasks: []},
      assets: {files: 'src/assets/**/*', tasks: ['copy:assets']},
      style: {files: 'src/style/**/*', tasks: ['copy:style']},
      testBuildOnly: {
        files: 'src/test-build-only/**/*',
        tasks: ['copy:testBuildOnly']
      },
      ejs: {files: 'src/**/*.ejs', tasks: ['ejs']}
    },
    ejs: {
      all: {
        cwd: 'src/',
        src: ['**/*.ejs', '!node_modules/**/*'],
        dest: 'build/',
        expand: true,
        ext: '.html',
        options: {
          liveReloadPort: liveReloadPort,
          appBundle: '<%= project.bundleURL %>',
          getFingerprint: function () {
            return +(new Date());
          }
        }
      }
    },
    browserify: {
      app: {
        src: ['<%= project.src %>/game/GameController.js'],
        dest: '<%= project.bundle %>',
        options: {
          transform: [
            'browserify-shim',
            ['babelify', {only: /game/}] // transform ES6 -> ES5 for game/ code
          ],
          watch: true,
          browserifyOptions: {
            // Adds inline source map to bundled package
            debug: !deployBuild
          }
        }
      }
    },
    open: {
      server: {path: 'http://localhost:<%= project.port %>'},
      deployed: {path: 'https://s3-us-west-1.amazonaws.com/cdo-mc-test/'
        + deployName + '/index.html'}
    },
    clean: ['./build/'],
    copy: {
      assets: {
        files: [{
          expand: true,
          cwd: 'src/assets/',
          src: ['**'],
          dest: 'build/assets/'
        }]
      },
      testBuildOnly: {
        files: [{
          expand: true,
          cwd: 'src/test-build-only/',
          src: ['**'],
          dest: 'build/test-build-only/'
        }]
      },
      style: {
        files: [{
          expand: true,
          cwd: 'src/style/',
          src: ['**'],
          dest: 'build/style/'
        }]
      }
    },
    aws: deployBuild ? grunt.file.readJSON('../../.secrets/aws-keys.json') : {},
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        uploadConcurrency: 20,
        downloadConcurrency: 20,
        region: 'us-west-1',
        gzip: true
      },
      test: {
        options: {
          bucket: 'cdo-mc-test',
          differential: true
        },
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**'],
          dest: deployName + '/'
        }]
      }
    },
    uglify: {
      build: {
        src: '<%= project.bundle %>',
        dest: '<%= project.bundle %>'
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'browserify',
    'ejs',
    'copy',
    'connect',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'clean',
    'browserify',
    'uglify',
    'ejs',
    'copy',
    'aws_s3:test',
    'open:deployed'
  ]);

  grunt.registerTask('publish', [
    'clean',
    'browserify',
    'ejs',
    'copy'
  ]);
};
