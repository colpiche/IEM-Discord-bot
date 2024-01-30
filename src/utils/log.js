const { currentDate } = require('../utils/date.js');

function log(msg) {
	console.log(`${currentDate()} : ${msg}`);
}

module.exports = { log };
