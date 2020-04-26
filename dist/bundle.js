(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./js/pages/About.js":2,"./js/pages/Homepage.js":3,"./js/utilities/Utilities.js":4}],2:[function(require,module,exports){
let About = {
	render: async _ => {
		return `
			<div>
				<h1>About Page</h1>
			</div>
		`;
	}
}

module.exports = { About };
},{}],3:[function(require,module,exports){
let Homepage = {
	render: async _ => {
		return `
			<div>
				<h1><a class="spalink" href="#/">Home</a> <a class="spalink" href="#/about">About</a></h1>
			</div>
		`;
	}
}

module.exports = { Homepage };
},{}],4:[function(require,module,exports){
const Utilities = {
	getUrlQuery: _ => {
		let query = location.hash.slice(1).split('/');
		console.log('query:', query);

		return '/' + query[1];
	}
}

module.exports = { Utilities };
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTMuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hcHAuanMiLCJzcmMvanMvcGFnZXMvQWJvdXQuanMiLCJzcmMvanMvcGFnZXMvSG9tZXBhZ2UuanMiLCJzcmMvanMvdXRpbGl0aWVzL1V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgeyBIb21lcGFnZSB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9Ib21lcGFnZS5qcycpO1xuY29uc3QgeyBBYm91dCB9ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9BYm91dC5qcycpO1xuXG5jb25zdCB7IFV0aWxpdGllczogVXRpbCB9ID0gcmVxdWlyZSgnLi9qcy91dGlsaXRpZXMvVXRpbGl0aWVzLmpzJyk7XG5cbmNvbnNvbGUubG9nKFwi5L2g5aW95LiW55WMXCIpO1xuXG5cbmNvbnN0IHJvdXRlcyA9IHtcblx0Jy8nOiBIb21lcGFnZSxcblx0Jy9pbmRleC5odG1sJzogSG9tZXBhZ2UsXG5cdCcvYWJvdXQnOiBBYm91dCxcbn07XG5cbmNvbnN0IHJ1bkFwcCA9IGFzeW5jIF8gPT4ge1xuXG5cdC8vIGZpbmQgdGhlIGFwcCBkaXYgdG8gYWRkIHBhZ2UgY29udGVudCB0b1xuXHRjb25zdCBhcHAgPSBudWxsIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblx0aWYoYXBwKSB7XG5cblx0XHRxdWVyeSA9IFV0aWwuZ2V0VXJsUXVlcnkoKTtcblxuXHRcdC8vIGZpeCBmb3IgZmlyc3QgbG9hZCwgbWlnaHQgbmVlZCB0byBjaGFuZ2UgbGF0ZXJcblx0XHRpZighcm91dGVzW3F1ZXJ5XSkge1xuXHRcdFx0cXVlcnkgPSAnLyc7XG5cdFx0fVxuXHRcdGFwcC5pbm5lckhUTUwgPSBhd2FpdCByb3V0ZXNbcXVlcnldLnJlbmRlcigpO1xuXG5cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU1BBIEVycm9yOiByb290IGVsZW1lbnQgZGl2IHdpdGggaWQgJ2FwcCcgbm90IGZvdW5kXCIpO1xuXHR9XG59XG5cbmNvbnN0IHJ1blBvc3RQYWdlTG9hZCA9IF8gPT4ge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bkFwcCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcnVuQXBwKTtcblxucnVuUG9zdFBhZ2VMb2FkKCk7XG5cbi8vIHN0YXJ0IGNvbW1hbmRcbi8vIGxpdmUtc2VydmVyIC0tcG9ydD04MDgwIC4vIC0tdmVyYm9zZSAtLXNwYVxuLy8gd2F0Y2hpZnkgLi9zcmMvYXBwLmpzIC1vIC4vZGlzdC9idW5kbGUuanMgLWQgLXYiLCJsZXQgQWJvdXQgPSB7XG5cdHJlbmRlcjogYXN5bmMgXyA9PiB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxoMT5BYm91dCBQYWdlPC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEFib3V0IH07IiwibGV0IEhvbWVwYWdlID0ge1xuXHRyZW5kZXI6IGFzeW5jIF8gPT4ge1xuXHRcdHJldHVybiBgXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDE+PGEgY2xhc3M9XCJzcGFsaW5rXCIgaHJlZj1cIiMvXCI+SG9tZTwvYT4gPGEgY2xhc3M9XCJzcGFsaW5rXCIgaHJlZj1cIiMvYWJvdXRcIj5BYm91dDwvYT48L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgSG9tZXBhZ2UgfTsiLCJjb25zdCBVdGlsaXRpZXMgPSB7XG5cdGdldFVybFF1ZXJ5OiBfID0+IHtcblx0XHRsZXQgcXVlcnkgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KCcvJyk7XG5cdFx0Y29uc29sZS5sb2coJ3F1ZXJ5OicsIHF1ZXJ5KTtcblxuXHRcdHJldHVybiAnLycgKyBxdWVyeVsxXTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgVXRpbGl0aWVzIH07Il19
