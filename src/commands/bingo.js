const { SlashCommandBuilder } = require('discord.js');
const constants = require('../constants.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bingo')
		.setDescription('Turbo bingo !'),

	async execute(interaction) {
		await interaction.deferReply();
		const grid = this.createGrid();
		const msg = this.formatMessage(grid, interaction);
		await interaction.editReply(msg);
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
		let msg = `Grille pour ${interaction.member.displayName}\n`;
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
