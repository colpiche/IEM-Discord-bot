const { Events } = require('discord.js');
const { log } = require('../utils/log.js');

// When the client is ready, run this code (only once)
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		log(`Ready! Logged in as ${client.user.tag}`);
	},
};
