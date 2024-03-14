const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

//---------------lef was here------------------
const initializeSocket = require("./api/components/socket");
const http = require("http");
const server = http.createServer(app);
//---------------lef was here------------------

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginRoute = require("./api/routes/login/login");
const databasesRoute = require("./api/routes/databases/databaseRoute");
const pagesRoute = require("./api/routes/pages/pagesRoute");

app.use("/login", loginRoute);
app.use("/databases", databasesRoute);
app.use("/pages", pagesRoute);

//---------------lef was here------------------
initializeSocket(server);
server.listen(port, () => console.log("Server is running on port:", port));
//---------------lef was here------------------ använder server ist för app. den kör båda, np np.