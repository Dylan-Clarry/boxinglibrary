// ====================
// Dashboard
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

let Dashboard = {
	render: async _ => {

		matches = getMatches();
		console.log(matches);

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
		console.log("hello post", dash);
	}
}

module.exports = { Dashboard };