require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../components/notionClient");

const database_id = process.env.NOTION_DB_PROJECTS_ID;

async function createProject(formData) {
	try {
		const data = {
			parent: {
				type: "database_id",
				database_id: database_id,
			},
			properties: {
				Projectname: {
					title: [{ type: "text", text: { content: formData.name } }],
				},
				Status: {
					type: "select",
					select: {
						name: formData.status,
					},
				},
				Hours: {
					type: "number",
					number: formData.hours,
				},
				Timespan: {
					type: "date",
					date: {
						start: formData.startDate,
						end: formData.endDate,
					},
				},
				Image: {
					url: formData.image,
				},
			},
		};

		const response = await notionClient.pages.create(data);
		//console.log("Data", response);
		return {
			success: true,
			message: "Data received and sent to Notion successfully",
		};
	} catch (error) {
		console.error("Error processing data:", error);
		return { success: false, message: "Error processing form data" };
	}
}

//Post new project
router.post("/projects", async (req, res) => {
	try {
		const formData = req.body; // Take data from req.body

		// Request to Notion - send form data
		const notionResponse = await createProject(formData);

		// Handle Notion response
		if (notionResponse.success) {
			res.status(200).json({ message: notionResponse.message });
		} else {
			res.status(500).json({ error: notionResponse.message });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
