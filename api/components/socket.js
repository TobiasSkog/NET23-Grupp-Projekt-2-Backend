const socketIo = require("socket.io");
const isProjectOverdue = require("../routes/databases/TimeReportDB/isProjectOverdue");

function initializeSocket(server) {
	const io = socketIo(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	async function checkAndEmitData() {
		const overdueProjects = await isProjectOverdue();
		if (overdueProjects && overdueProjects.length > 0) {
			io.emit("projectOverdue", overdueProjects);
		}
	}

	setInterval(checkAndEmitData, 300000);
	// 300000 = 5 minutes
	// 60000  = 1 minute
	// 30000  = 30 seconds
	// 15000  = 15 seconds
}

module.exports = initializeSocket;
