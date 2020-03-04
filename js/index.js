// ====================
// index.js
// ====================

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
	<div id="match-card-${index}" class="match-card">
		<div class="match-card-graphic">
			
		</div><!-- /match-card-graphic -->
		<h2 class="match-card-title"><a href="./single-match.html">${match.title}</a></h2>
		<h2 class="match-card-score">${match.score[0]} - ${match.score[1]}</h2>
		<p>${match.description}</p>
	</div><!-- /match -->
	`
}

// get page variables
homepageMatchesTag = document.getElementById('homepage-matches');
recentMatchesTag = document.getElementById('recent-matches');

if(homepageMatchesTag !== null) {
	content = buildMatchCardSet(matches);

	// render match cards to the page
	homepageMatchesTag.innerHTML = content;

	// repeat for recent match cards
	content = buildMatchCardSet(recentMatches);

	// render match cards to the page
	recentMatchesTag.innerHTML = content;
}
