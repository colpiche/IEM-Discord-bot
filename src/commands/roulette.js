const { SlashCommandBuilder } = require('discord.js');
const constants = require('../constants.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Du tirage au sort en masse')
		.addIntegerOption(option =>
			option
				.setName('teams')
				.setDescription('Le nombre d\'équipes à créer')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(8)),

	async execute(interaction) {
		await interaction.deferReply();
		const teams = this.createTeams(interaction);
		const msg = this.formatMessage(teams);
		await interaction.editReply(msg);
	},

	createTeams(interaction) {
		let students = constants.students.slice();
		const numTeams = interaction.options.getInteger('teams');
		const teams = [];

		for (let i = 0; i < numTeams; i++) {
			teams.push([]);
		}

		for (let i = 0; i < constants.students.length; i++) {
			const j = this.random(students.length);
			const team = i % numTeams;
			teams[team].push(students[j]);
			students.splice(j, 1);
		}

		return teams;
	},

	formatMessage(teams) {
		let msg = '';

		for (let i = 0; i < teams.length; i++) {
			msg += `Equipe ${i + 1} : `;

			for (let j = 0; j < teams[i].length; j++) {
				msg += `${teams[i][j]}`;
				(j == teams[i].length - 1) ? (msg += '\n') : (msg += ' + ');
			}
		}

		return msg;
	},

	random(max) {
		return Math.floor(Math.random() * max);
	},
};
