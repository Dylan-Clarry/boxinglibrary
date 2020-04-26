const Navbar = {
	render: async _ => {

		let content = `
			<div class="nav">
				<div class="container">
					<a id="nav-logo" href="./index.html"><h1 class="nav-title">FOOTBALL LIBRARY</h1></a>

					<div id="navbar-items">
						<nav>
							<ul class="nav-list">
								<li><a href="./dashboard.html">Dashboard</a></li>
								<li><a href="./account.html">Account</a></li>
							</ul>
						</nav>
					</div><!-- /navbar-desktop -->
				</div><!-- /container -->
			</div><!-- /nav -->
		`;

		return content;
	}
}

module.exports = { Navbar }