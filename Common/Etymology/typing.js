const typingSpeed = 30;
const readyCursorClass = 'ready-cursor';
const typingCursorClass = 'typing-cursor';

let elemIndex = 0;
let isAnimationLocked = false;

const timeout = duration => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};

const setCursorToReady = elem => elem.classList.add(readyCursorClass);
const setCursorToTyping = elem => elem.classList.replace(readyCursorClass, typingCursorClass);
const removeCursor = elem => elem.classList.remove(typingCursorClass);

const getTypedText = elem => elem.attributes.getNamedItem('data-text').value;
const setTypedText = (elem, text) => {
	elem.attributes.getNamedItem('data-text').value = text;
};

const getTypedElems = () =>
	Array.from(document.querySelectorAll('.typed'))
		.map(elem => Array.from(elem.querySelectorAll('dt, dd')))
		.flat();

const clearScreen = event => {
	event.preventDefault();
	if (isAnimationLocked) {
		return false;
	}

	const hasContent = elem =>
		elem.classList.contains('printed');

	const clearElement = elem => {
		elem.classList.add('cleared');
	};

	event.preventDefault();
	getTypedElems()
		.filter(hasContent)
		.forEach(clearElement);
	return false;
};

const animateElement = async elem => {
	setCursorToTyping(elem);
	const letters = getTypedText(elem).split('');

	for (const letter of letters) {
		elem.innerHTML += letter;
		await timeout(typingSpeed);
	}

	elem.classList.add('printed');
};

async function typeNextElement(e) {
	if (isAnimationLocked) {
		return;
	}

	const elems = getTypedElems();

	if (elemIndex >= elems.length) {
		// All groups have been animated
		return;
	}

	isAnimationLocked = true;
	const elem = elems[elemIndex];

	await animateElement(elem);
	++elemIndex;

	const anyRemainingElements = elemIndex < elems.length;
	removeCursor(elems[elemIndex - 1]);

	if (anyRemainingElements) {
		setCursorToReady(elems[elemIndex]);
		isAnimationLocked = false;
	} else {
		setCursorToReady(elems[elemIndex - 1])
	}
};

function onLoad() {
	const addDash = elem => {
		const text = ` - ${getTypedText(elem)}`;
		setTypedText(elem, text);
	};

	document.querySelector('dl').firstElementChild.classList.add('ready-cursor');

	Array
		.from(document.querySelectorAll('.typed > dd'))
		.forEach(addDash);

	const body = document.querySelector('body');
	body.addEventListener('click', typeNextElement);
	body.addEventListener('contextmenu', clearScreen);
};