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
		<h2 class="match-card-title"><a href="#/match/${ match.id }">${ match.title }</a></h2>
		<h2 class="match-card-score">${ match.score[0] } - ${ match.score[1] }</h2>
		<p>${ match.description }</p>
	</div><!-- /match -->
	`
}

let Homepage = {
	render: async _ => {

		let content = `
			<div id="index" class="container">

				<h1>Live Feed</h1>
				<br>

				<h1>Recent Matches</h1>
				
				<div id="recent-matches" class="matches grid">
		`;

		// build matches set
		let matches = getMatches();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgSG9tZXBhZ2UgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvSG9tZXBhZ2UuanMnKTtcbmNvbnN0IHsgQWNjb3VudCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BY2NvdW50LmpzJyk7XG5jb25zdCB7IERhc2hib2FyZCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9EYXNoYm9hcmQuanMnKTtcbmNvbnN0IHsgTWF0Y2ggfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvTWF0Y2guanMnKTtcblxuY29uc3QgeyBOYXZiYXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbmNvbnN0IHsgRm9vdGVyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvRm9vdGVyLmpzJyk7XG5cbmNvbnN0IHsgVXRpbGl0aWVzOiBVdGlsIH0gPSByZXF1aXJlKCcuL2pzL3V0aWxpdGllcy9VdGlsaXRpZXMuanMnKTtcblxuY29uc29sZS5sb2coXCLkvaDlpb3kuJbnlYxcIik7XG5cbmNvbnN0IHJvdXRlcyA9IHtcblx0Jy8nOiBIb21lcGFnZSxcblx0Jy9pbmRleC5odG1sJzogSG9tZXBhZ2UsXG5cdCcvYWNjb3VudCc6IEFjY291bnQsXG5cdCcvZGFzaGJvYXJkJzogRGFzaGJvYXJkLFxuXHQnL21hdGNoLzppZCc6IE1hdGNoLFxufTtcblxuY29uc3QgcnVuQXBwID0gYXN5bmMgXyA9PiB7XG5cblx0Ly8gZmluZCB0aGUgYXBwIGRpdiB0byBhZGQgcGFnZSBjb250ZW50IHRvXG5cdGNvbnN0IGFwcCA9IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRpZihhcHApIHtcblx0XHRsZXQgbmF2ID0gYXBwLmNoaWxkcmVuLm5hdjtcblx0XHRsZXQgZm9vdGVyID0gYXBwLmNoaWxkcmVuLmZvb3Rlcjtcblx0XHRsZXQgY29udGVudCA9IGFwcC5jaGlsZHJlbi5jb250ZW50O1xuXG5cdFx0bmF2LmlubmVySFRNTCA9IGF3YWl0IE5hdmJhci5yZW5kZXIoKTtcblx0XHRmb290ZXIuaW5uZXJIVE1MID0gYXdhaXQgRm9vdGVyLnJlbmRlcigpO1xuXHRcdFxuXHRcdHF1ZXJ5ID0gVXRpbC5nZXRVcmxRdWVyeSgpO1xuXHRcdGNvbnNvbGUubG9nKCdxdWVyeTonLCBxdWVyeSk7XG5cblx0XHRsZXQgcGFyc2VkUXVlcnkgPSBVdGlsLnBhcnNlUXVlcnkocXVlcnkpO1xuXHRcdGNvbnNvbGUubG9nKHBhcnNlZFF1ZXJ5KVxuXG5cdFx0Ly8gZml4IGZvciBmaXJzdCBsb2FkLCBtaWdodCBuZWVkIHRvIGNoYW5nZSBsYXRlclxuXHRcdGlmKCFyb3V0ZXNbcGFyc2VkUXVlcnldKSB7XG5cdFx0XHRxdWVyeS5yb3V0ZSA9ICcvJztcblx0XHR9XG5cblx0XHRsZXQgY3VyclBhZ2UgPSByb3V0ZXNbcGFyc2VkUXVlcnldO1xuXHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gYXdhaXQgY3VyclBhZ2UucmVuZGVyKCk7XG5cdFx0Y3VyclBhZ2UucG9zdFJlbmRlcigpO1xuXG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIlNQQSBFcnJvcjogcm9vdCBlbGVtZW50IGRpdiB3aXRoIGlkICdhcHAnIG5vdCBmb3VuZFwiKTtcblx0fVxufVxuXG5jb25zdCBydW5Qb3N0UGFnZUxvYWQgPSBfID0+IHtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5BcHApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHJ1bkFwcCk7XG5cbnJ1blBvc3RQYWdlTG9hZCgpO1xuXG4vLyBzdGFydCBjb21tYW5kXG4vLyBsaXZlLXNlcnZlciAtLXBvcnQ9ODA4MCAuLyAtLXZlcmJvc2UgLS1zcGFcbi8vIHdhdGNoaWZ5IC4vc3JjL2FwcC5qcyAtbyAuL2Rpc3QvYnVuZGxlLmpzIC1kIC12IiwiY29uc3QgRm9vdGVyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD4keyB5ZWFyIH0gRm9vdGJhbGwgTGlicmFyeS4gQWxsIHJpZ2h0cyByZXNldmVyZWQuPC9wPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0XHQ8L2Zvb3Rlcj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEZvb3RlciB9IiwiY29uc3QgTmF2YmFyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibmF2XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8YSBpZD1cIm5hdi1sb2dvXCIgaHJlZj1cIiMvXCI+PGgxIGNsYXNzPVwibmF2LXRpdGxlXCI+Rk9PVEJBTEwgTElCUkFSWTwvaDE+PC9hPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cIm5hdmJhci1pdGVtc1wiPlxuXHRcdFx0XHRcdFx0PG5hdj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibmF2LWxpc3RcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIiMvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPjxhIGhyZWY9XCIjL2FjY291bnRcIj5BY2NvdW50PC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8L25hdj5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9uYXZiYXItZGVza3RvcCAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvbmF2IC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gQWNjb3VudFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxubGV0IEFjY291bnQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLXNpZ251cFwiPlxuXHRcdFx0XHRcdDxoMT5GT09UQkFMTCBMSUJSQVJZPC9oMT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJsb2dpbi1mb3JtXCIgY2xhc3M9XCJoaWRlXCI+XG5cdFx0XHRcdFx0XHQ8aDI+TG9naW48L2gyPlxuXHRcdFx0XHRcdFx0PGZvcm0gYWN0aW9uPVwiUE9TVFwiIGNsYXNzPVwiYWNjb3VudC1mb3JtXCI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+TG9naW48L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT48IS0tIC9hY2NvdW50LWZvcm0gLS0+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSBsb2dpbi1mb3JtIC0tPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cInNpZ251cC1mb3JtXCI+XG5cdFx0XHRcdFx0XHQ8aDI+U2lnbnVwPC9oMj5cblx0XHRcdFx0XHRcdDxmb3JtIGFjdGlvbj1cIlBPU1RcIiBjbGFzcz1cImFjY291bnQtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TaWdudXA8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT48IS0tIC9hY2NvdW50LWZvcm0gLS0+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSBzaWdudXAtZm9ybSAtLT5cblx0XHRcdFx0XHQ8YSBpZD1cImNoYW5nZS1mb3JtLXR5cGVcIiB0eXBlLXZhbHVlPVwiMVwiPjx1PjxwPkxvZ2dpbmcgaW4/PC9wPjwvdT48L2E+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2xvZ2luLXNpZ251cCAtLT5cblx0XHRcdFx0XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4ge1xuXHRcdGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbi1mb3JtJyk7XG5cdFx0c2lnbnVwRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWdudXAtZm9ybScpO1xuXHRcdGNoYW5nZUZvcm1UeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYW5nZS1mb3JtLXR5cGUnKTtcblx0XHQvL21heSB3YW50IHRvIGFkZCBhIGZvcmdvdCBwYXNzd29yZCBhbmQgZW1haWwgdGhlbSB0aGVpcmUgYWNjb3VudCBpbmZvLCBtYXliZSBzb21ldGhpbmcgdG8gZG8gaW4gdGhlIGZ1dHVyZVxuXHRcdC8vIGNsaWNrIGV2ZW50IGR5bmFtaWNhbGx5IGNoYW5nZXMgdGhlIGFjY291bnQgZm9ybSBmcm9tIHNpZ251cCB0byBsb2dpblxuXHRcdGlmKGNoYW5nZUZvcm1UeXBlICE9PSBudWxsKSB7XG5cdFx0XHRjaGFuZ2VGb3JtVHlwZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF8gPT4ge1xuXHRcdFx0XHR0eXBlVmFsdWUgPSBjaGFuZ2VGb3JtVHlwZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIpO1xuXG5cdFx0XHRcdC8vIGhpZGVzIG9yIHVuaGlkZXMgdGhlIGN1cnJlbnQgZm9ybVxuXHRcdFx0XHRpZih0eXBlVmFsdWUgPT09ICcwJykge1xuXHRcdFx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cdFx0XHRcdFx0c2lnbnVwRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuc2V0QXR0cmlidXRlKFwidHlwZS12YWx1ZVwiLCAnMScpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLmlubmVyVGV4dCA9IFwiTG9nZ2luZyBpbj9cIlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cdFx0XHRcdFx0c2lnbnVwRm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuc2V0QXR0cmlidXRlKFwidHlwZS12YWx1ZVwiLCAnMCcpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLmlubmVyVGV4dCA9IFwiU2lnbmluZyB1cD9cIlxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEFjY291bnQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gRGFzaGJvYXJkXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBnZXRNYXRjaGVzID0gXyA9PiB7XG5cdG1hdGNoZXMgPSBbXG5cdFx0e1x0XG5cdFx0XHRpZDogMSxcblx0XHRcdHRpdGxlOiBcIkZyYW5jZSB2cyBTcGFpblwiLFxuXHRcdFx0dGVhbXM6IFtcIkZyYW5jZVwiLCBcIlNwYWluXCJdLFxuXHRcdFx0c2NvcmU6IFsxMCwgMl0sXG5cdFx0XHR3aW5uZXI6IFwiRnJhbmNlXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJGcmFuY2UgZmFjZXMgU3BhaW4uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiAyLFxuXHRcdFx0dGl0bGU6IFwiSXRhbHkgdnMgQnJhemlsXCIsXG5cdFx0XHR0ZWFtczogW1wiSXRhbHlcIiwgXCJCcmF6aWxcIl0sXG5cdFx0XHRzY29yZTogWzgsIDNdLFxuXHRcdFx0d2lubmVyOiBcIkJyYXppbFwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiSXRhbHkgZmFjZXMgQnJhemlsXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiAzLFxuXHRcdFx0dGl0bGU6IFwiRGVubWFyayB2cyAgUnVzc2lhXCIsXG5cdFx0XHR0ZWFtczogW1wiRGVubWFya1wiLCBcIlJ1c3NpYVwiXSxcblx0XHRcdHNjb3JlOiBbMywgNV0sXG5cdFx0XHR3aW5uZXI6IFwiRGVubWFya1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRGVubWFyayBmYWNlcyBSdXNzaWFcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDQsXG5cdFx0XHR0aXRsZTogXCJQb2xhbmQgdnMgQmVsZ2l1bVwiLFxuXHRcdFx0dGVhbXM6IFtcIlBvbGFuZFwiLCBcIkJlbGdpdW1cIl0sXG5cdFx0XHRzY29yZTogWzEwMSwgMjBdLFxuXHRcdFx0d2lubmVyOiBcIkJlbGdpdW1cIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlBvbGFuZCBmYWNlcyBCZWxnaXVtXCJcblx0XHR9LFxuXHRdO1xuXG5cdHJldHVybiBtYXRjaGVzO1xufVxuXG5sZXQgYnVpbGRBZGRNYXRjaCA9IF8gPT4ge1xuXHRyZXR1cm4gYFxuXHRcdDxkaXYgaWQ9XCJhZGQtbWF0Y2gtZm9ybVwiPlxuXHRcdFx0PGgxPkFkZCBNYXRjaDwvaDE+XG5cblx0XHRcdDxidXR0b24gaWQ9XCJiYWNrLWRhc2hib2FyZC1idG5cIj5CYWNrIHRvIERhc2hib2FyZDwvYnV0dG9uPlxuXG5cdFx0XHQ8Zm9ybSBjbGFzcz1cImFkZC1tYXRjaC1mb3JtXCIgYWN0aW9uPVwiUE9TVFwiPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRpdGxlXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRlYW1zXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cInNjb3JlXCI+XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIndpbm5lclwiPlxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJkZXNjcmlwdGlvblwiPlxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInN1Ym1pdC1hZGQtbWF0Y2gtYnRuXCIgdHlwZT1cInN1Ym1pdFwiPkFkZCBNYXRjaDwvYnV0dG9uPlxuXHRcdFx0PC9mb3JtPjwhLS0gYWRkLW1hdGNoLWZvcm0gLS0+XG5cdFx0PC9kaXY+PCEtLSAvYWRkLW1hdGNoLWZvcm0gLS0+XG5cdGBcbn1cblxubGV0IGJ1aWxkTWF0Y2hSb3cgPSAobWF0Y2gsIGluZGV4KSA9PiB7XG5cdHJldHVybiBgXG5cdFx0PHRyIGlkPVwibWF0Y2gtcm93LSR7aW5kZXh9XCIgY2xhc3M9XCJtYXRjaC1yb3dcIj5cblx0XHRcdDx0ZCBjbGFzcz1cInRpdGxlXCI+JHttYXRjaC50aXRsZX08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwidGVhbTFcIj4ke21hdGNoLnRlYW1zWzBdfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0ZWFtMlwiPiR7bWF0Y2gudGVhbXNbMV19PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImVkaXRcIj48YnV0dG9uIGNsYXNzPVwiZWRpdC1idG5cIj5FZGl0PC9idXR0b24+PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cImRlbGV0ZVwiPjxidXR0b24gY2xhc3M9XCJkZWxldGUtYnRuXCI+RGVsZXRlPC9idXR0b24+PC90ZD5cblx0XHQ8L3RyPlxuXHRgXG59XG5cbmxldCBidWlsZERhc2hib2FyZCA9IG1hdGNoZXMgPT4ge1xuXHRjb250ZW50ID0gYFxuXHRcdDxoMT5EYXNoYm9hcmQ8L2gxPlxuXG5cdFx0PGJ1dHRvbiBpZD1cImFkZC1tYXRjaC1idG5cIiBjbGFzcz1cImFkZC1tYXRjaC1idG5cIj5BZGQgTWF0Y2ggKzwvYnV0dG9uPlxuXG5cdFx0PHRhYmxlIGlkPVwiZGFzaGJvYXJkLXRhYmxlXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0aD5UaXRsZTwvdGg+XG5cdFx0XHRcdDx0aD5UZWFtIDE8L3RoPlxuXHRcdFx0XHQ8dGg+VGVhbSAyPC90aD5cblx0XHRcdFx0PHRoPkVkaXQ8L3RoPlxuXHRcdFx0XHQ8dGg+RGVsZXRlPC90aD5cblx0XHRcdDwvdHI+XG5cdGBcblx0Ly8gZm9yIGVhY2ggbWF0Y2ggaW4gbWF0Y2hlcyBidWlsZCB0aGUgcm93XG5cdGZvcihpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb250ZW50ICs9IGJ1aWxkTWF0Y2hSb3cobWF0Y2hlc1tpXSwgaSk7XG5cdH1cblxuXHRjb250ZW50ICs9IGBcblx0XHQ8L3RhYmxlPjwhLS0gL2Rhc2hib2FyZC10YWJsZSAtLT5cblx0YFxuXHRyZXR1cm4gY29udGVudDtcbn1cblxubGV0IERhc2hib2FyZCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdG1hdGNoZXMgPSBnZXRNYXRjaGVzKCk7XG5cdFx0Y29uc29sZS5sb2cobWF0Y2hlcyk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cblx0XHRcdFx0PGRpdiBpZD1cImRhc2hib2FyZFwiPlxuXHRcdGA7XG5cdFx0XG5cdFx0bGV0IGRhc2hib2FyZCA9IGJ1aWxkRGFzaGJvYXJkKG1hdGNoZXMpO1xuXHRcdGNvbnRlbnQgKz0gZGFzaGJvYXJkICsgYFxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9kYXNoYm9hcmQgLS0+XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4ge1xuXHRcdGxldCBkYXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rhc2hib2FyZCcpO1xuXHRcdGNvbnNvbGUubG9nKFwiaGVsbG8gcG9zdFwiLCBkYXNoKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgRGFzaGJvYXJkIH07IiwiLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIEhvbWVwYWdlXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG4vLyBUaGlzIGlzIHRoZSBjdXJyZW50IGR1bW15IGRhdGEgZm9yIHRlc3RpbmcgZHluYW1pYyBsb2FkcyB0byBwYWdlc1xuLy8gb25jZSB0aGUgc2VydmVyc2lkZSBoYXMgYmVlbiBpbXBsZW1lbnRlZCB0aGlzIHdpbGwgbm90IGJlIG5lZWRlZCBcbi8vIGFzIG1hdGNoIGRhdGEgd2lsbCBiZSBsb2FkZWQgdGhyb3VnaCBvdXIgc2VydmVyc2lkZSBhcyB3ZWxsIGFzIHRoZVxuLy8gQVBJJ3Mgc2VsZWN0ZWQgZm9yIHRoZSBwcm9qZWN0XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmNvbnN0IGdldFJlY2VudE1hdGNoZXMgPSBfID0+IHtcblx0cmVjZW50TWF0Y2hlcyA9IFtcblx0XHR7XG5cdFx0XHRpZDogMSxcblx0XHRcdHRpdGxlOiBcIkNyb2F0aWEgdnMgTWV4aWNvXCIsXG5cdFx0XHR0ZWFtczogW1wiQ3JvYXRpYVwiLCBcIk1leGljb1wiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkNyb2F0aWFcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkNyb2F0aWEgZmFjZXMgTWV4aWNvXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiAyLFxuXHRcdFx0dGl0bGU6IFwiR2VybWFueSB2cyBFbmdsYW5kXCIsXG5cdFx0XHR0ZWFtczogW1wiR2VybWFueVwiLCBcIkVuZ2xhbmRcIl0sXG5cdFx0XHRzY29yZTogWzgsIDNdLFxuXHRcdFx0d2lubmVyOiBcIkVuZ2xhbmRcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkdlcm1hbnkgZmFjZXMgRW5nbGFuZFwiXG5cdFx0fSxcblx0XVxuXG5cdHJldHVybiByZWNlbnRNYXRjaGVzO1xufVxuXG4vLyBidWlsZHMgdGhlIGh0bWwgZm9yIGEgZnVsbCBzZXQgb2YgbWF0Y2ggY2FyZHMgZ2l2ZW4gYSBsaXN0IG9mIG1hdGNoIG9iamVjdHNcbmxldCBidWlsZE1hdGNoQ2FyZFNldCA9IG1hdGNoZXMgPT4ge1xuXHRjb250ZW50ID0gJydcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2ggY2FyZHMgaW50byBjb250ZW50XG5cdFx0Y29udGVudCArPSBidWlsZE1hdGNoQ2FyZChtYXRjaGVzW2ldLCBpKTtcblx0fVxuXHRyZXR1cm4gY29udGVudFxufVxuXG4vLyBmdW5jdGlvbiByZWNpZXZlcyBhIG1hdGNoIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgaHRtbCBuZWVkZWQgdG8gcmVuZGVyIHRoZSBtYXRjaCBjYXJkXG5sZXQgYnVpbGRNYXRjaENhcmQgPSAobWF0Y2gsIGluZGV4KSA9PiB7XG5cdHJldHVybiBgXG5cdDxkaXYgaWQ9XCJtYXRjaC1jYXJkLSR7IGluZGV4IH1cIiBjbGFzcz1cIm1hdGNoLWNhcmRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtY2FyZC1ncmFwaGljXCI+XG5cdFx0XHRcblx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1jYXJkLWdyYXBoaWMgLS0+XG5cdFx0PGgyIGNsYXNzPVwibWF0Y2gtY2FyZC10aXRsZVwiPjxhIGhyZWY9XCIjL21hdGNoLyR7IG1hdGNoLmlkIH1cIj4keyBtYXRjaC50aXRsZSB9PC9hPjwvaDI+XG5cdFx0PGgyIGNsYXNzPVwibWF0Y2gtY2FyZC1zY29yZVwiPiR7IG1hdGNoLnNjb3JlWzBdIH0gLSAkeyBtYXRjaC5zY29yZVsxXSB9PC9oMj5cblx0XHQ8cD4keyBtYXRjaC5kZXNjcmlwdGlvbiB9PC9wPlxuXHQ8L2Rpdj48IS0tIC9tYXRjaCAtLT5cblx0YFxufVxuXG5sZXQgSG9tZXBhZ2UgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cblx0XHRcdFx0PGgxPkxpdmUgRmVlZDwvaDE+XG5cdFx0XHRcdDxicj5cblxuXHRcdFx0XHQ8aDE+UmVjZW50IE1hdGNoZXM8L2gxPlxuXHRcdFx0XHRcblx0XHRcdFx0PGRpdiBpZD1cInJlY2VudC1tYXRjaGVzXCIgY2xhc3M9XCJtYXRjaGVzIGdyaWRcIj5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2hlcyBzZXRcblx0XHRsZXQgbWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0XHRsZXQgbWF0Y2hDYXJkU2V0ID0gYnVpbGRNYXRjaENhcmRTZXQobWF0Y2hlcyk7XG5cblx0XHRjb250ZW50ICs9IG1hdGNoQ2FyZFNldCArIGBcblx0XHRcdDwvZGl2PjwhLS0gcmVjZW50LW1hdGNoZXMgLS0+XG5cdFx0YDtcblxuXHRcdC8vIGJ1aWxkIHJlY2VudCBtYXRjaGVzIHNldFxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0PGgxPlNlYXJjaCBNYXRjaGVzPC9oMT5cblx0XHRcdFx0PGRpdiBpZD1cImhvbWVwYWdlLW1hdGNoZXNcIiBjbGFzcz1cIm1hdGNoZXMgZ3JpZFwiPlxuXHRcdGA7XG5cblx0XHRsZXQgcmVjZW50TWF0Y2hlcyA9IGdldFJlY2VudE1hdGNoZXMoKTtcblx0XHRsZXQgcmVjZW50TWF0Y2hDYXJkU2V0ID0gYnVpbGRNYXRjaENhcmRTZXQocmVjZW50TWF0Y2hlcyk7XG5cblx0XHRjb250ZW50ICs9IHJlY2VudE1hdGNoQ2FyZFNldCArIGBcblx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2hlcyAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgSG9tZXBhZ2UgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gTWF0Y2hcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmNvbnN0IGdldE1hdGNoQnlJZCA9IGlkID0+IHtcblx0bWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0Y29uc29sZS5sb2cobWF0Y2hlcyk7XG5cblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmKGlkID09IG1hdGNoZXNbaV0uaWQpIHtcblx0XHRcdHJldHVybiBtYXRjaGVzW2ldO1xuXHRcdH1cblx0fVxufVxuXG5jb25zdCBnZXRVcmxRdWVyeSA9IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH1cblxubGV0IE1hdGNoID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGlkID0gZ2V0VXJsUXVlcnkoKS5pZDtcblx0XHRtYXRjaCA9IGdldE1hdGNoQnlJZChpZCk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgaWQ9XCJpbmRleFwiIGNsYXNzPVwiY29udGFpbmVyXCI+XG5cblx0XHRcdFx0PHU+PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj48L3U+XG5cblx0XHRcdFx0PGRpdiBpZD1cInNpbmdsZS1tYXRjaFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1oZWFkbGluZVwiPlxuXHRcdFx0XHRcdFx0PGgxPiR7bWF0Y2gudGVhbXNbMF19IFZTLiAke21hdGNoLnRlYW1zWzFdfTwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2gtaGVhZGxpbmUgLS0+XG5cblx0XHRcdFx0XHQ8YXJ0aWNsZT5cblx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm1hdGNoLXRpdGxlXCI+JHttYXRjaC50aXRsZX08L2gxPlxuXHRcdFx0XHRcdFx0PHA+JHttYXRjaC5kZXNjcmlwdGlvbn08L3A+XG5cdFx0XHRcdFx0PC9hcnRpY2xlPlxuXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLXdpbm5lclwiPlxuXHRcdFx0XHRcdFx0PGgxPldpbm5lcjogJHttYXRjaC53aW5uZXJ9PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC13aW5uZXIgLS0+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtc3RhdHNcIj5cblx0XHRcdFx0XHRcdDxoMT5GaW5hbCBTY29yZTogJHttYXRjaC5zY29yZVswXX0gOiAke21hdGNoLnNjb3JlWzFdfTwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbWF0Y2gtc3RhdHMgLS0+XG5cblx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0PHA+VGhlIHBhZ2UgbWF5IGxvb2sgYmFycmVuIHJpZ2h0IG5vdyBidXQgaXQgaXMgbG9hZGluZyBkeW5hbWljYWxseSB3aXRoIGpzIGFuZCB3aWxsIGNvbnRhaW4gbW9yZSBpbmZvcm1hdGlvbiBvbmNlIHRoZSBBUEkncyBhcmUgaW1wbGVtZW50ZWQgaW50byB0aGUgYmFja2VuZC4gR28gdG8gaW5kZXguanMgYW5kIGZlZWwgZnJlZSB0byBjaGFuZ2UgdGhlIGluZGV4IGxvYWRlZCBvbiB0aGlzIHBhZ2U8L3A+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL3NpbmdsZS1tYXRjaCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTWF0Y2ggfTsiLCJjb25zdCBVdGlsaXRpZXMgPSB7XG5cdGdldFVybFF1ZXJ5OiBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9LFxuXG5cdHBhcnNlUXVlcnk6IHF1ZXJ5ID0+IHtcblx0XHRyZXR1cm4gKHF1ZXJ5LnJvdXRlID8gJycgKyBxdWVyeS5yb3V0ZSA6ICcvJykgKyAocXVlcnkuaWQgPyAnLzppZCcgOiAnJyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFV0aWxpdGllcyB9OyJdfQ==
