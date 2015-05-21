module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },
      handlebars: {
        files: ['scripts/handlebars/**/*.handlebars'],
        tasks: ['handlebars']
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'scripts/cart_rest_0.1.js',
        'scripts/backbone-uc-common-functions-1.3.js',
        'scripts/handlebars-uc-extensions-1.1.js',
        'scripts/master.js'
      ]
    },
    handlebars: {
      options: {
        namespace: 'Ultracart.templates',
        processName: function (filePath) {
          return filePath.replace(/^scripts\/handlebars\//, '').replace(/\.handlebars$/, '');
        }
      },
      all: {
        files: {
          "scripts/master_template.js": ["scripts/handlebars/**/*.handlebars"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  // Default task(s).
  grunt.registerTask('default', ['jshint','handlebars']);
//  grunt.registerTask('jshint', ['jshint']);
};
