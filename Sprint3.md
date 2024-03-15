# Create and Update Custom Modal to Main branch and update the following to use said component

- Login
- Projects Edit
- Skapa nya Projects
- AdminPopupReminder
- Add Timereports
- Edit Timereports (User)
- Edit Timerports (Admin)

# navbar

Complete rework

- Nav links - Neumorphism design
  - "Active" page displays in navlink
- Small Monitor - Hamburger not working correctly
- Logout - CSS Slider ? Make more clear
- NotifyAdminModal Location - Styling (small fix)
  - Direct to a project if clicked on project in modal

# projects

## Admin:

- Edit Timereport Modal - No Styling
- Add New Project Modal - No Styling
- View Timereport based on Person / Project Modal - No Styling

## User

- Report Time Button - Only if Status is Active
  { project.status === "Active" && Button Report Time ...}

## Shared

- Sepparator between projects of different statuses - Update Styling
- Grid Layout för Cards - Needs Updates

# timereports (admin)

- Project Selector - No Styling

# timereports/project (admin)

- Date Picker Modal - No Styling
- Search Button - No Styling
- Timereports Table - No Styling
- Edit Button - No Styling
- Filter Buttons (Last 7 days, Last 30 days, All) - No Styling
- Search Date - Display The Dates We are Filtereing between

# timereports/user

- Report Time Button - No Styling
- Your Time Reports Table - No Styling
- Edit Button - No Styling
- Modal - No Styling
- Modal - Update Report Button - No Styling

##### Table CSS

```css
html,
body {
	height: 100%;
}

body {
	margin: 0;
	background: #e0e5ec;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: 100;
}

.container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

table.neumorphic {
	width: 600px;
	border-spacing: 0;
	color: #212121;
	text-align: center;
	overflow: hidden;
	box-shadow: 9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.6);
}
table.neumorphic thead {
	box-shadow: 9px 9px 16px rgba(163, 177, 198, 0.6);
}
table.neumorphic th {
	padding: 7px;
}

table.neumorphic > tbody > tr > td {
	padding: 10px;
	font-size: 14px;
	position: relative;
}

table.neumorphic > tbody > tr:hover {
	border: 4px solid #04d3f7;

	padding: 20px;
	box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.6);
}

table.neumorphic tr td:first-child::before {
	content: "";
	position: absolute;

	top: 0;
	width: 100%;
	height: 100%;
	z-index: -10;
}

table.neumorphic td:hover::after {
	background-color: #d7dbe1;
	content: "";
	position: absolute;
	box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.6);
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: -1;
}
```
