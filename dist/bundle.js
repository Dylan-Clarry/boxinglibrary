(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Homepage } = require('./js/pages/Homepage.js');
const { Post } = require('./js/pages/Post.js');
const { Account } = require('./js/pages/Account.js');
const { Dashboard } = require('./js/pages/Dashboard.js');
const { Match } = require('./js/pages/Match.js');

const { Navbar } = require('./js/components/Navbar.js');
const { Footer } = require('./js/components/Footer.js');

const { Utilities: Util } = require('./js/utilities/Utilities.js');

console.log("你好世界");

const routes = {
	'/': Homepage,
	'/index.html': Homepage,
	'/account': Account,
	'/dashboard': Dashboard,
	'/posts/:id': Post,
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

		let parsedQuery = Util.parseQuery(query);
		console.log(parsedQuery)

		// fix for first load, might need to change later
		if(!routes[parsedQuery]) {
			query.route = '/';
		}

		content.innerHTML = await routes[parsedQuery].render();


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
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/Account.js":4,"./js/pages/Dashboard.js":5,"./js/pages/Homepage.js":6,"./js/pages/Match.js":7,"./js/pages/Post.js":8,"./js/utilities/Utilities.js":9}],2:[function(require,module,exports){
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
					<a id="nav-logo" href="#/"><h1 class="nav-title">FOOTBALL LIBRARY</h1></a>

					<div id="navbar-items">
						<nav>
							<ul class="nav-list">
								<li><a href="#/dashboard">Dashboard</a></li>
								<li><a href="#/account">Account</a></li>
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
let Account = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Account</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Account };
},{}],5:[function(require,module,exports){
let Dashboard = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Dashboard</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Dashboard };
},{}],6:[function(require,module,exports){
let Homepage = {
	render: async _ => {

		let content = `
			<div class="container">
				<h1><a href="#/">Home</a> <a href="#/posts/1">Post 1</a> <a href="#/posts/2">Post 2</a></h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Homepage };
},{}],7:[function(require,module,exports){
let Match = {
	render: async _ => {

		let content = `
			<div class="container">
				<h2><a href="#/">Back</a></h2>
				<h1>Match</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Match };
},{}],8:[function(require,module,exports){
const getUrlQuery = _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	}

let Post = {
	render: async _ => {

		let id = getUrlQuery().id;

		let content = `
			<div>
				<h2><a href="#/">Back</a></h2>
				<h1>Post ${id}</h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Post };
},{}],9:[function(require,module,exports){
const Utilities = {
	getUrlQuery: _ => {
		let url = location.hash.slice(1).split('/');
		let query = {
			route 	: url[1] ? '/' + url[1] : null,
			id 		: url[2] ? url[2] : null,
		}
		return query;
	},

	parseQuery: query => {
		return (query.route ? '' + query.route : '/') + (query.id ? '/:id' : '');
	}
}

module.exports = { Utilities };
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWNjb3VudC5qcyIsInNyYy9qcy9wYWdlcy9EYXNoYm9hcmQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvTWF0Y2guanMiLCJzcmMvanMvcGFnZXMvUG9zdC5qcyIsInNyYy9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgeyBIb21lcGFnZSB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9Ib21lcGFnZS5qcycpO1xuY29uc3QgeyBQb3N0IH0gPSByZXF1aXJlKCcuL2pzL3BhZ2VzL1Bvc3QuanMnKTtcbmNvbnN0IHsgQWNjb3VudCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BY2NvdW50LmpzJyk7XG5jb25zdCB7IERhc2hib2FyZCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9EYXNoYm9hcmQuanMnKTtcbmNvbnN0IHsgTWF0Y2ggfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvTWF0Y2guanMnKTtcblxuY29uc3QgeyBOYXZiYXIgfSA9IHJlcXVpcmUoJy4vanMvY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbmNvbnN0IHsgRm9vdGVyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvRm9vdGVyLmpzJyk7XG5cbmNvbnN0IHsgVXRpbGl0aWVzOiBVdGlsIH0gPSByZXF1aXJlKCcuL2pzL3V0aWxpdGllcy9VdGlsaXRpZXMuanMnKTtcblxuY29uc29sZS5sb2coXCLkvaDlpb3kuJbnlYxcIik7XG5cbmNvbnN0IHJvdXRlcyA9IHtcblx0Jy8nOiBIb21lcGFnZSxcblx0Jy9pbmRleC5odG1sJzogSG9tZXBhZ2UsXG5cdCcvYWNjb3VudCc6IEFjY291bnQsXG5cdCcvZGFzaGJvYXJkJzogRGFzaGJvYXJkLFxuXHQnL3Bvc3RzLzppZCc6IFBvc3QsXG59O1xuXG5cbmNvbnN0IHJ1bkFwcCA9IGFzeW5jIF8gPT4ge1xuXG5cdC8vIGZpbmQgdGhlIGFwcCBkaXYgdG8gYWRkIHBhZ2UgY29udGVudCB0b1xuXHRjb25zdCBhcHAgPSBudWxsIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblx0aWYoYXBwKSB7XG5cdFx0bGV0IG5hdiA9IGFwcC5jaGlsZHJlbi5uYXY7XG5cdFx0bGV0IGZvb3RlciA9IGFwcC5jaGlsZHJlbi5mb290ZXI7XG5cdFx0bGV0IGNvbnRlbnQgPSBhcHAuY2hpbGRyZW4uY29udGVudDtcblxuXHRcdG5hdi5pbm5lckhUTUwgPSBhd2FpdCBOYXZiYXIucmVuZGVyKCk7XG5cdFx0Zm9vdGVyLmlubmVySFRNTCA9IGF3YWl0IEZvb3Rlci5yZW5kZXIoKTtcblx0XHRcblx0XHRxdWVyeSA9IFV0aWwuZ2V0VXJsUXVlcnkoKTtcblx0XHRjb25zb2xlLmxvZygncXVlcnk6JywgcXVlcnkpO1xuXG5cdFx0bGV0IHBhcnNlZFF1ZXJ5ID0gVXRpbC5wYXJzZVF1ZXJ5KHF1ZXJ5KTtcblx0XHRjb25zb2xlLmxvZyhwYXJzZWRRdWVyeSlcblxuXHRcdC8vIGZpeCBmb3IgZmlyc3QgbG9hZCwgbWlnaHQgbmVlZCB0byBjaGFuZ2UgbGF0ZXJcblx0XHRpZighcm91dGVzW3BhcnNlZFF1ZXJ5XSkge1xuXHRcdFx0cXVlcnkucm91dGUgPSAnLyc7XG5cdFx0fVxuXG5cdFx0Y29udGVudC5pbm5lckhUTUwgPSBhd2FpdCByb3V0ZXNbcGFyc2VkUXVlcnldLnJlbmRlcigpO1xuXG5cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU1BBIEVycm9yOiByb290IGVsZW1lbnQgZGl2IHdpdGggaWQgJ2FwcCcgbm90IGZvdW5kXCIpO1xuXHR9XG59XG5cbmNvbnN0IHJ1blBvc3RQYWdlTG9hZCA9IF8gPT4ge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bkFwcCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcnVuQXBwKTtcblxucnVuUG9zdFBhZ2VMb2FkKCk7XG5cbi8vIHN0YXJ0IGNvbW1hbmRcbi8vIGxpdmUtc2VydmVyIC0tcG9ydD04MDgwIC4vIC0tdmVyYm9zZSAtLXNwYVxuLy8gd2F0Y2hpZnkgLi9zcmMvYXBwLmpzIC1vIC4vZGlzdC9idW5kbGUuanMgLWQgLXYiLCJjb25zdCBGb290ZXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD48c2NyaXB0PmRvY3VtZW50LndyaXRlKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSk7PC9zY3JpcHQ+IEZvb3RiYWxsIExpYnJhcnkuIEFsbCByaWdodHMgcmVzZXZlcmVkLjwvcD5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9mb290ZXI+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBGb290ZXIgfSIsImNvbnN0IE5hdmJhciA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cIm5hdlwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGEgaWQ9XCJuYXYtbG9nb1wiIGhyZWY9XCIjL1wiPjxoMSBjbGFzcz1cIm5hdi10aXRsZVwiPkZPT1RCQUxMIExJQlJBUlk8L2gxPjwvYT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJuYXZiYXItaXRlbXNcIj5cblx0XHRcdFx0XHRcdDxuYXY+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cIm5hdi1saXN0XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPjxhIGhyZWY9XCIjL2Rhc2hib2FyZFwiPkRhc2hib2FyZDwvYT48L2xpPlxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9hY2NvdW50XCI+QWNjb3VudDwvYT48L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0PC9uYXY+XG5cdFx0XHRcdFx0PC9kaXY+PCEtLSAvbmF2YmFyLWRlc2t0b3AgLS0+XG5cdFx0XHRcdDwvZGl2PjwhLS0gL2NvbnRhaW5lciAtLT5cblx0XHRcdDwvZGl2PjwhLS0gL25hdiAtLT5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IE5hdmJhciB9IiwibGV0IEFjY291bnQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblx0XHRcdFx0PGgxPkFjY291bnQ8L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBBY2NvdW50IH07IiwibGV0IERhc2hib2FyZCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8aDI+PGEgaHJlZj1cIiMvXCI+QmFjazwvYT48L2gyPlxuXHRcdFx0XHQ8aDE+RGFzaGJvYXJkPC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgRGFzaGJvYXJkIH07IiwibGV0IEhvbWVwYWdlID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMT48YSBocmVmPVwiIy9cIj5Ib21lPC9hPiA8YSBocmVmPVwiIy9wb3N0cy8xXCI+UG9zdCAxPC9hPiA8YSBocmVmPVwiIy9wb3N0cy8yXCI+UG9zdCAyPC9hPjwvaDE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEhvbWVwYWdlIH07IiwibGV0IE1hdGNoID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcdDxoMT5NYXRjaDwvaDE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IE1hdGNoIH07IiwiY29uc3QgZ2V0VXJsUXVlcnkgPSBfID0+IHtcblx0XHRsZXQgdXJsID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKS5zcGxpdCgnLycpO1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdHJvdXRlIFx0OiB1cmxbMV0gPyAnLycgKyB1cmxbMV0gOiBudWxsLFxuXHRcdFx0aWQgXHRcdDogdXJsWzJdID8gdXJsWzJdIDogbnVsbCxcblx0XHR9XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9XG5cbmxldCBQb3N0ID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGlkID0gZ2V0VXJsUXVlcnkoKS5pZDtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGgyPjxhIGhyZWY9XCIjL1wiPkJhY2s8L2E+PC9oMj5cblx0XHRcdFx0PGgxPlBvc3QgJHtpZH08L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBQb3N0IH07IiwiY29uc3QgVXRpbGl0aWVzID0ge1xuXHRnZXRVcmxRdWVyeTogXyA9PiB7XG5cdFx0bGV0IHVybCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoJy8nKTtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHRyb3V0ZSBcdDogdXJsWzFdID8gJy8nICsgdXJsWzFdIDogbnVsbCxcblx0XHRcdGlkIFx0XHQ6IHVybFsyXSA/IHVybFsyXSA6IG51bGwsXG5cdFx0fVxuXHRcdHJldHVybiBxdWVyeTtcblx0fSxcblxuXHRwYXJzZVF1ZXJ5OiBxdWVyeSA9PiB7XG5cdFx0cmV0dXJuIChxdWVyeS5yb3V0ZSA/ICcnICsgcXVlcnkucm91dGUgOiAnLycpICsgKHF1ZXJ5LmlkID8gJy86aWQnIDogJycpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBVdGlsaXRpZXMgfTsiXX0=
