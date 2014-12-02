// analoog met gruntfile, maar gulp heeft enkele voordelen (streaming ...)

var gulp = require("gulp");
var es = require("event-stream");
var config = require('./config.json');

var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/, // zorgt ervoor dat je plugins kan aanspreken zonder de gulp-prefix en camelCased
});

function getFilePath(target,type){
  return config[type][target].folder + "/" + config[type][target].file;
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
  return es.merge(handlebars(), jshint()) // merget handlebars en jshint in 1 file -> voordeel tov grunt
        .pipe(plugins.concat(config.scripts.dest.file))
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.wrap('(function(){\n\n<%= contents %>\n\n})();'))
        .pipe(gulp.dest(config.scripts.dest.folder));
});

gulp.task('watch', function() {
  gulp.watch(getFilePath("src","scripts"), ['scripts']);
});

gulp.task('default', ['watch','stylesheets','scripts']);
