(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Homepage } = require('./js/pages/Homepage.js');
const { Post } = require('./js/pages/Post.js');
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

		content.innerHTML = await routes[parsedQuery].render();


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
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/Account.js":4,"./js/pages/Dashboard.js":5,"./js/pages/Homepage.js":6,"./js/pages/Match.js":7,"./js/pages/Post.js":8,"./js/utilities/Utilities.js":9}],2:[function(require,module,exports){
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
let Account = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Account</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Account };
},{}],5:[function(require,module,exports){
let Dashboard = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Dashboard</h1>
			</div>
		`;

		return content;
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
	}
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
		console.log('match:', match);

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
	}
}

module.exports = { Match };
},{}],8:[function(require,module,exports){
const getUrlQuery = _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}

let Post = {
	render: async _ => {

		let id = getUrlQuery().id;

		let content = `
			<div>
				<h2><a href="#/">Back</a></h2>
				<h1>Post ${id}</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Post };
},{}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvcGFnZXMvUG9zdC5qcyIsInNyYy9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7IEhvbWVwYWdlIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0hvbWVwYWdlLmpzJyk7XG5jb25zdCB7IFBvc3QgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvUG9zdC5qcycpO1xuY29uc3QgeyBBY2NvdW50IH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0FjY291bnQuanMnKTtcbmNvbnN0IHsgRGFzaGJvYXJkIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0Rhc2hib2FyZC5qcycpO1xuY29uc3QgeyBNYXRjaCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9NYXRjaC5qcycpO1xuXG5jb25zdCB7IE5hdmJhciB9ID0gcmVxdWlyZSgnLi9qcy9jb21wb25lbnRzL05hdmJhci5qcycpO1xuY29uc3QgeyBGb290ZXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9Gb290ZXIuanMnKTtcblxuY29uc3QgeyBVdGlsaXRpZXM6IFV0aWwgfSA9IHJlcXVpcmUoJy4vanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcycpO1xuXG5jb25zb2xlLmxvZyhcIuS9oOWlveS4lueVjFwiKTtcblxuY29uc3Qgcm91dGVzID0ge1xuXHQnLyc6IEhvbWVwYWdlLFxuXHQnL2luZGV4Lmh0bWwnOiBIb21lcGFnZSxcblx0Jy9hY2NvdW50JzogQWNjb3VudCxcblx0Jy9kYXNoYm9hcmQnOiBEYXNoYm9hcmQsXG5cdCcvbWF0Y2gvOmlkJzogTWF0Y2gsXG59O1xuXG5jb25zdCBydW5BcHAgPSBhc3luYyBfID0+IHtcblxuXHQvLyBmaW5kIHRoZSBhcHAgZGl2IHRvIGFkZCBwYWdlIGNvbnRlbnQgdG9cblx0Y29uc3QgYXBwID0gbnVsbCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cdGlmKGFwcCkge1xuXHRcdGxldCBuYXYgPSBhcHAuY2hpbGRyZW4ubmF2O1xuXHRcdGxldCBmb290ZXIgPSBhcHAuY2hpbGRyZW4uZm9vdGVyO1xuXHRcdGxldCBjb250ZW50ID0gYXBwLmNoaWxkcmVuLmNvbnRlbnQ7XG5cblx0XHRuYXYuaW5uZXJIVE1MID0gYXdhaXQgTmF2YmFyLnJlbmRlcigpO1xuXHRcdGZvb3Rlci5pbm5lckhUTUwgPSBhd2FpdCBGb290ZXIucmVuZGVyKCk7XG5cdFx0XG5cdFx0cXVlcnkgPSBVdGlsLmdldFVybFF1ZXJ5KCk7XG5cdFx0Y29uc29sZS5sb2coJ3F1ZXJ5OicsIHF1ZXJ5KTtcblxuXHRcdGxldCBwYXJzZWRRdWVyeSA9IFV0aWwucGFyc2VRdWVyeShxdWVyeSk7XG5cdFx0Y29uc29sZS5sb2cocGFyc2VkUXVlcnkpXG5cblx0XHQvLyBmaXggZm9yIGZpcnN0IGxvYWQsIG1pZ2h0IG5lZWQgdG8gY2hhbmdlIGxhdGVyXG5cdFx0aWYoIXJvdXRlc1twYXJzZWRRdWVyeV0pIHtcblx0XHRcdHF1ZXJ5LnJvdXRlID0gJy8nO1xuXHRcdH1cblxuXHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gYXdhaXQgcm91dGVzW3BhcnNlZFF1ZXJ5XS5yZW5kZXIoKTtcblxuXG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIlNQQSBFcnJvcjogcm9vdCBlbGVtZW50IGRpdiB3aXRoIGlkICdhcHAnIG5vdCBmb3VuZFwiKTtcblx0fVxufVxuXG5jb25zdCBydW5Qb3N0UGFnZUxvYWQgPSBfID0+IHtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5BcHApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHJ1bkFwcCk7XG5cbnJ1blBvc3RQYWdlTG9hZCgpO1xuXG4vLyBzdGFydCBjb21tYW5kXG4vLyBsaXZlLXNlcnZlciAtLXBvcnQ9ODA4MCAuLyAtLXZlcmJvc2UgLS1zcGFcbi8vIHdhdGNoaWZ5IC4vc3JjL2FwcC5qcyAtbyAuL2Rpc3QvYnVuZGxlLmpzIC1kIC12IiwiY29uc3QgRm9vdGVyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD4keyB5ZWFyIH0gRm9vdGJhbGwgTGlicmFyeS4gQWxsIHJpZ2h0cyByZXNldmVyZWQuPC9wPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0XHQ8L2Zvb3Rlcj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEZvb3RlciB9IiwiY29uc3QgTmF2YmFyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibmF2XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8YSBpZD1cIm5hdi1sb2dvXCIgaHJlZj1cIiMvXCI+PGgxIGNsYXNzPVwibmF2LXRpdGxlXCI+Rk9PVEJBTEwgTElCUkFSWTwvaDE+PC9hPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cIm5hdmJhci1pdGVtc1wiPlxuXHRcdFx0XHRcdFx0PG5hdj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibmF2LWxpc3RcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIiMvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPjxhIGhyZWY9XCIjL2FjY291bnRcIj5BY2NvdW50PC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8L25hdj5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9uYXZiYXItZGVza3RvcCAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvbmF2IC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCJsZXQgQWNjb3VudCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPlxuXHRcdFx0XHQ8aDE+QWNjb3VudDwvaDE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEFjY291bnQgfTsiLCJsZXQgRGFzaGJvYXJkID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcdDxoMT5EYXNoYm9hcmQ8L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEYXNoYm9hcmQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gSG9tZXBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbi8vIFRoaXMgaXMgdGhlIGN1cnJlbnQgZHVtbXkgZGF0YSBmb3IgdGVzdGluZyBkeW5hbWljIGxvYWRzIHRvIHBhZ2VzXG4vLyBvbmNlIHRoZSBzZXJ2ZXJzaWRlIGhhcyBiZWVuIGltcGxlbWVudGVkIHRoaXMgd2lsbCBub3QgYmUgbmVlZGVkIFxuLy8gYXMgbWF0Y2ggZGF0YSB3aWxsIGJlIGxvYWRlZCB0aHJvdWdoIG91ciBzZXJ2ZXJzaWRlIGFzIHdlbGwgYXMgdGhlXG4vLyBBUEkncyBzZWxlY3RlZCBmb3IgdGhlIHByb2plY3RcblxuY29uc3QgZ2V0TWF0Y2hlcyA9IF8gPT4ge1xuXHRtYXRjaGVzID0gW1xuXHRcdHtcdFxuXHRcdFx0aWQ6IDEsXG5cdFx0XHR0aXRsZTogXCJGcmFuY2UgdnMgU3BhaW5cIixcblx0XHRcdHRlYW1zOiBbXCJGcmFuY2VcIiwgXCJTcGFpblwiXSxcblx0XHRcdHNjb3JlOiBbMTAsIDJdLFxuXHRcdFx0d2lubmVyOiBcIkZyYW5jZVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRnJhbmNlIGZhY2VzIFNwYWluLlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMixcblx0XHRcdHRpdGxlOiBcIkl0YWx5IHZzIEJyYXppbFwiLFxuXHRcdFx0dGVhbXM6IFtcIkl0YWx5XCIsIFwiQnJhemlsXCJdLFxuXHRcdFx0c2NvcmU6IFs4LCAzXSxcblx0XHRcdHdpbm5lcjogXCJCcmF6aWxcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkl0YWx5IGZhY2VzIEJyYXppbFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogMyxcblx0XHRcdHRpdGxlOiBcIkRlbm1hcmsgdnMgIFJ1c3NpYVwiLFxuXHRcdFx0dGVhbXM6IFtcIkRlbm1hcmtcIiwgXCJSdXNzaWFcIl0sXG5cdFx0XHRzY29yZTogWzMsIDVdLFxuXHRcdFx0d2lubmVyOiBcIkRlbm1hcmtcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRlbm1hcmsgZmFjZXMgUnVzc2lhXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiA0LFxuXHRcdFx0dGl0bGU6IFwiUG9sYW5kIHZzIEJlbGdpdW1cIixcblx0XHRcdHRlYW1zOiBbXCJQb2xhbmRcIiwgXCJCZWxnaXVtXCJdLFxuXHRcdFx0c2NvcmU6IFsxMDEsIDIwXSxcblx0XHRcdHdpbm5lcjogXCJCZWxnaXVtXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJQb2xhbmQgZmFjZXMgQmVsZ2l1bVwiXG5cdFx0fSxcblx0XTtcblxuXHRyZXR1cm4gbWF0Y2hlcztcbn1cblxuY29uc3QgZ2V0UmVjZW50TWF0Y2hlcyA9IF8gPT4ge1xuXHRyZWNlbnRNYXRjaGVzID0gW1xuXHRcdHtcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiQ3JvYXRpYSB2cyBNZXhpY29cIixcblx0XHRcdHRlYW1zOiBbXCJDcm9hdGlhXCIsIFwiTWV4aWNvXCJdLFxuXHRcdFx0c2NvcmU6IFsxMCwgMl0sXG5cdFx0XHR3aW5uZXI6IFwiQ3JvYXRpYVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiQ3JvYXRpYSBmYWNlcyBNZXhpY29cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJHZXJtYW55IHZzIEVuZ2xhbmRcIixcblx0XHRcdHRlYW1zOiBbXCJHZXJtYW55XCIsIFwiRW5nbGFuZFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiRW5nbGFuZFwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiR2VybWFueSBmYWNlcyBFbmdsYW5kXCJcblx0XHR9LFxuXHRdXG5cblx0cmV0dXJuIHJlY2VudE1hdGNoZXM7XG59XG5cbi8vIGJ1aWxkcyB0aGUgaHRtbCBmb3IgYSBmdWxsIHNldCBvZiBtYXRjaCBjYXJkcyBnaXZlbiBhIGxpc3Qgb2YgbWF0Y2ggb2JqZWN0c1xubGV0IGJ1aWxkTWF0Y2hDYXJkU2V0ID0gbWF0Y2hlcyA9PiB7XG5cdGNvbnRlbnQgPSAnJ1xuXHRmb3IoaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHQvLyBidWlsZCBtYXRjaCBjYXJkcyBpbnRvIGNvbnRlbnRcblx0XHRjb250ZW50ICs9IGJ1aWxkTWF0Y2hDYXJkKG1hdGNoZXNbaV0sIGkpO1xuXHR9XG5cdHJldHVybiBjb250ZW50XG59XG5cbi8vIGZ1bmN0aW9uIHJlY2lldmVzIGEgbWF0Y2ggb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBodG1sIG5lZWRlZCB0byByZW5kZXIgdGhlIG1hdGNoIGNhcmRcbmxldCBidWlsZE1hdGNoQ2FyZCA9IChtYXRjaCwgaW5kZXgpID0+IHtcblx0cmV0dXJuIGBcblx0PGRpdiBpZD1cIm1hdGNoLWNhcmQtJHsgaW5kZXggfVwiIGNsYXNzPVwibWF0Y2gtY2FyZFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1jYXJkLWdyYXBoaWNcIj5cblx0XHRcdFxuXHRcdDwvZGl2PjwhLS0gL21hdGNoLWNhcmQtZ3JhcGhpYyAtLT5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXRpdGxlXCI+PGEgaHJlZj1cIiMvbWF0Y2gvJHsgbWF0Y2guaWQgfVwiPiR7IG1hdGNoLnRpdGxlIH08L2E+PC9oMj5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXNjb3JlXCI+JHsgbWF0Y2guc2NvcmVbMF0gfSAtICR7IG1hdGNoLnNjb3JlWzFdIH08L2gyPlxuXHRcdDxwPiR7IG1hdGNoLmRlc2NyaXB0aW9uIH08L3A+XG5cdDwvZGl2PjwhLS0gL21hdGNoIC0tPlxuXHRgXG59XG5cbmxldCBIb21lcGFnZSA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8aDE+TGl2ZSBGZWVkPC9oMT5cblx0XHRcdFx0PGJyPlxuXG5cdFx0XHRcdDxoMT5SZWNlbnQgTWF0Y2hlczwvaDE+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8ZGl2IGlkPVwicmVjZW50LW1hdGNoZXNcIiBjbGFzcz1cIm1hdGNoZXMgZ3JpZFwiPlxuXHRcdGA7XG5cblx0XHQvLyBidWlsZCBtYXRjaGVzIHNldFxuXHRcdGxldCBtYXRjaGVzID0gZ2V0TWF0Y2hlcygpO1xuXHRcdGxldCBtYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChtYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gbWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0PC9kaXY+PCEtLSByZWNlbnQtbWF0Y2hlcyAtLT5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgcmVjZW50IG1hdGNoZXMgc2V0XG5cdFx0Y29udGVudCArPSBgXG5cdFx0XHQ8aDE+U2VhcmNoIE1hdGNoZXM8L2gxPlxuXHRcdFx0XHQ8ZGl2IGlkPVwiaG9tZXBhZ2UtbWF0Y2hlc1wiIGNsYXNzPVwibWF0Y2hlcyBncmlkXCI+XG5cdFx0YDtcblxuXHRcdGxldCByZWNlbnRNYXRjaGVzID0gZ2V0UmVjZW50TWF0Y2hlcygpO1xuXHRcdGxldCByZWNlbnRNYXRjaENhcmRTZXQgPSBidWlsZE1hdGNoQ2FyZFNldChyZWNlbnRNYXRjaGVzKTtcblxuXHRcdGNvbnRlbnQgKz0gcmVjZW50TWF0Y2hDYXJkU2V0ICsgYFxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaGVzIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgSG9tZXBhZ2UgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gTWF0Y2hcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGdldE1hdGNoZXMgPSBfID0+IHtcblx0bWF0Y2hlcyA9IFtcblx0XHR7XHRcblx0XHRcdGlkOiAxLFxuXHRcdFx0dGl0bGU6IFwiRnJhbmNlIHZzIFNwYWluXCIsXG5cdFx0XHR0ZWFtczogW1wiRnJhbmNlXCIsIFwiU3BhaW5cIl0sXG5cdFx0XHRzY29yZTogWzEwLCAyXSxcblx0XHRcdHdpbm5lcjogXCJGcmFuY2VcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkZyYW5jZSBmYWNlcyBTcGFpbi5cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDIsXG5cdFx0XHR0aXRsZTogXCJJdGFseSB2cyBCcmF6aWxcIixcblx0XHRcdHRlYW1zOiBbXCJJdGFseVwiLCBcIkJyYXppbFwiXSxcblx0XHRcdHNjb3JlOiBbOCwgM10sXG5cdFx0XHR3aW5uZXI6IFwiQnJhemlsXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJJdGFseSBmYWNlcyBCcmF6aWxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0aWQ6IDMsXG5cdFx0XHR0aXRsZTogXCJEZW5tYXJrIHZzICBSdXNzaWFcIixcblx0XHRcdHRlYW1zOiBbXCJEZW5tYXJrXCIsIFwiUnVzc2lhXCJdLFxuXHRcdFx0c2NvcmU6IFszLCA1XSxcblx0XHRcdHdpbm5lcjogXCJEZW5tYXJrXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEZW5tYXJrIGZhY2VzIFJ1c3NpYVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogNCxcblx0XHRcdHRpdGxlOiBcIlBvbGFuZCB2cyBCZWxnaXVtXCIsXG5cdFx0XHR0ZWFtczogW1wiUG9sYW5kXCIsIFwiQmVsZ2l1bVwiXSxcblx0XHRcdHNjb3JlOiBbMTAxLCAyMF0sXG5cdFx0XHR3aW5uZXI6IFwiQmVsZ2l1bVwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiUG9sYW5kIGZhY2VzIEJlbGdpdW1cIlxuXHRcdH0sXG5cdF07XG5cblx0cmV0dXJuIG1hdGNoZXM7XG59XG5cbmNvbnN0IGdldE1hdGNoQnlJZCA9IGlkID0+IHtcblx0bWF0Y2hlcyA9IGdldE1hdGNoZXMoKTtcblx0Y29uc29sZS5sb2cobWF0Y2hlcyk7XG5cblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmKGlkID09IG1hdGNoZXNbaV0uaWQpIHtcblx0XHRcdHJldHVybiBtYXRjaGVzW2ldO1xuXHRcdH1cblx0fVxufVxuXG5jb25zdCBnZXRVcmxRdWVyeSA9IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH1cblxubGV0IE1hdGNoID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGlkID0gZ2V0VXJsUXVlcnkoKS5pZDtcblx0XHRtYXRjaCA9IGdldE1hdGNoQnlJZChpZCk7XG5cdFx0Y29uc29sZS5sb2coJ21hdGNoOicsIG1hdGNoKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8dT48aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPjwvdT5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwic2luZ2xlLW1hdGNoXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLWhlYWRsaW5lXCI+XG5cdFx0XHRcdFx0XHQ8aDE+JHttYXRjaC50ZWFtc1swXX0gVlMuICR7bWF0Y2gudGVhbXNbMV19PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1oZWFkbGluZSAtLT5cblxuXHRcdFx0XHRcdDxhcnRpY2xlPlxuXHRcdFx0XHRcdFx0PGgxIGNsYXNzPVwibWF0Y2gtdGl0bGVcIj4ke21hdGNoLnRpdGxlfTwvaDE+XG5cdFx0XHRcdFx0XHQ8cD4ke21hdGNoLmRlc2NyaXB0aW9ufTwvcD5cblx0XHRcdFx0XHQ8L2FydGljbGU+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtd2lubmVyXCI+XG5cdFx0XHRcdFx0XHQ8aDE+V2lubmVyOiAke21hdGNoLndpbm5lcn08L2gxPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL21hdGNoLXdpbm5lciAtLT5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC1zdGF0c1wiPlxuXHRcdFx0XHRcdFx0PGgxPkZpbmFsIFNjb3JlOiAke21hdGNoLnNjb3JlWzBdfSA6ICR7bWF0Y2guc2NvcmVbMV19PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1zdGF0cyAtLT5cblxuXHRcdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0XHQ8cD5UaGUgcGFnZSBtYXkgbG9vayBiYXJyZW4gcmlnaHQgbm93IGJ1dCBpdCBpcyBsb2FkaW5nIGR5bmFtaWNhbGx5IHdpdGgganMgYW5kIHdpbGwgY29udGFpbiBtb3JlIGluZm9ybWF0aW9uIG9uY2UgdGhlIEFQSSdzIGFyZSBpbXBsZW1lbnRlZCBpbnRvIHRoZSBiYWNrZW5kLiBHbyB0byBpbmRleC5qcyBhbmQgZmVlbCBmcmVlIHRvIGNoYW5nZSB0aGUgaW5kZXggbG9hZGVkIG9uIHRoaXMgcGFnZTwvcD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+PCEtLSAvc2luZ2xlLW1hdGNoIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTWF0Y2ggfTsiLCJjb25zdCBnZXRVcmxRdWVyeSA9IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH1cblxubGV0IFBvc3QgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgaWQgPSBnZXRVcmxRdWVyeSgpLmlkO1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPlxuXHRcdFx0XHQ8aDE+UG9zdCAke2lkfTwvaDE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFBvc3QgfTsiLCJjb25zdCBVdGlsaXRpZXMgPSB7XG5cdGdldFVybFF1ZXJ5OiBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9LFxuXG5cdHBhcnNlUXVlcnk6IHF1ZXJ5ID0+IHtcblx0XHRyZXR1cm4gKHF1ZXJ5LnJvdXRlID8gJycgKyBxdWVyeS5yb3V0ZSA6ICcvJykgKyAocXVlcnkuaWQgPyAnLzppZCcgOiAnJyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFV0aWxpdGllcyB9OyJdfQ==
