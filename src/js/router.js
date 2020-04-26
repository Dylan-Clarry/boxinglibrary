// let parseRequestURL : () => {

//         let url = location.hash.slice(1).toLowerCase() || '/';
//         let r = url.split("/")
//         console.log("r:", r)
//         let request = {
//             resource    : null,
//             id          : null,
//             verb        : null
//         }
//         request.resource    = r[1]
//         request.id          = r[2]
//         request.verb        = r[3]

//         console.log("request:", request)

//         return request
//     }

// let parseUrl = url => {
// 	console.log("url:", url);
// }

// const Router = {
// 	run: async _ => {
// 		// find the app div to add page content to
// 		const app = null || document.getElementById('app');
// 		if(app) {
// 			console.log(state);
// 			app.innerHTML = state.content;

// 			let spaLinks = document.querySelectorAll(".spalink");
// 			console.log(spaLinks);
			
// 			for(let i = 0; i < spaLinks.length; i++) {
// 				let currLink = spaLinks[i]
// 				console.log(currLink);
				
// 				let href = currLink.getAttribute('href');

// 				currLink.addEventListener("click", function(){

// 					// prevent default a tag redirect
// 					window.event.preventDefault();
// 					let href = currLink.getAttribute('href')

// 					console.log(href);
// 					console.log("yes")

// 					// rewrite url to a tags href
// 					window.history.pushState(
// 						{},
// 						href,
// 						window.location.origin + '' + href
// 					);
// 				}, false);
// 			}

// 		} else {
// 			console.error("quickSPA Error: root element div with id 'app' not found");
// 		}
// 	}

// 	// runPostPageLoad: _ => {
// 	// 	window.addEventListener('load', this.run());
// 	// }
// }


// module.exports = { Router };


