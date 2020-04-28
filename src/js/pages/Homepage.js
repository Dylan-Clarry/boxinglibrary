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