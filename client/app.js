const msgbox = document.getElementsByClassName("msg-box")[0];

const clientsocket = io();

const rememberedAccounts = JSON.parse(
	localStorage.getItem("firebaseui::rememberedAccounts")
);
console.log(rememberedAccounts);
console.log(JSON.stringify(rememberedAccounts, null, 2));

clientsocket.on("connect", () => {
	clientsocket.emit("set user data", {
		data: rememberedAccounts[0],
	});
	console.log("connessione");
});

clientsocket.on("response", (params) => {
	console.log("connessione avvenuta con successo");
	console.log(JSON.parse(params.list));
});

clientsocket.on("message", (params) => {
	console.log(params);
	const msgcontainer = document.createElement("div");
	const msg = document.createElement("div");
	const img = document.createElement("img");
	img.className = "foto-profilo";
	msg.className = "card msg msg-inviato";
	img.src = params.photo;

	// nome utente
	let sender = document.createElement("h6");
	sender.className = "card-title";
	sender.innerText = params.username;
	sender.style.color = params.color;
	msg.append(sender);

	//posizionamento della card in base al mittente
	if (params.userid == clientsocket.id) {
		msgcontainer.className = "d-flex justify-content-end";
		msg.className = "card msg msg-inviato";
		msgcontainer.append(msg);
		msgcontainer.append(img);
	} else {
		msgcontainer.className = "d-flex justify-content-start";
		msg.className = "card msg msg-ricevuto";
		msgcontainer.append(img);
		msgcontainer.append(msg);
	}

	//inserimento del testo
	msg.innerHTML += toHyperlink(params.message);

	// orario
	let timeDiv = document.createElement("p");
	let time = document.createElement("small");
	timeDiv.className = "card-text";
	time.innerText = params.time;
	timeDiv.append(time);

	msg.append(timeDiv);
	msgbox.append(msgcontainer);
});

function invia() {
	let msg = document.getElementById("msg").value;
	if (msg.length == 0) return;
	clientsocket.emit("message", {
		message: msg,
	});
	document.getElementById("msg").value = "";
}

// viene inviato il messaggio quando si preme il tasto enter
function checkEnterClick(e) {
	if (e.keyCode == 13) invia();
}

// autoscroll
var osservatore = new MutationObserver(scorri); // Tell it to look for new children that will change the height.
var config = { childList: true };
osservatore.observe(msgbox, config);

function scorri() {
	msgbox.scrollTop = msgbox.scrollHeight;
}

function toHyperlink(str) {
	var pattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
	var str1 = str.replace(pattern1, "<a href='$1' target='_blank'>$1</a>");

	var pattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	var str2 = str1.replace(
		pattern2,
		'$1<a target="_blank" href="http://$2">$2</a>'
	);

	return str2;
}
