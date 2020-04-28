(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Homepage } = require('./js/pages/Homepage.js');
const { Account } = require('./js/pages/Account.js');
const { Dashboard } = require('./js/pages/Dashboard.js');
const { Match } = require('./js/pages/Match.js');

const { Navbar } = require('./js/components/Navbar.js');
const { Footer } = require('./js/components/Footer.js');

const { Utilities: Util } = require('./js/utilities/Utilities.js');

console.log("你好世界");

const routes = {
	'/': Homepage,
	'/index.html': Homepage,
	'/account': Account,
	'/dashboard': Dashboard,
	'/match/:id': Match,
};

const runApp = async _ => {

	// find the app div to add page content to
	const app = null || document.getElementById('app');
	if(app) {
		let nav = app.children.nav;
		let footer = app.children.footer;
		let content = app.children.content;

		nav.innerHTML = await Navbar.render();
		footer.innerHTML = await Footer.render();
		
		query = Util.getUrlQuery();
		console.log('query:', query);

		let parsedQuery = Util.parseQuery(query);
		console.log(parsedQuery)

		// fix for first load, might need to change later
		if(!routes[parsedQuery]) {
			query.route = '/';
		}

		let currPage = routes[parsedQuery];
		content.innerHTML = await currPage.render();
		currPage.postRender();

	} else {
		console.error("SPA Error: root element div with id 'app' not found");
	}
}

const runPostPageLoad = _ => {
	window.addEventListener('load', runApp);
}

window.addEventListener('hashchange', runApp);

runPostPageLoad();

// start command
// live-server --port=8080 ./ --verbose --spa
// watchify ./src/app.js -o ./dist/bundle.js -d -v
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/Account.js":4,"./js/pages/Dashboard.js":5,"./js/pages/Homepage.js":6,"./js/pages/Match.js":7,"./js/utilities/Utilities.js":8}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
        console.log("from here (get token)");
        _removeToken();
        return null;
    }

    // return token
    return tokenObj.token;
};

