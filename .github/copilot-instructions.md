<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Weekly Sprint Planner - Copilot Instructions

This is a React + Vite project for a student productivity application using agile sprint methodology.

## Project Overview

- **Purpose**: Weekly sprint planner for college students
- **Tech Stack**: React 19, Vite, Material-UI, React Router, Local Storage
- **Architecture**: Single-user application with no backend

## Code Style Guidelines

- Use functional components with hooks
- Prefer named exports for components
- Use Material-UI components consistently
- File naming: PascalCase for components (.jsx), camelCase for utilities (.js)
- Use dayjs for date operations
- Store all data in localStorage

## Key Components

- `useSprintManager` hook: Central state management for sprints
- `localStorage.js`: Data persistence utilities
- All pages use Material-UI Container with consistent styling
- Navigation handled by React Router

## Development Notes

- Development server runs on port 5175 (or next available)
- All JSX files must have .jsx extension
- MUI components require ThemeProvider and CssBaseline
- Date pickers require LocalizationProvider wrapper

## Feature Implementation

- Sprint creation with goals, priorities, and estimated hours
- Daily check-ins with progress tracking
- Sprint reviews with reflections and ratings
- History view with statistics and analytics

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete
