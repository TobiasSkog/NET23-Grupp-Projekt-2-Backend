const express = require("express");
const cors = require("cors");
//const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(bodyParser.json());

// To be able to send a form
app.use(bodyParser.urlencoded({ extended: true }));

//Define routes
const loginRoute = require("./api/routes/login/login");
const databasesRoute = require("./api/routes/databases/project");
const pagesRoute = require("./api/routes/pages/pages");
const usersRoute = require("./api/routes/users/users");

app.get("/", (req, res) => res.json({ success: "Daniel gillar ost" }));
app.use("/login", loginRoute);
app.use("/databases", databasesRoute);
app.use("/pages", pagesRoute);
app.use("/users", usersRoute);

// Last thing is to tell the server what port to listen to
app.listen(port, () => console.log("Server is running on port:", port));