const Navbar = {
	render: async _ => {

		let token = _getToken();

		console.log("token:", token);

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
},{}],4:[function(require,module,exports){
// ====================
// Account
// ====================

const _removeToken = _ => {
    //console.log("REMOVE token");
    window.localStorage.removeItem('tokenObj');
};

const _setToken = token => {
    _removeToken();
    //console.log("SET token");
    var tokenObj = {
        token: 'bearer ' + token,
        timestamp: new Date().getTime(),
    };
    window.localStorage.setItem('tokenObj', JSON.stringify(tokenObj));
};

const signUpUser = data => {
	
	let url = 'https://footlib-backend.herokuapp.com/signup';

	return $.ajax({
		type: 'POST',
		datatype: 'json',
		data: data,
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
}

const loginUser = data => {

	let url = 'https://footlib-backend.herokuapp.com/login';

	return $.ajax({
		type: 'POST',
		datatype: 'json',
		data: data,
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
}

const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let Account = {
	render: async _ => {

		let content = `
			<div id="index" class="container">
				<h2><a href="#/">Back</a></h2>
			
				<div class="login-signup">
					<h1>FOOTBALL LIBRARY</h1>

					<div id="login-form" class="hide">
						<h2>Login</h2>
						<form method="POST" class="account-form">
							<input name="username" type="text" placeholder="Username">
							<br>
							<input name="pass" type="text" placeholder="Password">
							<br>
							<button type="submit">Login</button>
						</form><!-- /account-form -->
					</div><!-- login-form -->

					<div id="signup-form">
						<h2>Signup</h2>
						<form method="POST" class="account-form">
							<input name="username" type="text" placeholder="Username">
							<br>
							<input name="pass" type="password" placeholder="Password">
							<br>
							<input name="email" type="text" placeholder="Email">
							<br>
							<button type="submit">Signup</button>
						</form><!-- /account-form -->
					</div><!-- signup-form -->
					<a id="change-form-type" type-value="1"><u><p>Logging in?</p></u></a>
				</div><!-- /login-signup -->
				
			</div><!-- /container -->
		`;

		return content;
	},

	postRender: async _ => {

		loginForm = document.getElementById('login-form');
		signupForm = document.getElementById('signup-form');
		changeFormType = document.getElementById('change-form-type');

		// click event dynamically changes the account form from signup to login
		if(changeFormType !== null) {
			changeFormType.addEventListener('click', _ => {
				typeValue = changeFormType.getAttribute("type-value");

				// hides or unhides the current form
				if(typeValue === '0') {
					loginForm.classList.add('hide');
					signupForm.classList.remove('hide');
					changeFormType.setAttribute("type-value", '1');
					changeFormType.innerText = "Logging in?"
				} else {
					loginForm.classList.remove('hide');
					signupForm.classList.add('hide');
					changeFormType.setAttribute("type-value", '0');
					changeFormType.innerText = "Signing up?"
				}
			});

			let signupTrueForm = signupForm.getElementsByTagName('form')[0];
			console.log(signupTrueForm.elements);

			signupTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();

				let usernameVal = signupTrueForm.elements['username'].value;
				let passVal = signupTrueForm.elements['pass'].value;
				let emailVal = signupTrueForm.elements['email'].value.toLowerCase();

				if(usernameVal === '' || passVal === '' || emailVal === '') {
					alert('One or more fields are empty');
				} else if(!validateEmail(emailVal)) {
					alert("Invalid email form");
				}
				
				// create login object based on formdata
				var signupObj = {
					username: usernameVal,
					pass: passVal,
					email: emailVal,
				};

				signUpUser(signupObj).done(result => {
					console.log(result);

					if(result.signup == true){

						var loginObj = {
							username: usernameVal,
							pass: passVal,
						};

						loginUser(loginObj).done(result => {
							console.log(result.accessToken);

							_setToken(result.accessToken);

							document.location.href = '/';
						});
					}
				})

				console.log(signupTrueForm);
			});

			let loginTrueForm = loginForm.getElementsByTagName('form')[0];
			console.log(loginTrueForm.elements);

			loginTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();

				let usernameVal = loginTrueForm.elements['username'].value;
				let passVal = loginTrueForm.elements['pass'].value;

				if(usernameVal === '' || passVal === '') {
					alert('One or more fields are empty');
				}
				
				// create login object based on formdata
				var loginObj = {
					username: usernameVal,
					pass: passVal,
				};

				loginUser(loginObj).done(result => {

					if(result.loggedin == true) {
						console.log(result.accessToken);

						_setToken(result.accessToken);
						
						document.location.href = '/';
					} else {
						alert("Wrong credentials");
					}
				});

				console.log(loginTrueForm);
			});
		}
	}
}

module.exports = { Account };
},{}],5:[function(require,module,exports){
// ====================
// Dashboard
// ====================

const getMatches = _ => {
	matches = [
		{	
			id: 1,
			title: "France vs Spain",
			teams: ["France", "Spain"],
			score: [10, 2],
			winner: "France",
			description: "France faces Spain."
		},
		{
			id: 2,
			title: "Italy vs Brazil",
			teams: ["Italy", "Brazil"],
			score: [8, 3],
			winner: "Brazil",
			description: "Italy faces Brazil"
		},
		{
			id: 3,
			title: "Denmark vs  Russia",
			teams: ["Denmark", "Russia"],
			score: [3, 5],
			winner: "Denmark",
			description: "Denmark faces Russia"
		},
		{
			id: 4,
			title: "Poland vs Belgium",
			teams: ["Poland", "Belgium"],
			score: [101, 20],
			winner: "Belgium",
			description: "Poland faces Belgium"
		},
	];

	return matches;
}

let buildAddMatch = _ => {
	return `
		<div id="add-match-form">
			<h1>Add Match</h1>

			<button id="back-dashboard-btn">Back to Dashboard</button>

			<form class="add-match-form" action="POST">
				<input type="text" placeholder="Title">
				<br />
				<input type="text" placeholder="Teams">
				<br />
				<input type="text" placeholder="score">
				<br />
				<input type="text" placeholder="winner">
				<br />
				<input type="text" placeholder="description">
				<br />
				<button id="submit-add-match-btn" type="submit">Add Match</button>
			</form><!-- add-match-form -->
		</div><!-- /add-match-form -->
	`
}

let buildMatchRow = (match, index) => {
	return `
		<tr id="match-row-${index}" class="match-row">
			<td class="title">${match.title}</td>
			<td class="team1">${match.teams[0]}</td>
			<td class="team2">${match.teams[1]}</td>
			<td class="edit"><button class="edit-btn">Edit</button></td>
			<td class="delete"><button class="delete-btn">Delete</button></td>
		</tr>
	`
}

let buildDashboard = matches => {
	content = `
		<h1>Dashboard</h1>

		<button id="add-match-btn" class="add-match-btn">Add Match +</button>

		<table id="dashboard-table">
			<tr>
				<th>Title</th>
				<th>Team 1</th>
				<th>Team 2</th>
				<th>Edit</th>
				<th>Delete</th>
			</tr>
	`
	// for each match in matches build the row
	for(i = 0; i < matches.length; i++) {
		content += buildMatchRow(matches[i], i);
	}

	content += `
		</table><!-- /dashboard-table -->
	`
	return content;
}

let Dashboard = {
	render: async _ => {

		matches = getMatches();
		console.log(matches);

		let content = `
			<div id="index" class="container">
				<h2><a href="#/">Back</a></h2>

				<div id="dashboard">
		`;
		
		let dashboard = buildDashboard(matches);
		content += dashboard + `
				</div><!-- /dashboard -->
			</div><!-- /container -->
		`;

		return content;
	},

	postRender: async _ => {
		let dash = document.getElementById('dashboard');
		console.log("hello post", dash);
	}
}

module.exports = { Dashboard };
},{}],6:[function(require,module,exports){
// ====================
// Homepage
// ====================

const getRecentMatches = _ => {
	recentMatches = [
		{
			id: 1,
			title: "Croatia vs Mexico",
			teams: ["Croatia", "Mexico"],
			score: [10, 2],
			winner: "Croatia",
			description: "Croatia faces Mexico"
		},
		{
			id: 2,
			title: "Germany vs England",
			teams: ["Germany", "England"],
			score: [8, 3],
			winner: "England",
			description: "Germany faces England"
		},
	]

	return recentMatches;
}

const getMatchesAjax = _ => {

	let url = 'https://footlib-backend.herokuapp.com/matches';

	return $.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: url,
		async: false,
		success: data => {
			//console.log(data);
		}
	});
}

// builds the html for a full set of match cards given a list of match objects
let buildMatchCardSet = matches => {
	content = ''
	for(i = 0; i < matches.length; i++) {

		// build match cards into content
		content += buildMatchCard(matches[i], i);
	}
	return content
}

// function recieves a match object and returns the html needed to render the match card
let buildMatchCard = (match, index) => {
	return `
	<div id="match-card-${ index }" class="match-card">
		<div class="match-card-graphic">
			
		</div><!-- /match-card-graphic -->
		<h2 class="match-card-title"><a href="#/match/${ match.matchID }">${ match.teamID1_Name + '\nvs.\n' + match.teamID2_Name }</a></h2>
		<h2 class="match-card-score">${ match.score1 } - ${ match.score2 }</h2>
		<p>${ match.description }</p>
	</div><!-- /match -->
	`
}

