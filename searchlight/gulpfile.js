var gulp = require("gulp");
var es = require("event-stream");
var config = require('./config.json');

var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/,
});

function getFilePath(target,type){
  return config[type][target].folder + "/" + config[type][target].file;
}

gulp.task('stylesheets', function() {
  return gulp.src(getFilePath("src","stylesheets"))
              .pipe(plugins.scssLint({
                  'config': '.scss-lint.yml'
              }))
              .pipe(plugins.compass({
                css: config.stylesheets.dest.folder,
                sass: config.stylesheets.src.folder,
              }))
							.pipe(plugins.autoprefixer({
		            browsers: ['last 2 versions','ie 9'],
		            cascade: false
							}))
              .pipe(plugins.util.env.type === 'production' ? plugins.minifyCss() : plugins.util.noop())
              .pipe(gulp.dest(config.stylesheets.dest.folder));
});

function handlebars(){
  return gulp.src(getFilePath("src","templates"))
              .pipe(plugins.handlebars())
              .pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
              .pipe(plugins.declare({
                namespace: config.templates.namespace,
                noRedeclare: true
              }));
}

function jshint(){
  return gulp.src(getFilePath("src","scripts"))
              .pipe(plugins.jshint("./.jshintrc"))
              .pipe(plugins.jshint.reporter('jshint-stylish'))
              .pipe(plugins.jshint.reporter("fail"))
              .on('error', function(error){
                plugins.util.beep();
              });
}

gulp.task("scripts",function(){
  return es.merge(handlebars(), jshint())
        .pipe(plugins.concat(config.scripts.dest.file))
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.wrap('(function(){\n\n<%= contents %>\n\n})();'))
        .pipe(gulp.dest(config.scripts.dest.folder));
});

gulp.task('watch', function() {
  gulp.watch(getFilePath("src","stylesheets"), ['stylesheets']);
  gulp.watch(getFilePath("src","templates"), ['scripts']);
  gulp.watch(getFilePath("src","scripts"), ['scripts']);
});

gulp.task('default', ['watch','stylesheets','scripts']);
