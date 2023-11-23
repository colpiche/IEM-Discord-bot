const { Events } = require('discord.js');
const { currentDate } = require('../utils/date.js');

// When the client is ready, run this code (only once)
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`${currentDate()} : Ready! Logged in as ${client.user.tag}`);
	},
};
