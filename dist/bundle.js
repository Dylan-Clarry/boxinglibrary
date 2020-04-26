(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/About.js":4,"./js/pages/Homepage.js":5,"./js/utilities/Utilities.js":6}],2:[function(require,module,exports){
const Footer = {
	render: async _ => {

		let content = `
			<footer>
				<div class="container">
					<p><script>document.write(new Date().getFullYear());</script> Football Library. All rights resevered.</p>
				</div><!-- /container -->
			</footer>
		`;

		return content;
	}
}

module.exports = { Footer }
},{}],3:[function(require,module,exports){
const Navbar = {
	render: async _ => {

		let content = `
			<div class="nav">
				<div class="container">
					<a id="nav-logo" href="./index.html"><h1 class="nav-title">FOOTBALL LIBRARY</h1></a>

					<div id="navbar-items">
						<nav>
							<ul class="nav-list">
								<li><a href="./dashboard.html">Dashboard</a></li>
								<li><a href="./account.html">Account</a></li>
							</ul>
						</nav>
					</div><!-- /navbar-desktop -->
				</div><!-- /container -->
			</div><!-- /nav -->
		`;

		return content;
	}
}

module.exports = { Navbar }
},{}],4:[function(require,module,exports){
let About = {
	render: async _ => {
		return `
			<div>
				<h2><a href="#/">Back</a></h2>
				<h1>About Page</h1>
			</div>
		`;
	}
}

module.exports = { About };
},{}],5:[function(require,module,exports){
let Homepage = {
	render: async _ => {

		let content = `
			<div>
				<h1><a href="#/">Home</a> <a href="#/about">About</a></h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Homepage };
},{}],6:[function(require,module,exports){
const Utilities = {
	getUrlQuery: _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}
}

module.exports = { Utilities };
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWJvdXQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgeyBIb21lcGFnZSB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9Ib21lcGFnZS5qcycpO1xuY29uc3QgeyBBYm91dCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BYm91dC5qcycpO1xuXG5jb25zdCB7IE5hdmJhciB9ID0gcmVxdWlyZSgnLi9qcy9jb21wb25lbnRzL05hdmJhci5qcycpO1xuY29uc3QgeyBGb290ZXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9Gb290ZXIuanMnKTtcblxuY29uc3QgeyBVdGlsaXRpZXM6IFV0aWwgfSA9IHJlcXVpcmUoJy4vanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcycpO1xuXG5jb25zb2xlLmxvZyhcIuS9oOWlveS4lueVjFwiKTtcblxuY29uc3Qgcm91dGVzID0ge1xuXHQnLyc6IEhvbWVwYWdlLFxuXHQnL2luZGV4Lmh0bWwnOiBIb21lcGFnZSxcblx0Jy9hYm91dCc6IEFib3V0LFxufTtcblxuXG5jb25zdCBydW5BcHAgPSBhc3luYyBfID0+IHtcblxuXHQvLyBmaW5kIHRoZSBhcHAgZGl2IHRvIGFkZCBwYWdlIGNvbnRlbnQgdG9cblx0Y29uc3QgYXBwID0gbnVsbCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cdGlmKGFwcCkge1xuXHRcdGxldCBuYXYgPSBhcHAuY2hpbGRyZW4ubmF2O1xuXHRcdGxldCBmb290ZXIgPSBhcHAuY2hpbGRyZW4uZm9vdGVyO1xuXHRcdGxldCBjb250ZW50ID0gYXBwLmNoaWxkcmVuLmNvbnRlbnQ7XG5cblx0XHRuYXYuaW5uZXJIVE1MID0gYXdhaXQgTmF2YmFyLnJlbmRlcigpO1xuXHRcdGZvb3Rlci5pbm5lckhUTUwgPSBhd2FpdCBGb290ZXIucmVuZGVyKCk7XG5cdFx0XG5cdFx0cXVlcnkgPSBVdGlsLmdldFVybFF1ZXJ5KCk7XG5cdFx0Y29uc29sZS5sb2coJ3F1ZXJ5OicsIHF1ZXJ5KTtcblxuXHRcdC8vIGZpeCBmb3IgZmlyc3QgbG9hZCwgbWlnaHQgbmVlZCB0byBjaGFuZ2UgbGF0ZXJcblx0XHRpZighcm91dGVzW3F1ZXJ5LnJvdXRlXSkge1xuXHRcdFx0cXVlcnkucm91dGUgPSAnLyc7XG5cdFx0fVxuXHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gYXdhaXQgcm91dGVzW3F1ZXJ5LnJvdXRlXS5yZW5kZXIoKTtcblxuXG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIlNQQSBFcnJvcjogcm9vdCBlbGVtZW50IGRpdiB3aXRoIGlkICdhcHAnIG5vdCBmb3VuZFwiKTtcblx0fVxufVxuXG5jb25zdCBydW5Qb3N0UGFnZUxvYWQgPSBfID0+IHtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5BcHApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHJ1bkFwcCk7XG5cbnJ1blBvc3RQYWdlTG9hZCgpO1xuXG4vLyBzdGFydCBjb21tYW5kXG4vLyBsaXZlLXNlcnZlciAtLXBvcnQ9ODA4MCAuLyAtLXZlcmJvc2UgLS1zcGFcbi8vIHdhdGNoaWZ5IC4vc3JjL2FwcC5qcyAtbyAuL2Rpc3QvYnVuZGxlLmpzIC1kIC12IiwiY29uc3QgRm9vdGVyID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8Zm9vdGVyPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PHA+PHNjcmlwdD5kb2N1bWVudC53cml0ZShuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkpOzwvc2NyaXB0PiBGb290YmFsbCBMaWJyYXJ5LiBBbGwgcmlnaHRzIHJlc2V2ZXJlZC48L3A+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZm9vdGVyPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgRm9vdGVyIH0iLCJjb25zdCBOYXZiYXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgY2xhc3M9XCJuYXZcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdDxhIGlkPVwibmF2LWxvZ29cIiBocmVmPVwiLi9pbmRleC5odG1sXCI+PGgxIGNsYXNzPVwibmF2LXRpdGxlXCI+Rk9PVEJBTEwgTElCUkFSWTwvaDE+PC9hPlxuXG5cdFx0XHRcdFx0PGRpdiBpZD1cIm5hdmJhci1pdGVtc1wiPlxuXHRcdFx0XHRcdFx0PG5hdj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwibmF2LWxpc3RcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIi4vZGFzaGJvYXJkLmh0bWxcIj5EYXNoYm9hcmQ8L2E+PC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+PGEgaHJlZj1cIi4vYWNjb3VudC5odG1sXCI+QWNjb3VudDwvYT48L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0PC9uYXY+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbmF2YmFyLWRlc2t0b3AgLS0+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL25hdiAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IE5hdmJhciB9IiwibGV0IEFib3V0ID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXHRcdHJldHVybiBgXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPlxuXHRcdFx0XHQ8aDE+QWJvdXQgUGFnZTwvaDE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBBYm91dCB9OyIsImxldCBIb21lcGFnZSA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGgxPjxhIGhyZWY9XCIjL1wiPkhvbWU8L2E+IDxhIGhyZWY9XCIjL2Fib3V0XCI+QWJvdXQ8L2E+PC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgSG9tZXBhZ2UgfTsiLCJjb25zdCBVdGlsaXRpZXMgPSB7XG5cdGdldFVybFF1ZXJ5OiBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBVdGlsaXRpZXMgfTsiXX0=
