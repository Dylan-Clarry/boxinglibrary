const Utilities = {
	getUrlQuery: _ => {
		let query = location.hash.slice(1).split('/');
		console.log('query:', query);

		return '/' + query[1];
	}
}

module.exports = { Utilities };