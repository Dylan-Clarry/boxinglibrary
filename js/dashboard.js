// ====================
// dashboard.js
// ====================
dashboard = document.getElementById('dashboard');
addMatchBtn = '';

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

// let buildEditMatch = _ => {
	
// }

let buildMatchRow = (match, index) => {
	return `
		<tr id="match-row-${index}" class="match-row">
			<td class="title">${match.title}</td>
			<td class="team1">${match.teams[0]}</td>
			<td class="team2">${match.teams[1]}</td>
			<td class="edit"><button class="edit-btn">Edit</button></td>
			<td class="delete"><button class="delete-btn">Delete</button></td>
		</tr>
	`
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

if(dashboard !== null) {
	dashboard.innerHTML = buildDashboard(matches);
	addMatchBtn = document.getElementById('add-match-btn');

	// add add match button event listener
	addMatchBtn.addEventListener('click', _ => {
		dashboard.innerHTML = buildAddMatch();
		backDashboardBtn = document.getElementById('back-dashboard-btn');
		backDashboardBtn.addEventListener('click', _ => {
			dashboard.innerHTML = buildDashboard(matches);
			addMatchBtn = document.getElementById('add-match-btn');
		});
	});
}
