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