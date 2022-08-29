// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-junit-reporter'),
		],
		client: {
			jasmine: {},
			clearContext: false,
		},
		jasmineHtmlReporter: {
			suppressAll: true,
		},
		coverageReporter: {
			dir: require('path').join(__dirname, '../../coverage/ngx-cdk-lightbox'),
			subdir: '.',
			reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcov' }],
		},
		junitReporter: {
			outputDir: require('path').join(__dirname, '../../coverage/ngx-cdk-lightbox/reports'),
			outputFile: 'junit.xml',
			useBrowserName: false,
		},
		reporters: ['progress', 'kjhtml', 'junit'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless'],
		singleRun: false,
		restartOnFileChange: true,
		customLaunchers: {
			ChromeHeadless: {
				base: 'Chrome',
				flags: [
					'--headless',
					'--disable-gpu',
					'--disable-translate',
					'--disable-extensions',
					'--disable-web-security',
					'--no-sandbox',
					'--remote-debugging-port=9222',
				],
			},
		},
	});
};
