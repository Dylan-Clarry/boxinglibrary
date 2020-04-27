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
const Navbar = {
	render: async _ => {

		let content = `
			<div class="nav">
				<div class="container">
					<a id="nav-logo" href="#/"><h1 class="nav-title">FOOTBALL LIBRARY</h1></a>

					<div id="navbar-items">
						<nav>
							<ul class="nav-list">
								<li><a href="#/dashboard">Dashboard</a></li>
								<li><a href="#/account">Account</a></li>
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

let Account = {
	render: async _ => {

		let content = `
			<div id="index" class="container">
				<h2><a href="#/">Back</a></h2>
			
				<div class="login-signup">
					<h1>FOOTBALL LIBRARY</h1>

					<div id="login-form" class="hide">
						<h2>Login</h2>
						<form action="POST" class="account-form">
							<input type="text" placeholder="Username">
							<br>
							<input type="text" placeholder="Password">
							<br>
							<button type="submit">Login</button>
						</form><!-- /account-form -->
					</div><!-- login-form -->

					<div id="signup-form">
						<h2>Signup</h2>
						<form action="POST" class="account-form">
							<input type="text" placeholder="Username">
							<br>
							<input type="text" placeholder="Password">
							<br>
							<input type="text" placeholder="Email">
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
		//may want to add a forgot password and email them theire account info, maybe something to do in the future
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

// This is the current dummy data for testing dynamic loads to pages
// once the serverside has been implemented this will not be needed 
// as match data will be loaded through our serverside as well as the
// API's selected for the project

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

const getMatchesAjax = _ => {
	
	let response = '';

	return $.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: 'https://footlib-backend.herokuapp.com/matches',
		async: false,
		success: data => {
			console.log(data);
		}
	});
}

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

const getMatchById = id => {
	matches = getMatches();
	console.log(matches);

	for(i = 0; i < matches.length; i++) {
		if(id == matches[i].id) {
			return matches[i];
		}
	}
}

const getUrlQuery = _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}

