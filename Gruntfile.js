'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // configures browsers to run test against
  // any of [ 'PhantomJS', 'Chrome', 'Firefox', 'IE']
  var TEST_BROWSERS = ((process.env.TEST_BROWSERS || '').replace(/^\s+|\s+$/, '') || 'PhantomJS').split(/\s*,\s*/g);

  // project configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: '../../stratas/stratas-app/qplat-ui/stratas-web-ui/src/main/webapp/static/resources/libs/sparta-bpmn-modeler'
    },

    jshint: {
      src: [
        ['<%=config.sources %>']
      ],
      options: {
        jshintrc: true
      }
    },

    karma: {
      options: {
        configFile: '<%= config.tests %>/config/karma.unit.js'
      },
      single: {
        singleRun: true,
        autoWatch: false,

        browsers: TEST_BROWSERS
      },
      unit: {
        browsers: TEST_BROWSERS
      }
    },

    jsdoc: {
      dist: {
        src: [ '<%= config.sources %>/**/*.js' ],
        options: {
          destination: 'docs/api',
          plugins: [ 'plugins/markdown' ]
        }
      }
    },

    bundle: {
      modeler: {
        name: 'bpmn-modeler',
        src: '<%= config.sources %>/SpartaModeler.js',
        dest: '<%= config.dist %>'
      }
    },

    copy: {
      bpmn_js: {
        files: [
          { expand: true, cwd: 'assets', src: [ '**' ], dest: '<%= config.dist %>/assets' }
        ]
      },

      diagram_js: {
        files: [
          { expand: true, cwd: 'node_modules/diagram-js/assets', src: [ '**' ], dest: '<%= config.dist %>/assets' }
        ]
      },
      
    },
    exec : {
      rsync : {
        cwd : 'C:/dev/Git/stratas',
        command : 'vagrant rsync'
      }
    }
  });

  grunt.loadTasks('tasks');


  // tasks

  grunt.registerTask('test', [ 'karma:single' ]);

  grunt.registerTask('auto-test', [ 'karma:unit' ]);

  grunt.registerTask('build', ['bundle', 'exec:rsync' ]);

  grunt.registerTask('default', [ 'jshint', 'test', 'bundle', 'jsdoc' ]);
};