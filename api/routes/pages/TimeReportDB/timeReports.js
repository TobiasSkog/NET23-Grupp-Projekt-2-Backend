require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

const timereport_id = process.env.NOTION_DB_TIMEREPORTS_ID;
//user
async function createTimeReportUser(formData) {
    try {
        console.log('Received formData:', formData);
        const response = await notionClient.pages.create({
            parent: { database_id: timereport_id }, 
            properties: {
                'Date': {
                    date: { start: formData.date },
                },
                'Person': {
                    relation: [{ id: formData.personId }],
                },
                'Hours': { 
                    number: parseInt(formData.hours, 10), 
                },
                'Project': { 
                    relation: [{ id: formData.projectId }],
                },
                'Note': {
                    title: [
                        {
                            text: { content: formData.note }
                        }
                    ],
                },
            },
        });
  
        console.log('Time report created:', response);
        return {
            success: true,
            message: "Time report added successfully",
        };
    } catch (error) {
        console.error('Failed to create time report:', error);
        return {
            success: false,
            message: "Failed to add time report: " + error.message,
        };
    }
  }

  //user
router.post('/', async (req, res) => {
  try {
      const formData = req.body; 

      const response = await createTimeReportUser(formData);

      if (response.success) {
          res.status(201).json({ message: response.message });
      } else {
          res.status(400).json({ message: response.message });
      }
  } catch (error) {
      res.status(500).json({ message: "Failed to create time report", error: error.message });
  }
});
//user
async function updateTimeReportUser(timeReportId, formData) {
  try {
      const response = await notionClient.pages.update({
          page_id: timeReportId,
          properties: {
              'Date': {
                  date: { start: formData.date },
              },
              'Person': {
                  relation: [{ id: formData.personId }],
              },
              'Hours': { 
                  number: parseInt(formData.hours, 10),
              },
              'Project': {
                  relation: [{ id: formData.projectId }],
              },
              'Note': {
                  title: [
                      {
                          text: { content: formData.note }
                      }
                  ],
              },
          },
      });

      console.log('Time report updated:', response);
      return {
          success: true,
          message: "Time report updated successfully",
      };
  } catch (error) {
      console.error("Error updating time report:", error);
      return { success: false, message: "Error updating time report: " + error.message };
  }
}


router.patch('/user/:timeReportId', async (req, res) => {
  try {
      const timeReportId = req.params.timeReportId; 
      const formData = req.body; 

      const result = await updateTimeReportUser(timeReportId, formData);

      if (result.success) {
          res.status(200).json({ message: result.message });
      } else {
          res.status(500).json({ error: result.message });
      }
  } catch (error) {
      console.error("Error updating time report:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


//Edit timereport
router.patch("/admin/:timereportId", async (req, res) => {
	try {
		const timereportId = req.params.timereportId; // timereportId from req.param
		const formData = req.body; // formdata from request body

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
					start: formData?.date,
				},
			},
			Hours: {
				type: "number",
				number: formData?.hours,
			},
			Note: {
				title: [{ type: "text", text: { content: formData?.note } }],
			},
			Project: {
				relation: [
					{
						id: formData?.project,
					},
				],
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
