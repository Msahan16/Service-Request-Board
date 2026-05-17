# Testing Guide

## How to Test the Application

### Prerequisites
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB connected

---

## Unit Tests (Automated)

### Running Unit Tests

To run the automated Jest test suite:

```bash
cd backend
npm test
```

### Expected Output

All 19 tests should pass:

```
 PASS  __tests__/api.test.js
  Jobs API Tests
    GET /api/jobs
      ✓ Should return all jobs
      ✓ Should filter jobs by category
      ✓ Should filter jobs by status
      ✓ Should search jobs by keyword
      ✓ Should return empty array for non-matching filter
    POST /api/jobs
      ✓ Should create a job with valid data
      ✓ Should set default category to Other
      ✓ Should reject job without title
      ✓ Should reject job without description
      ✓ Should reject job with invalid email
      ✓ Should reject title exceeding max length
    GET /api/jobs/:id
      ✓ Should return job details for valid ID
      ✓ Should return 404 for non-existent job
    PATCH /api/jobs/:id
      ✓ Should update job status
      ✓ Should reject invalid status
      ✓ Should return 404 for non-existent job
    DELETE /api/jobs/:id
      ✓ Should delete job successfully
      ✓ Should return 403 if not authorized
      ✓ Should return 404 for non-existent job

Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Time:        2.5s
```

### Test Coverage

The test suite covers:
- ✅ GET /api/jobs - List, filter, search functionality
- ✅ POST /api/jobs - Create with validation
- ✅ GET /api/jobs/:id - Retrieve by ID
- ✅ PATCH /api/jobs/:id - Update status
- ✅ DELETE /api/jobs/:id - Delete with authorization

### Watch Mode (Development)

For continuous testing as you develop:

```bash
npm run test:watch
```

Tests will re-run automatically when you save files.

---

### 1. Seeding Sample Data

To populate the database with sample jobs:

```bash
cd backend
node seed.js
```

This will create 8 sample service requests across different categories.

---

## Frontend Testing

### Home Page Tests

1. **Load and Display Jobs**
   - [ ] Navigate to http://localhost:3000
   - [ ] Verify all jobs are loaded and displayed as cards
   - [ ] Each card shows title, description, category, location, and status
   - [ ] Jobs are sorted by newest first

2. **Search Functionality**
   - [ ] Type in search box
   - [ ] Results filter in real-time
   - [ ] Search works for both title and description
   - [ ] Clear search shows all jobs again

3. **Category Filter**
   - [ ] Select "Plumbing" from category dropdown
   - [ ] Only plumbing jobs are shown
   - [ ] Try other categories (Electrical, Painting, etc.)
   - [ ] "All" option shows all jobs

4. **Status Filter**
   - [ ] Select "Open" from status dropdown
   - [ ] Only open jobs are shown
   - [ ] Try "In Progress" and "Closed"
   - [ ] Combine filters (e.g., category + status)

5. **Reset Filters Button**
   - [ ] Apply multiple filters
   - [ ] Click "Reset Filters"
   - [ ] All filters clear and all jobs show

6. **Job Counter**
   - [ ] Verify it shows correct filtered count
   - [ ] Updates when filters change
   - [ ] Shows total jobs

7. **Responsive Design**
   - [ ] Test on desktop (1920x1080)
   - [ ] Test on tablet (768px)
   - [ ] Test on mobile (375px)
   - [ ] Verify cards stack properly
   - [ ] Navigation menu is accessible

### New Job Form Tests

1. **Form Display**
   - [ ] Navigate to http://localhost:3000/jobs/new
   - [ ] All form fields are visible
   - [ ] Form is properly styled and centered
   - [ ] Cancel button works and goes back

2. **Validation - Title Field**
   - [ ] Leave title empty and try to submit
   - [ ] Error message appears: "Title is required"
   - [ ] Enter title over 100 characters
   - [ ] Error message appears: "Title cannot exceed 100 characters"
   - [ ] Character counter shows count/100

3. **Validation - Description Field**
   - [ ] Leave description empty and try to submit
   - [ ] Error message appears: "Description is required"
   - [ ] Enter description over 1000 characters
   - [ ] Error message appears: "Description cannot exceed 1000 characters"
   - [ ] Character counter shows count/1000

4. **Validation - Location Field**
   - [ ] Leave location empty and try to submit
   - [ ] Error message appears: "Location is required"

5. **Validation - Contact Name Field**
   - [ ] Leave name empty and try to submit
   - [ ] Error message appears: "Contact name is required"

6. **Validation - Email Field**
   - [ ] Leave email empty and try to submit
   - [ ] Error message appears: "Email is required"
   - [ ] Enter invalid email (e.g., "notanemail")
   - [ ] Error message appears: "Invalid email format"
   - [ ] Enter valid email (e.g., "test@example.com")
   - [ ] No error message

7. **Category Selection**
   - [ ] Default category is "Other"
   - [ ] Can select Plumbing, Electrical, Painting, Joinery, Carpentry
   - [ ] Category persists after change

8. **Successful Submission**
   - [ ] Fill in all fields correctly
   - [ ] Click "Post Request"
   - [ ] Loading alert appears
   - [ ] Success message shows
   - [ ] Redirects to job detail page

9. **Error Handling**
   - [ ] Disconnect backend
   - [ ] Try to submit form
   - [ ] Error alert appears
   - [ ] Form data is preserved

### Job Detail Page Tests

1. **Load Job Details**
   - [ ] Click on a job card from home page
   - [ ] All job details load correctly
   - [ ] Title, description, category, location all visible
   - [ ] Contact name and email shown
   - [ ] Creation date formatted correctly