let Homepage = {
	render: async _ => {

		let matches;

		getMatchesAjax().done(result => {
			matches = result;
		});

		let content = `
			<div id="index" class="container">

				<h1>Live Feed</h1>
				<br>

				<h1>Recent Matches</h1>
				
				<div id="recent-matches" class="matches grid">
		`;

		// build matches set
		let matchCardSet = buildMatchCardSet(matches);

		content += matchCardSet + `
			</div><!-- recent-matches -->
		`;

		// build recent matches set
		content += `
			<h1>Search Matches</h1>
				<div id="homepage-matches" class="matches grid">
		`;

		let recentMatches = getRecentMatches();
		let recentMatchCardSet = buildMatchCardSet(recentMatches);

		content += recentMatchCardSet + `
				</div><!-- /matches -->
			</div><!-- /container -->
		`;

		return content;
	},

	postRender: async _ => {}
}

module.exports = { Homepage };
},{}],7:[function(require,module,exports){
// ====================
// Match
// ====================

// ********************
// JQuery AJAX Calls
// ********************
const getMatchesAjax = _ => {
	return $.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: 'https://footlib-backend.herokuapp.com/matches/match/',
		async: false,
		success: data => {
			console.log(data);
		}
	});
}

const getMatchById = id => {

	let url = 'https://footlib-backend.herokuapp.com/matches/match/' + id;

	return $.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: url,
		async: false,
		success: data => {
			console.log('response data:', data);
		}
	});
}

const getUrlQuery = _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}

const matchWinner = match => {
	return match.score1 > match.score2 ? match.teamID1_Name : match.teamID2_Name;
}

let Match = {
	render: async _ => {

		let id = getUrlQuery().id;
		let match;
		getMatchById(id).done(result => {
			match = result[0];
		});

		let content = `
			<div id="index" class="container">

				<u><h2><a href="#/">Back</a></h2></u>

				<div id="single-match">
					<div class="match-headline">
						<h1>${ match.teamID1_Name } VS. ${ match.teamID2_Name }</h1>
					</div><!-- /match-headline -->

					<div class="match-winner">
						<h1>Winner: ${ matchWinner(match) }</h1>
					</div><!-- /match-winner -->

					<div class="match-stats">
						<h1>Final Score: ${ match.score1 } : ${match.score2 }</h1>
					</div><!-- /match-stats -->
					
					<article>
						<h1 class="match-title">${ match.teamID1_Name + '\nvs.\n' + match.teamID2_Name }</h1>
						<p>${ match.description }</p>
					</article>
				</div><!-- /single-match -->
			</div><!-- /container -->
		`;

		return content;
	},

	postRender: async _ => {}
}

