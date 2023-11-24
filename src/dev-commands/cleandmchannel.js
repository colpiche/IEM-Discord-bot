const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleandmchannel')
		.setDescription('Cleans the DM channel between bot and user'),
	async execute(interaction) {
		await interaction.deferReply();

		interaction.member.fetch()
			.then(user => {
				user.createDM()
					.then(channel => {
						channel.messages.fetch()
							.then(messages => {
								messages.forEach(message => {
									message.delete();
								});
								interaction.editReply({ content: 'Done!', ephemeral: true });
							});
					});
			});
	},
};
