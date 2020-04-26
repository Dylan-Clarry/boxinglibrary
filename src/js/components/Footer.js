const Footer = {
	render: async _ => {

		let content = `
			<footer>
				<div class="container">
					<p><script>document.write(new Date().getFullYear());</script> Football Library. All rights resevered.</p>
				</div><!-- /container -->
			</footer>
		`;

		return content;
	}
}

module.exports = { Footer }