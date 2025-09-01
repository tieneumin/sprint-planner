# Weekly Sprint Planner 📋

A single-user productivity application that applies agile sprint methodology to academic work, helping college students plan weekly "sprints" with clear goals and daily progress tracking.

## 🚀 Features

### Sprint Setup (Weekly Planning)
- Create new weekly sprints with clear goals
- Set sprint duration, start/end dates
- Add goals with estimated hours and priority levels
- Warning system for active sprints

### Daily Standups (Progress Tracking)
- Daily check-in system with progress tracking
- Log hours worked on each goal
- Mark goals as completed
- Select focus goals for the day (up to 3)
- Add daily plans and notes

### Sprint Review (Weekly Review)
- End sprint with comprehensive review
- Mark final status of each goal (Completed/Partial/Not Done)
- Sprint reflection with structured questions
- Rate your sprint experience (1-5 stars)
- Track estimated vs actual hours

### History & Analytics
- View all completed sprints
- Overall statistics and completion rates
- Detailed goal tracking and progress
- Sprint reflections and learnings

## 🛠 Technical Stack

- **Frontend**: React 19 + Vite
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router
- **Date Handling**: Day.js with MUI Date Pickers
- **Storage**: Browser Local Storage (no backend required)
- **State Management**: React useState and useEffect hooks

## 📦 Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Dashboard.jsx       # Main dashboard with sprint overview
│   ├── SprintSetup.jsx     # Create new sprint form
│   ├── DailyUpdate.jsx     # Daily check-in form
│   ├── SprintReview.jsx    # Sprint completion and review
│   └── History.jsx         # Sprint history and statistics
├── hooks/
│   └── useSprintManager.js # Custom hook for sprint management
├── utils/
│   └── localStorage.js     # Local storage utility functions
└── App.jsx                 # Main app component with routing
```

## 📱 Usage Guide

### 1. Creating Your First Sprint
1. Click "Create New Sprint" on the dashboard
2. Enter sprint name (e.g., "Midterm Week")
3. Set start date and duration (defaults to 7 days)
4. Add goals with descriptions, estimated hours, and priorities
5. Click "Start Sprint" to begin

### 2. Daily Progress Tracking
1. Click "Daily Check-in" from the dashboard
2. Update progress on each goal:
   - Mark as completed if finished
   - Log hours worked today
   - Add optional notes
3. Select 1-3 focus goals for today
4. Write a brief daily plan
5. Save your check-in

### 3. Completing a Sprint
1. Click "Sprint Review" when ready to end
2. Mark final status for each goal
3. Answer reflection questions:
   - What went well?
   - What was challenging?
   - What to improve next time?
4. Rate your sprint experience
5. Click "Complete Sprint"

### 4. Viewing History
- Access completed sprints in the History page
- View overall statistics and completion rates
- Expand individual sprints to see detailed results
- Learn from past sprint reflections

## 🎯 Key Benefits

- **Academic Focus**: Designed specifically for student productivity
- **Agile Methodology**: Applies proven project management techniques
- **Self-Reflection**: Built-in retrospectives for continuous improvement
- **Progress Tracking**: Visual progress indicators and statistics
- **Offline Capable**: No internet required, all data stored locally
- **Privacy First**: No accounts or data sharing required

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Dependencies

- React & React DOM
- Material-UI (@mui/material, @mui/icons-material, @mui/x-date-pickers)
- React Router DOM
- Day.js for date manipulation
- Emotion for MUI styling

## 🎨 Design Principles

- **Clean Interface**: Intuitive Material Design components
- **Mobile Responsive**: Works on desktop and mobile devices
- **Fast Performance**: Lightweight with local storage
- **Accessibility**: Following Material-UI accessibility guidelines
- **User Experience**: Clear navigation and progress indicators

## 📊 Data Storage

All data is stored locally in your browser using localStorage:
- Active sprint information
- Completed sprint history
- Daily check-in records
- No data is sent to external servers

## 🤝 Contributing

This is a student productivity tool designed for single-user academic planning. Feel free to fork and customize for your own needs!

## 📝 License

Open source - feel free to use and modify for educational purposes.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
