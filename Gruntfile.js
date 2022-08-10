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
      rayCasting:
        { src: 'src/p5xr/core/raycasting.js', dest: 'docs/reference/raycasting.md' },
      p5xrInput:
        { src: 'src/p5xr/core/p5xrInput.js', dest: 'docs/reference/p5xrInput.md' },
      p5xrViewer:
        { src: 'src/p5xr/core/p5xrViewer.js', dest: 'docs/reference/p5xrViewer.md' },
      app:
            { src: 'src/app.js', dest: 'docs/reference/app.md' },
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
