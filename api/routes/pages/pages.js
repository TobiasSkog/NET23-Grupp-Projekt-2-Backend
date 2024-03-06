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

//Create new project
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

//Edit project
router.patch("/projects/:projectId", async (req, res) => {
	try {
		const projectId = req.params.projectId; // Extract projectId from request parameters
		const formData = req.body; // Take formdata from request body

		// Update the project with projectId and data
		const result = await updateProject(projectId, formData);

		if (result.success) {
			res.status(200).json({ message: result.message });
		} else {
			res.status(500).json({ error: result.message });
		}
	} catch (error) {
		console.error("Error updating project:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

async function updateProject(projectId, formData) {
	try {
		const data = {
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
			Image: { url: formData.image },
		};
		//console.log("Updating page with ID:", projectId);
		await notionClient.pages.update({
			page_id: projectId,
			properties: data,
		});

		//console.log("Data update:", data);
		return {
			success: true,
			message: "Project updated successfully",
		};
	} catch (error) {
		console.error("Error updating project:", error);
		return { success: false, message: "Error updating project" };
	}
}

module.exports = router;
