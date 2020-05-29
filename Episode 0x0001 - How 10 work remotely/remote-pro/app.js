import webApi from '@slack/web-api';

const { WebClient } = webApi;\
const userToken = process.env.SLACK_USER_TOKEN;
const webClient = new WebClient(userToken);

const responseIntervalSeconds = 5;

const replies = [
	'Oh yeah, I\'m on top of that',
	'Don\'t you think we should give that to someone more junior?',
	'I already did that yesterday',
	'I\'m pretty backed up here already. I know I\'m the best but we can\'t assign everything to me',
	'I\'ll do it next sprint',
	'I\'m still fixing the bugs you caused from last time',
	'Ok I\'ll get to it on Saturday because that\'s how much your incompetence is causing me to have to work',
	'I would love to but I\'m watching the kids. Oh yeah I had three kids this morning I forgot to mention sorry',
	'This is an auto-respond bot while I goof off haha just kidding it\'s really me. Yeah I guess I can do that.',
	'LOL ok',
	'I will look into it later once my coronavirus symptoms die down a little',
	'You don\'t actually want to do that. Trust me. It\'s a bad idea.',
	'What you are asking is impossible. I mean I could do it but nobody else could and then nobody could maintain it if I\'m ever out.'
];

const delay = seconds => new Promise(resolve => {
	setTimeout(resolve, seconds * 1000);
});

const all = (...fns) =>
	arg => fns.reduce(((allAreTrue, fn) => allAreTrue && fn(arg)), true);

const getRandomReply = () => {
	const delta = replies.length;
	const index = Math.floor(Math.random() * delta);
	return replies[index];
};

const sendChat = async (channel, text, parent) =>
	webClient.chat.postMessage({
		text,
		channel,
		thread_ts: parent,
		as_user: true
	});

const getChannels = async () => {
	const { channels } = await webClient.conversations.list({
		types: 'public_channel, private_channel, im, mpim'
	});
	
	return channels.map(({ id }) => id);
};

const initializeChannel = async (channelId) =>
	webClient.conversations.history({
		channel: channelId,
		limit: 1
	}).then(({ messages }) =>
		messages.length === 0
			? { channel: channelId, ts: 0 }
			: { channel: channelId, ts: messages[0].ts });

const aggregate = async (requestFn, resultsFn, results = [], cursor = undefined) => {
	if (cursor === '') {
		return results;
	}

	const response = await requestFn(cursor);
	const newResults = results.concat(resultsFn(response));
	const newCursor = response.has_more ? response.response_metadata.next_cursor : '';

	return await aggregate(requestFn, resultsFn, newResults, newCursor);
};

const getMentionFormat = userId => `<@${userId}>`;

const respond = async ({ userId, name }, index, channels) => {
	const { channel, ts } = channels[index];
	const requester = cursor => webClient.conversations.history({
		channel,
		oldest: ts,
		cursor
	});

	const messageExtractor = ({ messages }) => messages;
	const messages = await aggregate(requester, messageExtractor);

	channels[index].ts = messages.length > 0
		? messages[messages.length - 1].ts
		: channels[index].ts;

	const mentionsMe = ({ text }) =>
		text.toLowerCase().includes(name) || text.includes(getMentionFormat(userId));
	
	const isNotMe = ({ user }) => user !== userId;
	const mentions = messages.filter(all(mentionsMe, isNotMe));

	const sendReply = ({ ts }) => sendChat(channel, getRandomReply(), ts);
	await Promise.all(mentions.map(sendReply));
	await delay(responseIntervalSeconds);
};

const run = async () => {
	try {
		const { user_id } = await webClient.auth.test();
		const { profile: { display_name: name } } = await webClient.users.profile.get();
		const channelIds = await getChannels();
		const channels = await (Promise.all(channelIds.map(initializeChannel)));

		if (channels.length === 0) {
			return;
		}

		let index = 0;
		while (true) {
			await respond({ userId: user_id, name: name.toLowerCase() }, index, channels);
			index = (index + 1) % channels.length;
		}
	} catch (error) {
		console.log(error);
	}
};

run();