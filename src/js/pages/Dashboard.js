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