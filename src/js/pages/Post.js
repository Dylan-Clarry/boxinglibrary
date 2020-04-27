const getUrlQuery = _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}

let Post = {
	render: async _ => {

		let id = getUrlQuery().id;

		let content = `
			<div>
				<h2><a href="#/">Back</a></h2>
				<h1>Post ${id}</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Post };