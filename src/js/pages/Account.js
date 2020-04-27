// ====================
// Account
// ====================

let Account = {
	render: async _ => {

		let content = `
			<div id="index" class="container">
				<h2><a href="#/">Back</a></h2>
			
				<div class="login-signup">
					<h1>FOOTBALL LIBRARY</h1>

					<div id="login-form" class="hide">
						<h2>Login</h2>
						<form action="POST" class="account-form">
							<input type="text" placeholder="Username">
							<br>
							<input type="text" placeholder="Password">
							<br>
							<button type="submit">Login</button>
						</form><!-- /account-form -->
					</div><!-- login-form -->

					<div id="signup-form">
						<h2>Signup</h2>
						<form action="POST" class="account-form">
							<input type="text" placeholder="Username">
							<br>
							<input type="text" placeholder="Password">
							<br>
							<input type="text" placeholder="Email">
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
		//may want to add a forgot password and email them theire account info, maybe something to do in the future
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
		}
	}
}

module.exports = { Account };