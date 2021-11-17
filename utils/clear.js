const clearDir = require('clear-dir');

clearDir(`${__dirname}/../build`, () => {
	console.log('Catalog clear!');
});
