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

		if (peopleResponse.length > 0) {
			//Map key:id value:name
			const idNameMap = new Map(peopleResponse.map((person) => [person.id, person.name]));

			//we map to see if key in idNameMap match - then we get value name
			const updatedTimeReports = timeReport.map((report) => ({
				...report,
				name: idNameMap.get(report.person),
			}));

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
			const idProjectNameMap = new Map(projectsResponse.map((project) => [project.id, project.name]));
			//we map to see if key in idProjectName match - then we get value name
			const updatedTimeReports = timeReport.map((report) => ({
				...report,
				projectName: idProjectNameMap.get(report.project),
			}));

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
			// "http://localhost:3001/databases/projects"
			"http://127.0.0.1:3001/databases/projects"
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch from the database:", error.message);
		return { success: false, error: "Failed to fetch project data" };
	}
}

async function getPeople() {
	try {
		// const response = await axios.get("http://localhost:3001/databases/people");
		const response = await axios.get("http://127.0.0.1:3001/databases/people");
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
	return reports;
}

const timeReportDbId = process.env.NOTION_DB_TIMEREPORTS_ID;

//Get tiemReport
async function getTimeReports() {
	try {
		const response = await notionClient.databases.query({
			database_id: timeReportDbId,
		});

		const timeReports = response.results.map((page) => {
			return {
				id: page.id,
				date: page.properties.Date?.date?.start ?? "No date available",
				personId: page.properties.Person?.relation?.[0]?.id ?? "No person ID",
				hours: page.properties.Hours?.number ?? 0,
				projectId: page.properties.Project?.relation?.[0]?.id ?? "No project ID",
				note: page.properties.Note?.title?.[0]?.text?.content ?? "No note",
			};
		});

		return timeReports;
	} catch (error) {
		console.error("Failed to retrieve time reports:", error);
		throw error;
	}
}

//get TimeReports
router.get("/", async (req, res) => {
	try {
		const timeReports = await getTimeReports();
		res.json(timeReports);
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve time reports", error: error.toString() });
	}
});

module.exports = router;
