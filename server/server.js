const express = require("express");
const app = express();

var clientDir = __dirname;
for (let i = 0; i < 1; i++)
	clientDir = clientDir.substring(0, clientDir.lastIndexOf("\\"));
clientDir += "\\client";

console.log(clientDir);

app.use(express.static(clientDir));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

var n_users = 0;
var users = new Map();

io.on("connection", (socketclient) => {
	socketclient.on("set user data", (params) => {
		console.log(params);
		socketclient.username = params.data.displayName;
		socketclient.photo = params.data.photoUrl;
		socketclient.color = "hsl(" + Math.random() * 360 + ", 75%, 75%)";
		console.log(socketclient.username + " si è unito alla chat");
		users.set(socketclient.id, params.data);
		console.log(JSON.stringify(Array.from(users.entries())));
		socketclient.emit("response", {
			list: JSON.stringify(Array.from(users.entries())),
		});
	});

	socketclient.on("message", (params) => {
		console.log(
			"messaggio inviato da ",
			socketclient.username,
			":",
			params.message
		);
		io.emit("message", {
			userid: socketclient.id,
			username: users.get(socketclient.id).displayName,
			message: params.message,
			color: socketclient.color,
			photo: socketclient.photo,
			time:
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2),
		});
	});

	socketclient.on("disconnect", (reason) => {
		users.delete(socketclient.id);
		console.log(socketclient.username + " ha lasciato la chat");
	});
});

server.listen(3000);
