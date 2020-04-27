let Homepage = {
	render: async _ => {

		let content = `
			<div>
				<h1><a href="#/">Home</a> <a href="#/about">About</a> <a href="#/posts/1">Post 1</a> <a href="#/posts/2">Post 2</a></h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Homepage };