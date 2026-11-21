const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messagesFile = path.join(__dirname, "data", "messages.json");

app.use(express.static(path.join(__dirname, "public")));

function loadMessages() {
try {
return JSON.parse(fs.readFileSync(messagesFile, "utf8"));
} catch {
return [];
}
}

let messages = loadMessages();

io.on("connection", (socket) => {
console.log("A user connected");

socket.emit("old messages", messages);

socket.on("chat message", (data) => {
if (!data  || !data.name || !data.text) return;

const message = {
  name: String(data.name).slice(0, 30),
  text: String(data.text).slice(0, 1000),
  time: new Date().toLocaleString()
};

messages.push(message);

fs.writeFileSync(
  messagesFile,
  JSON.stringify(messages, null, 2)
);

io.emit("chat message", message);
});
});

server.listen(3000, "0.0.0.0", () => {
console.log("Chat server running on port 3000");
});