const { Homepage } = require('./js/pages/Homepage.js');
const { About } = require('./js/pages/About.js');

const { Navbar } = require('./js/components/Navbar.js');
const { Footer } = require('./js/components/Footer.js');

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
		let nav = app.children.nav;
		let footer = app.children.footer;
		let content = app.children.content;

		nav.innerHTML = await Navbar.render();
		footer.innerHTML = await Footer.render();
		
		query = Util.getUrlQuery();
		console.log('query:', query);

		// fix for first load, might need to change later
		if(!routes[query.route]) {
			query.route = '/';
		}
		content.innerHTML = await routes[query.route].render();


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