const msgbox = document.getElementsByClassName("msg-box")[0];

const clientsocket = io();

clientsocket.on("connect", () => {
	console.log("connessione");
});

clientsocket.on("response", (params) => {
	console.log("connessione avvenuta con successo, ti chiami " + params.username);
	console.log(JSON.stringify(params));
});

clientsocket.on("message", (params) => {
	console.log(params.username, " - ", params.userid, ": ", params.message);
	const msgcontainer = document.createElement("div");
	const msg = document.createElement("div");
	if (params.userid == clientsocket.id) {
		msgcontainer.className = "d-flex justify-content-end";
		msg.className = "card msg msg-inviato";
	} else {
		msgcontainer.className = "d-flex justify-content-start";
		msg.className = "card msg msg-ricevuto";
	}
	msg.innerHTML = toHyperlink(params.message);
	msg.style.backgroundColor = params.color;

	// nome utente
	let senderDiv = document.createElement("p");
	let sender = document.createElement("small");
	senderDiv.className = "card-text";
	sender.innerText = params.username + ", " + params.time;
	senderDiv.append(sender);

	msg.append(senderDiv);
	msgcontainer.append(msg);
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
