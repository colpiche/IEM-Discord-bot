const { SlashCommandBuilder } = require('discord.js');
const constants = require('../constants.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bingo')
		.setDescription('Turbo bingo !'),

	async execute(interaction) {
		await interaction.reply({ content: 'Check your DM', ephemeral: true });
		const grid = this.createGrid();
		const msg = this.formatMessage(grid, interaction);
		await interaction.member.send(msg);
	},

	createGrid() {
		let sentences = constants.bingo.slice();
		const grid = [];

		for (let i = 0; i < 9; i++) {
			const j = this.random(sentences.length);
			grid.push(sentences[j]);
			sentences.splice(j, 1);
		}

		return grid;
	},

	formatMessage(grid, interaction) {
		let msg = `<@${interaction.member.id}> voici ta grille :\n`;
		msg += '------\n';

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				msg += `(${i + 1},${j + 1}) ${grid[i * 3 + j]}\n`;
			}
		}

		return msg;
	},

	random(max) {
		return Math.floor(Math.random() * max);
	},
};
