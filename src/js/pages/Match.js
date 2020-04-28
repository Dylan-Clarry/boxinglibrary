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