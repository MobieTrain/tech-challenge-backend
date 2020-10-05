module.exports = {
	// file-matching
	flat: false,
	paths: ['./src'],
	transform: 'node_modules/lab-transform-typescript',

	// ...
	assert: '@hapi/code',
	colors: true,
	coverage: false,
	globals: '__core-js_shared__,core,global-symbol-property',
	lint: false,
	reporter: 'console',
	shuffle: true,
	timeout: 4000,
	verbose: true,
	sourcemaps: true,
}
