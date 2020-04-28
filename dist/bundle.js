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
		}

		content += `
								<li><a href="#/account">Signup/Login</a></li>
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

// token
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
		datatype: 'jsonp',
		data: data,
		url: url,
		async: false,
		success: data => {
			console.log(data);
		}
	});
}

const loginUser = data => {

	let url = 'https://footlib-backend.herokuapp.com/login';

	return $.ajax({
		type: 'POST',
		datatype: 'jsonp',
		data: data,
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
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
							<input name="pass" type="text" placeholder="Password">
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
				
				// create login object based on formdata
				var signupObj = {
					username: signupTrueForm.elements['username'].value,
					pass: signupTrueForm.elements['pass'].value,
					email: signupTrueForm.elements['email'].value.toLowerCase(),
				};

				loginUser(signupObj).done(result => {
					console.log(result);
				})

				console.log(signupTrueForm);
			});

			let loginTrueForm = loginForm.getElementsByTagName('form')[0];
			console.log(loginTrueForm.elements);

			loginTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();
				
				// create login object based on formdata
				var loginObj = {
					username: loginTrueForm.elements['username'].value,
					pass: loginTrueForm.elements['pass'].value,
					//email: loginTrueForm.elements['email'].value.toLowerCase(),
				};

				loginUser(loginObj).done(result => {
					console.log(result);
				})

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
			console.log(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgSG9tZXBhZ2UgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvSG9tZXBhZ2UuanMnKTtcbmNvbnN0IHsgQWNjb3VudCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BY2NvdW50LmpzJyk7XG5jb25zdCB7IERhc2hib2FyZCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9EYXNoYm9hcmQuanMnKTtcbmNvbnN0IHsgTWF0Y2ggfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvTWF0Y2guanMnKTtcblxuY29uc3QgeyBOYXZiYXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbmNvbnN0IHsgRm9vdGVyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvRm9vdGVyLmpzJyk7XG5cbmNvbnN0IHsgVXRpbGl0aWVzOiBVdGlsIH0gPSByZXF1aXJlKCcuL2pzL3V0aWxpdGllcy9VdGlsaXRpZXMuanMnKTtcblxuY29uc29sZS5sb2coXCLkvaDlpb3kuJbnlYxcIik7XG5cbmNvbnN0IHJvdXRlcyA9IHtcblx0Jy8nOiBIb21lcGFnZSxcblx0Jy9pbmRleC5odG1sJzogSG9tZXBhZ2UsXG5cdCcvYWNjb3VudCc6IEFjY291bnQsXG5cdCcvZGFzaGJvYXJkJzogRGFzaGJvYXJkLFxuXHQnL21hdGNoLzppZCc6IE1hdGNoLFxufTtcblxuY29uc3QgcnVuQXBwID0gYXN5bmMgXyA9PiB7XG5cblx0Ly8gZmluZCB0aGUgYXBwIGRpdiB0byBhZGQgcGFnZSBjb250ZW50IHRvXG5cdGNvbnN0IGFwcCA9IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRpZihhcHApIHtcblx0XHRsZXQgbmF2ID0gYXBwLmNoaWxkcmVuLm5hdjtcblx0XHRsZXQgZm9vdGVyID0gYXBwLmNoaWxkcmVuLmZvb3Rlcjtcblx0XHRsZXQgY29udGVudCA9IGFwcC5jaGlsZHJlbi5jb250ZW50O1xuXG5cdFx0bmF2LmlubmVySFRNTCA9IGF3YWl0IE5hdmJhci5yZW5kZXIoKTtcblx0XHRmb290ZXIuaW5uZXJIVE1MID0gYXdhaXQgRm9vdGVyLnJlbmRlcigpO1xuXHRcdFxuXHRcdHF1ZXJ5ID0gVXRpbC5nZXRVcmxRdWVyeSgpO1xuXHRcdGNvbnNvbGUubG9nKCdxdWVyeTonLCBxdWVyeSk7XG5cblx0XHRsZXQgcGFyc2VkUXVlcnkgPSBVdGlsLnBhcnNlUXVlcnkocXVlcnkpO1xuXHRcdGNvbnNvbGUubG9nKHBhcnNlZFF1ZXJ5KVxuXG5cdFx0Ly8gZml4IGZvciBmaXJzdCBsb2FkLCBtaWdodCBuZWVkIHRvIGNoYW5nZSBsYXRlclxuXHRcdGlmKCFyb3V0ZXNbcGFyc2VkUXVlcnldKSB7XG5cdFx0XHRxdWVyeS5yb3V0ZSA9ICcvJztcblx0XHR9XG5cblx0XHRsZXQgY3VyclBhZ2UgPSByb3V0ZXNbcGFyc2VkUXVlcnldO1xuXHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gYXdhaXQgY3VyclBhZ2UucmVuZGVyKCk7XG5cdFx0Y3VyclBhZ2UucG9zdFJlbmRlcigpO1xuXG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIlNQQSBFcnJvcjogcm9vdCBlbGVtZW50IGRpdiB3aXRoIGlkICdhcHAnIG5vdCBmb3VuZFwiKTtcblx0fVxufVxuXG5jb25zdCBydW5Qb3N0UGFnZUxvYWQgPSBfID0+IHtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5BcHApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHJ1bkFwcCk7XG5cbnJ1blBvc3RQYWdlTG9hZCgpO1xuXG4vLyBzdGFydCBjb21tYW5kXG4vLyBsaXZlLXNlcnZlciAtLXBvcnQ9ODA4MCAuLyAtLXZlcmJvc2UgLS1zcGFcbi8vIHdhdGNoaWZ5IC4vc3JjL2FwcC5qcyAtbyAuL2Rpc3QvYnVuZGxlLmpzIC1kIC12IiwiLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIEZvb3RlclxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgRm9vdGVyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD4keyB5ZWFyIH0gRm9vdGJhbGwgTGlicmFyeS4gQWxsIHJpZ2h0cyByZXNldmVyZWQuPC9wPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0XHQ8L2Zvb3Rlcj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEZvb3RlciB9IiwiLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIE5hdmJhclxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgX3JlbW92ZVRva2VuID0gXyA9PiB7XG4gICAgLy9jb25zb2xlLmxvZyhcIlJFTU9WRSB0b2tlblwiKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuT2JqJyk7XG59O1xuXG5jb25zdCBfZ2V0VG9rZW4gPSBfID0+IHtcblxuICAgIGxldCBvbmVIb3VyID0gNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAvLyBnZXQgb2JqZWN0LCByZXR1cm4gbnVsbCBpZiBudWxsXG4gICAgdmFyIHRva2VuT2JqID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuT2JqJykpO1xuICAgIC8vY29uc29sZS5sb2coJ3Rva2VuIG9iaicsIHRva2VuT2JqKTtcbiAgICBpZighdG9rZW5PYmopIHJldHVybiBudWxsO1xuICAgIFxuICAgIC8vIGlmIHRva2VuIHRpbWUgaXMgc3RvcmVkIGZvciBtb3JlIHRoYW4gYW4gaG91ciByZW1vdmUgdG9rZW4gYW5kIHJldHVybiBudWxsXG4gICAgdmFyIHRva2VuVGltZSA9IHRva2VuT2JqLnRpbWVzdGFtcDtcbiAgICB2YXIgdGltZU5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIC8vY29uc29sZS5sb2codGltZU5vdyAtIHRva2VuVGltZSk7XG4gICAgaWYodGltZU5vdyAtIHRva2VuVGltZSA+IG9uZUhvdXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIGhlcmUgKGdldCB0b2tlbilcIik7XG4gICAgICAgIF9yZW1vdmVUb2tlbigpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gdG9rZW5cbiAgICByZXR1cm4gdG9rZW5PYmoudG9rZW47XG59O1xuXG5jb25zdCBOYXZiYXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgdG9rZW4gPSBfZ2V0VG9rZW4oKTtcblxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW46XCIsIHRva2VuKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cIm5hdlwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGEgaWQ9XCJuYXYtbG9nb1wiIGhyZWY9XCIjL1wiPjxoMSBjbGFzcz1cIm5hdi10aXRsZVwiPkZPT1RCQUxMIExJQlJBUlk8L2gxPjwvYT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJuYXZiYXItaXRlbXNcIj5cblx0XHRcdFx0XHRcdDxuYXY+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cIm5hdi1saXN0XCI+XG5cdFx0YDtcblxuXHRcdGlmKHRva2VuKSB7XG5cdFx0XHRjb250ZW50ICs9IGBcblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIiMvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9hPjwvbGk+XG5cdFx0XHRgO1xuXHRcdH1cblxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9hY2NvdW50XCI+U2lnbnVwL0xvZ2luPC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8L25hdj5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9uYXZiYXItZGVza3RvcCAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvbmF2IC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gQWNjb3VudFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuLy8gdG9rZW5cbmNvbnN0IF9zZXRUb2tlbiA9IHRva2VuID0+IHtcbiAgICBfcmVtb3ZlVG9rZW4oKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiU0VUIHRva2VuXCIpO1xuICAgIHZhciB0b2tlbk9iaiA9IHtcbiAgICAgICAgdG9rZW46ICdiZWFyZXIgJyArIHRva2VuLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIH07XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbk9iaicsIEpTT04uc3RyaW5naWZ5KHRva2VuT2JqKSk7XG59O1xuXG5jb25zdCBzaWduVXBVc2VyID0gZGF0YSA9PiB7XG5cdFxuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vc2lnbnVwJztcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YTogZGF0YSxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG5jb25zdCBsb2dpblVzZXIgPSBkYXRhID0+IHtcblxuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbG9naW4nO1xuXG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHRkYXRhOiBkYXRhLFxuXHRcdHVybDogdXJsLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5sZXQgQWNjb3VudCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblx0XHRcdFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibG9naW4tc2lnbnVwXCI+XG5cdFx0XHRcdFx0PGgxPkZPT1RCQUxMIExJQlJBUlk8L2gxPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cImxvZ2luLWZvcm1cIiBjbGFzcz1cImhpZGVcIj5cblx0XHRcdFx0XHRcdDxoMj5Mb2dpbjwvaDI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBtZXRob2Q9XCJQT1NUXCIgY2xhc3M9XCJhY2NvdW50LWZvcm1cIj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwicGFzc1wiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkxvZ2luPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+PCEtLSAvYWNjb3VudC1mb3JtIC0tPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gbG9naW4tZm9ybSAtLT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJzaWdudXAtZm9ybVwiPlxuXHRcdFx0XHRcdFx0PGgyPlNpZ251cDwvaDI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBtZXRob2Q9XCJQT1NUXCIgY2xhc3M9XCJhY2NvdW50LWZvcm1cIj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwicGFzc1wiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TaWdudXA8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT48IS0tIC9hY2NvdW50LWZvcm0gLS0+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSBzaWdudXAtZm9ybSAtLT5cblx0XHRcdFx0XHQ8YSBpZD1cImNoYW5nZS1mb3JtLXR5cGVcIiB0eXBlLXZhbHVlPVwiMVwiPjx1PjxwPkxvZ2dpbmcgaW4/PC9wPjwvdT48L2E+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2xvZ2luLXNpZ251cCAtLT5cblx0XHRcdFx0XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bG9naW5Gb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luLWZvcm0nKTtcblx0XHRzaWdudXBGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ251cC1mb3JtJyk7XG5cdFx0Y2hhbmdlRm9ybVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLWZvcm0tdHlwZScpO1xuXG5cdFx0Ly8gY2xpY2sgZXZlbnQgZHluYW1pY2FsbHkgY2hhbmdlcyB0aGUgYWNjb3VudCBmb3JtIGZyb20gc2lnbnVwIHRvIGxvZ2luXG5cdFx0aWYoY2hhbmdlRm9ybVR5cGUgIT09IG51bGwpIHtcblx0XHRcdGNoYW5nZUZvcm1UeXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgXyA9PiB7XG5cdFx0XHRcdHR5cGVWYWx1ZSA9IGNoYW5nZUZvcm1UeXBlLmdldEF0dHJpYnV0ZShcInR5cGUtdmFsdWVcIik7XG5cblx0XHRcdFx0Ly8gaGlkZXMgb3IgdW5oaWRlcyB0aGUgY3VycmVudCBmb3JtXG5cdFx0XHRcdGlmKHR5cGVWYWx1ZSA9PT0gJzAnKSB7XG5cdFx0XHRcdFx0bG9naW5Gb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdFx0XHRzaWdudXBGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIsICcxJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuaW5uZXJUZXh0ID0gXCJMb2dnaW5nIGluP1wiXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bG9naW5Gb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblx0XHRcdFx0XHRzaWdudXBGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIsICcwJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuaW5uZXJUZXh0ID0gXCJTaWduaW5nIHVwP1wiXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgc2lnbnVwVHJ1ZUZvcm0gPSBzaWdudXBGb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF07XG5cdFx0XHRjb25zb2xlLmxvZyhzaWdudXBUcnVlRm9ybS5lbGVtZW50cyk7XG5cblx0XHRcdHNpZ251cFRydWVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXG5cdFx0XHRcdC8vIHByZXZlbnQgZm9ybSBmcm9tIHJlbG9hZGluZyBwYWdlIGFuZCBzZW5kaW5nXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGNyZWF0ZSBsb2dpbiBvYmplY3QgYmFzZWQgb24gZm9ybWRhdGFcblx0XHRcdFx0dmFyIHNpZ251cE9iaiA9IHtcblx0XHRcdFx0XHR1c2VybmFtZTogc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ3VzZXJuYW1lJ10udmFsdWUsXG5cdFx0XHRcdFx0cGFzczogc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ3Bhc3MnXS52YWx1ZSxcblx0XHRcdFx0XHRlbWFpbDogc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ2VtYWlsJ10udmFsdWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRsb2dpblVzZXIoc2lnbnVwT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhzaWdudXBUcnVlRm9ybSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bGV0IGxvZ2luVHJ1ZUZvcm0gPSBsb2dpbkZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Zvcm0nKVswXTtcblx0XHRcdGNvbnNvbGUubG9nKGxvZ2luVHJ1ZUZvcm0uZWxlbWVudHMpO1xuXG5cdFx0XHRsb2dpblRydWVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXG5cdFx0XHRcdC8vIHByZXZlbnQgZm9ybSBmcm9tIHJlbG9hZGluZyBwYWdlIGFuZCBzZW5kaW5nXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGNyZWF0ZSBsb2dpbiBvYmplY3QgYmFzZWQgb24gZm9ybWRhdGFcblx0XHRcdFx0dmFyIGxvZ2luT2JqID0ge1xuXHRcdFx0XHRcdHVzZXJuYW1lOiBsb2dpblRydWVGb3JtLmVsZW1lbnRzWyd1c2VybmFtZSddLnZhbHVlLFxuXHRcdFx0XHRcdHBhc3M6IGxvZ2luVHJ1ZUZvcm0uZWxlbWVudHNbJ3Bhc3MnXS52YWx1ZSxcblx0XHRcdFx0XHQvL2VtYWlsOiBsb2dpblRydWVGb3JtLmVsZW1lbnRzWydlbWFpbCddLnZhbHVlLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bG9naW5Vc2VyKGxvZ2luT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhsb2dpblRydWVGb3JtKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQWNjb3VudCB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBEYXNoYm9hcmRcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmxldCBidWlsZEFkZE1hdGNoID0gXyA9PiB7XG5cdHJldHVybiBgXG5cdFx0PGRpdiBpZD1cImFkZC1tYXRjaC1mb3JtXCI+XG5cdFx0XHQ8aDE+QWRkIE1hdGNoPC9oMT5cblxuXHRcdFx0PGJ1dHRvbiBpZD1cImJhY2stZGFzaGJvYXJkLWJ0blwiPkJhY2sgdG8gRGFzaGJvYXJkPC9idXR0b24+XG5cblx0XHRcdDxmb3JtIGNsYXNzPVwiYWRkLW1hdGNoLWZvcm1cIiBhY3Rpb249XCJQT1NUXCI+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGl0bGVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGVhbXNcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwic2NvcmVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwid2lubmVyXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImRlc2NyaXB0aW9uXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic3VibWl0LWFkZC1tYXRjaC1idG5cIiB0eXBlPVwic3VibWl0XCI+QWRkIE1hdGNoPC9idXR0b24+XG5cdFx0XHQ8L2Zvcm0+PCEtLSBhZGQtbWF0Y2gtZm9ybSAtLT5cblx0XHQ8L2Rpdj48IS0tIC9hZGQtbWF0Y2gtZm9ybSAtLT5cblx0YFxufVxuXG5sZXQgYnVpbGRNYXRjaFJvdyA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0XHQ8dHIgaWQ9XCJtYXRjaC1yb3ctJHtpbmRleH1cIiBjbGFzcz1cIm1hdGNoLXJvd1wiPlxuXHRcdFx0PHRkIGNsYXNzPVwidGl0bGVcIj4ke21hdGNoLnRpdGxlfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0ZWFtMVwiPiR7bWF0Y2gudGVhbXNbMF19PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cInRlYW0yXCI+JHttYXRjaC50ZWFtc1sxXX08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZWRpdFwiPjxidXR0b24gY2xhc3M9XCJlZGl0LWJ0blwiPkVkaXQ8L2J1dHRvbj48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZGVsZXRlXCI+PGJ1dHRvbiBjbGFzcz1cImRlbGV0ZS1idG5cIj5EZWxldGU8L2J1dHRvbj48L3RkPlxuXHRcdDwvdHI+XG5cdGBcbn1cblxubGV0IGJ1aWxkRGFzaGJvYXJkID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSBgXG5cdFx0PGgxPkRhc2hib2FyZDwvaDE+XG5cblx0XHQ8YnV0dG9uIGlkPVwiYWRkLW1hdGNoLWJ0blwiIGNsYXNzPVwiYWRkLW1hdGNoLWJ0blwiPkFkZCBNYXRjaCArPC9idXR0b24+XG5cblx0XHQ8dGFibGUgaWQ9XCJkYXNoYm9hcmQtdGFibGVcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPlRpdGxlPC90aD5cblx0XHRcdFx0PHRoPlRlYW0gMTwvdGg+XG5cdFx0XHRcdDx0aD5UZWFtIDI8L3RoPlxuXHRcdFx0XHQ8dGg+RWRpdDwvdGg+XG5cdFx0XHRcdDx0aD5EZWxldGU8L3RoPlxuXHRcdFx0PC90cj5cblx0YFxuXHQvLyBmb3IgZWFjaCBtYXRjaCBpbiBtYXRjaGVzIGJ1aWxkIHRoZSByb3dcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnRlbnQgKz0gYnVpbGRNYXRjaFJvdyhtYXRjaGVzW2ldLCBpKTtcblx0fVxuXG5cdGNvbnRlbnQgKz0gYFxuXHRcdDwvdGFibGU+PCEtLSAvZGFzaGJvYXJkLXRhYmxlIC0tPlxuXHRgXG5cdHJldHVybiBjb250ZW50O1xufVxuXG5sZXQgRGFzaGJvYXJkID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0XHRjb25zb2xlLmxvZyhtYXRjaGVzKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwiZGFzaGJvYXJkXCI+XG5cdFx0YDtcblx0XHRcblx0XHRsZXQgZGFzaGJvYXJkID0gYnVpbGREYXNoYm9hcmQobWF0Y2hlcyk7XG5cdFx0Y29udGVudCArPSBkYXNoYm9hcmQgKyBgXG5cdFx0XHRcdDwvZGl2PjwhLS0gL2Rhc2hib2FyZCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IGRhc2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGJvYXJkJyk7XG5cdFx0Y29uc29sZS5sb2coXCJoZWxsbyBwb3N0XCIsIGRhc2gpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEYXNoYm9hcmQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gSG9tZXBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldFJlY2VudE1hdGNoZXMgPSBfID0+IHtcblx0cmVjZW50TWF0Y2hlcyA9IFtcblx0XHR7XG5cdFx0XHRpZDogMSxcblx0XHRcdHRpdGxlOiBcIkNyb2F0aWEgdnMgTWV4aWNvXCIsXG5cdFx0XHR0ZWFtczogW1wiQ3JvYXRpYVwiLCBcIk1leGljb1wiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkNyb2F0aWFcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkNyb2F0aWEgZmFjZXMgTWV4aWNvXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiAyLFxuXHRcdFx0dGl0bGU6IFwiR2VybWFueSB2cyBFbmdsYW5kXCIsXG5cdFx0XHR0ZWFtczogW1wiR2VybWFueVwiLCBcIkVuZ2xhbmRcIl0sXG5cdFx0XHRzY29yZTogWzgsIDNdLFxuXHRcdFx0d2lubmVyOiBcIkVuZ2xhbmRcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkdlcm1hbnkgZmFjZXMgRW5nbGFuZFwiXG5cdFx0fSxcblx0XVxuXG5cdHJldHVybiByZWNlbnRNYXRjaGVzO1xufVxuXG5jb25zdCBnZXRNYXRjaGVzQWpheCA9IF8gPT4ge1xuXG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzJztcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnR0VUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBidWlsZHMgdGhlIGh0bWwgZm9yIGEgZnVsbCBzZXQgb2YgbWF0Y2ggY2FyZHMgZ2l2ZW4gYSBsaXN0IG9mIG1hdGNoIG9iamVjdHNcbmxldCBidWlsZE1hdGNoQ2FyZFNldCA9IG1hdGNoZXMgPT4ge1xuXHRjb250ZW50ID0gJydcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2ggY2FyZHMgaW50byBjb250ZW50XG5cdFx0Y29udGVudCArPSBidWlsZE1hdGNoQ2FyZChtYXRjaGVzW2ldLCBpKTtcblx0fVxuXHRyZXR1cm4gY29udGVudFxufVxuXG4vLyBmdW5jdGlvbiByZWNpZXZlcyBhIG1hdGNoIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgaHRtbCBuZWVkZWQgdG8gcmVuZGVyIHRoZSBtYXRjaCBjYXJkXG5sZXQgYnVpbGRNYXRjaENhcmQgPSAobWF0Y2gsIGluZGV4KSA9PiB7XG5cdHJldHVybiBgXG5cdDxkaXYgaWQ9XCJtYXRjaC1jYXJkLSR7IGluZGV4IH1cIiBjbGFzcz1cIm1hdGNoLWNhcmRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtY2FyZC1ncmFwaGljXCI+XG5cdFx0XHRcblx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1jYXJkLWdyYXBoaWMgLS0+XG5cdFx0PGgyIGNsYXNzPVwibWF0Y2gtY2FyZC10aXRsZVwiPjxhIGhyZWY9XCIjL21hdGNoLyR7IG1hdGNoLm1hdGNoSUQgfVwiPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSArICdcXG52cy5cXG4nICsgbWF0Y2gudGVhbUlEMl9OYW1lIH08L2E+PC9oMj5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXNjb3JlXCI+JHsgbWF0Y2guc2NvcmUxIH0gLSAkeyBtYXRjaC5zY29yZTIgfTwvaDI+XG5cdFx0PHA+JHsgbWF0Y2guZGVzY3JpcHRpb24gfTwvcD5cblx0PC9kaXY+PCEtLSAvbWF0Y2ggLS0+XG5cdGBcbn1cblxubGV0IEhvbWVwYWdlID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IG1hdGNoZXM7XG5cblx0XHRnZXRNYXRjaGVzQWpheCgpLmRvbmUocmVzdWx0ID0+IHtcblx0XHRcdG1hdGNoZXMgPSByZXN1bHQ7XG5cdFx0fSk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cblx0XHRcdFx0PGgxPkxpdmUgRmVlZDwvaDE+XG5cdFx0XHRcdDxicj5cblxuXHRcdFx0XHQ8aDE+UmVjZW50IE1hdGNoZXM8L2gxPlxuXHRcdFx0XHRcblx0XHRcdFx0PGRpdiBpZD1cInJlY2VudC1tYXRjaGVzXCIgY2xhc3M9XCJtYXRjaGVzIGdyaWRcIj5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2hlcyBzZXRcblx0XHRsZXQgbWF0Y2hDYXJkU2V0ID0gYnVpbGRNYXRjaENhcmRTZXQobWF0Y2hlcyk7XG5cblx0XHRjb250ZW50ICs9IG1hdGNoQ2FyZFNldCArIGBcblx0XHRcdDwvZGl2PjwhLS0gcmVjZW50LW1hdGNoZXMgLS0+XG5cdFx0YDtcblxuXHRcdC8vIGJ1aWxkIHJlY2VudCBtYXRjaGVzIHNldFxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0PGgxPlNlYXJjaCBNYXRjaGVzPC9oMT5cblx0XHRcdFx0PGRpdiBpZD1cImhvbWVwYWdlLW1hdGNoZXNcIiBjbGFzcz1cIm1hdGNoZXMgZ3JpZFwiPlxuXHRcdGA7XG5cblx0XHRsZXQgcmVjZW50TWF0Y2hlcyA9IGdldFJlY2VudE1hdGNoZXMoKTtcblx0XHRsZXQgcmVjZW50TWF0Y2hDYXJkU2V0ID0gYnVpbGRNYXRjaENhcmRTZXQocmVjZW50TWF0Y2hlcyk7XG5cblx0XHRjb250ZW50ICs9IHJlY2VudE1hdGNoQ2FyZFNldCArIGBcblx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2hlcyAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgSG9tZXBhZ2UgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gTWF0Y2hcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbi8vICoqKioqKioqKioqKioqKioqKioqXG4vLyBKUXVlcnkgQUpBWCBDYWxsc1xuLy8gKioqKioqKioqKioqKioqKioqKipcbmNvbnN0IGdldE1hdGNoZXNBamF4ID0gXyA9PiB7XG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdGRhdGF0eXBlOiAnanNvbnAnLFxuXHRcdHVybDogJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbWF0Y2hlcy9tYXRjaC8nLFxuXHRcdGFzeW5jOiBmYWxzZSxcblx0XHRzdWNjZXNzOiBkYXRhID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdH1cblx0fSk7XG59XG5cbmNvbnN0IGdldE1hdGNoQnlJZCA9IGlkID0+IHtcblxuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbWF0Y2hlcy9tYXRjaC8nICsgaWQ7XG5cblx0cmV0dXJuICQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ3Jlc3BvbnNlIGRhdGE6JywgZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgZ2V0VXJsUXVlcnkgPSBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9XG5cbmNvbnN0IG1hdGNoV2lubmVyID0gbWF0Y2ggPT4ge1xuXHRyZXR1cm4gbWF0Y2guc2NvcmUxID4gbWF0Y2guc2NvcmUyID8gbWF0Y2gudGVhbUlEMV9OYW1lIDogbWF0Y2gudGVhbUlEMl9OYW1lO1xufVxuXG5sZXQgTWF0Y2ggPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgaWQgPSBnZXRVcmxRdWVyeSgpLmlkO1xuXHRcdGxldCBtYXRjaDtcblx0XHRnZXRNYXRjaEJ5SWQoaWQpLmRvbmUocmVzdWx0ID0+IHtcblx0XHRcdG1hdGNoID0gcmVzdWx0WzBdO1xuXHRcdH0pO1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGlkPVwiaW5kZXhcIiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXG5cdFx0XHRcdDx1PjxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+PC91PlxuXG5cdFx0XHRcdDxkaXYgaWQ9XCJzaW5nbGUtbWF0Y2hcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtaGVhZGxpbmVcIj5cblx0XHRcdFx0XHRcdDxoMT4keyBtYXRjaC50ZWFtSUQxX05hbWUgfSBWUy4gJHsgbWF0Y2gudGVhbUlEMl9OYW1lIH08L2gxPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL21hdGNoLWhlYWRsaW5lIC0tPlxuXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLXdpbm5lclwiPlxuXHRcdFx0XHRcdFx0PGgxPldpbm5lcjogJHsgbWF0Y2hXaW5uZXIobWF0Y2gpIH08L2gxPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL21hdGNoLXdpbm5lciAtLT5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1zdGF0c1wiPlxuXHRcdFx0XHRcdFx0PGgxPkZpbmFsIFNjb3JlOiAkeyBtYXRjaC5zY29yZTEgfSA6ICR7bWF0Y2guc2NvcmUyIH08L2gxPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL21hdGNoLXN0YXRzIC0tPlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxhcnRpY2xlPlxuXHRcdFx0XHRcdFx0PGgxIGNsYXNzPVwibWF0Y2gtdGl0bGVcIj4keyBtYXRjaC50ZWFtSUQxX05hbWUgKyAnXFxudnMuXFxuJyArIG1hdGNoLnRlYW1JRDJfTmFtZSB9PC9oMT5cblx0XHRcdFx0XHRcdDxwPiR7IG1hdGNoLmRlc2NyaXB0aW9uIH08L3A+XG5cdFx0XHRcdFx0PC9hcnRpY2xlPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9zaW5nbGUtbWF0Y2ggLS0+XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4ge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IE1hdGNoIH07IiwiY29uc3QgVXRpbGl0aWVzID0ge1xuXHRnZXRVcmxRdWVyeTogXyA9PiB7XG5cdFx0bGV0IHVybCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoJy8nKTtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHRyb3V0ZSBcdDogdXJsWzFdID8gJy8nICsgdXJsWzFdIDogbnVsbCxcblx0XHRcdGlkIFx0XHQ6IHVybFsyXSA/IHVybFsyXSA6IG51bGwsXG5cdFx0fVxuXHRcdHJldHVybiBxdWVyeTtcblx0fSxcblxuXHRwYXJzZVF1ZXJ5OiBxdWVyeSA9PiB7XG5cdFx0cmV0dXJuIChxdWVyeS5yb3V0ZSA/ICcnICsgcXVlcnkucm91dGUgOiAnLycpICsgKHF1ZXJ5LmlkID8gJy86aWQnIDogJycpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBVdGlsaXRpZXMgfTsiXX0=
