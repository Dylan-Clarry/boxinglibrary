// ====================
// Footer
// ====================

const Footer = {
	render: async _ => {

		let year = new Date().getFullYear();

		let content = `
			<footer>
				<div class="container">
					<p>${ year } Football Library. All rights resevered.</p>
				</div><!-- /container -->
			</footer>
		`;

		return content;
	}
}

module.exports = { Footer }