const eol = require('os').EOL;
const promisify = require('util').promisify;
const convertToArt = promisify(require('figlet').text);

const clearScreen = () => {
	console.log('\033c');
}

const changeTextColor = () => console.log('\x1b[36m');
const resetTextColor = () => console.log('\x1b[0m');

const resetScreen = () => {
	resetTextColor();
	console.log(eol.repeat(5));
};

const run = async () => {
	clearScreen();

	const title = await convertToArt('Pro Gramming', { font: 'Big Money-ne' });
	console.log(title);
	console.log('Today\'s episode:');

	const episode = await convertToArt(process.argv[2], { font: 'Small' });
	changeTextColor();
	console.log(episode);
	resetScreen();
};

run();
