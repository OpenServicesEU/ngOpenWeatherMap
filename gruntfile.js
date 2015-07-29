module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: ['ng-openweathermap.js','gruntfile.js']
    },
    uglify: {
      js: {
        files: {
          'ng-openweathermap.min.js': 'ng-openweathermap.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', [ 'jshint', 'uglify']);
  grunt.registerTask('travis', [ 'jshint' ]);
};