let Match = {
	render: async _ => {

		let id = getUrlQuery().id;
		match = getMatchById(id);

		let content = `
			<div id="index" class="container">

				<u><h2><a href="#/">Back</a></h2></u>

				<div id="single-match">
					<div class="match-headline">
						<h1>${match.teams[0]} VS. ${match.teams[1]}</h1>
					</div><!-- /match-headline -->

					<article>
						<h1 class="match-title">${match.title}</h1>
						<p>${match.description}</p>
					</article>

					<div class="match-winner">
						<h1>Winner: ${match.winner}</h1>
					</div><!-- /match-winner -->

					<div class="match-stats">
						<h1>Final Score: ${match.score[0]} : ${match.score[1]}</h1>
					</div><!-- /match-stats -->

					<div>
						<p>The page may look barren right now but it is loading dynamically with js and will contain more information once the API's are implemented into the backend. Go to index.js and feel free to change the index loaded on this page</p>
					</div>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgSG9tZXBhZ2UgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvSG9tZXBhZ2UuanMnKTtcbmNvbnN0IHsgQWNjb3VudCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BY2NvdW50LmpzJyk7XG5jb25zdCB7IERhc2hib2FyZCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9EYXNoYm9hcmQuanMnKTtcbmNvbnN0IHsgTWF0Y2ggfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvTWF0Y2guanMnKTtcblxuY29uc3QgeyBOYXZiYXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbmNvbnN0IHsgRm9vdGVyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvRm9vdGVyLmpzJyk7XG5cbmNvbnN0IHsgVXRpbGl0aWVzOiBVdGlsIH0gPSByZXF1aXJlKCcuL2pzL3V0aWxpdGllcy9VdGlsaXRpZXMuanMnKTtcblxuY29uc29sZS5sb2coXCLkvaDlpb3kuJbnlYxcIik7XG5cbmNvbnN0IHJvdXRlcyA9IHtcblx0Jy8nOiBIb21lcGFnZSxcblx0Jy9pbmRleC5odG1sJzogSG9tZXBhZ2UsXG5cdCcvYWNjb3VudCc6IEFjY291bnQsXG5cdCcvZGFzaGJvYXJkJzogRGFzaGJvYXJkLFxuXHQnL21hdGNoLzppZCc6IE1hdGNoLFxufTtcblxuY29uc3QgcnVuQXBwID0gYXN5bmMgXyA9PiB7XG5cblx0Ly8gZmluZCB0aGUgYXBwIGRpdiB0byBhZGQgcGFnZSBjb250ZW50IHRvXG5cdGNvbnN0IGFwcCA9IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRpZihhcHApIHtcblx0XHRsZXQgbmF2ID0gYXBwLmNoaWxkcmVuLm5hdjtcblx0XHRsZXQgZm9vdGVyID0gYXBwLmNoaWxkcmVuLmZvb3Rlcjtcblx0XHRsZXQgY29udGVudCA9IGFwcC5jaGlsZHJlbi5jb250ZW50O1xuXG5cdFx0bmF2LmlubmVySFRNTCA9IGF3YWl0IE5hdmJhci5yZW5kZXIoKTtcblx0XHRmb290ZXIuaW5uZXJIVE1MID0gYXdhaXQgRm9vdGVyLnJlbmRlcigpO1xuXHRcdFxuXHRcdHF1ZXJ5ID0gVXRpbC5nZXRVcmxRdWVyeSgpO1xuXHRcdGNvbnNvbGUubG9nKCdxdWVyeTonLCBxdWVyeSk7XG5cblx0XHRsZXQgcGFyc2VkUXVlcnkgPSBVdGlsLnBhcnNlUXVlcnkocXVlcnkpO1xuXHRcdGNvbnNvbGUubG9nKHBhcnNlZFF1ZXJ5KVxuXG5cdFx0Ly8gZml4IGZvciBmaXJzdCBsb2FkLCBtaWdodCBuZWVkIHRvIGNoYW5nZSBsYXRlclxuXHRcdGlmKCFyb3V0ZXNbcGFyc2VkUXVlcnldKSB7XG5cdFx0XHRxdWVyeS5yb3V0ZSA9ICcvJztcblx0XHR9XG5cblx0XHRsZXQgY3VyclBhZ2UgPSByb3V0ZXNbcGFyc2VkUXVlcnldO1xuXHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gYXdhaXQgY3VyclBhZ2UucmVuZGVyKCk7XG5cdFx0Y3VyclBhZ2UucG9zdFJlbmRlcigpO1xuXG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIlNQQSBFcnJvcjogcm9vdCBlbGVtZW50IGRpdiB3aXRoIGlkICdhcHAnIG5vdCBmb3VuZFwiKTtcblx0fVxufVxuXG5jb25zdCBydW5Qb3N0UGFnZUxvYWQgPSBfID0+IHtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5BcHApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHJ1bkFwcCk7XG5cbnJ1blBvc3RQYWdlTG9hZCgpO1xuXG4vLyBzdGFydCBjb21tYW5kXG4vLyBsaXZlLXNlcnZlciAtLXBvcnQ9ODA4MCAuLyAtLXZlcmJvc2UgLS1zcGFcbi8vIHdhdGNoaWZ5IC4vc3JjL2FwcC5qcyAtbyAuL2Rpc3QvYnVuZGxlLmpzIC1kIC12IiwiY29uc3QgRm9vdGVyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD4keyB5ZWFyIH0gRm9vdGJhbGwgTGlicmFyeS4gQWxsIHJpZ2h0cyByZXNldmVyZWQuPC9wPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0XHQ8L2Zvb3Rlcj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEZvb3RlciB9IiwiY29uc3QgTmF2YmFyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibmF2XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8YSBpZD1cIm5hdi1sb2dvXCIgaHJlZj1cIiMvXCI+PGgxIGNsYXNzPVwibmF2LXRpdGxlXCI+Rk9PVEJBTEwgTElCUkFSWTwvaDE+PC9hPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cIm5hdmJhci1pdGVtc1wiPlxuXHRcdFx0XHRcdFx0PG5hdj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibmF2LWxpc3RcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIiMvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPjxhIGhyZWY9XCIjL2FjY291bnRcIj5BY2NvdW50PC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8L25hdj5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9uYXZiYXItZGVza3RvcCAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvbmF2IC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gQWNjb3VudFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxubGV0IEFjY291bnQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLXNpZ251cFwiPlxuXHRcdFx0XHRcdDxoMT5GT09UQkFMTCBMSUJSQVJZPC9oMT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJsb2dpbi1mb3JtXCIgY2xhc3M9XCJoaWRlXCI+XG5cdFx0XHRcdFx0XHQ8aDI+TG9naW48L2gyPlxuXHRcdFx0XHRcdFx0PGZvcm0gYWN0aW9uPVwiUE9TVFwiIGNsYXNzPVwiYWNjb3VudC1mb3JtXCI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+TG9naW48L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT48IS0tIC9hY2NvdW50LWZvcm0gLS0+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSBsb2dpbi1mb3JtIC0tPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cInNpZ251cC1mb3JtXCI+XG5cdFx0XHRcdFx0XHQ8aDI+U2lnbnVwPC9oMj5cblx0XHRcdFx0XHRcdDxmb3JtIGFjdGlvbj1cIlBPU1RcIiBjbGFzcz1cImFjY291bnQtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TaWdudXA8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT48IS0tIC9hY2NvdW50LWZvcm0gLS0+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSBzaWdudXAtZm9ybSAtLT5cblx0XHRcdFx0XHQ8YSBpZD1cImNoYW5nZS1mb3JtLXR5cGVcIiB0eXBlLXZhbHVlPVwiMVwiPjx1PjxwPkxvZ2dpbmcgaW4/PC9wPjwvdT48L2E+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2xvZ2luLXNpZ251cCAtLT5cblx0XHRcdFx0XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bG9naW5Gb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luLWZvcm0nKTtcblx0XHRzaWdudXBGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ251cC1mb3JtJyk7XG5cdFx0Y2hhbmdlRm9ybVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLWZvcm0tdHlwZScpO1xuXHRcdC8vbWF5IHdhbnQgdG8gYWRkIGEgZm9yZ290IHBhc3N3b3JkIGFuZCBlbWFpbCB0aGVtIHRoZWlyZSBhY2NvdW50IGluZm8sIG1heWJlIHNvbWV0aGluZyB0byBkbyBpbiB0aGUgZnV0dXJlXG5cdFx0Ly8gY2xpY2sgZXZlbnQgZHluYW1pY2FsbHkgY2hhbmdlcyB0aGUgYWNjb3VudCBmb3JtIGZyb20gc2lnbnVwIHRvIGxvZ2luXG5cdFx0aWYoY2hhbmdlRm9ybVR5cGUgIT09IG51bGwpIHtcblx0XHRcdGNoYW5nZUZvcm1UeXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgXyA9PiB7XG5cdFx0XHRcdHR5cGVWYWx1ZSA9IGNoYW5nZUZvcm1UeXBlLmdldEF0dHJpYnV0ZShcInR5cGUtdmFsdWVcIik7XG5cblx0XHRcdFx0Ly8gaGlkZXMgb3IgdW5oaWRlcyB0aGUgY3VycmVudCBmb3JtXG5cdFx0XHRcdGlmKHR5cGVWYWx1ZSA9PT0gJzAnKSB7XG5cdFx0XHRcdFx0bG9naW5Gb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdFx0XHRzaWdudXBGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIsICcxJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuaW5uZXJUZXh0ID0gXCJMb2dnaW5nIGluP1wiXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bG9naW5Gb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblx0XHRcdFx0XHRzaWdudXBGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdFx0XHRjaGFuZ2VGb3JtVHlwZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIsICcwJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuaW5uZXJUZXh0ID0gXCJTaWduaW5nIHVwP1wiXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQWNjb3VudCB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBEYXNoYm9hcmRcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmxldCBidWlsZEFkZE1hdGNoID0gXyA9PiB7XG5cdHJldHVybiBgXG5cdFx0PGRpdiBpZD1cImFkZC1tYXRjaC1mb3JtXCI+XG5cdFx0XHQ8aDE+QWRkIE1hdGNoPC9oMT5cblxuXHRcdFx0PGJ1dHRvbiBpZD1cImJhY2stZGFzaGJvYXJkLWJ0blwiPkJhY2sgdG8gRGFzaGJvYXJkPC9idXR0b24+XG5cblx0XHRcdDxmb3JtIGNsYXNzPVwiYWRkLW1hdGNoLWZvcm1cIiBhY3Rpb249XCJQT1NUXCI+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGl0bGVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGVhbXNcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwic2NvcmVcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwid2lubmVyXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImRlc2NyaXB0aW9uXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic3VibWl0LWFkZC1tYXRjaC1idG5cIiB0eXBlPVwic3VibWl0XCI+QWRkIE1hdGNoPC9idXR0b24+XG5cdFx0XHQ8L2Zvcm0+PCEtLSBhZGQtbWF0Y2gtZm9ybSAtLT5cblx0XHQ8L2Rpdj48IS0tIC9hZGQtbWF0Y2gtZm9ybSAtLT5cblx0YFxufVxuXG5sZXQgYnVpbGRNYXRjaFJvdyA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0XHQ8dHIgaWQ9XCJtYXRjaC1yb3ctJHtpbmRleH1cIiBjbGFzcz1cIm1hdGNoLXJvd1wiPlxuXHRcdFx0PHRkIGNsYXNzPVwidGl0bGVcIj4ke21hdGNoLnRpdGxlfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0ZWFtMVwiPiR7bWF0Y2gudGVhbXNbMF19PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cInRlYW0yXCI+JHttYXRjaC50ZWFtc1sxXX08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZWRpdFwiPjxidXR0b24gY2xhc3M9XCJlZGl0LWJ0blwiPkVkaXQ8L2J1dHRvbj48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZGVsZXRlXCI+PGJ1dHRvbiBjbGFzcz1cImRlbGV0ZS1idG5cIj5EZWxldGU8L2J1dHRvbj48L3RkPlxuXHRcdDwvdHI+XG5cdGBcbn1cblxubGV0IGJ1aWxkRGFzaGJvYXJkID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSBgXG5cdFx0PGgxPkRhc2hib2FyZDwvaDE+XG5cblx0XHQ8YnV0dG9uIGlkPVwiYWRkLW1hdGNoLWJ0blwiIGNsYXNzPVwiYWRkLW1hdGNoLWJ0blwiPkFkZCBNYXRjaCArPC9idXR0b24+XG5cblx0XHQ8dGFibGUgaWQ9XCJkYXNoYm9hcmQtdGFibGVcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPlRpdGxlPC90aD5cblx0XHRcdFx0PHRoPlRlYW0gMTwvdGg+XG5cdFx0XHRcdDx0aD5UZWFtIDI8L3RoPlxuXHRcdFx0XHQ8dGg+RWRpdDwvdGg+XG5cdFx0XHRcdDx0aD5EZWxldGU8L3RoPlxuXHRcdFx0PC90cj5cblx0YFxuXHQvLyBmb3IgZWFjaCBtYXRjaCBpbiBtYXRjaGVzIGJ1aWxkIHRoZSByb3dcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnRlbnQgKz0gYnVpbGRNYXRjaFJvdyhtYXRjaGVzW2ldLCBpKTtcblx0fVxuXG5cdGNvbnRlbnQgKz0gYFxuXHRcdDwvdGFibGU+PCEtLSAvZGFzaGJvYXJkLXRhYmxlIC0tPlxuXHRgXG5cdHJldHVybiBjb250ZW50O1xufVxuXG5sZXQgRGFzaGJvYXJkID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0XHRjb25zb2xlLmxvZyhtYXRjaGVzKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwiZGFzaGJvYXJkXCI+XG5cdFx0YDtcblx0XHRcblx0XHRsZXQgZGFzaGJvYXJkID0gYnVpbGREYXNoYm9hcmQobWF0Y2hlcyk7XG5cdFx0Y29udGVudCArPSBkYXNoYm9hcmQgKyBgXG5cdFx0XHRcdDwvZGl2PjwhLS0gL2Rhc2hib2FyZCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IGRhc2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGJvYXJkJyk7XG5cdFx0Y29uc29sZS5sb2coXCJoZWxsbyBwb3N0XCIsIGRhc2gpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEYXNoYm9hcmQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gSG9tZXBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbi8vIFRoaXMgaXMgdGhlIGN1cnJlbnQgZHVtbXkgZGF0YSBmb3IgdGVzdGluZyBkeW5hbWljIGxvYWRzIHRvIHBhZ2VzXG4vLyBvbmNlIHRoZSBzZXJ2ZXJzaWRlIGhhcyBiZWVuIGltcGxlbWVudGVkIHRoaXMgd2lsbCBub3QgYmUgbmVlZGVkIFxuLy8gYXMgbWF0Y2ggZGF0YSB3aWxsIGJlIGxvYWRlZCB0aHJvdWdoIG91ciBzZXJ2ZXJzaWRlIGFzIHdlbGwgYXMgdGhlXG4vLyBBUEkncyBzZWxlY3RlZCBmb3IgdGhlIHByb2plY3RcblxuY29uc3QgZ2V0TWF0Y2hlcyA9IF8gPT4ge1xuXHRtYXRjaGVzID0gW1xuXHRcdHtcdFxuXHRcdFx0aWQ6IDEsXG5cdFx0XHR0aXRsZTogXCJGcmFuY2UgdnMgU3BhaW5cIixcblx0XHRcdHRlYW1zOiBbXCJGcmFuY2VcIiwgXCJTcGFpblwiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkZyYW5jZVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRnJhbmNlIGZhY2VzIFNwYWluLlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMixcblx0XHRcdHRpdGxlOiBcIkl0YWx5IHZzIEJyYXppbFwiLFxuXHRcdFx0dGVhbXM6IFtcIkl0YWx5XCIsIFwiQnJhemlsXCJdLFxuXHRcdFx0c2NvcmU6IFs4LCAzXSxcblx0XHRcdHdpbm5lcjogXCJCcmF6aWxcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkl0YWx5IGZhY2VzIEJyYXppbFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMyxcblx0XHRcdHRpdGxlOiBcIkRlbm1hcmsgdnMgIFJ1c3NpYVwiLFxuXHRcdFx0dGVhbXM6IFtcIkRlbm1hcmtcIiwgXCJSdXNzaWFcIl0sXG5cdFx0XHRzY29yZTogWzMsIDVdLFxuXHRcdFx0d2lubmVyOiBcIkRlbm1hcmtcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRlbm1hcmsgZmFjZXMgUnVzc2lhXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiA0LFxuXHRcdFx0dGl0bGU6IFwiUG9sYW5kIHZzIEJlbGdpdW1cIixcblx0XHRcdHRlYW1zOiBbXCJQb2xhbmRcIiwgXCJCZWxnaXVtXCJdLFxuXHRcdFx0c2NvcmU6IFsxMDEsIDIwXSxcblx0XHRcdHdpbm5lcjogXCJCZWxnaXVtXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJQb2xhbmQgZmFjZXMgQmVsZ2l1bVwiXG5cdFx0fSxcblx0XTtcblxuXHRyZXR1cm4gbWF0Y2hlcztcbn1cblxuY29uc3QgZ2V0TWF0Y2hlc0FqYXggPSBfID0+IHtcblx0XG5cdGxldCByZXNwb25zZSA9ICcnO1xuXG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdGRhdGF0eXBlOiAnanNvbnAnLFxuXHRcdHVybDogJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbWF0Y2hlcycsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgZ2V0UmVjZW50TWF0Y2hlcyA9IF8gPT4ge1xuXHRyZWNlbnRNYXRjaGVzID0gW1xuXHRcdHtcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiQ3JvYXRpYSB2cyBNZXhpY29cIixcblx0XHRcdHRlYW1zOiBbXCJDcm9hdGlhXCIsIFwiTWV4aWNvXCJdLFxuXHRcdFx0c2NvcmU6IFsxMCwgMl0sXG5cdFx0XHR3aW5uZXI6IFwiQ3JvYXRpYVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiQ3JvYXRpYSBmYWNlcyBNZXhpY29cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJHZXJtYW55IHZzIEVuZ2xhbmRcIixcblx0XHRcdHRlYW1zOiBbXCJHZXJtYW55XCIsIFwiRW5nbGFuZFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiRW5nbGFuZFwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiR2VybWFueSBmYWNlcyBFbmdsYW5kXCJcblx0XHR9LFxuXHRdXG5cblx0cmV0dXJuIHJlY2VudE1hdGNoZXM7XG59XG5cbi8vIGJ1aWxkcyB0aGUgaHRtbCBmb3IgYSBmdWxsIHNldCBvZiBtYXRjaCBjYXJkcyBnaXZlbiBhIGxpc3Qgb2YgbWF0Y2ggb2JqZWN0c1xubGV0IGJ1aWxkTWF0Y2hDYXJkU2V0ID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSAnJ1xuXHRmb3IoaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHQvLyBidWlsZCBtYXRjaCBjYXJkcyBpbnRvIGNvbnRlbnRcblx0XHRjb250ZW50ICs9IGJ1aWxkTWF0Y2hDYXJkKG1hdGNoZXNbaV0sIGkpO1xuXHR9XG5cdHJldHVybiBjb250ZW50XG59XG5cbi8vIGZ1bmN0aW9uIHJlY2lldmVzIGEgbWF0Y2ggb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBodG1sIG5lZWRlZCB0byByZW5kZXIgdGhlIG1hdGNoIGNhcmRcbmxldCBidWlsZE1hdGNoQ2FyZCA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0PGRpdiBpZD1cIm1hdGNoLWNhcmQtJHsgaW5kZXggfVwiIGNsYXNzPVwibWF0Y2gtY2FyZFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1jYXJkLWdyYXBoaWNcIj5cblx0XHRcdFxuXHRcdDwvZGl2PjwhLS0gL21hdGNoLWNhcmQtZ3JhcGhpYyAtLT5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXRpdGxlXCI+PGEgaHJlZj1cIiMvbWF0Y2gvJHsgbWF0Y2gubWF0Y2hJRCB9XCI+JHsgbWF0Y2gudGVhbUlEMV9OYW1lICsgJ1xcbnZzLlxcbicgKyBtYXRjaC50ZWFtSUQyX05hbWUgfTwvYT48L2gyPlxuXHRcdDxoMiBjbGFzcz1cIm1hdGNoLWNhcmQtc2NvcmVcIj4keyBtYXRjaC5zY29yZTEgfSAtICR7IG1hdGNoLnNjb3JlMiB9PC9oMj5cblx0XHQ8cD4keyBtYXRjaC5kZXNjcmlwdGlvbiB9PC9wPlxuXHQ8L2Rpdj48IS0tIC9tYXRjaCAtLT5cblx0YFxufVxuXG5sZXQgSG9tZXBhZ2UgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgbWF0Y2hlcztcblxuXHRcdGdldE1hdGNoZXNBamF4KCkuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0bWF0Y2hlcyA9IHJlc3VsdDtcblx0XHR9KTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8aDE+TGl2ZSBGZWVkPC9oMT5cblx0XHRcdFx0PGJyPlxuXG5cdFx0XHRcdDxoMT5SZWNlbnQgTWF0Y2hlczwvaDE+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8ZGl2IGlkPVwicmVjZW50LW1hdGNoZXNcIiBjbGFzcz1cIm1hdGNoZXMgZ3JpZFwiPlxuXHRcdGA7XG5cblx0XHQvLyBidWlsZCBtYXRjaGVzIHNldFxuXHRcdGxldCBtYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChtYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gbWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0PC9kaXY+PCEtLSByZWNlbnQtbWF0Y2hlcyAtLT5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgcmVjZW50IG1hdGNoZXMgc2V0XG5cdFx0Y29udGVudCArPSBgXG5cdFx0XHQ8aDE+U2VhcmNoIE1hdGNoZXM8L2gxPlxuXHRcdFx0XHQ8ZGl2IGlkPVwiaG9tZXBhZ2UtbWF0Y2hlc1wiIGNsYXNzPVwibWF0Y2hlcyBncmlkXCI+XG5cdFx0YDtcblxuXHRcdGxldCByZWNlbnRNYXRjaGVzID0gZ2V0UmVjZW50TWF0Y2hlcygpO1xuXHRcdGxldCByZWNlbnRNYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChyZWNlbnRNYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gcmVjZW50TWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaGVzIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fSxcblxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBIb21lcGFnZSB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBNYXRjaFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgZ2V0TWF0Y2hlcyA9IF8gPT4ge1xuXHRtYXRjaGVzID0gW1xuXHRcdHtcdFxuXHRcdFx0aWQ6IDEsXG5cdFx0XHR0aXRsZTogXCJGcmFuY2UgdnMgU3BhaW5cIixcblx0XHRcdHRlYW1zOiBbXCJGcmFuY2VcIiwgXCJTcGFpblwiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkZyYW5jZVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRnJhbmNlIGZhY2VzIFNwYWluLlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMixcblx0XHRcdHRpdGxlOiBcIkl0YWx5IHZzIEJyYXppbFwiLFxuXHRcdFx0dGVhbXM6IFtcIkl0YWx5XCIsIFwiQnJhemlsXCJdLFxuXHRcdFx0c2NvcmU6IFs4LCAzXSxcblx0XHRcdHdpbm5lcjogXCJCcmF6aWxcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkl0YWx5IGZhY2VzIEJyYXppbFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMyxcblx0XHRcdHRpdGxlOiBcIkRlbm1hcmsgdnMgIFJ1c3NpYVwiLFxuXHRcdFx0dGVhbXM6IFtcIkRlbm1hcmtcIiwgXCJSdXNzaWFcIl0sXG5cdFx0XHRzY29yZTogWzMsIDVdLFxuXHRcdFx0d2lubmVyOiBcIkRlbm1hcmtcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRlbm1hcmsgZmFjZXMgUnVzc2lhXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiA0LFxuXHRcdFx0dGl0bGU6IFwiUG9sYW5kIHZzIEJlbGdpdW1cIixcblx0XHRcdHRlYW1zOiBbXCJQb2xhbmRcIiwgXCJCZWxnaXVtXCJdLFxuXHRcdFx0c2NvcmU6IFsxMDEsIDIwXSxcblx0XHRcdHdpbm5lcjogXCJCZWxnaXVtXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJQb2xhbmQgZmFjZXMgQmVsZ2l1bVwiXG5cdFx0fSxcblx0XTtcblxuXHRyZXR1cm4gbWF0Y2hlcztcbn1cblxuY29uc3QgZ2V0TWF0Y2hCeUlkID0gaWQgPT4ge1xuXHRtYXRjaGVzID0gZ2V0TWF0Y2hlcygpO1xuXHRjb25zb2xlLmxvZyhtYXRjaGVzKTtcblxuXHRmb3IoaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYoaWQgPT0gbWF0Y2hlc1tpXS5pZCkge1xuXHRcdFx0cmV0dXJuIG1hdGNoZXNbaV07XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGdldFVybFF1ZXJ5ID0gXyA9PiB7XG5cdFx0bGV0IHVybCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoJy8nKTtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHRyb3V0ZSBcdDogdXJsWzFdID8gJy8nICsgdXJsWzFdIDogbnVsbCxcblx0XHRcdGlkIFx0XHQ6IHVybFsyXSA/IHVybFsyXSA6IG51bGwsXG5cdFx0fVxuXHRcdHJldHVybiBxdWVyeTtcblx0fVxuXG5sZXQgTWF0Y2ggPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgaWQgPSBnZXRVcmxRdWVyeSgpLmlkO1xuXHRcdG1hdGNoID0gZ2V0TWF0Y2hCeUlkKGlkKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8dT48aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPjwvdT5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwic2luZ2xlLW1hdGNoXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLWhlYWRsaW5lXCI+XG5cdFx0XHRcdFx0XHQ8aDE+JHttYXRjaC50ZWFtc1swXX0gVlMuICR7bWF0Y2gudGVhbXNbMV19PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1oZWFkbGluZSAtLT5cblxuXHRcdFx0XHRcdDxhcnRpY2xlPlxuXHRcdFx0XHRcdFx0PGgxIGNsYXNzPVwibWF0Y2gtdGl0bGVcIj4ke21hdGNoLnRpdGxlfTwvaDE+XG5cdFx0XHRcdFx0XHQ8cD4ke21hdGNoLmRlc2NyaXB0aW9ufTwvcD5cblx0XHRcdFx0XHQ8L2FydGljbGU+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtd2lubmVyXCI+XG5cdFx0XHRcdFx0XHQ8aDE+V2lubmVyOiAke21hdGNoLndpbm5lcn08L2gxPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL21hdGNoLXdpbm5lciAtLT5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1zdGF0c1wiPlxuXHRcdFx0XHRcdFx0PGgxPkZpbmFsIFNjb3JlOiAke21hdGNoLnNjb3JlWzBdfSA6ICR7bWF0Y2guc2NvcmVbMV19PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1zdGF0cyAtLT5cblxuXHRcdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0XHQ8cD5UaGUgcGFnZSBtYXkgbG9vayBiYXJyZW4gcmlnaHQgbm93IGJ1dCBpdCBpcyBsb2FkaW5nIGR5bmFtaWNhbGx5IHdpdGgganMgYW5kIHdpbGwgY29udGFpbiBtb3JlIGluZm9ybWF0aW9uIG9uY2UgdGhlIEFQSSdzIGFyZSBpbXBsZW1lbnRlZCBpbnRvIHRoZSBiYWNrZW5kLiBHbyB0byBpbmRleC5qcyBhbmQgZmVlbCBmcmVlIHRvIGNoYW5nZSB0aGUgaW5kZXggbG9hZGVkIG9uIHRoaXMgcGFnZTwvcD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+PCEtLSAvc2luZ2xlLW1hdGNoIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fSxcblxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBNYXRjaCB9OyIsImNvbnN0IFV0aWxpdGllcyA9IHtcblx0Z2V0VXJsUXVlcnk6IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH0sXG5cblx0cGFyc2VRdWVyeTogcXVlcnkgPT4ge1xuXHRcdHJldHVybiAocXVlcnkucm91dGUgPyAnJyArIHF1ZXJ5LnJvdXRlIDogJy8nKSArIChxdWVyeS5pZCA/ICcvOmlkJyA6ICcnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgVXRpbGl0aWVzIH07Il19
