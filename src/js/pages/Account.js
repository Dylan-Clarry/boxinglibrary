let Account = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Account</h1>
			</div>
		`;

		return content;
	},

	postRender: async _ => {}
}

module.exports = { Account };