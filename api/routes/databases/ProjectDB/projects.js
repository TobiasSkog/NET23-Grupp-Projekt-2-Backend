require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

const database_id = process.env.NOTION_DB_PROJECTS_ID;

//Get projects
async function getProjects() {
	const payload = {
		path: `databases/${database_id}/query`,
		method: "POST",
	};

	const { results } = await notionClient.request(payload);
	//console.log("Log to see result ", results);
	const projects = results.map((page) => {
		const teamMembers = page.properties.Person?.relation.map(
			(person) => person.id
		);
		return {
			id: page.id,
			name: page.properties.Projectname?.title[0]?.text?.content,
			status: page.properties.Status?.select?.name,
			color: page.properties.Status?.select?.color,
			hours: page.properties.Hours?.number,
			timespan: {
				start: page.properties.Timespan?.date?.start,
				end: page.properties.Timespan?.date?.end,
			},
			workedHours: page.properties["Worked hours"]?.rollup?.number,
			hoursLeft: page.properties["Hours left"]?.formula?.number,
			teamMember: teamMembers,
		};
	});

	return projects;
}

//Get projects
router.get("/", async (req, res) => {
	const projects = await getProjects();
	res.json(projects);
});

module.exports = router;
