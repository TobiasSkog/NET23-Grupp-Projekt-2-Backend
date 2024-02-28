const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

//Define routes
const loginRoute = require("./api/routes/login");
const databasesRoute = require("./api/routes/databases");
const pagesRoute = require("./api/routes/pages");
const authRoute = require("./api/routes/auth");

app.use(express.json());

// Define WHITELIST URLS for CORS Options
const whitelist = [
	"http://127.0.0.1",
	"http://127.0.0.1:5500",
	"http://127.0.0.1:8085",
	"http://127.0.0.1:3000",
	"http://127.0.0.1:3001",
	"http://localhost:3000",
	"http://localhost:3001",
];

// Define CORS options
const corsOptions = {
	origin: (origin, callback) => {
		// if (!origin || whitelist.indexOf(origin) !== -1) {
		// 	callback(null, true);
		// } else {
		// 	callback(new Error("Not allowed by CORS"));
		// }
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 204,
	credentials: true,
	allowedHeaders: "Content-Type, Authorization",
};

// Add CORS to app
// app.use(cors(corsOptions));

// Setup Routes
// cors(corsOptions),
app.get("/", (req, res) => res.json({ success: "Daniel gillar ost" }));
app.use("/login", loginRoute);
app.use("/databases", databasesRoute);
app.use("/pages", pagesRoute);
app.use("/auth", authRoute);

// Last thing is to tell the server what port to listen to
app.listen(port, () => console.log("Server is running on port:", port));
