require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../components/notionClient");

const database_id = process.env.NOTION_DB_PROJECTS_ID;
//console.log(database_id);

//Get projects
async function getProjects(status) {
	const payload = {
		path: `databases/${database_id}/query`,
		method: "POST",
		body: {},
	};

	//If status is provided, add the filter to the payload
	if (status) {
		payload.body.filter = {
			property: "Status",
			select: {
				equals: status,
			},
		};
	}

	const { results } = await notionClient.request(payload);
	//console.log("Log to see result ", results);
	const projects = results.map((page) => {
		return {
			id: page.id,
			name: page.properties.Projectname.title[0].text.content,
			status: page.properties.Status.select.name,
			color: page.properties.Status.select.color,
			hours: page.properties.Hours.number,
			timespan: {
				start: page.properties.Timespan.date.start,
				end: page.properties.Timespan.date.end,
			},
			workedHours: page.properties["Worked hours"].rollup.number,
			hoursLeft: page.properties["Hours left"].formula.number,
		};
	});

	return projects;
}

//Get projects
router.get("/projects", async (req, res) => {
	const status = req.query.status;
	const projects = await getProjects(status);
	res.json(projects);
});

module.exports = router;
