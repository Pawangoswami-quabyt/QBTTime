# My Time

Application to record and manage employee time entries for projects.

## 1. User Roles and Authentication

### User Roles
- Employee
  - Can enter daily timesheet entries.
  - Can view and edit their timesheets.
  - Can submit weekly timesheets.
  - Receives notifications for missing/unsubmitted entries.
- Admin
  - Can define and manage projects.
  - Can assign employees to projects.
  - Can view and manage employee timesheets for all projects.
  - Can lock/unlock submitted timesheets.

### Authentication
- Microsoft Entra ID
  - Employee logins via Entra ID.
  - Admin logins via Entra ID.
- JWT-based authentication for API access.



Raise the PR to master with all your changes also, setup migrations for the tables you have created

## 2. Employee Module

### Timesheet Management
- Daily Entries  
  - Employees can enter time spent on tasks for each project.  
  - Each entry should have:  
    - Date (default to current day).  
    - Project name (dropdown, only assigned projects visible).  
    - Task description (text field).  
    - Time spent (hours, decimal allowed for fractional hours).  
  - Ability to add multiple tasks per day.
- Weekly Overview
  - A summary view for the week showing:
    - Date-wise breakdown of tasks and hours.
    - Total hours for the week.
  - Option to edit entries (if not locked).
  - Submit button for finalizing the week's entries.

  #### AI Enhancements (Optional)
  - Employees can describe tasks in plain language (e.g., "Worked 2 hours on backend bug fixing for Project A"), and the system auto-fills the fields (project, task description, hours).

### Notifications
- Automated Reminders  
  - Employees are notified (via email or in-app notifications) for:  
    - Missing entries for a week.  
    - Unsubmitted weekly entries nearing the deadline.
- Submission Confirmation  
  - Notification for successful submission of timesheet.

### Access Control
- Employees can only view/edit timesheets for their assigned projects.
- Locked timesheets cannot be edited.

## 3. Admin Module

### Project Management
- Create/Update Projects
  - Project Name.
  - Project Description.
  - Start and End Date.
  - Status (Active/Inactive).
- Assign Employees
  - Add/remove employees to/from a project.
  - Employees assigned to a project can see it in their timesheet entry page.

### Timesheet Review
- View Timesheets by Project
  - Filter timesheets by project, employee, or date range.
  - Detailed view of hours logged by each employee per project.
- Timesheet Actions
  - Lock a submitted timesheet to prevent further edits.
  - Unlock a timesheet (e.g., for corrections) and notify the employee.
  - Approve a timesheet.

### Notifications
- Notify employees about corrections or unlocks.

### Reporting
- Export timesheet data for a specific project, employee, or date range to CSV/Excel.
- Generate summary reports for:
  - Total hours logged per project.
  - Employee-wise contribution to a project.

  #### AI Enhancements (Optional)
  - Generate detailed insights on timesheet data, such as:
    - Employee productivity trends.
    - Project-wise time utilization.
    - Prediction of project delays based on logged hours.
  - Admin can ask questions in natural language and get answers from the system. E.g. "Which project has the highest average hours logged?"


## 4. System Features

### Timesheet Statuses
- Draft: Editable by the employee (before submission).
- Submitted: Locked for editing by the employee.  
- Locked: Editable only by the admin.  

### Validation
- Prevent submission if:
  - Required fields are missing.
  - Total hours exceed a configurable daily/weekly limit.
- Restrict employees from seeing non-assigned projects in dropdowns.

### Audit Trail (Optional)
- Track and log all changes made to timesheets, including:
  - Who made the changes.
  - Date and time of changes.
  - Before and after values.

### Scalability
- Ability to handle multiple employees, projects, and tasks concurrently without performance issues.

### User Interface
- Employee Dashboard  
  - Clear display of weekly progress with a calendar-style grid.  
  - Buttons for "Add Task," "Edit," and "Submit."  
- Admin Dashboard  
  - Overview of projects and pending timesheets.  
  - Filterable list views for projects and timesheets.


## 5. Technical Requirements

### Frontend
- Responsive web application (desktop and mobile-friendly).
- Technologies: React.js

### Backend
- RESTful API for data exchange.
- Technologies: Nest.js

### Database
- Relational database - PostgreSQL
- Tables for users, projects, tasks, timesheets, and audit logs.

### Integrations
- Email: Resend
- In-app notifications: Pusher/SignalR
- LLM: Groq

## 6. Development

This repo should be forked and cloned for development.