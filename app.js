const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

// To be able to send a form
//app.use(bodyParser.urlencoded({ extended: true }));


//Define routes
const loginRoute = require("./api/routes/login");
const databasesRoute = require("./api/routes/databases/databases");
const pagesRoute = require("./api/routes/pages");
const usersRoute = require("./api/routes/users");

app.get("/", (req, res) => res.json({ success: "Daniel gillar ost" }));
app.use("/login", loginRoute);
app.use("/databases", databasesRoute);
app.use("/pages", pagesRoute);
app.use("/users", usersRoute);

// Last thing is to tell the server what port to listen to
app.listen(port, () => console.log("Server is running on port:", port));
