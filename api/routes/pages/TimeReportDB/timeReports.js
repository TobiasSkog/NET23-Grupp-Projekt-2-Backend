require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

//Edit timereport
router.patch("/:timereportId", async (req, res) => {
	try {
		const timereportId = req.params.timereportId; // timereportId from req.param
		const formData = req.body; // formdata from request body
		//console.log(timereportId);
		console.log(formData);
		// Update the timereport
		const result = await updateTimereport(timereportId, formData);

		if (result.success) {
			res.status(200).json({ message: result.message });
		} else {
			res.status(500).json({ error: result.message });
		}
	} catch (error) {
		console.error("Error updating timereport:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

async function updateTimereport(timereportId, formData) {
	try {
		const data = {
			Date: {
				type: "date",
				date: {
					start: formData.date,
				},
			},
			Hours: {
				type: "number",
				number: formData.hours,
			},
			Note: {
				title: [{ type: "text", text: { content: formData.note } }],
			},
		};
		//console.log("Updating page with ID:", projectId);
		await notionClient.pages.update({
			page_id: timereportId,
			properties: data,
		});

		//console.log("Data update:", data);
		return {
			success: true,
			message: "Timereport updated successfully",
		};
	} catch (error) {
		console.error("Error updating timereport:", error);
		return { success: false, message: "Error updating timereport" };
	}
}

module.exports = router;
