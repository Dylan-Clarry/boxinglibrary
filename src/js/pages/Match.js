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