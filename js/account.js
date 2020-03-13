// ====================
// account.js
// ====================

// account login/signup forms
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
