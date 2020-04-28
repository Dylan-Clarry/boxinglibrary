// ====================
// Navbar
// ====================

const _removeToken = _ => {
    //console.log("REMOVE token");
    window.localStorage.removeItem('tokenObj');
};

const _getToken = _ => {
    let oneHour = 60 * 60 * 1000;

    // get object, return null if null
    var tokenObj = JSON.parse(window.localStorage.getItem('tokenObj'));
    //console.log('token obj', tokenObj);
    if(!tokenObj) return null;
    
    // if token time is stored for more than an hour remove token and return null
    var tokenTime = tokenObj.timestamp;
    var timeNow = new Date().getTime();
    //console.log(timeNow - tokenTime);
    if(timeNow - tokenTime > oneHour) {
        _removeToken();
        return null;
    }

    // return token
    return tokenObj.token;
};

const Navbar = {
	render: async _ => {
		let token = _getToken();
		let content = `
			<div class="nav">
				<div class="container">
					<a id="nav-logo" href="#/"><h1 class="nav-title">FOOTBALL LIBRARY</h1></a>

					<div id="navbar-items">
						<nav>
							<ul class="nav-list">
		`;
		if(token) {
			content += `
								<li><a href="#/dashboard">Dashboard</a></li>
			`;
		} else {
			content += `
								<li><a href="#/account">Signup/Login</a></li>
			`;
		}
		content += `
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