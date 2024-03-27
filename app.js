const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

const initializeSocket = require("./api/components/socket");
const http = require("http");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../webb-grupp2/build/index.html")));

const loginRoute = require("./api/routes/login/login");
const databasesRoute = require("./api/routes/databases/databaseRoute");
const pagesRoute = require("./api/routes/pages/pagesRoute");

app.use("/login", loginRoute);
app.use("/databases", databasesRoute);
app.use("/pages", pagesRoute);

const server = http.createServer(app);
initializeSocket(server);
//använder server ist för app. den kör båda, np np.
server.listen(port, () => console.log("Server is running on port:", port));

// this.app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../webb-grupp2/build/index.html"));
// });
