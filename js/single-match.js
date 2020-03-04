// ====================
// single-match.js
// ====================
singleMatch = document.getElementById('single-match');

// builds the html for an article given match data
buildSingleMatchArticle = match => {
	return `
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
	`
}

if(singleMatch !== null) {
	singleMatch.innerHTML = buildSingleMatchArticle(matches[0]);
}