module.exports = { Match };
},{}],8:[function(require,module,exports){
const Utilities = {
	getUrlQuery: _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	},

	parseQuery: query => {
		return (query.route ? '' + query.route : '/') + (query.id ? '/:id' : '');
	}
}

module.exports = { Utilities };
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgeyBIb21lcGFnZSB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9Ib21lcGFnZS5qcycpO1xuY29uc3QgeyBBY2NvdW50IH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0FjY291bnQuanMnKTtcbmNvbnN0IHsgRGFzaGJvYXJkIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0Rhc2hib2FyZC5qcycpO1xuY29uc3QgeyBNYXRjaCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9NYXRjaC5qcycpO1xuXG5jb25zdCB7IE5hdmJhciB9ID0gcmVxdWlyZSgnLi9qcy9jb21wb25lbnRzL05hdmJhci5qcycpO1xuY29uc3QgeyBGb290ZXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9Gb290ZXIuanMnKTtcblxuY29uc3QgeyBVdGlsaXRpZXM6IFV0aWwgfSA9IHJlcXVpcmUoJy4vanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcycpO1xuXG5jb25zb2xlLmxvZyhcIuS9oOWlveS4lueVjFwiKTtcblxuY29uc3Qgcm91dGVzID0ge1xuXHQnLyc6IEhvbWVwYWdlLFxuXHQnL2luZGV4Lmh0bWwnOiBIb21lcGFnZSxcblx0Jy9hY2NvdW50JzogQWNjb3VudCxcblx0Jy9kYXNoYm9hcmQnOiBEYXNoYm9hcmQsXG5cdCcvbWF0Y2gvOmlkJzogTWF0Y2gsXG59O1xuXG5jb25zdCBydW5BcHAgPSBhc3luYyBfID0+IHtcblxuXHQvLyBmaW5kIHRoZSBhcHAgZGl2IHRvIGFkZCBwYWdlIGNvbnRlbnQgdG9cblx0Y29uc3QgYXBwID0gbnVsbCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cdGlmKGFwcCkge1xuXHRcdGxldCBuYXYgPSBhcHAuY2hpbGRyZW4ubmF2O1xuXHRcdGxldCBmb290ZXIgPSBhcHAuY2hpbGRyZW4uZm9vdGVyO1xuXHRcdGxldCBjb250ZW50ID0gYXBwLmNoaWxkcmVuLmNvbnRlbnQ7XG5cblx0XHRuYXYuaW5uZXJIVE1MID0gYXdhaXQgTmF2YmFyLnJlbmRlcigpO1xuXHRcdGZvb3Rlci5pbm5lckhUTUwgPSBhd2FpdCBGb290ZXIucmVuZGVyKCk7XG5cdFx0XG5cdFx0cXVlcnkgPSBVdGlsLmdldFVybFF1ZXJ5KCk7XG5cdFx0Y29uc29sZS5sb2coJ3F1ZXJ5OicsIHF1ZXJ5KTtcblxuXHRcdGxldCBwYXJzZWRRdWVyeSA9IFV0aWwucGFyc2VRdWVyeShxdWVyeSk7XG5cdFx0Y29uc29sZS5sb2cocGFyc2VkUXVlcnkpXG5cblx0XHQvLyBmaXggZm9yIGZpcnN0IGxvYWQsIG1pZ2h0IG5lZWQgdG8gY2hhbmdlIGxhdGVyXG5cdFx0aWYoIXJvdXRlc1twYXJzZWRRdWVyeV0pIHtcblx0XHRcdHF1ZXJ5LnJvdXRlID0gJy8nO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyUGFnZSA9IHJvdXRlc1twYXJzZWRRdWVyeV07XG5cdFx0Y29udGVudC5pbm5lckhUTUwgPSBhd2FpdCBjdXJyUGFnZS5yZW5kZXIoKTtcblx0XHRjdXJyUGFnZS5wb3N0UmVuZGVyKCk7XG5cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU1BBIEVycm9yOiByb290IGVsZW1lbnQgZGl2IHdpdGggaWQgJ2FwcCcgbm90IGZvdW5kXCIpO1xuXHR9XG59XG5cbmNvbnN0IHJ1blBvc3RQYWdlTG9hZCA9IF8gPT4ge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bkFwcCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcnVuQXBwKTtcblxucnVuUG9zdFBhZ2VMb2FkKCk7XG5cbi8vIHN0YXJ0IGNvbW1hbmRcbi8vIGxpdmUtc2VydmVyIC0tcG9ydD04MDgwIC4vIC0tdmVyYm9zZSAtLXNwYVxuLy8gd2F0Y2hpZnkgLi9zcmMvYXBwLmpzIC1vIC4vZGlzdC9idW5kbGUuanMgLWQgLXYiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gRm9vdGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBGb290ZXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGZvb3Rlcj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdDxwPiR7IHllYXIgfSBGb290YmFsbCBMaWJyYXJ5LiBBbGwgcmlnaHRzIHJlc2V2ZXJlZC48L3A+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZm9vdGVyPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgRm9vdGVyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gTmF2YmFyXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBfcmVtb3ZlVG9rZW4gPSBfID0+IHtcbiAgICAvL2NvbnNvbGUubG9nKFwiUkVNT1ZFIHRva2VuXCIpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW5PYmonKTtcbn07XG5cbmNvbnN0IF9nZXRUb2tlbiA9IF8gPT4ge1xuXG4gICAgbGV0IG9uZUhvdXIgPSA2MCAqIDYwICogMTAwMDtcblxuICAgIC8vIGdldCBvYmplY3QsIHJldHVybiBudWxsIGlmIG51bGxcbiAgICB2YXIgdG9rZW5PYmogPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW5PYmonKSk7XG4gICAgLy9jb25zb2xlLmxvZygndG9rZW4gb2JqJywgdG9rZW5PYmopO1xuICAgIGlmKCF0b2tlbk9iaikgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgLy8gaWYgdG9rZW4gdGltZSBpcyBzdG9yZWQgZm9yIG1vcmUgdGhhbiBhbiBob3VyIHJlbW92ZSB0b2tlbiBhbmQgcmV0dXJuIG51bGxcbiAgICB2YXIgdG9rZW5UaW1lID0gdG9rZW5PYmoudGltZXN0YW1wO1xuICAgIHZhciB0aW1lTm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyh0aW1lTm93IC0gdG9rZW5UaW1lKTtcbiAgICBpZih0aW1lTm93IC0gdG9rZW5UaW1lID4gb25lSG91cikge1xuICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gaGVyZSAoZ2V0IHRva2VuKVwiKTtcbiAgICAgICAgX3JlbW92ZVRva2VuKCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHJldHVybiB0b2tlblxuICAgIHJldHVybiB0b2tlbk9iai50b2tlbjtcbn07XG5cbmNvbnN0IE5hdmJhciA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCB0b2tlbiA9IF9nZXRUb2tlbigpO1xuXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlbjpcIiwgdG9rZW4pO1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibmF2XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8YSBpZD1cIm5hdi1sb2dvXCIgaHJlZj1cIiMvXCI+PGgxIGNsYXNzPVwibmF2LXRpdGxlXCI+Rk9PVEJBTEwgTElCUkFSWTwvaDE+PC9hPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cIm5hdmJhci1pdGVtc1wiPlxuXHRcdFx0XHRcdFx0PG5hdj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibmF2LWxpc3RcIj5cblx0XHRgO1xuXG5cdFx0aWYodG9rZW4pIHtcblx0XHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9kYXNoYm9hcmRcIj5EYXNoYm9hcmQ8L2E+PC9saT5cblx0XHRcdGA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9hY2NvdW50XCI+U2lnbnVwL0xvZ2luPC9hPjwvbGk+XG5cdFx0XHRgO1xuXHRcdH1cblxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0PC9uYXY+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbmF2YmFyLWRlc2t0b3AgLS0+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL25hdiAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IE5hdmJhciB9IiwiLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIEFjY291bnRcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IF9yZW1vdmVUb2tlbiA9IF8gPT4ge1xuICAgIC8vY29uc29sZS5sb2coXCJSRU1PVkUgdG9rZW5cIik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbk9iaicpO1xufTtcblxuY29uc3QgX3NldFRva2VuID0gdG9rZW4gPT4ge1xuICAgIF9yZW1vdmVUb2tlbigpO1xuICAgIC8vY29uc29sZS5sb2coXCJTRVQgdG9rZW5cIik7XG4gICAgdmFyIHRva2VuT2JqID0ge1xuICAgICAgICB0b2tlbjogJ2JlYXJlciAnICsgdG9rZW4sXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgfTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuT2JqJywgSlNPTi5zdHJpbmdpZnkodG9rZW5PYmopKTtcbn07XG5cbmNvbnN0IHNpZ25VcFVzZXIgPSBkYXRhID0+IHtcblx0XG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9zaWdudXAnO1xuXG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhdHlwZTogJ2pzb24nLFxuXHRcdGRhdGE6IGRhdGEsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IHRydWUsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG5jb25zdCBsb2dpblVzZXIgPSBkYXRhID0+IHtcblxuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbG9naW4nO1xuXG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhdHlwZTogJ2pzb24nLFxuXHRcdGRhdGE6IGRhdGEsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IHRydWUsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG5jb25zdCB2YWxpZGF0ZUVtYWlsID0gZW1haWwgPT4ge1xuICAgIHZhciByZSA9IC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcXSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC87XG4gICAgcmV0dXJuIHJlLnRlc3QoU3RyaW5nKGVtYWlsKS50b0xvd2VyQ2FzZSgpKTtcbn1cblxubGV0IEFjY291bnQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLXNpZ251cFwiPlxuXHRcdFx0XHRcdDxoMT5GT09UQkFMTCBMSUJSQVJZPC9oMT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJsb2dpbi1mb3JtXCIgY2xhc3M9XCJoaWRlXCI+XG5cdFx0XHRcdFx0XHQ8aDI+TG9naW48L2gyPlxuXHRcdFx0XHRcdFx0PGZvcm0gbWV0aG9kPVwiUE9TVFwiIGNsYXNzPVwiYWNjb3VudC1mb3JtXCI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInBhc3NcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5Mb2dpbjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9mb3JtPjwhLS0gL2FjY291bnQtZm9ybSAtLT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIGxvZ2luLWZvcm0gLS0+XG5cblx0XHRcdFx0XHQ8ZGl2IGlkPVwic2lnbnVwLWZvcm1cIj5cblx0XHRcdFx0XHRcdDxoMj5TaWdudXA8L2gyPlxuXHRcdFx0XHRcdFx0PGZvcm0gbWV0aG9kPVwiUE9TVFwiIGNsYXNzPVwiYWNjb3VudC1mb3JtXCI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInBhc3NcIiB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFbWFpbFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlNpZ251cDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9mb3JtPjwhLS0gL2FjY291bnQtZm9ybSAtLT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIHNpZ251cC1mb3JtIC0tPlxuXHRcdFx0XHRcdDxhIGlkPVwiY2hhbmdlLWZvcm0tdHlwZVwiIHR5cGUtdmFsdWU9XCIxXCI+PHU+PHA+TG9nZ2luZyBpbj88L3A+PC91PjwvYT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvbG9naW4tc2lnbnVwIC0tPlxuXHRcdFx0XHRcblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsb2dpbkZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW4tZm9ybScpO1xuXHRcdHNpZ251cEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lnbnVwLWZvcm0nKTtcblx0XHRjaGFuZ2VGb3JtVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2UtZm9ybS10eXBlJyk7XG5cblx0XHQvLyBjbGljayBldmVudCBkeW5hbWljYWxseSBjaGFuZ2VzIHRoZSBhY2NvdW50IGZvcm0gZnJvbSBzaWdudXAgdG8gbG9naW5cblx0XHRpZihjaGFuZ2VGb3JtVHlwZSAhPT0gbnVsbCkge1xuXHRcdFx0Y2hhbmdlRm9ybVR5cGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfID0+IHtcblx0XHRcdFx0dHlwZVZhbHVlID0gY2hhbmdlRm9ybVR5cGUuZ2V0QXR0cmlidXRlKFwidHlwZS12YWx1ZVwiKTtcblxuXHRcdFx0XHQvLyBoaWRlcyBvciB1bmhpZGVzIHRoZSBjdXJyZW50IGZvcm1cblx0XHRcdFx0aWYodHlwZVZhbHVlID09PSAnMCcpIHtcblx0XHRcdFx0XHRsb2dpbkZvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXHRcdFx0XHRcdHNpZ251cEZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLnNldEF0dHJpYnV0ZShcInR5cGUtdmFsdWVcIiwgJzEnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5pbm5lclRleHQgPSBcIkxvZ2dpbmcgaW4/XCJcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsb2dpbkZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXHRcdFx0XHRcdHNpZ251cEZvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLnNldEF0dHJpYnV0ZShcInR5cGUtdmFsdWVcIiwgJzAnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5pbm5lclRleHQgPSBcIlNpZ25pbmcgdXA/XCJcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxldCBzaWdudXBUcnVlRm9ybSA9IHNpZ251cEZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Zvcm0nKVswXTtcblx0XHRcdGNvbnNvbGUubG9nKHNpZ251cFRydWVGb3JtLmVsZW1lbnRzKTtcblxuXHRcdFx0c2lnbnVwVHJ1ZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cblx0XHRcdFx0Ly8gcHJldmVudCBmb3JtIGZyb20gcmVsb2FkaW5nIHBhZ2UgYW5kIHNlbmRpbmdcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGxldCB1c2VybmFtZVZhbCA9IHNpZ251cFRydWVGb3JtLmVsZW1lbnRzWyd1c2VybmFtZSddLnZhbHVlO1xuXHRcdFx0XHRsZXQgcGFzc1ZhbCA9IHNpZ251cFRydWVGb3JtLmVsZW1lbnRzWydwYXNzJ10udmFsdWU7XG5cdFx0XHRcdGxldCBlbWFpbFZhbCA9IHNpZ251cFRydWVGb3JtLmVsZW1lbnRzWydlbWFpbCddLnZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0aWYodXNlcm5hbWVWYWwgPT09ICcnIHx8IHBhc3NWYWwgPT09ICcnIHx8IGVtYWlsVmFsID09PSAnJykge1xuXHRcdFx0XHRcdGFsZXJ0KCdPbmUgb3IgbW9yZSBmaWVsZHMgYXJlIGVtcHR5Jyk7XG5cdFx0XHRcdH0gZWxzZSBpZighdmFsaWRhdGVFbWFpbChlbWFpbFZhbCkpIHtcblx0XHRcdFx0XHRhbGVydChcIkludmFsaWQgZW1haWwgZm9ybVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Ly8gY3JlYXRlIGxvZ2luIG9iamVjdCBiYXNlZCBvbiBmb3JtZGF0YVxuXHRcdFx0XHR2YXIgc2lnbnVwT2JqID0ge1xuXHRcdFx0XHRcdHVzZXJuYW1lOiB1c2VybmFtZVZhbCxcblx0XHRcdFx0XHRwYXNzOiBwYXNzVmFsLFxuXHRcdFx0XHRcdGVtYWlsOiBlbWFpbFZhbCxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzaWduVXBVc2VyKHNpZ251cE9iaikuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cblx0XHRcdFx0XHRpZihyZXN1bHQuc2lnbnVwID09IHRydWUpe1xuXG5cdFx0XHRcdFx0XHR2YXIgbG9naW5PYmogPSB7XG5cdFx0XHRcdFx0XHRcdHVzZXJuYW1lOiB1c2VybmFtZVZhbCxcblx0XHRcdFx0XHRcdFx0cGFzczogcGFzc1ZhbCxcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGxvZ2luVXNlcihsb2dpbk9iaikuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZXN1bHQuYWNjZXNzVG9rZW4pO1xuXG5cdFx0XHRcdFx0XHRcdF9zZXRUb2tlbihyZXN1bHQuYWNjZXNzVG9rZW4pO1xuXG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0Y29uc29sZS5sb2coc2lnbnVwVHJ1ZUZvcm0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCBsb2dpblRydWVGb3JtID0gbG9naW5Gb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF07XG5cdFx0XHRjb25zb2xlLmxvZyhsb2dpblRydWVGb3JtLmVsZW1lbnRzKTtcblxuXHRcdFx0bG9naW5UcnVlRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblxuXHRcdFx0XHQvLyBwcmV2ZW50IGZvcm0gZnJvbSByZWxvYWRpbmcgcGFnZSBhbmQgc2VuZGluZ1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0bGV0IHVzZXJuYW1lVmFsID0gbG9naW5UcnVlRm9ybS5lbGVtZW50c1sndXNlcm5hbWUnXS52YWx1ZTtcblx0XHRcdFx0bGV0IHBhc3NWYWwgPSBsb2dpblRydWVGb3JtLmVsZW1lbnRzWydwYXNzJ10udmFsdWU7XG5cblx0XHRcdFx0aWYodXNlcm5hbWVWYWwgPT09ICcnIHx8IHBhc3NWYWwgPT09ICcnKSB7XG5cdFx0XHRcdFx0YWxlcnQoJ09uZSBvciBtb3JlIGZpZWxkcyBhcmUgZW1wdHknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Ly8gY3JlYXRlIGxvZ2luIG9iamVjdCBiYXNlZCBvbiBmb3JtZGF0YVxuXHRcdFx0XHR2YXIgbG9naW5PYmogPSB7XG5cdFx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lVmFsLFxuXHRcdFx0XHRcdHBhc3M6IHBhc3NWYWwsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bG9naW5Vc2VyKGxvZ2luT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0XHRpZihyZXN1bHQubG9nZ2VkaW4gPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0LmFjY2Vzc1Rva2VuKTtcblxuXHRcdFx0XHRcdFx0X3NldFRva2VuKHJlc3VsdC5hY2Nlc3NUb2tlbik7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFsZXJ0KFwiV3JvbmcgY3JlZGVudGlhbHNcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhsb2dpblRydWVGb3JtKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQWNjb3VudCB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBEYXNoYm9hcmRcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmxldCBidWlsZEFkZE1hdGNoID0gXyA9PiB7XG5cdHJldHVybiBgXG5cdFx0PGRpdiBpZD1cImFkZC1tYXRjaC1mb3JtXCI+XG5cdFx0XHQ8aDE+QWRkIE1hdGNoPC9oMT5cblxuXHRcdFx0PGJ1dHRvbiBpZD1cImJhY2stZGFzaGJvYXJkLWJ0blwiPkJhY2sgdG8gRGFzaGJvYXJkPC9idXR0b24+XG5cblx0XHRcdDxmb3JtIGNsYXNzPVwiYWRkLW1hdGNoLWZvcm1cIiBhY3Rpb249XCJQT1NUXCI+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGl0bGVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGVhbXNcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwic2NvcmVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwid2lubmVyXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImRlc2NyaXB0aW9uXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic3VibWl0LWFkZC1tYXRjaC1idG5cIiB0eXBlPVwic3VibWl0XCI+QWRkIE1hdGNoPC9idXR0b24+XG5cdFx0XHQ8L2Zvcm0+PCEtLSBhZGQtbWF0Y2gtZm9ybSAtLT5cblx0XHQ8L2Rpdj48IS0tIC9hZGQtbWF0Y2gtZm9ybSAtLT5cblx0YFxufVxuXG5sZXQgYnVpbGRNYXRjaFJvdyA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0XHQ8dHIgaWQ9XCJtYXRjaC1yb3ctJHtpbmRleH1cIiBjbGFzcz1cIm1hdGNoLXJvd1wiPlxuXHRcdFx0PHRkIGNsYXNzPVwidGl0bGVcIj4ke21hdGNoLnRpdGxlfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0ZWFtMVwiPiR7bWF0Y2gudGVhbXNbMF19PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cInRlYW0yXCI+JHttYXRjaC50ZWFtc1sxXX08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZWRpdFwiPjxidXR0b24gY2xhc3M9XCJlZGl0LWJ0blwiPkVkaXQ8L2J1dHRvbj48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZGVsZXRlXCI+PGJ1dHRvbiBjbGFzcz1cImRlbGV0ZS1idG5cIj5EZWxldGU8L2J1dHRvbj48L3RkPlxuXHRcdDwvdHI+XG5cdGBcbn1cblxubGV0IGJ1aWxkRGFzaGJvYXJkID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSBgXG5cdFx0PGgxPkRhc2hib2FyZDwvaDE+XG5cblx0XHQ8YnV0dG9uIGlkPVwiYWRkLW1hdGNoLWJ0blwiIGNsYXNzPVwiYWRkLW1hdGNoLWJ0blwiPkFkZCBNYXRjaCArPC9idXR0b24+XG5cblx0XHQ8dGFibGUgaWQ9XCJkYXNoYm9hcmQtdGFibGVcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPlRpdGxlPC90aD5cblx0XHRcdFx0PHRoPlRlYW0gMTwvdGg+XG5cdFx0XHRcdDx0aD5UZWFtIDI8L3RoPlxuXHRcdFx0XHQ8dGg+RWRpdDwvdGg+XG5cdFx0XHRcdDx0aD5EZWxldGU8L3RoPlxuXHRcdFx0PC90cj5cblx0YFxuXHQvLyBmb3IgZWFjaCBtYXRjaCBpbiBtYXRjaGVzIGJ1aWxkIHRoZSByb3dcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnRlbnQgKz0gYnVpbGRNYXRjaFJvdyhtYXRjaGVzW2ldLCBpKTtcblx0fVxuXG5cdGNvbnRlbnQgKz0gYFxuXHRcdDwvdGFibGU+PCEtLSAvZGFzaGJvYXJkLXRhYmxlIC0tPlxuXHRgXG5cdHJldHVybiBjb250ZW50O1xufVxuXG5sZXQgRGFzaGJvYXJkID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0XHRjb25zb2xlLmxvZyhtYXRjaGVzKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwiZGFzaGJvYXJkXCI+XG5cdFx0YDtcblx0XHRcblx0XHRsZXQgZGFzaGJvYXJkID0gYnVpbGREYXNoYm9hcmQobWF0Y2hlcyk7XG5cdFx0Y29udGVudCArPSBkYXNoYm9hcmQgKyBgXG5cdFx0XHRcdDwvZGl2PjwhLS0gL2Rhc2hib2FyZCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IGRhc2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGJvYXJkJyk7XG5cdFx0Y29uc29sZS5sb2coXCJoZWxsbyBwb3N0XCIsIGRhc2gpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEYXNoYm9hcmQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gSG9tZXBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldFJlY2VudE1hdGNoZXMgPSBfID0+IHtcblx0cmVjZW50TWF0Y2hlcyA9IFtcblx0XHR7XG5cdFx0XHRpZDogMSxcblx0XHRcdHRpdGxlOiBcIkNyb2F0aWEgdnMgTWV4aWNvXCIsXG5cdFx0XHR0ZWFtczogW1wiQ3JvYXRpYVwiLCBcIk1leGljb1wiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkNyb2F0aWFcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkNyb2F0aWEgZmFjZXMgTWV4aWNvXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiAyLFxuXHRcdFx0dGl0bGU6IFwiR2VybWFueSB2cyBFbmdsYW5kXCIsXG5cdFx0XHR0ZWFtczogW1wiR2VybWFueVwiLCBcIkVuZ2xhbmRcIl0sXG5cdFx0XHRzY29yZTogWzgsIDNdLFxuXHRcdFx0d2lubmVyOiBcIkVuZ2xhbmRcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkdlcm1hbnkgZmFjZXMgRW5nbGFuZFwiXG5cdFx0fSxcblx0XVxuXG5cdHJldHVybiByZWNlbnRNYXRjaGVzO1xufVxuXG5jb25zdCBnZXRNYXRjaGVzQWpheCA9IF8gPT4ge1xuXG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzJztcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnR0VUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIGJ1aWxkcyB0aGUgaHRtbCBmb3IgYSBmdWxsIHNldCBvZiBtYXRjaCBjYXJkcyBnaXZlbiBhIGxpc3Qgb2YgbWF0Y2ggb2JqZWN0c1xubGV0IGJ1aWxkTWF0Y2hDYXJkU2V0ID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSAnJ1xuXHRmb3IoaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHQvLyBidWlsZCBtYXRjaCBjYXJkcyBpbnRvIGNvbnRlbnRcblx0XHRjb250ZW50ICs9IGJ1aWxkTWF0Y2hDYXJkKG1hdGNoZXNbaV0sIGkpO1xuXHR9XG5cdHJldHVybiBjb250ZW50XG59XG5cbi8vIGZ1bmN0aW9uIHJlY2lldmVzIGEgbWF0Y2ggb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBodG1sIG5lZWRlZCB0byByZW5kZXIgdGhlIG1hdGNoIGNhcmRcbmxldCBidWlsZE1hdGNoQ2FyZCA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0PGRpdiBpZD1cIm1hdGNoLWNhcmQtJHsgaW5kZXggfVwiIGNsYXNzPVwibWF0Y2gtY2FyZFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1jYXJkLWdyYXBoaWNcIj5cblx0XHRcdFxuXHRcdDwvZGl2PjwhLS0gL21hdGNoLWNhcmQtZ3JhcGhpYyAtLT5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXRpdGxlXCI+PGEgaHJlZj1cIiMvbWF0Y2gvJHsgbWF0Y2gubWF0Y2hJRCB9XCI+JHsgbWF0Y2gudGVhbUlEMV9OYW1lICsgJ1xcbnZzLlxcbicgKyBtYXRjaC50ZWFtSUQyX05hbWUgfTwvYT48L2gyPlxuXHRcdDxoMiBjbGFzcz1cIm1hdGNoLWNhcmQtc2NvcmVcIj4keyBtYXRjaC5zY29yZTEgfSAtICR7IG1hdGNoLnNjb3JlMiB9PC9oMj5cblx0XHQ8cD4keyBtYXRjaC5kZXNjcmlwdGlvbiB9PC9wPlxuXHQ8L2Rpdj48IS0tIC9tYXRjaCAtLT5cblx0YFxufVxuXG5sZXQgSG9tZXBhZ2UgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgbWF0Y2hlcztcblxuXHRcdGdldE1hdGNoZXNBamF4KCkuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0bWF0Y2hlcyA9IHJlc3VsdDtcblx0XHR9KTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8aDE+TGl2ZSBGZWVkPC9oMT5cblx0XHRcdFx0PGJyPlxuXG5cdFx0XHRcdDxoMT5SZWNlbnQgTWF0Y2hlczwvaDE+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8ZGl2IGlkPVwicmVjZW50LW1hdGNoZXNcIiBjbGFzcz1cIm1hdGNoZXMgZ3JpZFwiPlxuXHRcdGA7XG5cblx0XHQvLyBidWlsZCBtYXRjaGVzIHNldFxuXHRcdGxldCBtYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChtYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gbWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0PC9kaXY+PCEtLSByZWNlbnQtbWF0Y2hlcyAtLT5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgcmVjZW50IG1hdGNoZXMgc2V0XG5cdFx0Y29udGVudCArPSBgXG5cdFx0XHQ8aDE+U2VhcmNoIE1hdGNoZXM8L2gxPlxuXHRcdFx0XHQ8ZGl2IGlkPVwiaG9tZXBhZ2UtbWF0Y2hlc1wiIGNsYXNzPVwibWF0Y2hlcyBncmlkXCI+XG5cdFx0YDtcblxuXHRcdGxldCByZWNlbnRNYXRjaGVzID0gZ2V0UmVjZW50TWF0Y2hlcygpO1xuXHRcdGxldCByZWNlbnRNYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChyZWNlbnRNYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gcmVjZW50TWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaGVzIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fSxcblxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBIb21lcGFnZSB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBNYXRjaFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuLy8gKioqKioqKioqKioqKioqKioqKipcbi8vIEpRdWVyeSBBSkFYIENhbGxzXG4vLyAqKioqKioqKioqKioqKioqKioqKlxuY29uc3QgZ2V0TWF0Y2hlc0FqYXggPSBfID0+IHtcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzL21hdGNoLycsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgZ2V0TWF0Y2hCeUlkID0gaWQgPT4ge1xuXG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzL21hdGNoLycgKyBpZDtcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnR0VUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygncmVzcG9uc2UgZGF0YTonLCBkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG5jb25zdCBnZXRVcmxRdWVyeSA9IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH1cblxuY29uc3QgbWF0Y2hXaW5uZXIgPSBtYXRjaCA9PiB7XG5cdHJldHVybiBtYXRjaC5zY29yZTEgPiBtYXRjaC5zY29yZTIgPyBtYXRjaC50ZWFtSUQxX05hbWUgOiBtYXRjaC50ZWFtSUQyX05hbWU7XG59XG5cbmxldCBNYXRjaCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBpZCA9IGdldFVybFF1ZXJ5KCkuaWQ7XG5cdFx0bGV0IG1hdGNoO1xuXHRcdGdldE1hdGNoQnlJZChpZCkuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0bWF0Y2ggPSByZXN1bHRbMF07XG5cdFx0fSk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cblx0XHRcdFx0PHU+PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj48L3U+XG5cblx0XHRcdFx0PGRpdiBpZD1cInNpbmdsZS1tYXRjaFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1oZWFkbGluZVwiPlxuXHRcdFx0XHRcdFx0PGgxPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSB9IFZTLiAkeyBtYXRjaC50ZWFtSUQyX05hbWUgfTwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2gtaGVhZGxpbmUgLS0+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtd2lubmVyXCI+XG5cdFx0XHRcdFx0XHQ8aDE+V2lubmVyOiAkeyBtYXRjaFdpbm5lcihtYXRjaCkgfTwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2gtd2lubmVyIC0tPlxuXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLXN0YXRzXCI+XG5cdFx0XHRcdFx0XHQ8aDE+RmluYWwgU2NvcmU6ICR7IG1hdGNoLnNjb3JlMSB9IDogJHttYXRjaC5zY29yZTIgfTwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2gtc3RhdHMgLS0+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGFydGljbGU+XG5cdFx0XHRcdFx0XHQ8aDEgY2xhc3M9XCJtYXRjaC10aXRsZVwiPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSArICdcXG52cy5cXG4nICsgbWF0Y2gudGVhbUlEMl9OYW1lIH08L2gxPlxuXHRcdFx0XHRcdFx0PHA+JHsgbWF0Y2guZGVzY3JpcHRpb24gfTwvcD5cblx0XHRcdFx0XHQ8L2FydGljbGU+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL3NpbmdsZS1tYXRjaCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTWF0Y2ggfTsiLCJjb25zdCBVdGlsaXRpZXMgPSB7XG5cdGdldFVybFF1ZXJ5OiBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9LFxuXG5cdHBhcnNlUXVlcnk6IHF1ZXJ5ID0+IHtcblx0XHRyZXR1cm4gKHF1ZXJ5LnJvdXRlID8gJycgKyBxdWVyeS5yb3V0ZSA6ICcvJykgKyAocXVlcnkuaWQgPyAnLzppZCcgOiAnJyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFV0aWxpdGllcyB9OyJdfQ==
