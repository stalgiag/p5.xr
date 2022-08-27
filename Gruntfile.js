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
    jsdoc2md: {
      oneOutputFile: {
        src: 'src/**/*.js',
        dest: 'docs/reference/app.md',
        options: {
          'no-gfm': true,
          separators: true,
          'global-index-format': 'none',
        },
      },
    },
  });

  // Load task plugins
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

  // Tasks
  grunt.registerTask('build', [
    'eslint',
    'karma:unit',
    'run:build',
  ]);
  grunt.registerTask('docs', [
    'jsdoc2md',
  ]);
};
