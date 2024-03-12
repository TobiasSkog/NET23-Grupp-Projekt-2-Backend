const express = require("express");
const router = express.Router();

const projectsRoute = require("./ProjectDB/projects");
const peopleRoute = require("./PeopleDB/people");
const timeReportsRoute = require("./TimeReportDB/timeReports");

router.use("/projects", projectsRoute);
router.use("/people", peopleRoute);
router.use("/timereports", timeReportsRoute);

module.exports = router;
