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