2. **Status Badge**
   - [ ] Open jobs show green badge
   - [ ] In Progress jobs show yellow badge
   - [ ] Closed jobs show red badge

3. **Update Status**
   - [ ] Click status dropdown
   - [ ] Change from "Open" to "In Progress"
   - [ ] Loading alert appears
   - [ ] Success message shows
   - [ ] Status updates on page
   - [ ] Change from "In Progress" to "Closed"
   - [ ] Verify it updates correctly

4. **Delete Job**
   - [ ] Click "Delete Job" button
   - [ ] Confirmation dialog appears
   - [ ] Cancel deletion
   - [ ] Job is not deleted
   - [ ] Click delete again
   - [ ] Confirm deletion
   - [ ] Success message appears
   - [ ] Redirects to home page
   - [ ] Job no longer in list

5. **Contact Information**
   - [ ] Email is clickable link
   - [ ] Clicking email opens email client (or mailto protocol)

6. **Job ID Copy**
   - [ ] Click "Copy" button next to job ID
   - [ ] Success message shows "Job ID copied"
   - [ ] ID is actually in clipboard

7. **Back Navigation**
   - [ ] Click "← Back to Jobs"
   - [ ] Returns to home page
   - [ ] Filters are preserved or reset appropriately

---

## Backend API Testing (using Postman or curl)

### 1. Health Check
```
GET http://localhost:5000/api/health
Expected: 200 OK
```

### 2. Get All Jobs
```
GET http://localhost:5000/api/jobs
Expected: 200 OK with array of jobs
```

### 3. Get Jobs with Filters
```
GET http://localhost:5000/api/jobs?category=Plumbing
Expected: 200 OK with filtered jobs

GET http://localhost:5000/api/jobs?status=Open
Expected: 200 OK with open jobs

GET http://localhost:5000/api/jobs?search=leak
Expected: 200 OK with jobs matching "leak"
```

### 4. Get Single Job
```
GET http://localhost:5000/api/jobs/:id (replace :id with actual job ID)
Expected: 200 OK with single job

GET http://localhost:5000/api/jobs/invalid-id
Expected: 404 Not Found
```

### 5. Create Job
```
POST http://localhost:5000/api/jobs
Body:
{
  "title": "Test job",
  "description": "Test description",
  "category": "Plumbing",
  "location": "London",
  "contactName": "Test User",
  "contactEmail": "test@example.com"
}
Expected: 201 Created
```

### 6. Create Job - Validation Errors
```
POST http://localhost:5000/api/jobs
Body (missing title):
{
  "description": "Test",
  "location": "London",
  "contactName": "Test",
  "contactEmail": "test@example.com"
}
Expected: 400 Bad Request with error message

POST http://localhost:5000/api/jobs
Body (invalid email):
{
  "title": "Test",
  "description": "Test",
  "location": "London",
  "contactName": "Test",
  "contactEmail": "notanemail"
}
Expected: 400 Bad Request
```

### 7. Update Job Status
```
PATCH http://localhost:5000/api/jobs/:id
Body:
{
  "status": "In Progress"
}
Expected: 200 OK with updated job

PATCH http://localhost:5000/api/jobs/:id
Body:
{
  "status": "Invalid Status"
}
Expected: 400 Bad Request
```

### 8. Delete Job
```
DELETE http://localhost:5000/api/jobs/:id
Expected: 200 OK with success message

DELETE http://localhost:5000/api/jobs/invalid-id
Expected: 404 Not Found
```

---

## Integration Testing

### Workflow 1: Create and Manage a Job
1. Create a new job via form on frontend
2. Verify it appears on home page
3. Click on it to view details
4. Update status to "In Progress"
5. Update status to "Closed"
6. Delete the job
7. Verify it's removed from list

### Workflow 2: Complex Filtering
1. Seed database with sample data
2. Filter by category "Plumbing"
3. Further filter by status "Open"
4. Search for "leak"
5. Results should show only open plumbing jobs matching "leak"
6. Reset filters and verify all jobs show

### Workflow 3: Error Handling
1. Stop backend server
2. Try to load home page - should show error
3. Try to create job - should show error
4. Restart backend
5. Verify everything works again

---

## Performance Testing

1. **Load Performance**
   - Seed database with 100+ jobs
   - Load home page
   - Verify it loads within reasonable time
   - Check browser console for no errors

2. **Filtering Performance**
   - With 100+ jobs, apply filters
   - Verify filters respond quickly
   - Search should be instant

---

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Responsive Design Checklist

### Desktop (1920x1080)
- [ ] Full layout visible
- [ ] Cards in 3-column grid
- [ ] All buttons accessible

### Tablet (768px)
- [ ] Cards in 2-column grid
- [ ] Navigation adjusted
- [ ] Forms readable

### Mobile (375px)
- [ ] Cards in 1 column
- [ ] Navigation collapsed/accessible
- [ ] Touch-friendly buttons
- [ ] No horizontal scroll

---

## Accessibility Checks

- [ ] All form labels associated with inputs
- [ ] Error messages clearly visible
- [ ] Color not only indicator (shapes/text used)
- [ ] Buttons have clear labels
- [ ] Keyboard navigation works

---

## Known Limitations

- No user profiles
- No email notifications
- No rating system
- No image uploads

---

## Bug Report Template

If you find an issue, report:

**Title:** [Brief description]
**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**

**Actual Behavior:**

**Screenshots:**

**Environment:**
- Browser:
- Device:
- Backend: running/stopped
