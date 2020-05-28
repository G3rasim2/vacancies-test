var gulp = require('gulp');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var server = require('browser-sync').create();

gulp.task('clean', function() {
	return del('build');
});

gulp.task('copy', function() {
	return gulp.src([
		'source/fonts/**/*.{woff,woff2}',
		'source/css/normalize.min.css',
		'source/img/**'
		], {base: 'source'})
		.pipe(gulp.dest('build'));
});

gulp.task('style', function() {
	return gulp.src('source/sass/**/*.{sass,scss}')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest('./source/css'))
		.pipe(minify())
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/css'))
		.pipe(server.stream());
});

gulp.task('html', function() {
	return gulp.src('source/*.html')
		.pipe(posthtml([include()]))
		.pipe(gulp.dest('build'));
});

gulp.task('js', function () {
	return gulp.src('source/js/script.js')
		.pipe(uglify())
		.pipe(rename('script.min.js'))
		.pipe(gulp.dest('build/js'));
});

gulp.task("build", gulp.series("clean", "copy", "style", "html", 'js'), function(done) {
});

gulp.task('serve', function() {
	server.init({
		server: 'build',
		notify: false,
		open: true,
		cors: true,
		ui: false
	});
	gulp.watch('./source/sass/**/*.{sass,scss}', gulp.series('style'));
	gulp.watch('./source/css/style.min.css').on('change', server.reload);
	gulp.watch('./source/*.html', gulp.series('html'));
	gulp.watch('./source/*.html').on('change', server.reload);
	gulp.watch('./source/js/*.js', gulp.series('js'));
	gulp.watch('./source/js/*.js').on('change', server.reload);
});