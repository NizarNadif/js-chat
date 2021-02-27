// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

console.log(firebase);
console.log(window.location.href);

function accesso_anonimo() {
	firebase
		.auth()
		.signInAnonymously()
		.then(() => {
			// Signed in..
			console.log("accesso anonimo");
			window.location.replace("chat.html");
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		});
}

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		var uid = user.uid;
		console.log(user.currentUser);
		// ...
	} else {
		console.log(user);
		// User is signed out
		// ...
	}
});

ui.start("#autenticazione", {
	signInOptions: [
		// List of OAuth providers supported.
		/* firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		firebase.auth.TwitterAuthProvider.PROVIDER_ID, */
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.GithubAuthProvider.PROVIDER_ID,
	],
	// Other config options...
	signInSuccessUrl: "chat.html",
	callbacks: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			// User successfully signed in.
			/* console.log(authResult); */
			// Return type determines whether we continue the redirect automatically
			// or whether we leave that to developer to handle.
			return true;
		},
		uiShown: function () {
			// The widget is rendered.
			// Hide the loader.
			// document.getElementById("loader").style.display = "none";
		},
	},
});
