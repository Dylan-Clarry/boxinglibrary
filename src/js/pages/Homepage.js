let Homepage = {
	render: async _ => {

		let content = `
			<div>
				<h1><a href="#/">Home</a> <a href="#/about">About</a></h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Homepage };