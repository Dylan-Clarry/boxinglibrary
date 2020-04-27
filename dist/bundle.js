(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Homepage } = require('./js/pages/Homepage.js');
const { About } = require('./js/pages/About.js');
const { Post } = require('./js/pages/Post.js');

const { Navbar } = require('./js/components/Navbar.js');
const { Footer } = require('./js/components/Footer.js');

const { Utilities: Util } = require('./js/utilities/Utilities.js');

console.log("你好世界");

const routes = {
	'/': Homepage,
	'/index.html': Homepage,
	'/about': About,
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
},{"./js/components/Footer.js":2,"./js/components/Navbar.js":3,"./js/pages/About.js":4,"./js/pages/Homepage.js":5,"./js/pages/Post.js":6,"./js/utilities/Utilities.js":7}],2:[function(require,module,exports){
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
								<li><a href="#/">Dashboard</a></li>
								<li><a href="#/">Account</a></li>
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
				<h1><a href="#/">Home</a> <a href="#/about">About</a> <a href="#/posts/1">Post 1</a> <a href="#/posts/2">Post 2</a></h1>
			</div>
		`;

		return content;
	}
}

module.exports = { Homepage };
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJzcmMvanMvcGFnZXMvQWJvdXQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvcGFnZXMvUG9zdC5qcyIsInNyYy9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgSG9tZXBhZ2UgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvSG9tZXBhZ2UuanMnKTtcbmNvbnN0IHsgQWJvdXQgfSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvQWJvdXQuanMnKTtcbmNvbnN0IHsgUG9zdCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9Qb3N0LmpzJyk7XG5cbmNvbnN0IHsgTmF2YmFyIH0gPSByZXF1aXJlKCcuL2pzL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG5jb25zdCB7IEZvb3RlciB9ID0gcmVxdWlyZSgnLi9qcy9jb21wb25lbnRzL0Zvb3Rlci5qcycpO1xuXG5jb25zdCB7IFV0aWxpdGllczogVXRpbCB9ID0gcmVxdWlyZSgnLi9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzJyk7XG5cbmNvbnNvbGUubG9nKFwi5L2g5aW95LiW55WMXCIpO1xuXG5jb25zdCByb3V0ZXMgPSB7XG5cdCcvJzogSG9tZXBhZ2UsXG5cdCcvaW5kZXguaHRtbCc6IEhvbWVwYWdlLFxuXHQnL2Fib3V0JzogQWJvdXQsXG5cdCcvcG9zdHMvOmlkJzogUG9zdCxcbn07XG5cblxuY29uc3QgcnVuQXBwID0gYXN5bmMgXyA9PiB7XG5cblx0Ly8gZmluZCB0aGUgYXBwIGRpdiB0byBhZGQgcGFnZSBjb250ZW50IHRvXG5cdGNvbnN0IGFwcCA9IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRpZihhcHApIHtcblx0XHRsZXQgbmF2ID0gYXBwLmNoaWxkcmVuLm5hdjtcblx0XHRsZXQgZm9vdGVyID0gYXBwLmNoaWxkcmVuLmZvb3Rlcjtcblx0XHRsZXQgY29udGVudCA9IGFwcC5jaGlsZHJlbi5jb250ZW50O1xuXG5cdFx0bmF2LmlubmVySFRNTCA9IGF3YWl0IE5hdmJhci5yZW5kZXIoKTtcblx0XHRmb290ZXIuaW5uZXJIVE1MID0gYXdhaXQgRm9vdGVyLnJlbmRlcigpO1xuXHRcdFxuXHRcdHF1ZXJ5ID0gVXRpbC5nZXRVcmxRdWVyeSgpO1xuXHRcdGNvbnNvbGUubG9nKCdxdWVyeTonLCBxdWVyeSk7XG5cblx0XHRsZXQgcGFyc2VkUXVlcnkgPSBVdGlsLnBhcnNlUXVlcnkocXVlcnkpO1xuXHRcdGNvbnNvbGUubG9nKHBhcnNlZFF1ZXJ5KVxuXG5cdFx0Ly8gZml4IGZvciBmaXJzdCBsb2FkLCBtaWdodCBuZWVkIHRvIGNoYW5nZSBsYXRlclxuXHRcdGlmKCFyb3V0ZXNbcGFyc2VkUXVlcnldKSB7XG5cdFx0XHRxdWVyeS5yb3V0ZSA9ICcvJztcblx0XHR9XG5cdFx0XG5cdFx0Y29udGVudC5pbm5lckhUTUwgPSBhd2FpdCByb3V0ZXNbcGFyc2VkUXVlcnldLnJlbmRlcigpO1xuXG5cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU1BBIEVycm9yOiByb290IGVsZW1lbnQgZGl2IHdpdGggaWQgJ2FwcCcgbm90IGZvdW5kXCIpO1xuXHR9XG59XG5cbmNvbnN0IHJ1blBvc3RQYWdlTG9hZCA9IF8gPT4ge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bkFwcCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcnVuQXBwKTtcblxucnVuUG9zdFBhZ2VMb2FkKCk7XG5cbi8vIHN0YXJ0IGNvbW1hbmRcbi8vIGxpdmUtc2VydmVyIC0tcG9ydD04MDgwIC4vIC0tdmVyYm9zZSAtLXNwYVxuLy8gd2F0Y2hpZnkgLi9zcmMvYXBwLmpzIC1vIC4vZGlzdC9idW5kbGUuanMgLWQgLXYiLCJjb25zdCBGb290ZXIgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxmb290ZXI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHQ8cD48c2NyaXB0PmRvY3VtZW50LndyaXRlKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSk7PC9zY3JpcHQ+IEZvb3RiYWxsIExpYnJhcnkuIEFsbCByaWdodHMgcmVzZXZlcmVkLjwvcD5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9mb290ZXI+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBGb290ZXIgfSIsImNvbnN0IE5hdmJhciA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBjb250ZW50ID0gYFxuXHRcdFx0PGRpdiBjbGFzcz1cIm5hdlwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGEgaWQ9XCJuYXYtbG9nb1wiIGhyZWY9XCIjL1wiPjxoMSBjbGFzcz1cIm5hdi10aXRsZVwiPkZPT1RCQUxMIExJQlJBUlk8L2gxPjwvYT5cblxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJuYXZiYXItaXRlbXNcIj5cblx0XHRcdFx0XHRcdDxuYXY+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cIm5hdi1saXN0XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPjxhIGhyZWY9XCIjL1wiPkRhc2hib2FyZDwvYT48L2xpPlxuXHRcdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPVwiIy9cIj5BY2NvdW50PC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8L25hdj5cblx0XHRcdFx0XHQ8L2Rpdj48IS0tIC9uYXZiYXItZGVza3RvcCAtLT5cblx0XHRcdFx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxuXHRcdFx0PC9kaXY+PCEtLSAvbmF2IC0tPlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgTmF2YmFyIH0iLCJsZXQgQWJvdXQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcdDxoMT5BYm91dCBQYWdlPC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEFib3V0IH07IiwibGV0IEhvbWVwYWdlID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXG5cdFx0bGV0IGNvbnRlbnQgPSBgXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDE+PGEgaHJlZj1cIiMvXCI+SG9tZTwvYT4gPGEgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT4gPGEgaHJlZj1cIiMvcG9zdHMvMVwiPlBvc3QgMTwvYT4gPGEgaHJlZj1cIiMvcG9zdHMvMlwiPlBvc3QgMjwvYT48L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBIb21lcGFnZSB9OyIsImNvbnN0IGdldFVybFF1ZXJ5ID0gXyA9PiB7XG5cdFx0bGV0IHVybCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkuc3BsaXQoJy8nKTtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHRyb3V0ZSBcdDogdXJsWzFdID8gJy8nICsgdXJsWzFdIDogbnVsbCxcblx0XHRcdGlkIFx0XHQ6IHVybFsyXSA/IHVybFsyXSA6IG51bGwsXG5cdFx0fVxuXHRcdHJldHVybiBxdWVyeTtcblx0fVxuXG5sZXQgUG9zdCA9IHtcblx0cmVuZGVyOiBhc3luYyBfID0+IHtcblxuXHRcdGxldCBpZCA9IGdldFVybFF1ZXJ5KCkuaWQ7XG5cblx0XHRsZXQgY29udGVudCA9IGBcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxoMj48YSBocmVmPVwiIy9cIj5CYWNrPC9hPjwvaDI+XG5cdFx0XHRcdDxoMT5Qb3N0ICR7aWR9PC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgUG9zdCB9OyIsImNvbnN0IFV0aWxpdGllcyA9IHtcblx0Z2V0VXJsUXVlcnk6IF8gPT4ge1xuXHRcdGxldCB1cmwgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0cm91dGUgXHQ6IHVybFsxXSA/ICcvJyArIHVybFsxXSA6IG51bGwsXG5cdFx0XHRpZCBcdFx0OiB1cmxbMl0gPyB1cmxbMl0gOiBudWxsLFxuXHRcdH1cblx0XHRyZXR1cm4gcXVlcnk7XG5cdH0sXG5cblx0cGFyc2VRdWVyeTogcXVlcnkgPT4ge1xuXHRcdHJldHVybiAocXVlcnkucm91dGUgPyAnJyArIHF1ZXJ5LnJvdXRlIDogJy8nKSArIChxdWVyeS5pZCA/ICcvOmlkJyA6ICcnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgVXRpbGl0aWVzIH07Il19
