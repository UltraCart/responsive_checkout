module.exports = function(grunt) {

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
      handlebars: {
        options: {
          namespace: 'Ultracart.templates',
           processName: function(filePath) {
             return filePath.replace(/^scripts\/handlebars\//, '').replace(/\.handlebars$/, '');
           },
        },
        all: {
          files: {
            "scripts/master_template.js": ["scripts/handlebars/**/*.handlebars"]
          }
        }
      }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');


    // Default task(s).
    grunt.registerTask('default', ['handlebars']);
};
