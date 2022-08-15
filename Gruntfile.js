module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      target: ['src/**/*.js'],
      options: {
        fix: true,
      },
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
      },
    },
    run: {
      build: {
        cmd: 'npm',
        args: [
          'run',
          'build',
        ],
        options: {
          failOnError: true,
        },
      },
    },
  });

  // Load task plugins
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-run');

  // Tasks
  grunt.registerTask('build', [
    'eslint',
    'karma:unit',
    'run:build',
  ]);
};
