const { Events } = require('discord.js');
const dedent = require('dedent');
const { log } = require('../utils/log.js');
const config = require('../config.json');

module.exports = {
	name: Events.ThreadCreate,
	async execute(thread) {
		if (thread.parent.id == config.homeworkChannelId) {
			const threadName = thread.name;
			log(`Thread "${threadName}" was created in "${thread.parent.name}" channel`);

			// https://www.freecodecamp.org/news/regex-for-date-formats-what-is-the-regular-expression-for-matching-dates/
			// Expected format = "DD-MM-YYYY - Course : Detail"
			const regex = /(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[1,2])-(19|20)\d{2} - [^ :][^:]+ \: [^:]+/;

			if (!threadName.match(regex)) {
				log(`Thread's name "${threadName}" doesn't match the regex.`);
				const ownerId = thread.ownerId;

				thread.client.users.fetch(ownerId)
					.then(user => {
						user.send(this.message(thread));
						thread.delete('Deleting thread with incorrect name')
							.then(deletedThread => {
								log(`Thread "${deletedThread.name}" deleted because of incorrect name.`);
							})
							.catch(console.error);
					})
					.catch(console.error);
			}
		}
	},

	message(thread) {
		const msg = dedent`
			Coucou toi,

			Je me suis permis de supprimer ton thread car son titre ne
			correspondait pas aux règles. J'ai besoin qu'il soit formaté d'une
			manière bien précise pour qu'il apparaisse dans la synthèse que
			j'envoie en réponse à la commande \`/homework\` !

			La règle en question (attention aux espaces) :
			\`JJ-MM-AAAA - Matière : Livrable\`

			Je t'invite donc à en recréer un dont le titre correspond. Et comme
			je suis sympa je te redonne quand-même quelques infos pour pas avoir
			à tout te retaper.

			Nom du thread supprimé :
			\`${thread.name}\``;

		return msg;
	},
};
