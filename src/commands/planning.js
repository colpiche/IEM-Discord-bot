// Import libraries
const { SlashCommandBuilder } = require('discord.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const Constants = require('../constants.json');


// Run dotenv
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('planning')
		.setDescription('Get the planning for the current week'),

	async execute(interaction) {
		await interaction.deferReply();
		module.exports.sendPlanning(interaction);
	},

	async sendPlanning(interaction) {
		fetch(process.env.CALENDAR_URL)
			.then(function(response) {
				return response.text();
			})
			.then(function(html) {
				const dom = new JSDOM(html);
				const planningTable = module.exports.extractPlanningTable(dom);
				const message = module.exports.formatMessage(planningTable);
				interaction.editReply(message);
			})
			.catch(function(error) {
				console.log(`error : ${error}`);
			});
	},


	extractPlanningTable(dom) {
		const planningTable = dom.window.document.getElementsByClassName('PlanningEvtContainer').item(0);
		return planningTable;
	},


	formatMessage(planningTable) {
		let message = '';
		const spans = planningTable.querySelectorAll('span, a');

		spans.forEach(span => {
			const spanId = span.id.split('_');
			const spanType = spanId[spanId.length - 1];
			let textContent = span.textContent;

			switch (spanType) {
			case 'lblDay':
				// Jour
				if (message.length != 0) { message += '\n'; }
				message += `\n${textContent.toUpperCase()}`;
				break;
			case 'lblEvtRange':
				// Heure
				message += `\n${textContent}`;
				break;
			case 'lblEvtType':
				// Type
				break;
			case 'lblEvtSalle':
				// Salle
				textContent = textContent.split(' - ')[0];
				message += ` - ${textContent}`;
				break;
			case 'lblEvtUE':
				// UE
				const course = Constants.courses.find((obj) => obj.code == textContent);
				textContent = course.name;
				// falls through
			default:
				message += ` ${textContent}`;
				break;
			}
		});

		return message;
	},
};
