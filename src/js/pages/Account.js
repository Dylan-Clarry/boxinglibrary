// ====================
// Account
// ====================

const _removeToken = _ => {
    //console.log("REMOVE token");
    window.localStorage.removeItem('tokenObj');
};

const _setToken = token => {
    _removeToken();
    //console.log("SET token");
    var tokenObj = {
        token: 'bearer ' + token,
        timestamp: new Date().getTime(),
    };
    window.localStorage.setItem('tokenObj', JSON.stringify(tokenObj));
};

const signUpUser = data => {
	
	let url = 'https://footlib-backend.herokuapp.com/signup';

	return $.ajax({
		type: 'POST',
		datatype: 'json',
		data: data,
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
}

const loginUser = data => {

	let url = 'https://footlib-backend.herokuapp.com/login';

	return $.ajax({
		type: 'POST',
		datatype: 'json',
		data: data,
		url: url,
		async: true,
		success: data => {
			console.log(data);
		}
	});
}

const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let Account = {
	render: async _ => {

		let content = `
			<div id="index" class="container">
				<h2><a href="#/">Back</a></h2>
			
				<div class="login-signup">
					<h1>FOOTBALL LIBRARY</h1>

					<div id="login-form" class="hide">
						<h2>Login</h2>
						<form method="POST" class="account-form">
							<input name="username" type="text" placeholder="Username">
							<br>
							<input name="pass" type="text" placeholder="Password">
							<br>
							<button type="submit">Login</button>
						</form><!-- /account-form -->
					</div><!-- login-form -->

					<div id="signup-form">
						<h2>Signup</h2>
						<form method="POST" class="account-form">
							<input name="username" type="text" placeholder="Username">
							<br>
							<input name="pass" type="password" placeholder="Password">
							<br>
							<input name="email" type="text" placeholder="Email">
							<br>
							<button type="submit">Signup</button>
						</form><!-- /account-form -->
					</div><!-- signup-form -->
					<a id="change-form-type" type-value="1"><u><p>Logging in?</p></u></a>
				</div><!-- /login-signup -->
				
			</div><!-- /container -->
		`;

		return content;
	},

	postRender: async _ => {

		loginForm = document.getElementById('login-form');
		signupForm = document.getElementById('signup-form');
		changeFormType = document.getElementById('change-form-type');

		// click event dynamically changes the account form from signup to login
		if(changeFormType !== null) {
			changeFormType.addEventListener('click', _ => {
				typeValue = changeFormType.getAttribute("type-value");

				// hides or unhides the current form
				if(typeValue === '0') {
					loginForm.classList.add('hide');
					signupForm.classList.remove('hide');
					changeFormType.setAttribute("type-value", '1');
					changeFormType.innerText = "Logging in?"
				} else {
					loginForm.classList.remove('hide');
					signupForm.classList.add('hide');
					changeFormType.setAttribute("type-value", '0');
					changeFormType.innerText = "Signing up?"
				}
			});

			let signupTrueForm = signupForm.getElementsByTagName('form')[0];
			console.log(signupTrueForm.elements);

			signupTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();

				let usernameVal = signupTrueForm.elements['username'].value;
				let passVal = signupTrueForm.elements['pass'].value;
				let emailVal = signupTrueForm.elements['email'].value.toLowerCase();

				if(usernameVal === '' || passVal === '' || emailVal === '') {
					alert('One or more fields are empty');
				} else if(!validateEmail(emailVal)) {
					alert("Invalid email form");
				}
				
				// create login object based on formdata
				var signupObj = {
					username: usernameVal,
					pass: passVal,
					email: emailVal,
				};

				signUpUser(signupObj).done(result => {
					console.log(result);

					if(result.signup == true){

						var loginObj = {
							username: usernameVal,
							pass: passVal,
						};

						loginUser(loginObj).done(result => {
							console.log(result.accessToken);

							_setToken(result.accessToken);

							document.location.href = '/';
						});
					}
				})

				console.log(signupTrueForm);
			});

			let loginTrueForm = loginForm.getElementsByTagName('form')[0];
			console.log(loginTrueForm.elements);

			loginTrueForm.addEventListener('submit', e => {

				// prevent form from reloading page and sending
				e.preventDefault();

				let usernameVal = loginTrueForm.elements['username'].value;
				let passVal = loginTrueForm.elements['pass'].value;

				if(usernameVal === '' || passVal === '') {
					alert('One or more fields are empty');
				}
				
				// create login object based on formdata
				var loginObj = {
					username: usernameVal,
					pass: passVal,
				};

				loginUser(loginObj).done(result => {

					if(result.loggedin == true) {
						console.log(result.accessToken);

						_setToken(result.accessToken);
						
						document.location.href = '/';
					} else {
						alert("Wrong credentials");
					}
				});

				console.log(loginTrueForm);
			});
		}
	}
}

module.exports = { Account };