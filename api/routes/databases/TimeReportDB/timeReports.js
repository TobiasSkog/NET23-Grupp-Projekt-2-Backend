require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");
const axios = require("axios");

const database_id = process.env.NOTION_DB_TIMEREPORTS_ID;

//Get all timereports
router.get("/", async (req, res) => {
	const reports = await getTimereports();

	res.json(reports);
});

//Get timereports filtered by projectId
router.get("/filter/project", async (req, res) => {
	const property = req.query.property; // take property from query
	const id = req.query.id; // take id from query

	try {
		const timeReport = await getTimereportByFilter(property, id);

		//Get all people
		const peopleResponse = await getPeople();

		//console.log(peopleResponse);
		if (peopleResponse.length > 0) {
			//Map key:id value:name
			const idNameMap = new Map(
				peopleResponse.map((person) => [person.id, person.name])
			);

			//we map to see if key in idNameMap match - then we get value name
			const updatedTimeReports = timeReport.map((report) => ({
				...report,
				name: idNameMap.get(report.person),
			}));

			//console.log(updatedTimeReports);
			return res.json(updatedTimeReports);
		} else {
			return res.status(500).json({ error: peopleResponse.error });
		}
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
});

//Get timereports filtered by personId
router.get("/filter/people", async (req, res) => {
	const property = req.query.property; // take property from query
	const id = req.query.id; // take id from query

	try {
		const timeReport = await getTimereportByFilter(property, id);

		//get all projects
		const projectsResponse = await getProjects();

		if (projectsResponse.length > 0) {
			// Map key:id value: name
			const idProjectNameMap = new Map(
				projectsResponse.map((project) => [project.id, project.name])
			);
			//console.log(idProjectNameMap);
			//we map to see if key in idProjectName match - then we get value name
			const updatedTimeReports = timeReport.map((report) => ({
				...report,
				projectName: idProjectNameMap.get(report.project),
			}));
			//console.log(updatedTimeReports);

			return res.json(updatedTimeReports);
		} else {
			return res.status(500).json({ error: projectsResponse.error });
		}
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
});

async function getProjects() {
	try {
		const response = await axios.get(
			"http://localhost:3001/databases/projects"
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch from the database:", error.message);
		return { success: false, error: "Failed to fetch project data" };
	}
}

async function getPeople() {
	try {
		const response = await axios.get("http://localhost:3001/databases/people");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch from the database:", error.message);
		return { success: false, error: "Failed to fetch people data" };
	}
}

//Get ALL timereports
async function getTimereports() {
	const payload = {
		path: `databases/${database_id}/query`,
		method: "POST",
	};

	const { results } = await notionClient.request(payload);
	//console.log("Log result ", results);
	const reports = results.map((page) => {
		return {
			id: page.id,
			hours: page.properties.Hours?.number,
			date: page.properties.Date?.date?.start,
			project: page.properties.Project?.relation[0]?.id,
			person: page.properties.Person?.relation[0]?.id,
			note: page.properties.Note?.title[0]?.text?.content,
		};
	});

	return reports;
}

//Get Timereport by projectId
async function getTimereportByFilter(property, id) {
	const payload = {
		path: `databases/${database_id}/query`,
		method: "POST",
		body: {
			filter: {
				property: property,
				relation: {
					contains: id,
				},
			},
		},
	};

	const { results } = await notionClient.request(payload);
	const reports = results.map((page) => {
		return {
			id: page.id,
			hours: page.properties.Hours?.number,
			date: page.properties.Date?.date?.start,
			person: page.properties.Person?.relation[0]?.id,
			note: page.properties.Note?.title[0]?.text?.content,
			project: page.properties.Project?.relation[0]?.id,
		};
	});
	//console.log(reports);
	return reports;
}

module.exports = router;
