const { Homepage } = require('./js/pages/Homepage.js');
const { About } = require('./js/pages/About.js');

const { Utilities: Util } = require('./js/utilities/Utilities.js');

console.log("你好世界");


const routes = {
	'/': Homepage,
	'/index.html': Homepage,
	'/about': About,
};

const runApp = async _ => {

	// find the app div to add page content to
	const app = null || document.getElementById('app');
	if(app) {

		query = Util.getUrlQuery();

		// fix for first load, might need to change later
		if(!routes[query]) {
			query = '/';
		}
		app.innerHTML = await routes[query].render();


	} else {
		console.error("SPA Error: root element div with id 'app' not found");
	}
}

const runPostPageLoad = _ => {
	window.addEventListener('load', runApp);
}

window.addEventListener('hashchange', runApp);

runPostPageLoad();

// start command
// live-server --port=8080 ./ --verbose --spa
// watchify ./src/app.js -o ./dist/bundle.js -d -v