const eol = require('os').EOL;
const promisify = require('util').promisify;
const convertToArt = promisify(require('figlet').text);

const clearScreen = () => {
	console.log('\033c');
}

const timeout = delay => new Promise((resolve, reject) => setTimeout(resolve, delay));

const green = () => console.log('\x1b[32m');
const blue = () => console.log('\x1b[36m');
const resetTextColor = () => console.log('\x1b[0m');
const createSpace = n => console.log(eol.repeat(n));

const resetScreen = () => {
	resetTextColor();
	createSpace(5);
};

const run = async () => {
	clearScreen();
	await timeout(500);

	green();
	const title = await convertToArt('Pro Gramming', { font: 'Big Money-ne' });
	console.log(title);
	createSpace(2);

	resetTextColor();
	await timeout(2000);
	console.log('Today\'s episode:');

	blue();
	const episode = await convertToArt(process.argv[2], { font: 'Big' });
	await timeout(500);

	console.log(episode);
	resetScreen();

	await timeout(1000);
	console.error('FATAL ERROR: This code is trash and I give up');
	console.error('Process exited with error code 6B696C6C206D65');
	await timeout(5000);
};

run();