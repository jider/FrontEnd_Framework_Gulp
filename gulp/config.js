// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var root	= './src/';
var appPath = root + 'lib/';


module.exports =  {
	markup: {
		src: appPath + '*.html',	
	},
	
	browserSync: { 
		server: appPath 
	},

	sass: {
		src: appPath + 'scss/**/*.scss',
		dest: appPath +'css',
		srcMapDest: '.',
		dev: {
			errLogToConsole: true,
			includePaths: ['bower_components/foundation/scss'],
			outputStyle: 'expanded',
		},
		pro: {
			errLogToConsole: true,		
			includePaths: ['bower_components/foundation/scss'],
			outputStyle: 'compressed'
		}
	}, 
	sassdoc: {
		src: appPath + 'scss/**/*.scss',
		options: {
			dest: root + 'sassdoc'
		}
	}
};