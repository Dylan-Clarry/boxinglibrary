(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Homepage } = require('./js/pages/Homepage.js');
const { Account } = require('./js/pages/Account.js');
const { Dashboard } = require('./js/pages/Dashboard.js');
const { Match } = require('./js/pages/Match.js');
const { Addmatch } = require('./js/pages/Addmatch.js');

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
	'/addmatch': Addmatch,
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
		let parsedQuery = Util.parseQuery(query);

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
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/Account.js":4,"./js/pages/Addmatch.js":5,"./js/pages/Dashboard.js":6,"./js/pages/Homepage.js":7,"./js/pages/Match.js":8,"./js/utilities/Utilities.js":9}],2:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
// ====================
// Account
// ====================

const _removeToken = _ => {
    //console.log("REMOVE token");
    window.localStorage.removeItem('tokenObj');
};

const _setToken = (token, user) => {
    _removeToken();
    //console.log("SET token");
    var tokenObj = {
        token: 'bearer ' + token,
        timestamp: new Date().getTime(),
        user: user,
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
							<input name="pass" type="password" placeholder="Password">
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

							_setToken(result.accessToken, usernameVal);

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

						_setToken(result.accessToken, result.userID);
						
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
// Addmatch
// ====================

const _removeToken = _ => {
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

const getTeams = _ => {
	let url = 'https://footlib-backend.herokuapp.com/teams';
	return $.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: url,
		async: false,
		success: data => {
			//console.log(data);
		}
	});
};

const _getUser = _ => {

    // get object, return null if null
    var tokenObj = JSON.parse(window.localStorage.getItem('tokenObj'));
    if(!tokenObj) return null;
    return tokenObj.user;
};

const buildTeamOptions = (teams, teamNumber) => {
	content = `
		<select name="team${ teamNumber }" id="team${ teamNumber }-selector">
	`;

	for(i = 0; i < teams.length; i++) {
		console.log(teams[i].teamID, teams[i].name);
		content += `
			<option value="${ teams[i].teamID }">${ teams[i].name }</option>
		`;
	}

	content += `
		</select>
	`;

	return content;
};

const createMatch = (data, user, token) => {
	let url = 'https://footlib-backend.herokuapp.com/matches/' + user + '/create';
	return $.ajax({
		headers: {
			"Authorization": token,
		},
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

const Addmatch = {
	render: async _ => {
		let year = new Date().getFullYear();

		let teams;

		getTeams().done(result => {
			console.log('teams:', result);
			teams = result;
		})

		let content = `
			<div class="container">
				<div id="add-match-form">
					<h1>Add Match</h1>

					<br />

					<u><h3><a href="#/dashboard">Back to Dashboard</a></h3></u>

					<br />

					<form class="add-match-form" action="POST">
		`;

		content += buildTeamOptions(teams, '1') + '<br />';
		content += buildTeamOptions(teams, '2') + '<br />';

		content += `
						<input name="score1" type="text" placeholder="score 1">
						<br />
						<input name="score2" type="text" placeholder="score 2">
						<br />
						<input name="description" name="" type="text" placeholder="description">
						<br />
						<input name="matchurl" type="text" placeholder="Video Link (optional)">
						<br />
						<button id="submit-add-match-btn" type="submit">Add Match</button>
					</form><!-- add-match-form -->
				</div><!-- /add-match-form -->
			</div><!-- /container -->
		`;
		return content;
	},

	postRender: async _ => {
		addMatchForm = document.getElementById('add-match-form');
		if(addMatchForm !== null) {
			let addMatchTrueForm = addMatchForm.getElementsByTagName('form')[0];
			addMatchTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();

				let user = _getUser();
				let team1Val = addMatchTrueForm.elements['team1'].value;
				let team2Val = addMatchTrueForm.elements['team2'].value;
				let score1Val = addMatchTrueForm.elements['score1'].value;
				let score2Val = addMatchTrueForm.elements['score2'].value;
				let descriptionVal = addMatchTrueForm.elements['description'].value;
				let matchurlVal = addMatchTrueForm.elements['matchurl'].value ? addMatchTrueForm.elements['matchurl'].value : null;

				// form validation
				if(team1Val === '' || team2Val === '' || score1Val === '' || score2Val === '' || descriptionVal === '') {
					alert('One or more fields are empty');
				}
				
				// create login object based on formdata
				var addMatchObj = {
					userID: user,
					description: descriptionVal,
					score1: score1Val,
					score2: score2Val,
					teamID1: team1Val,
					teamID2: team2Val,
					matchURL: matchurlVal,
				};

				let token = _getToken();

				createMatch(addMatchObj, user, token).done(result => {
					document.location.href = document.location.href.split('#')[0] + '#/dashboard';
				})
			});
		}
	}
}

module.exports = { Addmatch }
},{}],6:[function(require,module,exports){
// ====================
// Dashboard
// ====================

const _getUser = _ => {
    // get object, return null if null
    var tokenObj = JSON.parse(window.localStorage.getItem('tokenObj'));
    if(!tokenObj) return null;
    return tokenObj.user;
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

const getUserMatchesAjax = user => {
	let url = 'https://footlib-backend.herokuapp.com/matches/' + user;
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

const deleteMatch = (user, match, token) => {
	let url = 'https://footlib-backend.herokuapp.com/matches/' + user + '/delete/' + match;
	return $.ajax({
		headers: {
			"Authorization": token,
		},
		type: 'POST',
		datatype: 'json',
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
}

const matchWinner = match => {
	return match.score1 > match.score2 ? match.teamID1_Name : match.teamID2_Name;
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
		<tr id="match-row-${ matchWinner(match) }" class="match-row">
			<td class="title">${ match.teamID1_Name + ' vs. ' + match.teamID2_Name }</td>
			<td class="team1">${ match.teamID1_Name }</td>
			<td class="team2">${ match.teamID2_Name }</td>
			<td class="score1">${ match.score1 }</td>
			<td class="score2">${ match.score2 }</td>
			<td class="edit"><button class="edit-btn">Edit</button></td>
			<td class="delete"><button id="delete-btn-${ index }" matchid="${ match.matchID }" class="delete-btn">Delete</button></td>
		</tr>
	`;
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
				<th>Score 1</th>
				<th>Score 2</th>
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
		let user = _getUser();
		let matches;
		getUserMatchesAjax(user).done(result => {
			matches = result;
		});

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
		let addMatchBtn = document.getElementById('add-match-btn');
		addMatchBtn.addEventListener('click', _ => {
			document.location.href = document.location.href.split('#')[0] + '#/addmatch';
		});

		let deleteBtnArr = document.getElementsByClassName('delete-btn');
		for(i = 0; i < deleteBtnArr.length; i++) {
			let delKey = deleteBtnArr[i].getAttribute('matchid');
			deleteBtnArr[i].addEventListener('click', _ => {
				let user = _getUser();
				let token = _getToken();

				deleteMatch(user, delKey, token).done(result => {
					console.log(result);
					location.reload();
				});
			});
		}
	}
}

module.exports = { Dashboard };
},{}],7:[function(require,module,exports){
// ====================
// Homepage
// ====================

const thirdPartyCall = _ => {
	let url = 'https://api-football-v1.p.rapidapi.com/v2/leagueTable/524';
	return $.ajax({
		headers: {
			"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
			"x-rapidapi-key": "94b2a171bcmshc5866e97b177557p15ea11jsn42e8c6f871c1"
		},
		type: 'GET',
		datatype: 'jsonp',
		crossdomain: true,
		url: url,
		async: false,
		success: data => {
			//console.log(data);
		}
	});
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

let buildStandingsCardsSet = standings => {
	content = ''
	for(i = 0; i < 6; i++) {

		console.log('standdnsgkldng:', standings[i]);

		// build match cards into content
		content += buildStandingsCard(standings[i], i);
	}
	return content
}

const buildStandingsCard = (standing, index) => {
	return `
	<div id="match-card-${ index }" class="standing-card match-card">
		<div class="match-card-graphic">
			
		</div><!-- /match-card-graphic -->
		<img src="${ standing.logo }" alt="${ standing.logo }" />
		<h3 class="match-card-team">${ standing.teamName }</h3>
		<h3 class="match-card-league">${ standing.group }</h3>
		<h3 class="match-card-rank">Rank ${ standing.rank }</h3>
	</div><!-- /match -->
	`
}

let Homepage = {
	render: async _ => {
		let matches;
		getMatchesAjax().done(result => {
			matches = result;
		});

		let standings = [];
		thirdPartyCall().done(result => {
			console.log(result);
			standings = result.api.standings[0];
		});

		let content = `
			<div id="index" class="container">

				<h1>Team Standings</h1>
		`;

		if(standings.length > 0) {
			content += `
				<div id="standings" class="matches grid">
			` + buildStandingsCardsSet(standings) + `
				</div><!-- standings -->
			`;
		}
		content += `
				<br>

				<h1>Matches</h1>
				
				<div id="recent-matches" class="matches grid">
		`;

		// build matches set
		let matchCardSet = buildMatchCardSet(matches);
		content += matchCardSet + `
			</div><!-- recent-matches -->
		`;
		return content;
	},
	postRender: async _ => { }
}

module.exports = { Homepage };
},{}],8:[function(require,module,exports){
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
		`;
		if(match.matchURL != null && match.matchURL != '') {
			console.log('matchURL:', match.matchURL);
			content += `
				<iframe src="${ match.matchURL }" height="400" width="600" frameborder="0"></iframe>
			`;
		}
		content += `

				</div><!-- /single-match -->
			</div><!-- /container -->
		`;
		return content;
	},
	postRender: async _ => {}
}

module.exports = { Match };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9BZGRtYXRjaC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7IEhvbWVwYWdlIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0hvbWVwYWdlLmpzJyk7XG5jb25zdCB7IEFjY291bnQgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvQWNjb3VudC5qcycpO1xuY29uc3QgeyBEYXNoYm9hcmQgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvRGFzaGJvYXJkLmpzJyk7XG5jb25zdCB7IE1hdGNoIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL01hdGNoLmpzJyk7XG5jb25zdCB7IEFkZG1hdGNoIH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL0FkZG1hdGNoLmpzJyk7XG5cbmNvbnN0IHsgTmF2YmFyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG5jb25zdCB7IEZvb3RlciB9ID0gcmVxdWlyZSgnLi9qcy9jb21wb25lbnRzL0Zvb3Rlci5qcycpO1xuXG5jb25zdCB7IFV0aWxpdGllczogVXRpbCB9ID0gcmVxdWlyZSgnLi9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzJyk7XG5cbmNvbnNvbGUubG9nKFwi5L2g5aW95LiW55WMXCIpO1xuXG5jb25zdCByb3V0ZXMgPSB7XG5cdCcvJzogSG9tZXBhZ2UsXG5cdCcvaW5kZXguaHRtbCc6IEhvbWVwYWdlLFxuXHQnL2FjY291bnQnOiBBY2NvdW50LFxuXHQnL2Rhc2hib2FyZCc6IERhc2hib2FyZCxcblx0Jy9tYXRjaC86aWQnOiBNYXRjaCxcblx0Jy9hZGRtYXRjaCc6IEFkZG1hdGNoLFxufTtcblxuY29uc3QgcnVuQXBwID0gYXN5bmMgXyA9PiB7XG5cblx0Ly8gZmluZCB0aGUgYXBwIGRpdiB0byBhZGQgcGFnZSBjb250ZW50IHRvXG5cdGNvbnN0IGFwcCA9IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRpZihhcHApIHtcblx0XHRsZXQgbmF2ID0gYXBwLmNoaWxkcmVuLm5hdjtcblx0XHRsZXQgZm9vdGVyID0gYXBwLmNoaWxkcmVuLmZvb3Rlcjtcblx0XHRsZXQgY29udGVudCA9IGFwcC5jaGlsZHJlbi5jb250ZW50O1xuXG5cdFx0bmF2LmlubmVySFRNTCA9IGF3YWl0IE5hdmJhci5yZW5kZXIoKTtcblx0XHRmb290ZXIuaW5uZXJIVE1MID0gYXdhaXQgRm9vdGVyLnJlbmRlcigpO1xuXHRcdFxuXHRcdHF1ZXJ5ID0gVXRpbC5nZXRVcmxRdWVyeSgpO1xuXHRcdGxldCBwYXJzZWRRdWVyeSA9IFV0aWwucGFyc2VRdWVyeShxdWVyeSk7XG5cblx0XHQvLyBmaXggZm9yIGZpcnN0IGxvYWQsIG1pZ2h0IG5lZWQgdG8gY2hhbmdlIGxhdGVyXG5cdFx0aWYoIXJvdXRlc1twYXJzZWRRdWVyeV0pIHtcblx0XHRcdHF1ZXJ5LnJvdXRlID0gJy8nO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyUGFnZSA9IHJvdXRlc1twYXJzZWRRdWVyeV07XG5cdFx0Y29udGVudC5pbm5lckhUTUwgPSBhd2FpdCBjdXJyUGFnZS5yZW5kZXIoKTtcblx0XHRjdXJyUGFnZS5wb3N0UmVuZGVyKCk7XG5cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU1BBIEVycm9yOiByb290IGVsZW1lbnQgZGl2IHdpdGggaWQgJ2FwcCcgbm90IGZvdW5kXCIpO1xuXHR9XG59XG5cbmNvbnN0IHJ1blBvc3RQYWdlTG9hZCA9IF8gPT4ge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bkFwcCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcnVuQXBwKTtcblxucnVuUG9zdFBhZ2VMb2FkKCk7XG5cbi8vIHN0YXJ0IGNvbW1hbmRcbi8vIGxpdmUtc2VydmVyIC0tcG9ydD04MDgwIC4vIC0tdmVyYm9zZSAtLXNwYVxuLy8gd2F0Y2hpZnkgLi9zcmMvYXBwLmpzIC1vIC4vZGlzdC9idW5kbGUuanMgLWQgLXYiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gRm9vdGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBGb290ZXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGZvb3Rlcj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdDxwPiR7IHllYXIgfSBGb290YmFsbCBMaWJyYXJ5LiBBbGwgcmlnaHRzIHJlc2V2ZXJlZC48L3A+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZm9vdGVyPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgRm9vdGVyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gTmF2YmFyXG4vLyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBfcmVtb3ZlVG9rZW4gPSBfID0+IHtcbiAgICAvL2NvbnNvbGUubG9nKFwiUkVNT1ZFIHRva2VuXCIpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW5PYmonKTtcbn07XG5cbmNvbnN0IF9nZXRUb2tlbiA9IF8gPT4ge1xuICAgIGxldCBvbmVIb3VyID0gNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAvLyBnZXQgb2JqZWN0LCByZXR1cm4gbnVsbCBpZiBudWxsXG4gICAgdmFyIHRva2VuT2JqID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuT2JqJykpO1xuICAgIC8vY29uc29sZS5sb2coJ3Rva2VuIG9iaicsIHRva2VuT2JqKTtcbiAgICBpZighdG9rZW5PYmopIHJldHVybiBudWxsO1xuICAgIFxuICAgIC8vIGlmIHRva2VuIHRpbWUgaXMgc3RvcmVkIGZvciBtb3JlIHRoYW4gYW4gaG91ciByZW1vdmUgdG9rZW4gYW5kIHJldHVybiBudWxsXG4gICAgdmFyIHRva2VuVGltZSA9IHRva2VuT2JqLnRpbWVzdGFtcDtcbiAgICB2YXIgdGltZU5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIC8vY29uc29sZS5sb2codGltZU5vdyAtIHRva2VuVGltZSk7XG4gICAgaWYodGltZU5vdyAtIHRva2VuVGltZSA+IG9uZUhvdXIpIHtcbiAgICAgICAgX3JlbW92ZVRva2VuKCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHJldHVybiB0b2tlblxuICAgIHJldHVybiB0b2tlbk9iai50b2tlbjtcbn07XG5cbmNvbnN0IE5hdmJhciA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblx0XHRsZXQgdG9rZW4gPSBfZ2V0VG9rZW4oKTtcblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgY2xhc3M9XCJuYXZcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdDxhIGlkPVwibmF2LWxvZ29cIiBocmVmPVwiIy9cIj48aDEgY2xhc3M9XCJuYXYtdGl0bGVcIj5GT09UQkFMTCBMSUJSQVJZPC9oMT48L2E+XG5cblx0XHRcdFx0XHQ8ZGl2IGlkPVwibmF2YmFyLWl0ZW1zXCI+XG5cdFx0XHRcdFx0XHQ8bmF2PlxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJuYXYtbGlzdFwiPlxuXHRcdGA7XG5cdFx0aWYodG9rZW4pIHtcblx0XHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9kYXNoYm9hcmRcIj5EYXNoYm9hcmQ8L2E+PC9saT5cblx0XHRcdGA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9hY2NvdW50XCI+U2lnbnVwL0xvZ2luPC9hPjwvbGk+XG5cdFx0XHRgO1xuXHRcdH1cblx0XHRjb250ZW50ICs9IGBcblx0XHRcdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHRcdDwvbmF2PlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gL25hdmJhci1kZXNrdG9wIC0tPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0XHQ8L2Rpdj48IS0tIC9uYXYgLS0+XG5cdFx0YDtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gQWNjb3VudFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgX3JlbW92ZVRva2VuID0gXyA9PiB7XG4gICAgLy9jb25zb2xlLmxvZyhcIlJFTU9WRSB0b2tlblwiKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuT2JqJyk7XG59O1xuXG5jb25zdCBfc2V0VG9rZW4gPSAodG9rZW4sIHVzZXIpID0+IHtcbiAgICBfcmVtb3ZlVG9rZW4oKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiU0VUIHRva2VuXCIpO1xuICAgIHZhciB0b2tlbk9iaiA9IHtcbiAgICAgICAgdG9rZW46ICdiZWFyZXIgJyArIHRva2VuLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICB1c2VyOiB1c2VyLFxuICAgIH07XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbk9iaicsIEpTT04uc3RyaW5naWZ5KHRva2VuT2JqKSk7XG59O1xuXG5jb25zdCBzaWduVXBVc2VyID0gZGF0YSA9PiB7XG5cdFxuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vc2lnbnVwJztcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29uJyxcblx0XHRkYXRhOiBkYXRhLFxuXHRcdHVybDogdXJsLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgbG9naW5Vc2VyID0gZGF0YSA9PiB7XG5cblx0bGV0IHVybCA9ICdodHRwczovL2Zvb3RsaWItYmFja2VuZC5oZXJva3VhcHAuY29tL2xvZ2luJztcblxuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29uJyxcblx0XHRkYXRhOiBkYXRhLFxuXHRcdHVybDogdXJsLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgdmFsaWRhdGVFbWFpbCA9IGVtYWlsID0+IHtcbiAgICB2YXIgcmUgPSAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuICAgIHJldHVybiByZS50ZXN0KFN0cmluZyhlbWFpbCkudG9Mb3dlckNhc2UoKSk7XG59XG5cbmxldCBBY2NvdW50ID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGlkPVwiaW5kZXhcIiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPlxuXHRcdFx0XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJsb2dpbi1zaWdudXBcIj5cblx0XHRcdFx0XHQ8aDE+Rk9PVEJBTEwgTElCUkFSWTwvaDE+XG5cblx0XHRcdFx0XHQ8ZGl2IGlkPVwibG9naW4tZm9ybVwiIGNsYXNzPVwiaGlkZVwiPlxuXHRcdFx0XHRcdFx0PGgyPkxvZ2luPC9oMj5cblx0XHRcdFx0XHRcdDxmb3JtIG1ldGhvZD1cIlBPU1RcIiBjbGFzcz1cImFjY291bnQtZm9ybVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJwYXNzXCIgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkxvZ2luPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+PCEtLSAvYWNjb3VudC1mb3JtIC0tPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gbG9naW4tZm9ybSAtLT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJzaWdudXAtZm9ybVwiPlxuXHRcdFx0XHRcdFx0PGgyPlNpZ251cDwvaDI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBtZXRob2Q9XCJQT1NUXCIgY2xhc3M9XCJhY2NvdW50LWZvcm1cIj5cblx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQ8YnI+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwicGFzc1wiIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIj5cblx0XHRcdFx0XHRcdFx0PGJyPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkVtYWlsXCI+XG5cdFx0XHRcdFx0XHRcdDxicj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+U2lnbnVwPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+PCEtLSAvYWNjb3VudC1mb3JtIC0tPlxuXHRcdFx0XHRcdDwvZGl2PjwhLS0gc2lnbnVwLWZvcm0gLS0+XG5cdFx0XHRcdFx0PGEgaWQ9XCJjaGFuZ2UtZm9ybS10eXBlXCIgdHlwZS12YWx1ZT1cIjFcIj48dT48cD5Mb2dnaW5nIGluPzwvcD48L3U+PC9hPlxuXHRcdFx0XHQ8L2Rpdj48IS0tIC9sb2dpbi1zaWdudXAgLS0+XG5cdFx0XHRcdFxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fSxcblxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbi1mb3JtJyk7XG5cdFx0c2lnbnVwRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWdudXAtZm9ybScpO1xuXHRcdGNoYW5nZUZvcm1UeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYW5nZS1mb3JtLXR5cGUnKTtcblxuXHRcdC8vIGNsaWNrIGV2ZW50IGR5bmFtaWNhbGx5IGNoYW5nZXMgdGhlIGFjY291bnQgZm9ybSBmcm9tIHNpZ251cCB0byBsb2dpblxuXHRcdGlmKGNoYW5nZUZvcm1UeXBlICE9PSBudWxsKSB7XG5cdFx0XHRjaGFuZ2VGb3JtVHlwZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF8gPT4ge1xuXHRcdFx0XHR0eXBlVmFsdWUgPSBjaGFuZ2VGb3JtVHlwZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlLXZhbHVlXCIpO1xuXG5cdFx0XHRcdC8vIGhpZGVzIG9yIHVuaGlkZXMgdGhlIGN1cnJlbnQgZm9ybVxuXHRcdFx0XHRpZih0eXBlVmFsdWUgPT09ICcwJykge1xuXHRcdFx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cdFx0XHRcdFx0c2lnbnVwRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuc2V0QXR0cmlidXRlKFwidHlwZS12YWx1ZVwiLCAnMScpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLmlubmVyVGV4dCA9IFwiTG9nZ2luZyBpbj9cIlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cdFx0XHRcdFx0c2lnbnVwRm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cdFx0XHRcdFx0Y2hhbmdlRm9ybVR5cGUuc2V0QXR0cmlidXRlKFwidHlwZS12YWx1ZVwiLCAnMCcpO1xuXHRcdFx0XHRcdGNoYW5nZUZvcm1UeXBlLmlubmVyVGV4dCA9IFwiU2lnbmluZyB1cD9cIlxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGV0IHNpZ251cFRydWVGb3JtID0gc2lnbnVwRm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZm9ybScpWzBdO1xuXHRcdFx0Y29uc29sZS5sb2coc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHMpO1xuXG5cdFx0XHRzaWdudXBUcnVlRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblxuXHRcdFx0XHQvLyBwcmV2ZW50IGZvcm0gZnJvbSByZWxvYWRpbmcgcGFnZSBhbmQgc2VuZGluZ1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0bGV0IHVzZXJuYW1lVmFsID0gc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ3VzZXJuYW1lJ10udmFsdWU7XG5cdFx0XHRcdGxldCBwYXNzVmFsID0gc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ3Bhc3MnXS52YWx1ZTtcblx0XHRcdFx0bGV0IGVtYWlsVmFsID0gc2lnbnVwVHJ1ZUZvcm0uZWxlbWVudHNbJ2VtYWlsJ10udmFsdWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0XHRpZih1c2VybmFtZVZhbCA9PT0gJycgfHwgcGFzc1ZhbCA9PT0gJycgfHwgZW1haWxWYWwgPT09ICcnKSB7XG5cdFx0XHRcdFx0YWxlcnQoJ09uZSBvciBtb3JlIGZpZWxkcyBhcmUgZW1wdHknKTtcblx0XHRcdFx0fSBlbHNlIGlmKCF2YWxpZGF0ZUVtYWlsKGVtYWlsVmFsKSkge1xuXHRcdFx0XHRcdGFsZXJ0KFwiSW52YWxpZCBlbWFpbCBmb3JtXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBjcmVhdGUgbG9naW4gb2JqZWN0IGJhc2VkIG9uIGZvcm1kYXRhXG5cdFx0XHRcdHZhciBzaWdudXBPYmogPSB7XG5cdFx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lVmFsLFxuXHRcdFx0XHRcdHBhc3M6IHBhc3NWYWwsXG5cdFx0XHRcdFx0ZW1haWw6IGVtYWlsVmFsLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNpZ25VcFVzZXIoc2lnbnVwT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcblxuXHRcdFx0XHRcdGlmKHJlc3VsdC5zaWdudXAgPT0gdHJ1ZSl7XG5cblx0XHRcdFx0XHRcdHZhciBsb2dpbk9iaiA9IHtcblx0XHRcdFx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lVmFsLFxuXHRcdFx0XHRcdFx0XHRwYXNzOiBwYXNzVmFsLFxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0bG9naW5Vc2VyKGxvZ2luT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdC5hY2Nlc3NUb2tlbik7XG5cblx0XHRcdFx0XHRcdFx0X3NldFRva2VuKHJlc3VsdC5hY2Nlc3NUb2tlbiwgdXNlcm5hbWVWYWwpO1xuXG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0Y29uc29sZS5sb2coc2lnbnVwVHJ1ZUZvcm0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCBsb2dpblRydWVGb3JtID0gbG9naW5Gb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF07XG5cdFx0XHRjb25zb2xlLmxvZyhsb2dpblRydWVGb3JtLmVsZW1lbnRzKTtcblxuXHRcdFx0bG9naW5UcnVlRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblxuXHRcdFx0XHQvLyBwcmV2ZW50IGZvcm0gZnJvbSByZWxvYWRpbmcgcGFnZSBhbmQgc2VuZGluZ1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0bGV0IHVzZXJuYW1lVmFsID0gbG9naW5UcnVlRm9ybS5lbGVtZW50c1sndXNlcm5hbWUnXS52YWx1ZTtcblx0XHRcdFx0bGV0IHBhc3NWYWwgPSBsb2dpblRydWVGb3JtLmVsZW1lbnRzWydwYXNzJ10udmFsdWU7XG5cblx0XHRcdFx0aWYodXNlcm5hbWVWYWwgPT09ICcnIHx8IHBhc3NWYWwgPT09ICcnKSB7XG5cdFx0XHRcdFx0YWxlcnQoJ09uZSBvciBtb3JlIGZpZWxkcyBhcmUgZW1wdHknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Ly8gY3JlYXRlIGxvZ2luIG9iamVjdCBiYXNlZCBvbiBmb3JtZGF0YVxuXHRcdFx0XHR2YXIgbG9naW5PYmogPSB7XG5cdFx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lVmFsLFxuXHRcdFx0XHRcdHBhc3M6IHBhc3NWYWwsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bG9naW5Vc2VyKGxvZ2luT2JqKS5kb25lKHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0XHRpZihyZXN1bHQubG9nZ2VkaW4gPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0LmFjY2Vzc1Rva2VuKTtcblxuXHRcdFx0XHRcdFx0X3NldFRva2VuKHJlc3VsdC5hY2Nlc3NUb2tlbiwgcmVzdWx0LnVzZXJJRCk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFsZXJ0KFwiV3JvbmcgY3JlZGVudGlhbHNcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhsb2dpblRydWVGb3JtKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQWNjb3VudCB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBBZGRtYXRjaFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgX3JlbW92ZVRva2VuID0gXyA9PiB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbk9iaicpO1xufTtcblxuY29uc3QgX2dldFRva2VuID0gXyA9PiB7XG5cbiAgICBsZXQgb25lSG91ciA9IDYwICogNjAgKiAxMDAwO1xuXG4gICAgLy8gZ2V0IG9iamVjdCwgcmV0dXJuIG51bGwgaWYgbnVsbFxuICAgIHZhciB0b2tlbk9iaiA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbk9iaicpKTtcbiAgICAvL2NvbnNvbGUubG9nKCd0b2tlbiBvYmonLCB0b2tlbk9iaik7XG4gICAgaWYoIXRva2VuT2JqKSByZXR1cm4gbnVsbDtcbiAgICBcbiAgICAvLyBpZiB0b2tlbiB0aW1lIGlzIHN0b3JlZCBmb3IgbW9yZSB0aGFuIGFuIGhvdXIgcmVtb3ZlIHRva2VuIGFuZCByZXR1cm4gbnVsbFxuICAgIHZhciB0b2tlblRpbWUgPSB0b2tlbk9iai50aW1lc3RhbXA7XG4gICAgdmFyIHRpbWVOb3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAvL2NvbnNvbGUubG9nKHRpbWVOb3cgLSB0b2tlblRpbWUpO1xuICAgIGlmKHRpbWVOb3cgLSB0b2tlblRpbWUgPiBvbmVIb3VyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZnJvbSBoZXJlIChnZXQgdG9rZW4pXCIpO1xuICAgICAgICBfcmVtb3ZlVG9rZW4oKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIHRva2VuXG4gICAgcmV0dXJuIHRva2VuT2JqLnRva2VuO1xufTtcblxuY29uc3QgZ2V0VGVhbXMgPSBfID0+IHtcblx0bGV0IHVybCA9ICdodHRwczovL2Zvb3RsaWItYmFja2VuZC5oZXJva3VhcHAuY29tL3RlYW1zJztcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufTtcblxuY29uc3QgX2dldFVzZXIgPSBfID0+IHtcblxuICAgIC8vIGdldCBvYmplY3QsIHJldHVybiBudWxsIGlmIG51bGxcbiAgICB2YXIgdG9rZW5PYmogPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW5PYmonKSk7XG4gICAgaWYoIXRva2VuT2JqKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdG9rZW5PYmoudXNlcjtcbn07XG5cbmNvbnN0IGJ1aWxkVGVhbU9wdGlvbnMgPSAodGVhbXMsIHRlYW1OdW1iZXIpID0+IHtcblx0Y29udGVudCA9IGBcblx0XHQ8c2VsZWN0IG5hbWU9XCJ0ZWFtJHsgdGVhbU51bWJlciB9XCIgaWQ9XCJ0ZWFtJHsgdGVhbU51bWJlciB9LXNlbGVjdG9yXCI+XG5cdGA7XG5cblx0Zm9yKGkgPSAwOyBpIDwgdGVhbXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zb2xlLmxvZyh0ZWFtc1tpXS50ZWFtSUQsIHRlYW1zW2ldLm5hbWUpO1xuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0PG9wdGlvbiB2YWx1ZT1cIiR7IHRlYW1zW2ldLnRlYW1JRCB9XCI+JHsgdGVhbXNbaV0ubmFtZSB9PC9vcHRpb24+XG5cdFx0YDtcblx0fVxuXG5cdGNvbnRlbnQgKz0gYFxuXHRcdDwvc2VsZWN0PlxuXHRgO1xuXG5cdHJldHVybiBjb250ZW50O1xufTtcblxuY29uc3QgY3JlYXRlTWF0Y2ggPSAoZGF0YSwgdXNlciwgdG9rZW4pID0+IHtcblx0bGV0IHVybCA9ICdodHRwczovL2Zvb3RsaWItYmFja2VuZC5oZXJva3VhcHAuY29tL21hdGNoZXMvJyArIHVzZXIgKyAnL2NyZWF0ZSc7XG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdGhlYWRlcnM6IHtcblx0XHRcdFwiQXV0aG9yaXphdGlvblwiOiB0b2tlbixcblx0XHR9LFxuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHRkYXRhOiBkYXRhLFxuXHRcdHVybDogdXJsLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgQWRkbWF0Y2ggPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cblx0XHRsZXQgdGVhbXM7XG5cblx0XHRnZXRUZWFtcygpLmRvbmUocmVzdWx0ID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCd0ZWFtczonLCByZXN1bHQpO1xuXHRcdFx0dGVhbXMgPSByZXN1bHQ7XG5cdFx0fSlcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8ZGl2IGlkPVwiYWRkLW1hdGNoLWZvcm1cIj5cblx0XHRcdFx0XHQ8aDE+QWRkIE1hdGNoPC9oMT5cblxuXHRcdFx0XHRcdDxiciAvPlxuXG5cdFx0XHRcdFx0PHU+PGgzPjxhIGhyZWY9XCIjL2Rhc2hib2FyZFwiPkJhY2sgdG8gRGFzaGJvYXJkPC9hPjwvaDM+PC91PlxuXG5cdFx0XHRcdFx0PGJyIC8+XG5cblx0XHRcdFx0XHQ8Zm9ybSBjbGFzcz1cImFkZC1tYXRjaC1mb3JtXCIgYWN0aW9uPVwiUE9TVFwiPlxuXHRcdGA7XG5cblx0XHRjb250ZW50ICs9IGJ1aWxkVGVhbU9wdGlvbnModGVhbXMsICcxJykgKyAnPGJyIC8+Jztcblx0XHRjb250ZW50ICs9IGJ1aWxkVGVhbU9wdGlvbnModGVhbXMsICcyJykgKyAnPGJyIC8+JztcblxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJzY29yZTFcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwic2NvcmUgMVwiPlxuXHRcdFx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInNjb3JlMlwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJzY29yZSAyXCI+XG5cdFx0XHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwiZGVzY3JpcHRpb25cIiBuYW1lPVwiXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImRlc2NyaXB0aW9uXCI+XG5cdFx0XHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0XHRcdDxpbnB1dCBuYW1lPVwibWF0Y2h1cmxcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVmlkZW8gTGluayAob3B0aW9uYWwpXCI+XG5cdFx0XHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJzdWJtaXQtYWRkLW1hdGNoLWJ0blwiIHR5cGU9XCJzdWJtaXRcIj5BZGQgTWF0Y2g8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Zvcm0+PCEtLSBhZGQtbWF0Y2gtZm9ybSAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvYWRkLW1hdGNoLWZvcm0gLS0+XG5cdFx0XHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XG5cdFx0YDtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fSxcblxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHtcblx0XHRhZGRNYXRjaEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLW1hdGNoLWZvcm0nKTtcblx0XHRpZihhZGRNYXRjaEZvcm0gIT09IG51bGwpIHtcblx0XHRcdGxldCBhZGRNYXRjaFRydWVGb3JtID0gYWRkTWF0Y2hGb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF07XG5cdFx0XHRhZGRNYXRjaFRydWVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXG5cdFx0XHRcdC8vIHByZXZlbnQgZm9ybSBmcm9tIHJlbG9hZGluZyBwYWdlIGFuZCBzZW5kaW5nXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRsZXQgdXNlciA9IF9nZXRVc2VyKCk7XG5cdFx0XHRcdGxldCB0ZWFtMVZhbCA9IGFkZE1hdGNoVHJ1ZUZvcm0uZWxlbWVudHNbJ3RlYW0xJ10udmFsdWU7XG5cdFx0XHRcdGxldCB0ZWFtMlZhbCA9IGFkZE1hdGNoVHJ1ZUZvcm0uZWxlbWVudHNbJ3RlYW0yJ10udmFsdWU7XG5cdFx0XHRcdGxldCBzY29yZTFWYWwgPSBhZGRNYXRjaFRydWVGb3JtLmVsZW1lbnRzWydzY29yZTEnXS52YWx1ZTtcblx0XHRcdFx0bGV0IHNjb3JlMlZhbCA9IGFkZE1hdGNoVHJ1ZUZvcm0uZWxlbWVudHNbJ3Njb3JlMiddLnZhbHVlO1xuXHRcdFx0XHRsZXQgZGVzY3JpcHRpb25WYWwgPSBhZGRNYXRjaFRydWVGb3JtLmVsZW1lbnRzWydkZXNjcmlwdGlvbiddLnZhbHVlO1xuXHRcdFx0XHRsZXQgbWF0Y2h1cmxWYWwgPSBhZGRNYXRjaFRydWVGb3JtLmVsZW1lbnRzWydtYXRjaHVybCddLnZhbHVlID8gYWRkTWF0Y2hUcnVlRm9ybS5lbGVtZW50c1snbWF0Y2h1cmwnXS52YWx1ZSA6IG51bGw7XG5cblx0XHRcdFx0Ly8gZm9ybSB2YWxpZGF0aW9uXG5cdFx0XHRcdGlmKHRlYW0xVmFsID09PSAnJyB8fCB0ZWFtMlZhbCA9PT0gJycgfHwgc2NvcmUxVmFsID09PSAnJyB8fCBzY29yZTJWYWwgPT09ICcnIHx8IGRlc2NyaXB0aW9uVmFsID09PSAnJykge1xuXHRcdFx0XHRcdGFsZXJ0KCdPbmUgb3IgbW9yZSBmaWVsZHMgYXJlIGVtcHR5Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC8vIGNyZWF0ZSBsb2dpbiBvYmplY3QgYmFzZWQgb24gZm9ybWRhdGFcblx0XHRcdFx0dmFyIGFkZE1hdGNoT2JqID0ge1xuXHRcdFx0XHRcdHVzZXJJRDogdXNlcixcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25WYWwsXG5cdFx0XHRcdFx0c2NvcmUxOiBzY29yZTFWYWwsXG5cdFx0XHRcdFx0c2NvcmUyOiBzY29yZTJWYWwsXG5cdFx0XHRcdFx0dGVhbUlEMTogdGVhbTFWYWwsXG5cdFx0XHRcdFx0dGVhbUlEMjogdGVhbTJWYWwsXG5cdFx0XHRcdFx0bWF0Y2hVUkw6IG1hdGNodXJsVmFsLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGxldCB0b2tlbiA9IF9nZXRUb2tlbigpO1xuXG5cdFx0XHRcdGNyZWF0ZU1hdGNoKGFkZE1hdGNoT2JqLCB1c2VyLCB0b2tlbikuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyAnIy9kYXNoYm9hcmQnO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBBZGRtYXRjaCB9IiwiLy8gPT09PT09PT09PT09PT09PT09PT1cbi8vIERhc2hib2FyZFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgX2dldFVzZXIgPSBfID0+IHtcbiAgICAvLyBnZXQgb2JqZWN0LCByZXR1cm4gbnVsbCBpZiBudWxsXG4gICAgdmFyIHRva2VuT2JqID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuT2JqJykpO1xuICAgIGlmKCF0b2tlbk9iaikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRva2VuT2JqLnVzZXI7XG59O1xuXG5jb25zdCBfZ2V0VG9rZW4gPSBfID0+IHtcbiAgICBsZXQgb25lSG91ciA9IDYwICogNjAgKiAxMDAwO1xuXG4gICAgLy8gZ2V0IG9iamVjdCwgcmV0dXJuIG51bGwgaWYgbnVsbFxuICAgIHZhciB0b2tlbk9iaiA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbk9iaicpKTtcbiAgICAvL2NvbnNvbGUubG9nKCd0b2tlbiBvYmonLCB0b2tlbk9iaik7XG4gICAgaWYoIXRva2VuT2JqKSByZXR1cm4gbnVsbDtcbiAgICBcbiAgICAvLyBpZiB0b2tlbiB0aW1lIGlzIHN0b3JlZCBmb3IgbW9yZSB0aGFuIGFuIGhvdXIgcmVtb3ZlIHRva2VuIGFuZCByZXR1cm4gbnVsbFxuICAgIHZhciB0b2tlblRpbWUgPSB0b2tlbk9iai50aW1lc3RhbXA7XG4gICAgdmFyIHRpbWVOb3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAvL2NvbnNvbGUubG9nKHRpbWVOb3cgLSB0b2tlblRpbWUpO1xuICAgIGlmKHRpbWVOb3cgLSB0b2tlblRpbWUgPiBvbmVIb3VyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZnJvbSBoZXJlIChnZXQgdG9rZW4pXCIpO1xuICAgICAgICBfcmVtb3ZlVG9rZW4oKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIHRva2VuXG4gICAgcmV0dXJuIHRva2VuT2JqLnRva2VuO1xufTtcblxuY29uc3QgZ2V0VXNlck1hdGNoZXNBamF4ID0gdXNlciA9PiB7XG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzLycgKyB1c2VyO1xuXHRyZXR1cm4gJC5hamF4KHtcblx0XHR0eXBlOiAnR0VUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpO1xuXHRcdH1cblx0fSk7XG59XG5cbmNvbnN0IGRlbGV0ZU1hdGNoID0gKHVzZXIsIG1hdGNoLCB0b2tlbikgPT4ge1xuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbWF0Y2hlcy8nICsgdXNlciArICcvZGVsZXRlLycgKyBtYXRjaDtcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0aGVhZGVyczoge1xuXHRcdFx0XCJBdXRob3JpemF0aW9uXCI6IHRva2VuLFxuXHRcdH0sXG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdGRhdGF0eXBlOiAnanNvbicsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IHRydWUsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG5jb25zdCBtYXRjaFdpbm5lciA9IG1hdGNoID0+IHtcblx0cmV0dXJuIG1hdGNoLnNjb3JlMSA+IG1hdGNoLnNjb3JlMiA/IG1hdGNoLnRlYW1JRDFfTmFtZSA6IG1hdGNoLnRlYW1JRDJfTmFtZTtcbn1cblxubGV0IGJ1aWxkQWRkTWF0Y2ggPSBfID0+IHtcblx0cmV0dXJuIGBcblx0XHQ8ZGl2IGlkPVwiYWRkLW1hdGNoLWZvcm1cIj5cblx0XHRcdDxoMT5BZGQgTWF0Y2g8L2gxPlxuXG5cdFx0XHQ8YnV0dG9uIGlkPVwiYmFjay1kYXNoYm9hcmQtYnRuXCI+QmFjayB0byBEYXNoYm9hcmQ8L2J1dHRvbj5cblxuXHRcdFx0PGZvcm0gY2xhc3M9XCJhZGQtbWF0Y2gtZm9ybVwiIGFjdGlvbj1cIlBPU1RcIj5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUaXRsZVwiPlxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUZWFtc1wiPlxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJzY29yZVwiPlxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJ3aW5uZXJcIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZGVzY3JpcHRpb25cIj5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJzdWJtaXQtYWRkLW1hdGNoLWJ0blwiIHR5cGU9XCJzdWJtaXRcIj5BZGQgTWF0Y2g8L2J1dHRvbj5cblx0XHRcdDwvZm9ybT48IS0tIGFkZC1tYXRjaC1mb3JtIC0tPlxuXHRcdDwvZGl2PjwhLS0gL2FkZC1tYXRjaC1mb3JtIC0tPlxuXHRgXG59XG5cbmxldCBidWlsZE1hdGNoUm93ID0gKG1hdGNoLCBpbmRleCkgPT4ge1xuXHRyZXR1cm4gYFxuXHRcdDx0ciBpZD1cIm1hdGNoLXJvdy0keyBtYXRjaFdpbm5lcihtYXRjaCkgfVwiIGNsYXNzPVwibWF0Y2gtcm93XCI+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0aXRsZVwiPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSArICcgdnMuICcgKyBtYXRjaC50ZWFtSUQyX05hbWUgfTwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJ0ZWFtMVwiPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSB9PC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cInRlYW0yXCI+JHsgbWF0Y2gudGVhbUlEMl9OYW1lIH08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwic2NvcmUxXCI+JHsgbWF0Y2guc2NvcmUxIH08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwic2NvcmUyXCI+JHsgbWF0Y2guc2NvcmUyIH08L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZWRpdFwiPjxidXR0b24gY2xhc3M9XCJlZGl0LWJ0blwiPkVkaXQ8L2J1dHRvbj48L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZGVsZXRlXCI+PGJ1dHRvbiBpZD1cImRlbGV0ZS1idG4tJHsgaW5kZXggfVwiIG1hdGNoaWQ9XCIkeyBtYXRjaC5tYXRjaElEIH1cIiBjbGFzcz1cImRlbGV0ZS1idG5cIj5EZWxldGU8L2J1dHRvbj48L3RkPlxuXHRcdDwvdHI+XG5cdGA7XG59XG5cbmxldCBidWlsZERhc2hib2FyZCA9IG1hdGNoZXMgPT4ge1xuXHRjb250ZW50ID0gYFxuXHRcdDxoMT5EYXNoYm9hcmQ8L2gxPlxuXG5cdFx0PGJ1dHRvbiBpZD1cImFkZC1tYXRjaC1idG5cIiBjbGFzcz1cImFkZC1tYXRjaC1idG5cIj5BZGQgTWF0Y2ggKzwvYnV0dG9uPlxuXG5cdFx0PHRhYmxlIGlkPVwiZGFzaGJvYXJkLXRhYmxlXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0aD5UaXRsZTwvdGg+XG5cdFx0XHRcdDx0aD5UZWFtIDE8L3RoPlxuXHRcdFx0XHQ8dGg+VGVhbSAyPC90aD5cblx0XHRcdFx0PHRoPlNjb3JlIDE8L3RoPlxuXHRcdFx0XHQ8dGg+U2NvcmUgMjwvdGg+XG5cdFx0XHRcdDx0aD5FZGl0PC90aD5cblx0XHRcdFx0PHRoPkRlbGV0ZTwvdGg+XG5cdFx0XHQ8L3RyPlxuXHRgXG5cdC8vIGZvciBlYWNoIG1hdGNoIGluIG1hdGNoZXMgYnVpbGQgdGhlIHJvd1xuXHRmb3IoaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29udGVudCArPSBidWlsZE1hdGNoUm93KG1hdGNoZXNbaV0sIGkpO1xuXHR9XG5cdGNvbnRlbnQgKz0gYFxuXHRcdDwvdGFibGU+PCEtLSAvZGFzaGJvYXJkLXRhYmxlIC0tPlxuXHRgXG5cdHJldHVybiBjb250ZW50O1xufVxuXG5sZXQgRGFzaGJvYXJkID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXHRcdGxldCB1c2VyID0gX2dldFVzZXIoKTtcblx0XHRsZXQgbWF0Y2hlcztcblx0XHRnZXRVc2VyTWF0Y2hlc0FqYXgodXNlcikuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0bWF0Y2hlcyA9IHJlc3VsdDtcblx0XHR9KTtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwiZGFzaGJvYXJkXCI+XG5cdFx0YDtcblxuXHRcdGxldCBkYXNoYm9hcmQgPSBidWlsZERhc2hib2FyZChtYXRjaGVzKTtcblx0XHRjb250ZW50ICs9IGRhc2hib2FyZCArIGBcblx0XHRcdFx0PC9kaXY+PCEtLSAvZGFzaGJvYXJkIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdGA7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cblx0cG9zdFJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IGRhc2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGJvYXJkJyk7XG5cdFx0bGV0IGFkZE1hdGNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1tYXRjaC1idG4nKTtcblx0XHRhZGRNYXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF8gPT4ge1xuXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSArICcjL2FkZG1hdGNoJztcblx0XHR9KTtcblxuXHRcdGxldCBkZWxldGVCdG5BcnIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWxldGUtYnRuJyk7XG5cdFx0Zm9yKGkgPSAwOyBpIDwgZGVsZXRlQnRuQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgZGVsS2V5ID0gZGVsZXRlQnRuQXJyW2ldLmdldEF0dHJpYnV0ZSgnbWF0Y2hpZCcpO1xuXHRcdFx0ZGVsZXRlQnRuQXJyW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgXyA9PiB7XG5cdFx0XHRcdGxldCB1c2VyID0gX2dldFVzZXIoKTtcblx0XHRcdFx0bGV0IHRva2VuID0gX2dldFRva2VuKCk7XG5cblx0XHRcdFx0ZGVsZXRlTWF0Y2godXNlciwgZGVsS2V5LCB0b2tlbikuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBEYXNoYm9hcmQgfTsiLCIvLyA9PT09PT09PT09PT09PT09PT09PVxuLy8gSG9tZXBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IHRoaXJkUGFydHlDYWxsID0gXyA9PiB7XG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9hcGktZm9vdGJhbGwtdjEucC5yYXBpZGFwaS5jb20vdjIvbGVhZ3VlVGFibGUvNTI0Jztcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0aGVhZGVyczoge1xuXHRcdFx0XCJ4LXJhcGlkYXBpLWhvc3RcIjogXCJhcGktZm9vdGJhbGwtdjEucC5yYXBpZGFwaS5jb21cIixcblx0XHRcdFwieC1yYXBpZGFwaS1rZXlcIjogXCI5NGIyYTE3MWJjbXNoYzU4NjZlOTdiMTc3NTU3cDE1ZWExMWpzbjQyZThjNmY4NzFjMVwiXG5cdFx0fSxcblx0XHR0eXBlOiAnR0VUJyxcblx0XHRkYXRhdHlwZTogJ2pzb25wJyxcblx0XHRjcm9zc2RvbWFpbjogdHJ1ZSxcblx0XHR1cmw6IHVybCxcblx0XHRhc3luYzogZmFsc2UsXG5cdFx0c3VjY2VzczogZGF0YSA9PiB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpO1xuXHRcdH1cblx0fSk7XG59XG5cbmNvbnN0IGdldE1hdGNoZXNBamF4ID0gXyA9PiB7XG5cdGxldCB1cmwgPSAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzJztcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0dXJsOiB1cmwsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhkYXRhKTtcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBidWlsZHMgdGhlIGh0bWwgZm9yIGEgZnVsbCBzZXQgb2YgbWF0Y2ggY2FyZHMgZ2l2ZW4gYSBsaXN0IG9mIG1hdGNoIG9iamVjdHNcbmxldCBidWlsZE1hdGNoQ2FyZFNldCA9IG1hdGNoZXMgPT4ge1xuXHRjb250ZW50ID0gJydcblx0Zm9yKGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2ggY2FyZHMgaW50byBjb250ZW50XG5cdFx0Y29udGVudCArPSBidWlsZE1hdGNoQ2FyZChtYXRjaGVzW2ldLCBpKTtcblx0fVxuXHRyZXR1cm4gY29udGVudFxufVxuXG4vLyBmdW5jdGlvbiByZWNpZXZlcyBhIG1hdGNoIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgaHRtbCBuZWVkZWQgdG8gcmVuZGVyIHRoZSBtYXRjaCBjYXJkXG5sZXQgYnVpbGRNYXRjaENhcmQgPSAobWF0Y2gsIGluZGV4KSA9PiB7XG5cdHJldHVybiBgXG5cdDxkaXYgaWQ9XCJtYXRjaC1jYXJkLSR7IGluZGV4IH1cIiBjbGFzcz1cIm1hdGNoLWNhcmRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtY2FyZC1ncmFwaGljXCI+XG5cdFx0XHRcblx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1jYXJkLWdyYXBoaWMgLS0+XG5cdFx0PGgyIGNsYXNzPVwibWF0Y2gtY2FyZC10aXRsZVwiPjxhIGhyZWY9XCIjL21hdGNoLyR7IG1hdGNoLm1hdGNoSUQgfVwiPiR7IG1hdGNoLnRlYW1JRDFfTmFtZSArICdcXG52cy5cXG4nICsgbWF0Y2gudGVhbUlEMl9OYW1lIH08L2E+PC9oMj5cblx0XHQ8aDIgY2xhc3M9XCJtYXRjaC1jYXJkLXNjb3JlXCI+JHsgbWF0Y2guc2NvcmUxIH0gLSAkeyBtYXRjaC5zY29yZTIgfTwvaDI+XG5cdFx0PHA+JHsgbWF0Y2guZGVzY3JpcHRpb24gfTwvcD5cblx0PC9kaXY+PCEtLSAvbWF0Y2ggLS0+XG5cdGBcbn1cblxubGV0IGJ1aWxkU3RhbmRpbmdzQ2FyZHNTZXQgPSBzdGFuZGluZ3MgPT4ge1xuXHRjb250ZW50ID0gJydcblx0Zm9yKGkgPSAwOyBpIDwgNjsgaSsrKSB7XG5cblx0XHRjb25zb2xlLmxvZygnc3RhbmRkbnNna2xkbmc6Jywgc3RhbmRpbmdzW2ldKTtcblxuXHRcdC8vIGJ1aWxkIG1hdGNoIGNhcmRzIGludG8gY29udGVudFxuXHRcdGNvbnRlbnQgKz0gYnVpbGRTdGFuZGluZ3NDYXJkKHN0YW5kaW5nc1tpXSwgaSk7XG5cdH1cblx0cmV0dXJuIGNvbnRlbnRcbn1cblxuY29uc3QgYnVpbGRTdGFuZGluZ3NDYXJkID0gKHN0YW5kaW5nLCBpbmRleCkgPT4ge1xuXHRyZXR1cm4gYFxuXHQ8ZGl2IGlkPVwibWF0Y2gtY2FyZC0keyBpbmRleCB9XCIgY2xhc3M9XCJzdGFuZGluZy1jYXJkIG1hdGNoLWNhcmRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtY2FyZC1ncmFwaGljXCI+XG5cdFx0XHRcblx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1jYXJkLWdyYXBoaWMgLS0+XG5cdFx0PGltZyBzcmM9XCIkeyBzdGFuZGluZy5sb2dvIH1cIiBhbHQ9XCIkeyBzdGFuZGluZy5sb2dvIH1cIiAvPlxuXHRcdDxoMyBjbGFzcz1cIm1hdGNoLWNhcmQtdGVhbVwiPiR7IHN0YW5kaW5nLnRlYW1OYW1lIH08L2gzPlxuXHRcdDxoMyBjbGFzcz1cIm1hdGNoLWNhcmQtbGVhZ3VlXCI+JHsgc3RhbmRpbmcuZ3JvdXAgfTwvaDM+XG5cdFx0PGgzIGNsYXNzPVwibWF0Y2gtY2FyZC1yYW5rXCI+UmFuayAkeyBzdGFuZGluZy5yYW5rIH08L2gzPlxuXHQ8L2Rpdj48IS0tIC9tYXRjaCAtLT5cblx0YFxufVxuXG5sZXQgSG9tZXBhZ2UgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0bGV0IG1hdGNoZXM7XG5cdFx0Z2V0TWF0Y2hlc0FqYXgoKS5kb25lKHJlc3VsdCA9PiB7XG5cdFx0XHRtYXRjaGVzID0gcmVzdWx0O1xuXHRcdH0pO1xuXG5cdFx0bGV0IHN0YW5kaW5ncyA9IFtdO1xuXHRcdHRoaXJkUGFydHlDYWxsKCkuZG9uZShyZXN1bHQgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcblx0XHRcdHN0YW5kaW5ncyA9IHJlc3VsdC5hcGkuc3RhbmRpbmdzWzBdO1xuXHRcdH0pO1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGlkPVwiaW5kZXhcIiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXG5cdFx0XHRcdDxoMT5UZWFtIFN0YW5kaW5nczwvaDE+XG5cdFx0YDtcblxuXHRcdGlmKHN0YW5kaW5ncy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb250ZW50ICs9IGBcblx0XHRcdFx0PGRpdiBpZD1cInN0YW5kaW5nc1wiIGNsYXNzPVwibWF0Y2hlcyBncmlkXCI+XG5cdFx0XHRgICsgYnVpbGRTdGFuZGluZ3NDYXJkc1NldChzdGFuZGluZ3MpICsgYFxuXHRcdFx0XHQ8L2Rpdj48IS0tIHN0YW5kaW5ncyAtLT5cblx0XHRcdGA7XG5cdFx0fVxuXHRcdGNvbnRlbnQgKz0gYFxuXHRcdFx0XHQ8YnI+XG5cblx0XHRcdFx0PGgxPk1hdGNoZXM8L2gxPlxuXHRcdFx0XHRcblx0XHRcdFx0PGRpdiBpZD1cInJlY2VudC1tYXRjaGVzXCIgY2xhc3M9XCJtYXRjaGVzIGdyaWRcIj5cblx0XHRgO1xuXG5cdFx0Ly8gYnVpbGQgbWF0Y2hlcyBzZXRcblx0XHRsZXQgbWF0Y2hDYXJkU2V0ID0gYnVpbGRNYXRjaENhcmRTZXQobWF0Y2hlcyk7XG5cdFx0Y29udGVudCArPSBtYXRjaENhcmRTZXQgKyBgXG5cdFx0XHQ8L2Rpdj48IS0tIHJlY2VudC1tYXRjaGVzIC0tPlxuXHRcdGA7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH0sXG5cdHBvc3RSZW5kZXI6IGFzeW5jIF8gPT4geyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBIb21lcGFnZSB9OyIsIi8vID09PT09PT09PT09PT09PT09PT09XG4vLyBNYXRjaFxuLy8gPT09PT09PT09PT09PT09PT09PT1cblxuLy8gKioqKioqKioqKioqKioqKioqKipcbi8vIEpRdWVyeSBBSkFYIENhbGxzXG4vLyAqKioqKioqKioqKioqKioqKioqKlxuY29uc3QgZ2V0TWF0Y2hlc0FqYXggPSBfID0+IHtcblx0cmV0dXJuICQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0ZGF0YXR5cGU6ICdqc29ucCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9mb290bGliLWJhY2tlbmQuaGVyb2t1YXBwLmNvbS9tYXRjaGVzL21hdGNoLycsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6IGRhdGEgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgZ2V0TWF0Y2hCeUlkID0gaWQgPT4ge1xuXHRsZXQgdXJsID0gJ2h0dHBzOi8vZm9vdGxpYi1iYWNrZW5kLmhlcm9rdWFwcC5jb20vbWF0Y2hlcy9tYXRjaC8nICsgaWQ7XG5cdHJldHVybiAkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdGRhdGF0eXBlOiAnanNvbnAnLFxuXHRcdHVybDogdXJsLFxuXHRcdGFzeW5jOiBmYWxzZSxcblx0XHRzdWNjZXNzOiBkYXRhID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdyZXNwb25zZSBkYXRhOicsIGRhdGEpO1xuXHRcdH1cblx0fSk7XG59XG5cbmNvbnN0IGdldFVybFF1ZXJ5ID0gXyA9PiB7XG5cdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdGxldCBxdWVyeSA9IHtcblx0XHRyb3V0ZSBcdDogdXJsWzFdID8gJy8nICsgdXJsWzFdIDogbnVsbCxcblx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHR9XG5cdHJldHVybiBxdWVyeTtcbn1cblxuY29uc3QgbWF0Y2hXaW5uZXIgPSBtYXRjaCA9PiB7XG5cdHJldHVybiBtYXRjaC5zY29yZTEgPiBtYXRjaC5zY29yZTIgPyBtYXRjaC50ZWFtSUQxX05hbWUgOiBtYXRjaC50ZWFtSUQyX05hbWU7XG59XG5cbmxldCBNYXRjaCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblx0XHRsZXQgaWQgPSBnZXRVcmxRdWVyeSgpLmlkO1xuXHRcdGxldCBtYXRjaDtcblx0XHRnZXRNYXRjaEJ5SWQoaWQpLmRvbmUocmVzdWx0ID0+IHtcblx0XHRcdG1hdGNoID0gcmVzdWx0WzBdO1xuXHRcdH0pO1xuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBpZD1cImluZGV4XCIgY2xhc3M9XCJjb250YWluZXJcIj5cblxuXHRcdFx0XHQ8dT48aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPjwvdT5cblxuXHRcdFx0XHQ8ZGl2IGlkPVwic2luZ2xlLW1hdGNoXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1hdGNoLWhlYWRsaW5lXCI+XG5cdFx0XHRcdFx0XHQ8aDE+JHsgbWF0Y2gudGVhbUlEMV9OYW1lIH0gVlMuICR7IG1hdGNoLnRlYW1JRDJfTmFtZSB9PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1oZWFkbGluZSAtLT5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtYXRjaC13aW5uZXJcIj5cblx0XHRcdFx0XHRcdDxoMT5XaW5uZXI6ICR7IG1hdGNoV2lubmVyKG1hdGNoKSB9PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC13aW5uZXIgLS0+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWF0Y2gtc3RhdHNcIj5cblx0XHRcdFx0XHRcdDxoMT5GaW5hbCBTY29yZTogJHsgbWF0Y2guc2NvcmUxIH0gOiAke21hdGNoLnNjb3JlMiB9PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9tYXRjaC1zdGF0cyAtLT5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8YXJ0aWNsZT5cblx0XHRcdFx0XHRcdDxoMSBjbGFzcz1cIm1hdGNoLXRpdGxlXCI+JHsgbWF0Y2gudGVhbUlEMV9OYW1lICsgJ1xcbnZzLlxcbicgKyBtYXRjaC50ZWFtSUQyX05hbWUgfTwvaDE+XG5cdFx0XHRcdFx0XHQ8cD4keyBtYXRjaC5kZXNjcmlwdGlvbiB9PC9wPlxuXHRcdFx0XHRcdDwvYXJ0aWNsZT5cblx0XHRgO1xuXHRcdGlmKG1hdGNoLm1hdGNoVVJMICE9IG51bGwgJiYgbWF0Y2gubWF0Y2hVUkwgIT0gJycpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdtYXRjaFVSTDonLCBtYXRjaC5tYXRjaFVSTCk7XG5cdFx0XHRjb250ZW50ICs9IGBcblx0XHRcdFx0PGlmcmFtZSBzcmM9XCIkeyBtYXRjaC5tYXRjaFVSTCB9XCIgaGVpZ2h0PVwiNDAwXCIgd2lkdGg9XCI2MDBcIiBmcmFtZWJvcmRlcj1cIjBcIj48L2lmcmFtZT5cblx0XHRcdGA7XG5cdFx0fVxuXHRcdGNvbnRlbnQgKz0gYFxuXG5cdFx0XHRcdDwvZGl2PjwhLS0gL3NpbmdsZS1tYXRjaCAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRgO1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9LFxuXHRwb3N0UmVuZGVyOiBhc3luYyBfID0+IHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBNYXRjaCB9OyIsImNvbnN0IFV0aWxpdGllcyA9IHtcblx0Z2V0VXJsUXVlcnk6IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH0sXG5cblx0cGFyc2VRdWVyeTogcXVlcnkgPT4ge1xuXHRcdHJldHVybiAocXVlcnkucm91dGUgPyAnJyArIHF1ZXJ5LnJvdXRlIDogJy8nKSArIChxdWVyeS5pZCA/ICcvOmlkJyA6ICcnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgVXRpbGl0aWVzIH07Il19
