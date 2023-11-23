const { SlashCommandBuilder } = require('discord.js');
require('any-date-parser');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('homework')
		.setDescription('Get upcoming homework'),

	async execute(interaction) {
		await interaction.deferReply();
		module.exports.computeHomework(interaction);
	},

	async computeHomework(interaction) {
		await interaction.client.channels.fetch(config.homeworkChannelId)
			.then(channel => {
				channel.threads.fetch()
					.then(threads => {
						const upcomingThreads = this.filterThreads(threads.threads);
						const threadsNames = upcomingThreads.map(thread => `${thread.name}`).join('\n');
						const threadsLinks = upcomingThreads.map(thread => `<#${thread.id}>`).join('\n');
						interaction.editReply(`${threadsNames}\n\n${threadsLinks}`);
					});
			});
	},

	filterThreads(threads) {
		const currentDate = Date.now();
		const threadsWithDate = threads.map(thread => ({ thread: thread, date: this.parseDate(thread) }));
		const sortedThreads = this.sortThreads(threadsWithDate);
		const filteredThreads = sortedThreads.filter(thread => (thread.date - currentDate >= 0));
		return filteredThreads.map(thread => thread.thread);
	},

	sortThreads(threadsWithDate) {
		threadsWithDate.sort(function(a, b) {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA - dateB;
		});
		return threadsWithDate;
	},

	parseDate(thread) {
		const dateString = thread.name.split(' - ')[0];
		const date = Date.fromString(dateString, 'fr-FR');
		return date;
	},
};
