# Project: Campus Event Explorer

Week 1 - Day 4 frontend assignment 
## 1. Project overview

Campus Event Explorer is a small frontend-only application that allows users to:

- View a list of campus events.
- Search events by title.
- Filter events by category and status.
- Add a new event into frontend state.
- See basic UI states: loading, success feedback, validation error, and empty state.

This project prepares for Day 5 Backend/API integration by separating UI, state, validation, rendering, and mock API flow.

## 2. Tech stack

- HTML
- CSS
- Vanilla JavaScript
- No framework
- No backend required

## 3. Folder structure

```text
w1d4_campus_event_explorer/
  index.html
  styles.css
  app.js
  README.md
  assets/
  data/events.json
```

## 4. How to run

Option 1: Open directly in browser

```text
Open index.html
```

Option 2: Use VS Code Live Server

```text
1. Open this folder in VS Code.
2. Install the Live Server extension if needed.
3. Right click index.html.
4. Click "Open with Live Server".
```

## 5. Features 

- F1-Event list: Hiển thị tối thiểu 6 event từ mock data, gồm title, date, category, capacity, status.
- F2-Search/filter: Có ít nhất 1 search input và 1 filter theo category hoặc status.
- F3-Add event form: Form thêm event mới vào frontend state, không cần lưu database.
- F4-Validation: Validate required fields, date hợp lệ và capacity > 0. Hiển thị message rõ ràng.
- F5-UI states: Có loading giả lập, success/feedback, error validation và empty state.
- F6-Responsive: basics	UI không vỡ ở desktop và width nhỏ khoảng 390px.
- F7-README/evidence: Có README mô tả cách chạy, feature đã làm, screenshot và known limitations.


## 6. Data shape

```js
{
    "id": 1,
    "title": "Intro to Cloud Computing Architecture",
    "date": "2026-05-25",
    "time": "14:00",
    "dateText": "Today, 2:00 PM - 4:00 PM",
    "location": "Science Building, Room 402",
    "category": "Workshop",
    "categories": ["Tech", "Workshop"],
    "capacity": 30,
    "status": "Open",
    "price": "Free",
    "image": "./assests/event-cloud.jpg"
  }
```


## 7. Validation rules

The add event form checks:

- Title is required.
- Date is required and must be valid.
- Category is required.
- Capacity must be a positive number.
- Status is required.

## 8. UI states

- Normal: event cards are displayed.
- Loading: mock API loading message is displayed.
- Success: feedback message appears after loading or adding event.
- Error: validation errors appear if form data is invalid.
- Empty: appears when search/filter returns no results.

## 9. Pull Request

- Summary
- How to run
- Screenshots or short video evidence


