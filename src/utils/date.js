function currentDate() {
	const date = new Date();
	return date.toLocaleString();
}

module.exports = { currentDate };
