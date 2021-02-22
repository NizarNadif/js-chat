const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

var n_users = 0;
var users = new Map();

io.on("connection", (socketclient) => {
	socketclient.username = "Guest " + n_users++;
	socketclient.color = "hsl(" + Math.random() * 360 + ", 75%, 75%)";
	console.log(socketclient.username + " si è unito alla chat");
	users.set(socketclient.id, socketclient.username);

	socketclient.emit("response", {
		username: socketclient.username,
		list: JSON.parse(JSON.stringify(users)),
	});

	socketclient.on("message", (params) => {
		console.log(
			"messaggio inviato da ",
			socketclient.client,
			": ",
			params.message
		);
		io.emit("message", {
			username: users.get(socketclient.id),
			userid: socketclient.id,
			message: params.message,
			time:
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2),
			color: socketclient.color,
		});
	});

	socketclient.on("disconnect", (reason) => {
		users.delete(socketclient.id);
		console.log(socketclient.username + " ha lasciato la chat");
	});
});

server.listen(3000);
