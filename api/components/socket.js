const socketIo = require("socket.io");
const timeReports = require("../routes/databases/TimeReportDB/isProjectOverdue");

function initializeSocket(server) {
	const io = socketIo(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("A user connected");

		socket.on("checkProjects", () => {
			timeReports.isProjectOverdue("Website TechInfo", io);
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});
}

module.exports = initializeSocket;
